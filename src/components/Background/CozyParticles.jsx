import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CozyParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 20;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle Texture (Soft circles generated via canvas)
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

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const particleTexture = createCircleTexture();

    // Colors (soft violet/lavender/white firefly colors)
    const particleColors = [
      new THREE.Color('#8B5CF6'), // Violet
      new THREE.Color('#C4B5FD'), // Soft Purple
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#EDE9FE'), // Lavender glow
    ];

    // Particle Data Setup
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Track original states for physics & drift
    const initialOffsets = [];
    const driftSpeeds = [];
    const swaySpeeds = [];
    const swayScales = [];

    // Set initial coordinates and properties
    // We want the particles spread in a wide box in front of the camera
    const spreadX = 40;
    const spreadY = 30;
    const spreadZ = 25;

    for (let i = 0; i < count; i++) {
      // Position
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color selection
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Animation properties
      initialOffsets.push({ x, y, z });
      driftSpeeds.push(Math.random() * 0.015 + 0.005); // upward speed
      swaySpeeds.push(Math.random() * 0.8 + 0.2); // phase shift speed
      swayScales.push(Math.random() * 0.3 + 0.1); // sway magnitude
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Points Material
    const material = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      map: particleTexture,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    // Particle System
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Interactive mouse mapping
    const mouse = new THREE.Vector2(-999, -999);
    const targetMouse3D = new THREE.Vector3(-999, -999, 0);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (event) => {
      // Calculate container-relative mouse coordinates
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      mouse.x = (clientX / width) * 2 - 1;
      mouse.y = -(clientY / height) * 2 + 1;

      // Raycast to Z=0 plane to get 3D mouse positions
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(planeZ, targetMouse3D);
    };

    const handleMouseLeave = () => {
      mouse.set(-999, -999);
      targetMouse3D.set(-999, -999, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const posAttr = geometry.attributes.position;
      const arr = posAttr.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // 1. Slow upward drift
        arr[i3 + 1] += driftSpeeds[i];

        // Wrap around boundaries
        const yLimit = spreadY / 2;
        if (arr[i3 + 1] > yLimit) {
          arr[i3 + 1] = -yLimit;
          arr[i3] = (Math.random() - 0.5) * spreadX;
        }

        // 2. Firefly sway (using sine waves)
        const phase = elapsedTime * swaySpeeds[i];
        const swayX = Math.sin(phase) * swayScales[i];
        const swayZ = Math.cos(phase) * swayScales[i] * 0.5;

        // Apply temporary drift/sway position
        let px = arr[i3] + swayX * 0.02;
        let py = arr[i3 + 1];
        let pz = arr[i3 + 2] + swayZ * 0.02;

        // 3. Mouse scattering force
        if (targetMouse3D.x !== -999) {
          const dx = px - targetMouse3D.x;
          const dy = py - targetMouse3D.y;
          const dz = pz - targetMouse3D.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          const scatterRadius = 6.0;
          if (dist < scatterRadius) {
            // Calculate force direction
            const force = (1.0 - dist / scatterRadius) * 0.35;
            
            // Push particle away
            // Avoid division by zero
            const angle = Math.atan2(dy, dx);
            arr[i3] += Math.cos(angle) * force;
            arr[i3 + 1] += Math.sin(angle) * force;
            
            // Push Z slightly
            arr[i3 + 2] += (dz >= 0 ? 1 : -1) * force * 0.3;
          }
        }

        // Apply subtle friction returning towards natural sway paths
        const naturalX = initialOffsets[i].x;
        arr[i3] += (naturalX - arr[i3]) * 0.01;
      }

      posAttr.needsUpdate = true;
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
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore already removed
        }
      }

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default CozyParticles;
