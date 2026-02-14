import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VoiceEcho() {
  const navigate = useNavigate();
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [canPlayOnce, setCanPlayOnce] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [error, setError] = useState('');

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioUrlRef = useRef(null);
  const timerRef = useRef(null);
  const maxDurationMs = 60_000;

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      'MediaRecorder' in window;
    setIsSupported(supported);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const resetRecordingState = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (recorderRef.current) {
      recorderRef.current = null;
    }
    chunksRef.current = [];
  };

  const handleStart = async () => {
    if (!isSupported || isRecording) return;
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      setHasRecording(false);
      setCanPlayOnce(false);
      setDurationSeconds(0);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      const startedAt = Date.now();

      recorder.onstart = () => {
        setIsRecording(true);
        timerRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startedAt) / 1000);
          setDurationSeconds(Math.min(elapsed, maxDurationMs / 1000));
        }, 500);
      };

      recorder.onstop = () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsRecording(false);

        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
          }
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setHasRecording(true);
          setCanPlayOnce(true);
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        recorderRef.current = null;
        chunksRef.current = [];
      };

      recorder.start();

      setTimeout(() => {
        if (recorderRef.current && recorderRef.current.state === 'recording') {
          recorderRef.current.stop();
        }
      }, maxDurationMs);
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      resetRecordingState();
    }
  };

  const handleStop = () => {
    if (!isRecording || !recorderRef.current) return;
    recorderRef.current.stop();
  };

  const handlePlayOnce = () => {
    if (!hasRecording || !canPlayOnce || !audioUrlRef.current) return;

    const audio = new Audio(audioUrlRef.current);
    setCanPlayOnce(false);

    audio.onended = () => {
      // after one full playback, keep it disabled
    };

    audio.play().catch(() => {
      setError('Could not play the recording.');
      setCanPlayOnce(true);
    });
  };

  const handleSubmit = () => {
    if (!hasRecording) return;

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setHasRecording(false);
    setCanPlayOnce(false);
    setDurationSeconds(0);
    resetRecordingState();

    navigate('/reflection');
  };

  if (!isSupported) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Voice Echo</h2>
        <p className="text-sm text-slate-300">
          Your browser does not support audio recording with the MediaRecorder API.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Voice Echo</h2>
        <p className="text-sm text-slate-300">
          Say your thoughts out loud and let them echo back to you. Record for up to 60 seconds,
          listen once, then move on to a brief reflection.
        </p>
      </header>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleStart}
            disabled={isRecording}
            className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {isRecording ? 'Recording…' : 'Start recording'}
          </button>
          <button
            type="button"
            onClick={handleStop}
            disabled={!isRecording}
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
          >
            Stop
          </button>
        </div>

        <p className="text-xs text-slate-400">
          {isRecording
            ? `Recording… ${durationSeconds}s / 60s`
            : hasRecording
            ? `Captured ~${durationSeconds || 0}s of audio.`
            : 'You can record up to 60 seconds.'}
        </p>

        <button
          type="button"
          onClick={handlePlayOnce}
          disabled={!hasRecording || !canPlayOnce}
          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
        >
          Play once
        </button>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!hasRecording}
          className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-sm shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          Continue to reflection
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-400">
          {error}
        </p>
      )}
    </section>
  );
}

export default VoiceEcho;


