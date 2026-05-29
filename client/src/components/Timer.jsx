import { useState, useEffect } from 'react';

const Timer = ({ startTime, isRunning }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsed(0);
      return;
    }

    // Calculate how long it's already been running
    const initial = Math.floor(
      (Date.now() - new Date(startTime).getTime()) / 1000
    );
    setElapsed(initial);

    const interval = setInterval(() => {
      setElapsed(
        Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const format = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isRunning) return null;

  return (
    <span className="font-mono text-green-600 font-semibold text-sm">
      ⏱ {format(elapsed)}
    </span>
  );
};

export default Timer;