import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

const COLORS = ['#F97316', '#FBBF24', '#FCD34D', '#FB923C', '#991B1B'];

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const getW = () => canvas.getBoundingClientRect().width;
    const getH = () => canvas.getBoundingClientRect().height;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = getW();
      const h = getH();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const createParticle = (initialSpread = false): Particle => {
      const w = getW();
      const h = getH();
      return {
        x: Math.random() * w,
        y: initialSpread ? Math.random() * h : h + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        radius: Math.random() * 2.5 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.4 + 0.15,
      };
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < 55; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      const w = getW();
      const h = getH();
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          particles[i] = createParticle(false);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
