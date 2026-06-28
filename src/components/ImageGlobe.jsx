import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ImageGlobe = ({ activePersona }) => {
  const containerRef = useRef(null);
  const activePersonaRef = useRef(activePersona);

  // Sync prop changes to ref for access in animation loops without re-mounting
  useEffect(() => {
    activePersonaRef.current = activePersona;
  }, [activePersona]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Full screen dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera - Initialized to z=36 to scale correctly within the full-screen viewport
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.z = 36;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear container to prevent duplicate canvases in hot-reload
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orbit Controls - Native Three.js 360 vertical & horizontal rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.autoRotate = true; // Slowly rotate the globe in 360 degrees automatically
    controls.autoRotateSpeed = 0.45;

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Uniform soft ambient light for matte surface rendering
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Soft directional light for realistic specular sun glints on the ocean
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(12, 10, 15);
    scene.add(dirLight);

    THREE.Cache.enabled = false;

    const textureLoader = new THREE.TextureLoader();
    const sphereRadius = 5.2;

    // Midpoint Displacement Algorithm to generate rugged, realistic coastlines
    const perturbPath = (points, iterations = 3, displacement = 12) => {
      let current = [...points];
      for (let iter = 0; iter < iterations; iter++) {
        const next = [];
        const disp = displacement / Math.pow(1.65, iter);
        for (let i = 0; i < current.length; i++) {
          const p1 = current[i];
          const p2 = current[(i + 1) % current.length];
          
          const mx = (p1[0] + p2[0]) / 2;
          const my = (p1[1] + p2[1]) / 2;
          
          const dx = p2[0] - p1[0];
          const dy = p2[1] - p1[1];
          const len = Math.sqrt(dx * dx + dy * dy);
          
          if (len < 3) {
            next.push(p1);
            continue;
          }
          
          const nx = -dy / len;
          const ny = dx / len;
          
          const noiseVal = Math.sin(mx * 0.05 + my * 0.08) * Math.cos(mx * 0.03 - my * 0.05) +
                           Math.sin(mx * 0.12 - my * 0.1) * 0.35;
          const rx = mx + nx * noiseVal * disp;
          const ry = my + ny * noiseVal * disp;
          
          next.push(p1);
          next.push([rx, ry]);
        }
        current = next;
      }
      return current;
    };

    // Fallback Texture: beautiful green continents on navy oceans (offline safe)
    const createFallbackTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Ocean base: deep navy blue
      ctx.fillStyle = '#0f2042';
      ctx.fillRect(0, 0, 1024, 512);

      // Continents: green land with organic coastlines
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 1.5;

      const drawPath = (coords) => {
        const ruggedCoords = perturbPath(coords, 3, 14);
        ctx.beginPath();
        ctx.moveTo(ruggedCoords[0][0], ruggedCoords[0][1]);
        for (let i = 1; i < ruggedCoords.length; i++) {
          ctx.lineTo(ruggedCoords[i][0], ruggedCoords[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // North America
      drawPath([
        [80, 90], [200, 70], [280, 50], [340, 80], [300, 150],
        [320, 210], [280, 240], [230, 260], [210, 220], [190, 200],
        [120, 180], [90, 140]
      ]);

      // Greenland
      drawPath([
        [310, 40], [360, 40], [340, 90], [300, 80]
      ]);

      // South America
      drawPath([
        [230, 260], [270, 280], [330, 330], [340, 380], [290, 480],
        [270, 480], [240, 390], [220, 310]
      ]);

      // Eurasia (Europe + Asia)
      drawPath([
        [380, 110], [440, 80], [520, 60], [640, 50], [840, 60], 
        [990, 70], [970, 160], [990, 220], [910, 260], [880, 230],
        [840, 250], [760, 260], [710, 280], [670, 230], [620, 260],
        [570, 240], [500, 250], [440, 200], [410, 190]
      ]);

      // Africa
      drawPath([
        [420, 260], [500, 250], [570, 240], [610, 280], [630, 320],
        [570, 440], [530, 450], [490, 370], [430, 360], [400, 310]
      ]);

      // Australia
      drawPath([
        [830, 360], [920, 350], [950, 390], [910, 450], [820, 430]
      ]);

      // Antarctica
      drawPath([
        [40, 496], [980, 496], [960, 510], [60, 510]
      ]);
      
      return new THREE.CanvasTexture(canvas);
    };

    const createEarthBumpMap = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Ocean base (Black = low height)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 1024, 512);

      // Landmasses (White = high height)
      ctx.fillStyle = '#ffffff';

      const drawPath = (coords) => {
        const ruggedCoords = perturbPath(coords, 3, 14);
        ctx.beginPath();
        ctx.moveTo(ruggedCoords[0][0], ruggedCoords[0][1]);
        for (let i = 1; i < ruggedCoords.length; i++) {
          ctx.lineTo(ruggedCoords[i][0], ruggedCoords[i][1]);
        }
        ctx.closePath();
        ctx.fill();
      };

      // North America
      drawPath([
        [80, 90], [200, 70], [280, 50], [340, 80], [300, 150],
        [320, 210], [280, 240], [230, 260], [210, 220], [190, 200],
        [120, 180], [90, 140]
      ]);

      // Greenland
      drawPath([
        [310, 40], [360, 40], [340, 90], [300, 80]
      ]);

      // South America
      drawPath([
        [230, 260], [270, 280], [330, 330], [340, 380], [290, 480],
        [270, 480], [240, 390], [220, 310]
      ]);

      // Eurasia (Europe + Asia)
      drawPath([
        [380, 110], [440, 80], [520, 60], [640, 50], [840, 60], 
        [990, 70], [970, 160], [990, 220], [910, 260], [880, 230],
        [840, 250], [760, 260], [710, 280], [670, 230], [620, 260],
        [570, 240], [500, 250], [440, 200], [410, 190]
      ]);

      // Africa
      drawPath([
        [420, 260], [500, 250], [570, 240], [610, 280], [630, 320],
        [570, 440], [530, 450], [490, 370], [430, 360], [400, 310]
      ]);

      // Australia
      drawPath([
        [830, 360], [920, 350], [950, 390], [910, 450], [820, 430]
      ]);

      // Antarctica
      drawPath([
        [40, 496], [980, 496], [960, 510], [60, 510]
      ]);
      
      return new THREE.CanvasTexture(canvas);
    };

    // Procedural Fallback Specular: Oceans shiny (white), land matte (black)
    const createFallbackSpecular = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Oceans: White (highly shiny specular reflection)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1024, 512);

      // Landmasses: Black (completely rough/matte, no reflections)
      ctx.fillStyle = '#000000';

      const drawPath = (coords) => {
        const ruggedCoords = perturbPath(coords, 3, 14);
        ctx.beginPath();
        ctx.moveTo(ruggedCoords[0][0], ruggedCoords[0][1]);
        for (let i = 1; i < ruggedCoords.length; i++) {
          ctx.lineTo(ruggedCoords[i][0], ruggedCoords[i][1]);
        }
        ctx.closePath();
        ctx.fill();
      };

      // North America
      drawPath([
        [80, 90], [200, 70], [280, 50], [340, 80], [300, 150],
        [320, 210], [280, 240], [230, 260], [210, 220], [190, 200],
        [120, 180], [90, 140]
      ]);

      // Greenland
      drawPath([
        [310, 40], [360, 40], [340, 90], [300, 80]
      ]);

      // South America
      drawPath([
        [230, 260], [270, 280], [330, 330], [340, 380], [290, 480],
        [270, 480], [240, 390], [220, 310]
      ]);

      // Eurasia
      drawPath([
        [380, 110], [440, 80], [520, 60], [640, 50], [840, 60], 
        [990, 70], [970, 160], [990, 220], [910, 260], [880, 230],
        [840, 250], [760, 260], [710, 280], [670, 230], [620, 260],
        [570, 240], [500, 250], [440, 200], [410, 190]
      ]);

      // Africa
      drawPath([
        [420, 260], [500, 250], [570, 240], [610, 280], [630, 320],
        [570, 440], [530, 450], [490, 370], [430, 360], [400, 310]
      ]);

      // Australia
      drawPath([
        [830, 360], [920, 350], [950, 390], [910, 450], [820, 430]
      ]);

      // Antarctica
      drawPath([
        [40, 496], [980, 496], [960, 510], [60, 510]
      ]);
      
      return new THREE.CanvasTexture(canvas);
    };

    // 1. Initial Earth Globe using procedural fallbacks (instantly loaded)
    const earthTexture = createFallbackTexture();
    const earthBumpMap = createEarthBumpMap();
    const earthSpecularMap = createFallbackSpecular();
    const earthGeometry = new THREE.SphereGeometry(sphereRadius * 0.94, 64, 64);
    
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthBumpMap,
      bumpScale: 0.15, // Emboss landmasses slightly for realism shadows
      specularMap: earthSpecularMap, // Specular map controls water glossiness
      specular: new THREE.Color('#222222'), // Soft sunlight reflection color
      shininess: 22, // Glossiness factor of the ocean
      transparent: true,
      opacity: 1.0,
    });
    const earthGlobe = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthGlobe);

    // Asynchronously load the high-resolution photo-realistic satellite map texture (pristine & line-free)
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
      (loadedTexture) => {
        earthMaterial.map = loadedTexture;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      (error) => {
        console.warn('Could not load online Earth texture, using local procedural fallback.', error);
      }
    );

    // Asynchronously load the official NASA Earth specular map texture
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
      (loadedSpecular) => {
        earthMaterial.specularMap = loadedSpecular;
        earthMaterial.needsUpdate = true;
      },
      undefined,
      (error) => {
        console.warn('Could not load online Earth specular texture, using local procedural fallback.', error);
      }
    );

    // 2. Beautiful Atmospheric Limb Glow (Fresnel Shader wrapper)
    // Renders a soft glowing blue halo around the horizon edges of the sphere
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          // Glow intensity is high near Glance angle (edges) and zero at normal angle (center)
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.6);
          gl_FragColor = vec4(0.38, 0.68, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    // Sphere is slightly larger than the Earth sphere to create the horizon wrapper envelope
    const atmosphereGeometry = new THREE.SphereGeometry(sphereRadius * 0.97, 64, 64);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update OrbitControls with damping physics
      controls.update();

      // Slowly rotate Earth globe inside the group (autoRotate rotates the camera, this rotates the Earth)
      earthGlobe.rotation.y -= 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();

      if (container && renderer.domElement) {
        try { container.removeChild(renderer.domElement); } catch (e) {}
      }

      earthGeometry.dispose();
      earthTexture.dispose();
      earthMaterial.dispose();
      earthBumpMap.dispose();
      earthSpecularMap.dispose();

      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none relative"
      style={{ touchAction: 'none' }}
    />
  );
};

export default ImageGlobe;
