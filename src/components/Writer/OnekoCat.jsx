import React, { useEffect, useRef, useState } from 'react';

/**
 * Web Audio API synthesized cute Meow Sound
 * Generates an authentic multi-formant "Mee-ooww~" sound with zero external assets.
 */
const playSynthesizedMeow = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const duration = 0.45;

    // Main Carrier Oscillator (Simulates Cat Vocal Tract)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Secondary sub-oscillator for richness & warmth
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    // Pitch formant filter for "ee" -> "ow" vowel transition
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);

    // Vibrato / Purr modulation (LFO)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(6.5, now);
    lfoGain.gain.setValueAtTime(14, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    // Pitch envelope: starts around 480Hz, slides up to 880Hz ("ee"), then glides down to 420Hz ("ow")
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(860, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(420, now + duration);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(460, now);
    subOsc.frequency.exponentialRampToValueAtTime(860, now + 0.12);
    subOsc.frequency.exponentialRampToValueAtTime(420, now + duration);

    // Filter frequency sweep for feline vocalization
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.14);
    filter.frequency.exponentialRampToValueAtTime(650, now + duration);

    // Volume Envelope
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.06);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.06);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Connect Audio Graph
    osc.connect(gainNode);
    gainNode.connect(filter);

    subOsc.connect(subGain);
    subGain.connect(filter);

    filter.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);

    setTimeout(() => {
      ctx.close();
    }, (duration + 0.1) * 1000);
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
};

const OnekoCat = () => {
  const nekoRef = useRef(null);
  const [meowBubble, setMeowBubble] = useState(null);
  const bubbleTimeoutRef = useRef(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    let nekoPosX = window.innerWidth / 2 - 16;
    let nekoPosY = window.innerHeight / 2 - 16;
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleAnimationFrame = 0;
    const nekoSpeed = 11;

    const spriteSets = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
      scratchWallN: [[0, 0], [0, -1]],
      scratchWallS: [[-7, -1], [-6, -2]],
      scratchWallE: [[-2, -2], [-2, -3]],
      scratchWallW: [[-4, 0], [-4, -1]],
      tired: [[-3, -2]],
      sleeping: [[-2, 0], [-2, -1]],
      N: [[-1, -2], [-1, -3]],
      NE: [[0, -2], [0, -3]],
      E: [[-3, 0], [-3, -1]],
      SE: [[-5, -1], [-5, -2]],
      S: [[-6, -3], [-7, -2]],
      SW: [[-5, -3], [-6, -1]],
      W: [[-4, -2], [-4, -3]],
      NW: [[-1, 0], [-1, -1]],
    };

    const handleMouseMove = (event) => {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const setSprite = (name, frame) => {
      if (!nekoRef.current) return;
      const sprite = spriteSets[name][frame % spriteSets[name].length];
      nekoRef.current.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    };

    const resetIdleAnimation = () => {
      idleAnimation = null;
      idleAnimationFrame = 0;
    };

    const idle = () => {
      idleTime += 1;

      // Every few idle cycles, trigger a random cute behavior
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const availableAnimations = ['scratchSelf'];
        if (nekoPosX < 32) availableAnimations.push('scratchWallW');
        if (nekoPosY < 32) availableAnimations.push('scratchWallN');
        if (nekoPosX > window.innerWidth - 32) availableAnimations.push('scratchWallE');
        if (nekoPosY > window.innerHeight - 32) availableAnimations.push('scratchWallS');
        idleAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
      }

      switch (idleAnimation) {
        case 'sleeping':
          if (idleAnimationFrame < 8) {
            setSprite('tired', 0);
            break;
          }
          setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) {
            resetIdleAnimation();
          }
          break;
        case 'scratchWallN':
        case 'scratchWallS':
        case 'scratchWallE':
        case 'scratchWallW':
        case 'scratchSelf':
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) {
            resetIdleAnimation();
          }
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleAnimationFrame += 1;
    };

    const frame = () => {
      frameCount += 1;
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      // If near cursor, idle
      if (distance < nekoSpeed || distance < 38) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      if (idleTime > 1) {
        setSprite('alert', 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = '';
      direction += diffY / distance > 0.5 ? 'N' : '';
      direction += diffY / distance < -0.5 ? 'S' : '';
      direction += diffX / distance > 0.5 ? 'W' : '';
      direction += diffX / distance < -0.5 ? 'E' : '';
      setSprite(direction || 'idle', frameCount);

      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;

      // Keep within bounds
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      if (nekoRef.current) {
        nekoRef.current.style.left = `${nekoPosX - 16}px`;
        nekoRef.current.style.top = `${nekoPosY - 16}px`;
      }
    };

    const intervalId = setInterval(frame, 100);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCatClick = (e) => {
    e.stopPropagation();
    // Play synthesized meow sound
    playSynthesizedMeow();

    // Trigger cute floating meow bubble & jump
    const meows = ['Meow! 🐾', 'Purr~ 😺', 'Nyaa~! ✨', 'Mew! ❤️'];
    const randomMeow = meows[Math.floor(Math.random() * meows.length)];
    setMeowBubble(randomMeow);

    if (nekoRef.current) {
      nekoRef.current.classList.add('animate-bounce');
      setTimeout(() => {
        nekoRef.current?.classList.remove('animate-bounce');
      }, 600);
    }

    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setMeowBubble(null);
    }, 1800);
  };

  return (
    <div
      ref={nekoRef}
      id="oneko-cat"
      onClick={handleCatClick}
      title="Click me to Meow! 🐾"
      aria-label="Interactive Cursor Cat Companion"
      className="fixed z-[999] pointer-events-auto cursor-pointer select-none transition-transform duration-100 active:scale-125 hover:scale-110"
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        left: '48%',
        top: '50%',
        backgroundImage: "url('/oneko.gif')",
        imageRendering: 'pixelated',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {/* Floating Speech / Meow Bubble */}
      {meowBubble && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-amber-100 text-stone-900 dark:bg-stone-900 dark:text-amber-200 border-2 border-stone-800 dark:border-amber-400/50 shadow-md text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full whitespace-nowrap animate-fade-in pointer-events-none">
          {meowBubble}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-100 dark:bg-stone-900 border-r-2 border-b-2 border-stone-800 dark:border-amber-400/50 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default OnekoCat;
