"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 10);

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const goldLight = new THREE.PointLight(0xf59e0b, 6, 40);
    goldLight.position.set(6, 6, 6);
    scene.add(goldLight);
    const emeraldLight = new THREE.PointLight(0x10b981, 4, 40);
    emeraldLight.position.set(-8, -4, 4);
    scene.add(emeraldLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    // ── Golf ball ──
    const ballGeo = new THREE.SphereGeometry(2.4, 128, 128);
    const ballMat = new THREE.MeshPhongMaterial({
      color: 0xf5f0e8,
      shininess: 120,
      specular: new THREE.Color(0xf59e0b),
      emissive: new THREE.Color(0x0a0a0a),
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(3, 0, 0);
    scene.add(ball);

    // Wireframe overlay (dimple suggestion)
    const wireGeo = new THREE.SphereGeometry(2.42, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.copy(ball.position);
    scene.add(wire);

    // ── Orbit ring ──
    const ringGeo = new THREE.TorusGeometry(3.6, 0.018, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(ball.position);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(4.2, 0.01, 8, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.2 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.position.copy(ball.position);
    ring2.rotation.x = -Math.PI / 6;
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring2);

    // ── Orbiting mini balls ──
    const miniBalls: THREE.Mesh[] = [];
    const miniAngles = [0, Math.PI * 0.66, Math.PI * 1.33];
    miniAngles.forEach((angle) => {
      const geo = new THREE.SphereGeometry(0.18, 16, 16);
      const mat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 80, emissive: 0x553300 });
      const m = new THREE.Mesh(geo, mat);
      scene.add(m);
      miniBalls.push(m);
      (m as unknown as { _angle: number })._angle = angle;
    });

    // ── Gold star particles ──
    const PARTICLE_COUNT = 1800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;

      const gold = Math.random() > 0.5;
      colors[i * 3] = gold ? 0.98 : 0.06;
      colors[i * 3 + 1] = gold ? 0.62 : 0.73;
      colors[i * 3 + 2] = gold ? 0.04 : 0.51;

      sizes[i] = Math.random() * 3 + 1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Flag pin (golf hole) ──
    const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8);
    const poleMat = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 100 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(-4, -0.9, 1);
    scene.add(pole);

    const flagGeo = new THREE.PlaneGeometry(0.7, 0.45);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(-3.67, 0.42, 1);
    scene.add(flag);

    const cupGeo = new THREE.CylinderGeometry(0.25, 0.2, 0.1, 16);
    const cupMat = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.set(-4, -1.8, 1);
    scene.add(cup);

    // ── Mouse ──
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ── Resize ──
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animate ──
    let frame: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ball.rotation.y = t * 0.18;
      ball.rotation.x = t * 0.06;
      wire.rotation.y = ball.rotation.y;
      wire.rotation.x = ball.rotation.x;

      ring.rotation.z = t * 0.12;
      ring2.rotation.z = -t * 0.08;

      flag.rotation.y = Math.sin(t * 1.5) * 0.2;

      miniBalls.forEach((m, i) => {
        const mb = m as THREE.Mesh & { _angle: number };
        const angle = mb._angle + t * (0.4 + i * 0.1);
        m.position.set(
          ball.position.x + Math.cos(angle) * 3.6,
          ball.position.y + Math.sin(angle * 0.7) * 1.2,
          ball.position.z + Math.sin(angle) * 1.8
        );
      });

      particles.rotation.y = t * 0.015;
      particles.rotation.x = t * 0.008;

      // Smooth camera parallax
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.035;
      camera.position.y += (mouseY * 0.8 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
