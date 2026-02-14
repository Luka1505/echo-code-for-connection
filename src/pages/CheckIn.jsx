import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckIn } from '../services/CheckInContext.jsx';
import { getUserId } from '../services/userIdentity.js';

const moods = [
  { id: 'awful', label: 'Awful', emoji: '😞' },
  { id: 'low', label: 'Low', emoji: '😔' },
  { id: 'neutral', label: 'Okay', emoji: '😐' },
  { id: 'good', label: 'Good', emoji: '🙂' },
  { id: 'great', label: 'Great', emoji: '😊' },
];

const TAGS = [
  'overwhelmed',
  'anxious',
  'proud',
  'exhausted',
  'grateful',
  'lonely',
  'hopeful',
  'stressed',
];

function CheckIn() {
  const navigate = useNavigate();
  const { setEntry } = useCheckIn();
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [journalOpen, setJournalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const entry = {
      mood: selectedMood,
      intensity,
      note,
      tags: selectedTags,
      at: new Date().toISOString(),
      userId: getUserId(),
    };

    // Save locally in context
    setEntry(entry);

    // Send to backend
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_BASE}/submit-mood`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          // attach id to context entry if backend returned it
          setEntry((prev) => ({ ...(prev || entry), id: data.id }));
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('Network error submitting mood', e);
      })
      .finally(() => {
        // go to guided reflection after check-in
        navigate('/reflection');
      });
  };

  return (
    <section className="flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6"
      >
        <header className="space-y-2 text-center">
          <h2 className="text-lg font-semibold text-white">Daily Check-in</h2>
          <p className="text-sm text-slate-300">
            Choose how you feel right now, then add a little context if you like.
          </p>
        </header>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Mood
          </p>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => {
              const isActive = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    isActive
                      ? 'border-sky-400 bg-sky-500/10 text-sky-100'
                      : 'border-transparent bg-white/3 text-slate-200 hover:border-sky-500/60 hover:bg-white/6'
                  }`}
                >
                  <span className="text-base">{mood.emoji}</span>
                  <span className="mt-1 leading-tight">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium uppercase tracking-wide">
              Intensity
            </span>
            <span className="text-slate-300">
              {intensity}
              <span className="text-slate-500"> / 5</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Very gentle</span>
            <span>Very strong</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="note" className="block text-xs font-medium text-slate-400">
              Journal (optional)
            </label>
            <button
              type="button"
              onClick={() => setJournalOpen((s) => !s)}
              className="text-xs text-sky-300 hover:text-sky-200 transition"
            >
              {journalOpen ? 'Hide' : 'Write more'}
            </button>
          </div>

          {journalOpen ? (
            <textarea
              id="note"
              rows={6}
              maxLength={2000}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write anything you'd like to explore — this will be private to your device and dashboard."
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          ) : (
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What feels most present for you right now?"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          )}

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{note.length}/2000</span>
            <span className="italic">Your journal saves with the check-in.</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium uppercase tracking-wide">Tags (optional)</span>
            <span className="text-slate-300">Select any that apply</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                    );
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    active
                      ? 'bg-sky-500/20 text-sky-100 border border-sky-400'
                      : 'bg-white/4 text-slate-200 hover:bg-white/6'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={!selectedMood}
            className="cta-button inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            Submit check-in
          </button>
        </div>
      </form>
    </section>
  );
}

export default CheckIn;


