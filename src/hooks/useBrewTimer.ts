import { useCallback, useEffect, useRef, useState } from 'react';
import type { PourStage } from '../data/roasteryData';

function playCopperChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.46);
  } catch {
    // Ignore audio context restrictions if blocked
  }
}

export function useBrewTimer(stages: PourStage[]) {
  const totalSec = stages.reduce((acc, s) => acc + s.durationSec, 0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const prevStageIdxRef = useRef(0);

  // Compute current stage index from elapsedSec
  let cumulative = 0;
  let stageIndex = stages.length - 1;
  let stageElapsed = 0;
  for (let i = 0; i < stages.length; i++) {
    if (elapsedSec < cumulative + stages[i].durationSec) {
      stageIndex = i;
      stageElapsed = elapsedSec - cumulative;
      break;
    }
    cumulative += stages[i].durationSec;
  }
  const isFinished = elapsedSec >= totalSec;

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setElapsedSec((prev) => {
        if (prev + 1 >= totalSec) {
          setIsRunning(false);
          return totalSec;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, totalSec]);

  useEffect(() => {
    if (stageIndex !== prevStageIdxRef.current) {
      if (chimeEnabled && isRunning) {
        playCopperChime();
      }
      prevStageIdxRef.current = stageIndex;
    }
  }, [stageIndex, chimeEnabled, isRunning]);

  const toggleRun = useCallback(() => {
    if (isFinished) {
      setElapsedSec(0);
      prevStageIdxRef.current = 0;
      setIsRunning(true);
    } else {
      setIsRunning((r) => !r);
    }
  }, [isFinished]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSec(0);
    prevStageIdxRef.current = 0;
  }, []);

  const nextStage = useCallback(() => {
    let acc = 0;
    for (let i = 0; i <= stageIndex; i++) {
      acc += stages[i].durationSec;
    }
    if (acc >= totalSec) {
      setElapsedSec(totalSec);
      setIsRunning(false);
    } else {
      setElapsedSec(acc);
      if (chimeEnabled) playCopperChime();
    }
  }, [stageIndex, stages, totalSec, chimeEnabled]);

  const progressPct = totalSec > 0 ? Math.min(100, (elapsedSec / totalSec) * 100) : 0;

  return {
    elapsedSec,
    totalSec,
    isRunning,
    isFinished,
    stageIndex,
    stageElapsed,
    currentStage: stages[stageIndex],
    progressPct,
    chimeEnabled,
    setChimeEnabled,
    toggleRun,
    reset,
    nextStage,
  };
}

export function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
