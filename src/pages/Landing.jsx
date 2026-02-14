import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.25em] uppercase text-sky-300/80">
          Echo
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
          A space where your feelings are heard — even by yourself.
        </h2>
        <p className="text-sm text-slate-300 max-w-xl">
          Echo gives you a quiet corner to slow down, notice what you&apos;re feeling,
          and put words to your inner experience without judgement.
        </p>
        <p className="text-sm text-slate-300 max-w-xl">
          Come back whenever you need a soft landing and a gentle check-in with yourself.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/check-in')}
          className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Start Check-in
        </button>
        <p className="text-xs text-slate-400">
          No sign-in, no pressure — just a space to listen to yourself.
        </p>
      </div>
    </section>
  );
}

export default Landing;


