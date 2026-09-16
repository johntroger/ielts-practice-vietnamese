import React, { useEffect, useRef } from 'react';

/**
 * SpeechWaveVisualizer
 * High-performance 60 FPS Organic Waveform Canvas Visualizer.
 * State-isolated: DOES NOT trigger parent React re-renders.
 */
export default function SpeechWaveVisualizer({
  mode = 'idle', // 'idle' | 'candidate_speaking' | 'examiner_speaking' | 'muted'
  analyserNode = null,
  className = 'w-full h-20'
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 300);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 80);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    // Audio frequency buffer if analyserNode is present
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 0;
    const dataArray = analyserNode ? new Uint8Array(bufferLength) : null;

    const render = () => {
      phaseRef.current += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Determine amplitude & energy
      let energy = 0.25; // default gentle baseline
      if (mode === 'candidate_speaking') {
        if (analyserNode && dataArray) {
          analyserNode.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < 16; i++) {
            sum += dataArray[i];
          }
          const avg = sum / 16;
          energy = Math.max(0.2, Math.min(1.2, avg / 80));
        } else {
          energy = 0.6;
        }
      } else if (mode === 'examiner_speaking') {
        energy = 0.55 + Math.sin(phaseRef.current * 1.5) * 0.3;
      } else if (mode === 'muted') {
        energy = 0.05;
      }

      // Draw 3 layered organic sine waves
      const centerY = height / 2;
      const waveCount = 3;

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const waveOffset = w * 0.7;
        const waveAmp = (height * 0.32 * energy) / (w + 1);

        // Styling gradients based on mode
        let strokeColor;
        if (mode === 'examiner_speaking') {
          // Purple to Indigo
          strokeColor = w === 0 ? 'rgba(168, 85, 247, 0.85)' : w === 1 ? 'rgba(129, 140, 248, 0.6)' : 'rgba(192, 132, 252, 0.35)';
        } else if (mode === 'candidate_speaking') {
          // Emerald to Teal
          strokeColor = w === 0 ? 'rgba(16, 185, 129, 0.9)' : w === 1 ? 'rgba(20, 184, 166, 0.6)' : 'rgba(52, 211, 153, 0.35)';
        } else if (mode === 'muted') {
          strokeColor = 'rgba(148, 163, 184, 0.2)';
        } else {
          // Idle gentle slate
          strokeColor = w === 0 ? 'rgba(148, 163, 184, 0.45)' : 'rgba(100, 116, 139, 0.25)';
        }

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (3 - w) * window.devicePixelRatio;
        ctx.lineCap = 'round';

        for (let x = 0; x < width; x += 4) {
          const normX = x / width;
          // Smooth bell envelope tapering at edges
          const envelope = Math.sin(normX * Math.PI);
          const y = centerY + Math.sin(normX * 10 + phaseRef.current + waveOffset) * waveAmp * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mode, analyserNode]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
      />
    </div>
  );
}
