import os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
app = Flask(__name__)
CORS(app)

# MongoDB
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGODB_URI)
db = client.echo
moods_collection = db.moods
reflections_collection = db.reflections

# Mood id -> numeric value for trend (1-5)
MOOD_TO_VALUE = {
    "awful": 1,
    "low": 2,
    "neutral": 3,
    "good": 4,
    "great": 5,
}
MOOD_LABELS = ["Awful", "Low", "Okay", "Good", "Great"]


def mood_id_to_value(mood_id):
    return MOOD_TO_VALUE.get(mood_id, 3)


@app.route("/submit-mood", methods=["POST"])
def submit_mood():
    data = request.get_json() or {}
    mood = data.get("mood")
    intensity = data.get("intensity", 3)
    note = (data.get("note") or "").strip()[:2000]
    userId = data.get("userId")  # anonymous user identifier
    # tags: expect an array of strings (optional). sanitize to allowed list
    raw_tags = data.get("tags") or []
    if not isinstance(raw_tags, list):
        raw_tags = []
    ALLOWED_TAGS = {"overwhelmed", "anxious", "proud", "exhausted", "grateful", "lonely", "hopeful", "stressed"}
    tags = [t for t in raw_tags if isinstance(t, str) and t in ALLOWED_TAGS][:10]
    at = data.get("at") or datetime.utcnow().isoformat() + "Z"

    if not mood:
        return jsonify({"error": "mood is required"}), 400

    entry = {
        "mood": mood,
        "intensity": int(min(5, max(1, intensity))),
        "note": note,
        "tags": tags,
        "userId": userId,
        "at": at,
    }
    result = moods_collection.insert_one(entry)
    entry["_id"] = str(result.inserted_id)
    return jsonify({"ok": True, "id": entry["_id"]}), 201


@app.route("/submit-reflection", methods=["POST"])
def submit_reflection():
    data = request.get_json() or {}
    entry_id = data.get("entryId")
    mode = data.get("mode")
    responses = data.get("responses") or {}
    # simple validation
    if not entry_id or not isinstance(responses, dict):
        return jsonify({"error": "invalid payload"}), 400

    # store reflection as separate document, private by default
    doc = {
        "entryId": str(entry_id),
        "mode": mode,
        "responses": {k: (v or "") for k, v in responses.items()},
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    try:
        res = reflections_collection.insert_one(doc)
        return jsonify({"ok": True, "id": str(res.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": "failed to save"}), 500


@app.route("/recent-entries", methods=["GET"])
def recent_entries():
    # return the most recent journal entries (private view in dashboard)
    userId = request.args.get("userId")
    try:
        cursor = moods_collection.find({"userId": userId}).sort("at", -1).limit(12) if userId else moods_collection.find().sort("at", -1).limit(12)
        out = []
        for doc in cursor:
            out.append({
                "id": str(doc.get("_id")),
                "mood": doc.get("mood"),
                "intensity": doc.get("intensity"),
                "note": doc.get("note"),
                "tags": doc.get("tags", []),
                "at": doc.get("at"),
            })
        return jsonify({"entries": out}), 200
    except Exception:
        return jsonify({"entries": []}), 200


@app.route("/dashboard-data", methods=["GET"])
def dashboard_data():
    userId = request.args.get("userId")
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    week_ago_str = week_ago.strftime("%Y-%m-%d")  # matches ISO at strings

    # Last 7 days: aggregate by day from stored mood ids (we store mood id, not value).
    query = {"at": {"$gte": week_ago_str}}
    if userId:
        query["userId"] = userId
    cursor = moods_collection.find(query).sort("at", 1)
    by_day = {}
    for doc in cursor:
        at_str = doc.get("at", "") or ""
        if len(at_str) >= 10:
            day = at_str[:10]  # YYYY-MM-DD
        else:
            day = now.strftime("%Y-%m-%d")
        value = mood_id_to_value(doc.get("mood"))
        if day not in by_day:
            by_day[day] = []
        by_day[day].append(value)

    week_labels = []
    weekly_values = []
    for i in range(6, -1, -1):
        d = now - timedelta(days=i)
        day_str = d.strftime("%Y-%m-%d")
        week_labels.append(d.strftime("%a"))
        if day_str in by_day and by_day[day_str]:
            vals = by_day[day_str]
            weekly_values.append(round(sum(vals) / len(vals), 1))
        else:
            weekly_values.append(None)

    # Mood frequency: count per mood id
    freq_query = {"at": {"$gte": week_ago_str}}
    if userId:
        freq_query["userId"] = userId
    freq_cursor = moods_collection.find(freq_query)
    mood_counts = {mid: 0 for mid in MOOD_TO_VALUE}
    for doc in freq_cursor:
        mid = doc.get("mood")
        if mid in mood_counts:
            mood_counts[mid] += 1
    mood_frequency = [mood_counts.get(mid, 0) for mid in ["awful", "low", "neutral", "good", "great"]]

    # Tag frequency (for allowed tags)
    ALLOWED_TAGS_LIST = ["overwhelmed", "anxious", "proud", "exhausted", "grateful", "lonely", "hopeful", "stressed"]
    tag_counts = {t: 0 for t in ALLOWED_TAGS_LIST}
    tag_query = {"at": {"$gte": week_ago_str}}
    if userId:
        tag_query["userId"] = userId
    tag_cursor = moods_collection.find(tag_query)
    for doc in tag_cursor:
        for t in doc.get("tags", []) or []:
            if t in tag_counts:
                tag_counts[t] += 1
    tag_frequency = [tag_counts.get(t, 0) for t in ALLOWED_TAGS_LIST]

    # Journal count: number of entries with a non-empty note in the last 7 days
    journal_query = {"at": {"$gte": week_ago_str}, "note": {"$ne": ""}}
    if userId:
        journal_query["userId"] = userId
    journal_count = moods_collection.count_documents(journal_query)

    return jsonify({
        "weeklyTrend": {
            "labels": week_labels,
            "values": weekly_values,
        },
        "moodFrequency": {
            "labels": MOOD_LABELS,
            "values": mood_frequency,
        },
        "tagFrequency": {
            "labels": ALLOWED_TAGS_LIST,
            "values": tag_frequency,
        },
        "journalCount": journal_count,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
