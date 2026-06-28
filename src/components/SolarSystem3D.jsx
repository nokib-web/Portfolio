import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const SolarSystem3D = ({
  isModal = false,
  onSelectPersona,
  hoveredPersonaId,
  setHoveredPersonaId,
  speedMultiplier = 1,
}) => {
  const containerRef = useRef(null);
  const labelContainerRef = useRef(null);
  
  // Track local hover state inside Three.js
  const [internalHoverId, setInternalHoverId] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    // Set initial camera target coordinates
    // We will use Spherical Coordinates to control the camera: radius, phi (vertical), theta (horizontal)
    let camRadius = isModal ? 13 : 21;
    let camTheta = Math.PI / 4; // yaw angle
    let camPhi = Math.PI / 3;   // pitch angle
    
    let targetCamRadius = camRadius;
    let targetCamTheta = camTheta;
    let targetCamPhi = camPhi;

    const updateCameraPosition = () => {
      // Clamping pitch (phi) to prevent camera flipping
      camPhi = THREE.MathUtils.clamp(camPhi, 0.05, Math.PI / 2 - 0.05);
      targetCamPhi = THREE.MathUtils.clamp(targetCamPhi, 0.05, Math.PI / 2 - 0.05);

      const x = camRadius * Math.sin(camPhi) * Math.sin(camTheta);
      const y = camRadius * Math.cos(camPhi);
      const z = camRadius * Math.sin(camPhi) * Math.cos(camTheta);
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };

    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Texture Generator for Soft Particles
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);

      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    // Starfield Background
    const starCount = isModal ? 600 : 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const spaceRadius = isModal ? 60 : 150;
    for (let i = 0; i < starCount; i++) {
      // Distribute stars on a sphere shell
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = spaceRadius * (0.8 + Math.random() * 0.4);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Star color (mostly white/yellow/cyan-blue tones)
      const colorVal = 0.7 + Math.random() * 0.3;
      starColors[i * 3] = colorVal;
      starColors[i * 3 + 1] = colorVal + (Math.random() * 0.05);
      starColors[i * 3 + 2] = colorVal + (Math.random() * 0.15);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: isModal ? 0.25 : 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      map: particleTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffedd5, 3.5, 100, 0.6);
    scene.add(sunLight);

    // Sun Mesh (Glowing Orange Core)
    const sunRadius = isModal ? 0.9 : 1.35;
    const sunGeo = new THREE.SphereGeometry(sunRadius, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfb923c, // orange-400
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Inner glowing ring shell for the sun (atmosphere flare)
    const sunFlareGeo = new THREE.SphereGeometry(sunRadius * 1.15, 32, 32);
    const sunFlareMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15, // yellow-450
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const sunFlare = new THREE.Mesh(sunFlareGeo, sunFlareMat);
    scene.add(sunFlare);

    // Personas definition
    const scale = isModal ? 0.7 : 1.0;
    const planetsData = [
      {
        id: 'developer',
        color: '#22d3ee', // cyan
        radius: 0.42 * scale,
        orbitRadius: (isModal ? 3.5 : 5.2) * scale,
        speed: 0.015,
        inclinationX: 0.0,
        inclinationZ: 0.0,
      },
      {
        id: 'writer',
        color: '#f59e0b', // amber
        radius: 0.36 * scale,
        orbitRadius: (isModal ? 5.2 : 7.8) * scale,
        speed: 0.010,
        inclinationX: 0.04,
        inclinationZ: 0.02,
      },
      {
        id: 'friend',
        color: '#f43f5e', // rose
        radius: 0.38 * scale,
        orbitRadius: (isModal ? 7.0 : 10.5) * scale,
        speed: 0.0075,
        inclinationX: -0.03,
        inclinationZ: -0.01,
      },
      {
        id: 'philosopher',
        color: '#a855f7', // purple
        radius: 0.48 * scale,
        orbitRadius: (isModal ? 8.8 : 13.2) * scale,
        speed: 0.005,
        inclinationX: 0.06,
        inclinationZ: 0.04,
        hasRings: true,
      },
    ];

    const planetMeshes = [];
    const orbitGroups = [];

    planetsData.forEach((planetData) => {
      // Orbit group to handle tilted axis
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.x = planetData.inclinationX;
      orbitGroup.rotation.z = planetData.inclinationZ;
      scene.add(orbitGroup);
      orbitGroups.push(orbitGroup);

      // Orbit Ring Line
      const ringPoints = [];
      const segments = 120;
      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(angle) * planetData.orbitRadius, 0, Math.sin(angle) * planetData.orbitRadius));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x4f46e5, // indigo-600
        transparent: true,
        opacity: 0.12,
      });
      const orbitLine = new THREE.LineLoop(ringGeo, ringMat);
      orbitGroup.add(orbitLine);

      // Planet Mesh
      const planetGeo = new THREE.SphereGeometry(planetData.radius, 32, 32);
      
      // Standard material to reflect the central light creating gorgeous shadow crescents!
      const planetMat = new THREE.MeshStandardMaterial({
        color: planetData.color,
        roughness: 0.7,
        metalness: 0.15,
        bumpScale: 0.05,
      });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      
      // Starting random orbit angle
      planetMesh.userData = {
        id: planetData.id,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: planetData.orbitRadius,
        speed: planetData.speed,
        baseRadius: planetData.radius,
      };

      // Set initial position
      const initialAngle = planetMesh.userData.angle;
      planetMesh.position.set(
        Math.cos(initialAngle) * planetData.orbitRadius,
        0,
        Math.sin(initialAngle) * planetData.orbitRadius
      );
      
      orbitGroup.add(planetMesh);
      planetMeshes.push(planetMesh);

      // If philosopher, add Saturn-like flat rings
      if (planetData.hasRings) {
        const innerRingRadius = planetData.radius * 1.35;
        const outerRingRadius = planetData.radius * 2.3;
        const ringGeoFlat = new THREE.RingGeometry(innerRingRadius, outerRingRadius, 64);
        
        // Tilt the rings relative to the planet equator
        ringGeoFlat.rotateX(Math.PI / 2.2);

        // Make rings lit by double-sided material
        const ringMatFlat = new THREE.MeshStandardMaterial({
          color: '#a855f7',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          roughness: 0.8,
        });
        const ringsMesh = new THREE.Mesh(ringGeoFlat, ringMatFlat);
        planetMesh.add(ringsMesh);
      }
    });

    // Space Probes (Miniature Crafts) like Voyager/Pioneer with custom elliptical paths
    const probesData = [
      {
        id: 'skills',
        label: 'Skills',
        color: '#38bdf8', // light cyan
        a: (isModal ? 4.3 : 6.5) * scale, // semi-major axis
        b: (isModal ? 3.0 : 4.5) * scale, // semi-minor axis
        speed: 0.012,
        inclinationX: 0.25,
        inclinationZ: 0.15,
      },
      {
        id: 'projects',
        label: 'Projects',
        color: '#f472b6', // pink
        a: (isModal ? 6.2 : 9.5) * scale,
        b: (isModal ? 4.0 : 6.0) * scale,
        speed: 0.009,
        inclinationX: -0.22,
        inclinationZ: -0.10,
      },
      {
        id: 'resume',
        label: 'Resume',
        color: '#fb7185', // rose
        a: (isModal ? 8.0 : 12.0) * scale,
        b: (isModal ? 5.5 : 8.0) * scale,
        speed: 0.007,
        inclinationX: 0.35,
        inclinationZ: -0.25,
      }
    ];

    const probeMeshes = [];
    const probeOrbitGroups = [];

    probesData.forEach((probeData) => {
      const pGroup = new THREE.Group();
      pGroup.rotation.x = probeData.inclinationX;
      pGroup.rotation.z = probeData.inclinationZ;
      scene.add(pGroup);
      probeOrbitGroups.push(pGroup);

      // Draw faint elliptical trajectory
      const pathPoints = [];
      const steps = 100;
      for (let j = 0; j <= steps; j++) {
        const t = (j / steps) * Math.PI * 2;
        pathPoints.push(new THREE.Vector3(Math.cos(t) * probeData.a, 0, Math.sin(t) * probeData.b));
      }
      const pathGeo = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const pathMat = new THREE.LineBasicMaterial({
        color: 0x64748b, // slate-500
        transparent: true,
        opacity: 0.07,
      });
      const pathLine = new THREE.LineLoop(pathGeo, pathMat);
      pGroup.add(pathLine);

      // Probe indicator node (represented by a tiny glowing dot)
      const probeGeo = new THREE.SphereGeometry(0.12 * scale, 16, 16);
      const probeMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const probeMesh = new THREE.Mesh(probeGeo, probeMat);
      probeMesh.userData = {
        id: probeData.id,
        angle: Math.random() * Math.PI * 2,
        a: probeData.a,
        b: probeData.b,
        speed: probeData.speed,
      };

      pGroup.add(probeMesh);
      probeMeshes.push(probeMesh);
    });

    // 3D Constellation Line: glowing line from sun center to the hovered planet
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(6); // 2 points (x,y,z)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xf43f5e,
      dashSize: 0.25,
      gapSize: 0.15,
    });
    const constellationLine = new THREE.Line(lineGeo, lineMat);
    constellationLine.visible = false;
    scene.add(constellationLine);

    // Mouse interactions: Drag to rotate orbit and scroll to zoom
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      // Calculate mouse values for drag camera
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        targetCamTheta -= deltaX * 0.007;
        targetCamPhi -= deltaY * 0.007;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Raycaster for checking node hovers
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

      // Raycast against planets
      const intersects = raycaster.intersectObjects(planetMeshes);

      if (intersects.length > 0) {
        const hitPlanet = intersects[0].object;
        const hitId = hitPlanet.userData.id;
        document.body.style.cursor = 'pointer';
        
        if (internalHoverId !== hitId) {
          setInternalHoverId(hitId);
          if (setHoveredPersonaId) setHoveredPersonaId(hitId);
        }
      } else {
        document.body.style.cursor = 'default';
        if (internalHoverId !== null) {
          setInternalHoverId(null);
          if (setHoveredPersonaId) setHoveredPersonaId(null);
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      // Zoom factor adjustment
      const zoomFactor = e.deltaY * 0.01;
      const minDistance = isModal ? 6 : 10;
      const maxDistance = isModal ? 22 : 45;
      targetCamRadius = THREE.MathUtils.clamp(targetCamRadius + zoomFactor, minDistance, maxDistance);
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(planetMeshes);

      if (intersects.length > 0 && onSelectPersona) {
        const selectedId = intersects[0].object.userData.id;
        const matchingPlanet = planetsData.find(p => p.id === selectedId);
        if (matchingPlanet) {
          onSelectPersona(selectedId);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });
    domEl.addEventListener('click', onClick);

    // HTML Label position tracking helper
    const projectNodeToDOM = (object, domId) => {
      if (!labelContainerRef.current) return;
      const element = labelContainerRef.current.querySelector(`[data-id="${domId}"]`);
      if (!element) return;

      const tempV = new THREE.Vector3();
      object.getWorldPosition(tempV);
      tempV.project(camera);

      // Hide if behind camera lens
      if (tempV.z > 1.0) {
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
        return;
      }

      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (tempV.y * -0.5 + 0.5) * height;

      element.style.transform = `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0)`;
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    };

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      // Orbit rate scaling factor (speedMultiplier prop)
      const speedCoeff = delta * speedMultiplier * 1.5;

      // Slowly rotate starfield and Sun structure
      starField.rotation.y += 0.0006;
      sunMesh.rotation.y += 0.002;
      sunFlare.rotation.y -= 0.001;

      // Spin and orbit planets
      planetMeshes.forEach((planetMesh) => {
        // Increment orbit angle
        planetMesh.userData.angle += planetMesh.userData.speed * speedCoeff * 10;
        
        // Calculate new coordinate positions
        const angle = planetMesh.userData.angle;
        const radius = planetMesh.userData.orbitRadius;
        planetMesh.position.set(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );

        // Self axis rotation
        planetMesh.rotation.y += 0.01;

        // Visual hover pulse scale up
        const activeHoverId = hoveredPersonaId || internalHoverId;
        const isHovered = activeHoverId === planetMesh.userData.id;
        const targetScale = isHovered ? 1.4 : 1.0;
        
        planetMesh.scale.x += (targetScale - planetMesh.scale.x) * 0.15;
        planetMesh.scale.y += (targetScale - planetMesh.scale.y) * 0.15;
        planetMesh.scale.z += (targetScale - planetMesh.scale.z) * 0.15;

        // Orbit ring glow on hover
        const index = planetsData.findIndex(p => p.id === planetMesh.userData.id);
        const group = orbitGroups[index];
        const loop = group.children[0];
        if (loop && loop.material) {
          loop.material.opacity = isHovered ? 0.35 : 0.12;
        }

        // Project planet to screen coordinates label
        projectNodeToDOM(planetMesh, planetMesh.userData.id);
      });

      // Update Space Probes orbits
      probeMeshes.forEach((probeMesh) => {
        probeMesh.userData.angle += probeMesh.userData.speed * speedCoeff * 10;
        const angle = probeMesh.userData.angle;
        probeMesh.position.set(
          Math.cos(angle) * probeMesh.userData.a,
          0,
          Math.sin(angle) * probeMesh.userData.b
        );

        // Project probes coordinates
        projectNodeToDOM(probeMesh, probeMesh.userData.id);
      });

      // Update 3D Constellation Line vertices
      const activeHoverId = hoveredPersonaId || internalHoverId;
      if (activeHoverId) {
        const hoveredMesh = planetMeshes.find(m => m.userData.id === activeHoverId);
        if (hoveredMesh) {
          const startV = new THREE.Vector3(0, 0, 0); // Sun
          const endV = new THREE.Vector3();
          hoveredMesh.getWorldPosition(endV);

          const positions = constellationLine.geometry.attributes.position.array;
          positions[0] = startV.x;
          positions[1] = startV.y;
          positions[2] = startV.z;
          positions[3] = endV.x;
          positions[4] = endV.y;
          positions[5] = endV.z;
          
          constellationLine.geometry.attributes.position.needsUpdate = true;
          
          // Match matching color
          const pData = planetsData.find(p => p.id === activeHoverId);
          if (pData) {
            constellationLine.material.color.set(pData.color);
          }
          
          constellationLine.visible = true;
        }
      } else {
        constellationLine.visible = false;
      }

      // Camera position interpolation (lerp) towards target coords for smooth movement
      camRadius += (targetCamRadius - camRadius) * 0.08;
      camTheta += (targetCamTheta - camTheta) * 0.08;
      camPhi += (targetCamPhi - camPhi) * 0.08;

      // Add gentle idle auto-rotation if user is not actively dragging
      if (!isDragging) {
        targetCamTheta += 0.0006 * (speedMultiplier > 0 ? Math.min(speedMultiplier, 5) : 1);
      }

      updateCameraPosition();
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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      domEl.removeEventListener('mousedown', onMouseDown);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('click', onClick);

      document.body.style.cursor = 'default';

      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore
        }
      }

      // Dispose resources
      starGeo.dispose();
      starMat.dispose();
      particleTexture.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      sunFlareGeo.dispose();
      sunFlareMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();

      planetMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh.children.forEach((c) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
      });

      orbitGroups.forEach((group) => {
        const loop = group.children[0];
        if (loop) {
          loop.geometry.dispose();
          loop.material.dispose();
        }
      });

      probeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      probeOrbitGroups.forEach((group) => {
        const loop = group.children[0];
        if (loop) {
          loop.geometry.dispose();
          loop.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, [speedMultiplier, isModal]);

  // Handle external hoveredPersonaId updates to trigger hover state
  useEffect(() => {
    if (hoveredPersonaId) {
      setInternalHoverId(hoveredPersonaId);
    } else {
      setInternalHoverId(null);
    }
  }, [hoveredPersonaId]);

  const activeHoverId = hoveredPersonaId || internalHoverId;

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
      {/* ThreeJS Container */}
      <div ref={containerRef} className="w-full h-full relative z-0" />

      {/* DOM Projection Overlay Labels Container */}
      <div
        ref={labelContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 font-sans"
      >
        {/* Sun central tag */}
        <div
          data-id="sun"
          className="absolute text-[8px] uppercase tracking-[0.25em] text-amber-500 font-bold bg-black/60 px-2 py-0.5 rounded border border-amber-500/20 backdrop-blur-sm pointer-events-none transition-all duration-300"
          style={{ transform: 'translate3d(-50%, -50%, 0)', display: 'none' }}
        >
          SOLAR CORE
        </div>

        {/* Planet Labels */}
        {[
          { id: 'developer', title: 'Developer', colorClass: 'text-cyan-400 border-cyan-500/30' },
          { id: 'writer', title: 'Writer', colorClass: 'text-amber-400 border-amber-500/30' },
          { id: 'friend', title: 'Friend', colorClass: 'text-rose-400 border-rose-500/30' },
          { id: 'philosopher', title: 'Philosopher', colorClass: 'text-purple-400 border-purple-500/30' },
        ].map((planet) => {
          const isHovered = activeHoverId === planet.id;
          return (
            <div
              key={planet.id}
              data-id={planet.id}
              onClick={() => onSelectPersona && onSelectPersona(planet.id)}
              className={`absolute flex flex-col items-center pointer-events-auto cursor-pointer group transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-90 opacity-75 hover:opacity-100 hover:scale-100'
              }`}
              style={{ transform: 'translate3d(-50%, -50%, 0)' }}
            >
              {/* Target reticle dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 bg-slate-950 mb-1 transition-all duration-300 ${
                  isHovered ? 'border-red-500 scale-125 shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'border-white'
                }`}
              />

              {/* Label Banner */}
              <div
                className={`px-3 py-1 bg-slate-950/85 backdrop-blur-md border rounded text-[10px] font-bold uppercase tracking-wider ${
                  planet.colorClass
                } ${isHovered ? 'shadow-[0_0_15px_rgba(0,0,0,0.8)] ring-1 ring-white/20' : 'border-slate-800'}`}
              >
                {planet.title}
              </div>
            </div>
          );
        })}

        {/* Spacecraft / Probes Labels */}
        {[
          { id: 'skills', title: 'Skills.dat' },
          { id: 'projects', title: 'Proj_Log' },
          { id: 'resume', title: 'Resume.bin' }
        ].map((probe) => {
          return (
            <div
              key={probe.id}
              data-id={probe.id}
              className="absolute flex items-center pointer-events-none opacity-50 scale-75 transition-all duration-300"
              style={{ transform: 'translate3d(-50%, -50%, 0)' }}
            >
              {/* Antenna style marker line */}
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-1 shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              <div className="px-1.5 py-0.5 bg-black/40 rounded text-[7px] text-slate-400 tracking-wider font-mono">
                {probe.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SolarSystem3D;
