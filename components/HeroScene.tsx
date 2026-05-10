"use client";
import { useEffect, useRef } from "react";

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Phase timing (ms)
    const FLIGHT_DUR = 2800;
    const ROLL_DUR   = 900;
    const HOLE_DUR   = 600;
    const PAUSE_DUR  = 700;
    const TOTAL      = FLIGHT_DUR + ROLL_DUR + HOLE_DUR + PAUSE_DUR;

    let startTime = performance.now();

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function easeInQuad(t: number) { return t * t; }
    function easeOutBounce(t: number) {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
      if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
      t -= 2.625 / 2.75;
      return 7.5625 * t * t + 0.984375;
    }

    function draw(now: number) {
      const w = W(), h = H();
      ctx!.clearRect(0, 0, w, h);

      // ── Sky gradient background ──
      const sky = ctx!.createLinearGradient(0, 0, 0, h * 0.65);
      sky.addColorStop(0,   "#0c2340");
      sky.addColorStop(0.4, "#1a4a7a");
      sky.addColorStop(1,   "#5b9bd5");
      ctx!.fillStyle = sky;
      ctx!.fillRect(0, 0, w, h * 0.65);

      // ── Fairway gradient ──
      const grass = ctx!.createLinearGradient(0, h * 0.62, 0, h);
      grass.addColorStop(0,   "#0f3d22");
      grass.addColorStop(0.5, "#166534");
      grass.addColorStop(1,   "#14532d");
      ctx!.fillStyle = grass;
      ctx!.fillRect(0, h * 0.62, w, h * 0.38);

      // ── Horizon glow ──
      const glow = ctx!.createLinearGradient(0, h * 0.55, 0, h * 0.7);
      glow.addColorStop(0, "rgba(180,220,255,0.18)");
      glow.addColorStop(1, "rgba(22,101,52,0)");
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, h * 0.55, w, h * 0.2);

      // Fairway stripe
      ctx!.fillStyle = "rgba(20,83,45,0.5)";
      ctx!.fillRect(0, h * 0.62, w, 3);

      const groundY = h * 0.635;
      const holeX   = w * 0.78;
      const holeY   = groundY;

      // ── Flag pin ──
      const poleBase = { x: holeX - 4, y: holeY };
      const poleTop  = { x: holeX - 4, y: holeY - h * 0.28 };

      ctx!.strokeStyle = "rgba(220,220,210,0.9)";
      ctx!.lineWidth = 2;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(poleBase.x, poleBase.y);
      ctx!.lineTo(poleTop.x, poleTop.y);
      ctx!.stroke();

      // Waving flag
      const flagWave = Math.sin(now * 0.002) * 6;
      ctx!.fillStyle = "#dc2626";
      ctx!.beginPath();
      ctx!.moveTo(poleTop.x, poleTop.y);
      ctx!.bezierCurveTo(
        poleTop.x + 14 + flagWave, poleTop.y + 5,
        poleTop.x + 16 + flagWave, poleTop.y + 10,
        poleTop.x,                 poleTop.y + 16
      );
      ctx!.closePath();
      ctx!.fill();

      // ── Hole cup ──
      ctx!.fillStyle = "#080808";
      ctx!.beginPath();
      ctx!.ellipse(holeX, holeY + 2, 9, 4, 0, 0, Math.PI * 2);
      ctx!.fill();

      // ── Phase logic ──
      const elapsed = (now - startTime) % TOTAL;

      if (elapsed < FLIGHT_DUR) {
        // --- FLIGHT PHASE ---
        const t = elapsed / FLIGHT_DUR;

        // Bezier: start off-screen left, arc high, land near hole
        const p0 = { x: -20,       y: groundY };
        const p1 = { x: w * 0.18,  y: groundY - h * 0.7 };
        const p2 = { x: w * 0.6,   y: groundY - h * 0.55 };
        const p3 = { x: holeX - 30, y: groundY - 6 };

        const mt = 1 - t;
        const bx = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x;
        const by = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y;

        drawBall(ctx!, bx, by, 11, groundY);

        // Trail
        for (let i = 1; i <= 8; i++) {
          const tr = (t - i * 0.012);
          if (tr < 0) continue;
          const tm = 1 - tr;
          const tx = tm*tm*tm*p0.x + 3*tm*tm*tr*p1.x + 3*tm*tr*tr*p2.x + tr*tr*tr*p3.x;
          const ty = tm*tm*tm*p0.y + 3*tm*tm*tr*p1.y + 3*tm*tr*tr*p2.y + tr*tr*tr*p3.y;
          ctx!.fillStyle = `rgba(255,255,255,${0.06 - i * 0.006})`;
          ctx!.beginPath();
          ctx!.arc(tx, ty, 5 - i * 0.4, 0, Math.PI * 2);
          ctx!.fill();
        }

      } else if (elapsed < FLIGHT_DUR + ROLL_DUR) {
        // --- ROLL PHASE ---
        const t = (elapsed - FLIGHT_DUR) / ROLL_DUR;
        const te = easeOutBounce(Math.min(t, 1));
        const ballX = (holeX - 30) + te * 22;
        const ballY = groundY - 11;
        drawBall(ctx!, ballX, ballY, 11, groundY);

      } else if (elapsed < FLIGHT_DUR + ROLL_DUR + HOLE_DUR) {
        // --- INTO HOLE PHASE ---
        const t = (elapsed - FLIGHT_DUR - ROLL_DUR) / HOLE_DUR;
        const ballX = holeX - 30 + 22 + t * 12;
        const scale = 1 - easeInQuad(t) * 0.9;
        const ballY = groundY - 11 * scale + easeInQuad(t) * 6;
        drawBall(ctx!, ballX, ballY, 11 * scale, groundY);
      }
      // PAUSE phase: nothing to draw for ball

      animFrame = requestAnimationFrame(draw);
    }

    animFrame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, groundY: number) {
  if (r <= 0) return;

  // Shadow on ground
  const shadowAlpha = Math.max(0, 0.3 - Math.abs(y - groundY) / 300);
  if (shadowAlpha > 0) {
    ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
    ctx.beginPath();
    ctx.ellipse(x, groundY + 2, r * 0.8, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ball gradient
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
  grad.addColorStop(0,   "#ffffff");
  grad.addColorStop(0.5, "#f4f1ea");
  grad.addColorStop(1,   "#c8bfaa");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Subtle dimples
  ctx.fillStyle = "rgba(160,140,110,0.25)";
  [[0.28, -0.22], [-0.18, 0.25], [0.1, 0.3], [-0.3, -0.1]].forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
  });
}
