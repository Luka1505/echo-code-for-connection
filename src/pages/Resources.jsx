import { useState } from 'react';

function ExpandableCard({ title, icon, steps }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
      <div className="rounded-lg border border-white/12 bg-slate-800/40 hover:bg-slate-800/60 p-4 transition-all duration-300">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <h4 className="text-sm font-semibold text-white">{title}</h4>
          </div>
          <span className={`text-xs text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
        
        {isOpen && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-xs font-semibold text-sky-300 flex-shrink-0 w-5">
                  {idx + 1}.
                </span>
                <span className="text-sm text-slate-200">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Resources() {
  const groundingTechniques = [
    {
      title: '2-Minute Breathing',
      icon: '🫁',
      steps: [
        'Find a quiet spot and sit comfortably',
        'Breathe in for 4 counts',
        'Hold for 4 counts',
        'Exhale for 4 counts',
        'Repeat for 2 minutes',
      ],
    },
    {
      title: '5-4-3-2-1 Reset',
      icon: '🎯',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
      ],
    },
    {
      title: 'Stretch Break',
      icon: '🧘',
      steps: [
        'Reach both arms overhead and stretch',
        'Gently roll your shoulders backward',
        'Touch your toes or as far as comfortable',
        'Neck rolls—slow and controlled',
        'Finish with deep breathing',
      ],
    },
  ];

  const reflectionPrompts = [
    'What am I grateful for today, even something small?',
    'What challenge did I face, and what did I learn from it?',
    'How did I show kindness to myself or others today?',
    'What do I need more of this week to feel balanced?',
    'What am I proud of accomplishing, no matter the size?',
  ];

  const calmCornerTechniques = [
    {
      title: 'Progressive Muscle Relaxation',
      icon: '💆',
      steps: [
        'Tense each muscle group for 5 seconds',
        'Release and notice the relief',
        'Start with your toes and move upward',
        'Work through arms, shoulders, and face',
        'End with full-body relaxation',
      ],
    },
    {
      title: 'Body Scan Meditation',
      icon: '🧠',
      steps: [
        'Lie down in a comfortable position',
        'Close your eyes and breathe deeply',
        'Mentally scan from head to toes',
        'Notice any tensions without judgment',
        'Send relaxing breath to each area',
      ],
    },
    {
      title: 'Guided Imagery',
      icon: '🌅',
      steps: [
        'Find a quiet, comfortable space',
        'Close your eyes and imagine a peaceful place',
        'Engage all your senses—what do you see, hear, feel?',
        'Stay in this space for 5-10 minutes',
        'Slowly return to the present moment',
      ],
    },
    {
      title: 'Journaling Flow',
      icon: '✍️',
      steps: [
        'Write without stopping for 10 minutes',
        'Let thoughts flow freely—no judgment',
        'Don\'t worry about grammar or structure',
        'If stuck, write the same word repeatedly',
        'Reflect on what emerged',
      ],
    },
  ];

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Resources</h2>
        <p className="text-sm text-slate-300">Curated practices for self-care, grounding, and calm.</p>
      </header>

      {/* Quick Grounding */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚡</span>
          <h3 className="text-lg font-semibold text-white">Quick Grounding</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">Use these techniques when you need to feel present and centered.</p>
        <div className="space-y-3">
          {groundingTechniques.map((technique, idx) => (
            <ExpandableCard
              key={idx}
              title={technique.title}
              icon={technique.icon}
              steps={technique.steps}
            />
          ))}
        </div>
      </div>

      {/* Reflection Prompts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💭</span>
          <h3 className="text-lg font-semibold text-white">Reflection Prompts</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">Journaling prompts to deepen your self-awareness.</p>
        <div className="space-y-3">
          {reflectionPrompts.map((prompt, idx) => (
            <div key={idx} className="rounded-lg border border-white/12 bg-slate-800/40 hover:bg-slate-800/60 p-4 transition-all duration-300">
              <div className="flex gap-3">
                <span className="text-lg">✨</span>
                <p className="text-sm text-slate-100">{prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* When You Need Support */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤝</span>
          <h3 className="text-lg font-semibold text-white">When You Need Support</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">Professional resources for times when you need extra help.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/12 bg-slate-800/40 hover:bg-slate-800/60 p-5 transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">💼</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Counseling Services</h4>
                <p className="text-xs text-slate-400 mt-1">Professional guidance with a trained therapist</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>💻 <span className="font-medium">Online Options:</span> BetterHelp, Talkspace, 7Cups</p>
              <p>🏥 <span className="font-medium">Local:</span> Check your insurance or search OpenCounseling</p>
              <p>🏫 <span className="font-medium">Student:</span> Contact your school/university wellness center</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/12 bg-slate-800/40 hover:bg-slate-800/60 p-5 transition-all duration-300">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">🆘</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Crisis Support</h4>
                <p className="text-xs text-slate-400 mt-1">Immediate help when in crisis</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>📞 <span className="font-medium">988 Suicide & Crisis Lifeline:</span> Call or text 988 (US)</p>
              <p>💬 <span className="font-medium">Crisis Text Line:</span> Text HOME to 741741</p>
              <p>🌍 <span className="font-medium">International:</span> findahelpline.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calm Corner */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏞️</span>
          <h3 className="text-lg font-semibold text-white">Calm Corner</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">Deeper practices for extended peace and healing.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calmCornerTechniques.map((technique, idx) => (
            <ExpandableCard
              key={idx}
              title={technique.title}
              icon={technique.icon}
              steps={technique.steps}
            />
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-lg border border-white/12 bg-slate-800/40 p-4 text-center">
        <p className="text-xs text-slate-300">
          These resources are tools for self-care. If you're struggling, please reach out to a mental health professional. 💙
        </p>
      </div>
    </section>
  );
}

export default Resources;

