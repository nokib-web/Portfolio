import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TechTorus = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Strict mode fix: ensure container is empty before appending new canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Create Torus Knot Geometry
    const geometry = new THREE.TorusKnotGeometry(4.5, 1.2, 200, 32);
    
    // We'll create two meshes: a wireframe and a points overlay
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x6D28D9,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    scene.add(wireMesh);

    // Points overlay
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xA78BFA,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const pointsMesh = new THREE.Points(geometry, pointsMaterial);
    scene.add(pointsMesh);

    // Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = x * 0.3;
      targetRotationX = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Base rotation
      wireMesh.rotation.y += 0.002;
      wireMesh.rotation.x += 0.001;
      pointsMesh.rotation.y += 0.002;
      pointsMesh.rotation.x += 0.001;

      // Mouse sway
      wireMesh.rotation.y += (targetRotationY - wireMesh.rotation.y) * 0.05;
      wireMesh.rotation.x += (targetRotationX - wireMesh.rotation.x) * 0.05;
      pointsMesh.rotation.y = wireMesh.rotation.y;
      pointsMesh.rotation.x = wireMesh.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        try { containerRef.current.removeChild(renderer.domElement); } catch (e) {}
      }
      geometry.dispose();
      wireMaterial.dispose();
      pointsMaterial.dispose();
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

export default TechTorus;
