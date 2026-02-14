import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getUserId } from '../services/userIdentity.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const DEFAULT_WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_MOOD_LABELS = ['Awful', 'Low', 'Okay', 'Good', 'Great'];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: 'rgb(226, 232, 240)',
      bodyColor: 'rgb(203, 213, 225)',
      borderColor: 'rgba(148,163,184,0.2)',
      borderWidth: 1.5,
      padding: 12,
      displayColors: true,
      titleFont: { size: 13, weight: 'bold' },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      boxPadding: 6,
      usePointStyle: true,
    },
  },
  animation: {
    duration: 900,
    easing: 'easeOutCubic',
  },
  scales: {
    x: {
      grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
      ticks: { color: 'rgb(148, 163, 184)', maxRotation: 0 },
    },
    y: {
      grid: { color: 'rgba(148,163,184,0.06)', drawBorder: false },
      ticks: { color: 'rgb(148, 163, 184)' },
    },
  },
};

function makeLineData(labels = [], values = []) {
  const safeLabels = Array.isArray(labels) ? labels : DEFAULT_WEEK_LABELS;
  const safeValues = Array.isArray(values) ? values : [null, null, null, null, null, null, null];
  const valid = safeValues.filter((v) => v !== null && v !== undefined).map((v) => Number(v));
  const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 3;
  let baseColor = 'rgba(99,179,237,1)';
  if (avg >= 4) baseColor = 'rgba(34,197,94,1)';
  else if (avg >= 3 && avg < 4) baseColor = 'rgba(168,85,247,1)';
  const bgColor = baseColor.replace(/,1\)$/, ',0.18)');
  return {
    labels: safeLabels,
    datasets: [{
      label: 'Mood',
      data: safeValues,
      borderColor: baseColor,
      backgroundColor: bgColor,
      fill: true,
      tension: 0.4,
      borderWidth: 4.5,
      pointBackgroundColor: baseColor,
      pointBorderColor: 'rgba(255,255,255,0.9)',
      pointBorderWidth: 1.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      hoverRadius: 7,
    }],
  };
}

function makeBarData(labels = [], values = [], palette = []) {
  const safeLabels = Array.isArray(labels) ? labels : [];
  const safeValues = Array.isArray(values) ? values.map((v) => Number(v) || 0) : [];
  return {
    labels: safeLabels,
    datasets: [{
      label: 'Times',
      data: safeValues,
      backgroundColor: 'rgba(255,255,255,0.75)',
      hoverBackgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 8,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    }],
  };
}

const lineOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: true,
      text: 'Weekly mood trend',
      color: 'rgb(226, 232, 240)',
      font: { size: 13, weight: 'bold' },
      padding: 15,
    },
  },
  scales: {
    ...chartOptions.scales,
    x: {
      ...chartOptions.scales.x,
      grid: { color: 'rgba(148,163,184,0.05)', drawBorder: false },
    },
    y: {
      ...chartOptions.scales.y,
      min: 1,
      max: 5,
      ticks: {
        ...chartOptions.scales.y.ticks,
        stepSize: 1,
        padding: 8,
      },
      grid: { color: 'rgba(148,163,184,0.05)', drawBorder: false },
    },
  },
  animation: {
    ...chartOptions.animation,
    tension: {
      duration: 800,
      easing: 'easeOutQuart',
      from: 0.1,
      to: 0.4,
    },
  },
};

const barOptions = {
  ...chartOptions,
  plugins: {
    ...chartOptions.plugins,
    title: {
      display: true,
      text: 'Mood frequency',
      color: 'rgb(226, 232, 240)',
      font: { size: 13, weight: 'bold' },
      padding: 15,
    },
  },
  scales: {
    ...chartOptions.scales,
    x: {
      ...chartOptions.scales.x,
      grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
      ticks: {
        ...chartOptions.scales.x.ticks,
        color: '#cbd5e1',
        padding: 8,
      },
    },
    y: {
      ...chartOptions.scales.y,
      beginAtZero: true,
      grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
      ticks: {
        ...chartOptions.scales.y.ticks,
        color: '#cbd5e1',
        stepSize: 1,
        padding: 8,
      },
    },
  },
  hover: { mode: 'nearest', intersect: true },
};

function getMostFrequentMood(labels, values) {
  if (!Array.isArray(labels) || !Array.isArray(values) || labels.length === 0) {
    return null;
  }
  let maxIdx = 0;
  let maxVal = values[0] || 0;
  for (let i = 1; i < labels.length; i++) {
    if ((values[i] || 0) > maxVal) {
      maxVal = values[i];
      maxIdx = i;
    }
  }
  return maxVal > 0 ? labels[maxIdx] : null;
}

function getMostFrequentTag(labels, values) {
  if (!Array.isArray(labels) || !Array.isArray(values) || labels.length === 0) {
    return null;
  }
  let maxIdx = 0;
  let maxVal = values[0] || 0;
  for (let i = 1; i < labels.length; i++) {
    if ((values[i] || 0) > maxVal) {
      maxVal = values[i];
      maxIdx = i;
    }
  }
  return maxVal > 0 ? labels[maxIdx] : null;
}

function generateInsight(mostFrequentMood, mostFrequentTag, checkInCount) {
  const insights = [];

  if (mostFrequentMood) {
    const moodLower = mostFrequentMood.toLowerCase();
    if (moodLower === 'great') {
      insights.push(`You've been feeling great more often this week. Keep it up! 🌟`);
    } else if (moodLower === 'good') {
      insights.push(`You've been feeling good more often this week. That's wonderful! ✨`);
    } else if (moodLower === 'okay') {
      insights.push(`You've experienced ${moodLower} moments often this week. That's normal and okay. 💙`);
    } else if (moodLower === 'low') {
      insights.push(`You've had some low moments this week. Be kind to yourself. 🤗`);
    } else if (moodLower === 'awful') {
      insights.push(`You've faced some difficult moments. Remember, difficult times pass. 💪`);
    }
  }

  if (mostFrequentTag) {
    const tagLower = mostFrequentTag.toLowerCase();
    insights.push(`"${mostFrequentTag}" has appeared frequently in your reflections. Pay attention to it. 🎯`);
  }

  if (checkInCount >= 7) {
    insights.push(`Consistency is key—${checkInCount} check-ins this week shows real self-awareness. 🏆`);
  } else if (checkInCount >= 4) {
    insights.push(`You've logged ${checkInCount} check-ins this week. Building consistency! 📈`);
  } else if (checkInCount > 0) {
    insights.push(`Every check-in counts. You've logged ${checkInCount} this week—great start! 🌱`);
  }

  return insights.length > 0 ? insights[0] : 'Start tracking your mood to discover insights about yourself.';
}

function InsightCard({ moodLabels, moodValues, tagLabels, tagValues, recentEntries }) {
  const mostMood = getMostFrequentMood(moodLabels, moodValues);
  const mostTag = getMostFrequentTag(tagLabels, tagValues);
  const checkInCount = Array.isArray(recentEntries) ? recentEntries.length : 0;
  const insight = generateInsight(mostMood, mostTag, checkInCount);

  return (
    <div className="rounded-2xl insight-card p-6">
      <div className="flex items-start gap-4">
        <span className="text-4xl flex-shrink-0 mt-1">💡</span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white mb-3 tracking-wide">This Week's Insight</h3>
          <p className="text-sm text-slate-100 leading-relaxed space-y-2">{insight}</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [weekLabels, setWeekLabels] = useState(DEFAULT_WEEK_LABELS);
  const [weeklyValues, setWeeklyValues] = useState([null, null, null, null, null, null, null]);
  const [moodLabels, setMoodLabels] = useState(DEFAULT_MOOD_LABELS);
  const [moodValues, setMoodValues] = useState([0, 0, 0, 0, 0]);
  const [tagLabels, setTagLabels] = useState([]);
  const [tagValues, setTagValues] = useState([]);
  const [journalCount, setJournalCount] = useState(0);
  const [recentEntries, setRecentEntries] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState(null);
  const [hasCheckins, setHasCheckins] = useState(false);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const userId = getUserId();
    fetch(`${API_BASE}/dashboard-data?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.weeklyTrend) {
          setWeekLabels(data.weeklyTrend.labels || DEFAULT_WEEK_LABELS);
          setWeeklyValues(
            (data.weeklyTrend.values || []).map((v) => (v === null ? null : Number(v)))
          );
        }
        if (data?.moodFrequency) {
          setMoodLabels(data.moodFrequency.labels || DEFAULT_MOOD_LABELS);
          setMoodValues((data.moodFrequency.values || []).map((v) => Number(v)));
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch dashboard data', e);
      });
    // fetch recent journal entries
    fetch(`${API_BASE}/recent-entries?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const entries = data?.entries || [];
        setRecentEntries(entries);
        setHasCheckins(entries.length > 0);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch recent entries', e);
        setHasCheckins(false);
      });

    // fetch tag frequency + journal count
    fetch(`${API_BASE}/dashboard-data?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.tagFrequency?.labels && Array.isArray(data.tagFrequency.labels)) {
          setTagLabels(data.tagFrequency.labels);
          setTagValues((data.tagFrequency.values || []).map((v) => Number(v) || 0));
        }
        if (typeof data?.journalCount === 'number') {
          setJournalCount(data.journalCount);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-slate-300">Track your emotional journey and discover patterns.</p>
      </header>

      {!hasCheckins ? (
        <div className="rounded-2xl border border-white/12 bg-slate-900/50 p-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">✨ No check-ins yet</h3>
          <p className="text-sm text-slate-300">Start tracking your mood to see insights.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <InsightCard 
            moodLabels={moodLabels} 
            moodValues={moodValues} 
            tagLabels={tagLabels} 
            tagValues={tagValues} 
            recentEntries={recentEntries} 
          />
          
          <div className="rounded-2xl border border-white/12 bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">📈 Weekly Mood Trend</h3>
            <div className="h-48 sm:h-56">
              <Line data={makeLineData(weekLabels, weeklyValues)} options={lineOptions} />
            </div>
          </div>

        <div className="rounded-2xl border border-white/12 bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">😊 Mood Frequency</h3>
          <div className="h-48 sm:h-56">
            <Bar
              data={makeBarData(moodLabels ?? [], moodValues ?? [])}
              options={barOptions}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">📔 Recent Journal Entries</h3>
              <div className="text-xs text-slate-300">Journals (last 7d): <span className="font-semibold text-sky-300">{journalCount ?? 0}</span></div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-slate-300 font-medium">Filter:</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter(null)}
                  className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${selectedTagFilter === null ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-100 hover:bg-slate-600'}`}>
                  All
                </button>
                {Array.isArray(tagLabels) && tagLabels.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTagFilter(t)}
                    className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${selectedTagFilter === t ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-100 hover:bg-slate-600'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {(recentEntries ?? []).filter(e => !selectedTagFilter || (e?.tags || []).includes(selectedTagFilter)).length === 0 && (
              <div className="text-sm text-slate-400">No recent entries.</div>
            )}
            {(recentEntries ?? []).filter(e => !selectedTagFilter || (e?.tags || []).includes(selectedTagFilter)).map((e) => {
              const isOpen = expandedEntry === e.id;
              return (
                <div key={e.id} className="rounded-lg border border-slate-700 p-3 bg-slate-800/40 hover:bg-slate-800/60 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300">{new Date(e.at).toLocaleString()}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs font-semibold text-sky-300">{e.mood}</span>
                      </div>
                      <div className="mt-2 text-sm text-slate-100">
                        {isOpen ? e.note : (e.note ? (e.note.length > 120 ? `${e.note.slice(0, 120)}...` : e.note) : <span className="text-slate-500">(no journal)</span>)}
                      </div>
                      {e.tags && e.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.tags.map((t) => (
                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-100">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedEntry(isOpen ? null : e.id)}
                        className="text-xs text-sky-300 hover:text-sky-200"
                      >
                        {isOpen ? 'Read less' : 'Read more'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">🏷️ Emotion Tags</h3>
          {!Array.isArray(tagLabels) || tagLabels.length === 0 ? (
            <div className="text-sm text-slate-300">No tag data yet.</div>
          ) : (
            <div className="h-36">
              <Bar
                data={makeBarData(tagLabels ?? [], tagValues ?? [])}
                options={{
                  indexAxis: 'y',
                  ...barOptions,
                  plugins: {
                    ...barOptions.plugins,
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#cbd5e1' },
                    },
                    y: {
                      grid: { display: false },
                      ticks: { color: '#cbd5e1' },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/12 bg-slate-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-3">✨ Calming Thought</h3>
          <QuoteCard />
        </div>
      </div>
      )}
    </section>
  );
}

function QuoteCard() {
  const QUOTES = [
    'Breathe deeply. You are allowed to pause and be present.',
    'Small steps still move you forward — one breath at a time.',
    'You are not your feelings. Notice them, then let them pass.',
    'Kindness to yourself is a practice, not a final destination.',
    'This moment is temporary — breathe, steady, and continue.',
    'What you need now is not perfection but consistency.',
    'You’ve made it this far — that’s worth noticing.',
    'Softly: you can begin again from where you are.',
  ];
  const idx = new Date().getDate() % QUOTES.length;
  return (
    <div className="text-sm text-slate-200 italic">{QUOTES[idx]}</div>
  );
}

export default Dashboard;
