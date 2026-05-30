import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GlobeHero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create Soft Circle Texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);

      return new THREE.CanvasTexture(canvas);
    };

    const pointTexture = createCircleTexture();

    // Particles Data
    const count = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = 8.2;

    const colorPalette = [
      new THREE.Color('#f87171'), // Coral
      new THREE.Color('#f9a8d4'), // Pink
      new THREE.Color('#ffffff'), // White
    ];

    // Fibonacci sphere algorithm to distribute dots uniformly
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color selection
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Points Material
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: pointTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Point Cloud Mesh
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse Tracking for Sway Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = x * 0.45;
      targetRotationX = y * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Default constant rotation
      points.rotation.y += 0.002;
      points.rotation.x += 0.0005;

      // Smoothly sway towards target rotation based on mouse coordinates (lerp)
      points.rotation.y += (targetRotationY - points.rotation.y) * 0.05;
      points.rotation.x += (targetRotationX - points.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore
        }
      }

      geometry.dispose();
      material.dispose();
      pointTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ minHeight: '400px' }}
    />
  );
};

export default GlobeHero;
