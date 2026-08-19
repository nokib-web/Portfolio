import React, { useEffect, useRef } from 'react';

/**
 * High-quality Web Audio API synthesized Meow Sound
 * Uses formant modulation and harmonic oscillators to produce an authentic "Mee-ooww~" sound.
 */
const playMeowSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const duration = 0.55;

    // Main voice oscillator
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    // Harmonic overtone oscillator
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    // Vowel formant filter ("M-E-O-W")
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(4.0, now);

    // Subtle pitch vibrato
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(7.0, now);
    vibratoGain.gain.setValueAtTime(18, now);
    vibrato.connect(osc1.frequency);
    vibrato.connect(osc2.frequency);
    vibrato.start(now);
    vibrato.stop(now + duration);

    // Pitch Curve: Starts ~420Hz, rises up to 880Hz ("Eee"), then swoops down to 380Hz ("Oww")
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(420, now);
    osc1.frequency.linearRampToValueAtTime(880, now + 0.16);
    osc1.frequency.exponentialRampToValueAtTime(380, now + duration);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(420, now);
    osc2.frequency.linearRampToValueAtTime(880, now + 0.16);
    osc2.frequency.exponentialRampToValueAtTime(380, now + duration);

    // Formant sweep
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(2100, now + 0.18);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    // Amplitude envelope
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.5, now + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Connect graph
    osc1.connect(gain1);
    gain1.connect(filter);

    osc2.connect(gain2);
    gain2.connect(filter);

    filter.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    setTimeout(() => {
      ctx.close();
    }, (duration + 0.1) * 1000);
  } catch (err) {
    console.warn('Could not play synthesized meow:', err);
  }
};

const OnekoCat = () => {
  const nekoRef = useRef(null);

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
    const nekoSpeed = 10;

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

      if (distance < nekoSpeed || distance < 36) {
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
    // Play meow sound
    playMeowSound();

    // Little playful jump
    if (nekoRef.current) {
      nekoRef.current.classList.add('animate-bounce');
      setTimeout(() => {
        nekoRef.current?.classList.remove('animate-bounce');
      }, 500);
    }
  };

  return (
    <div
      ref={nekoRef}
      id="oneko-cat"
      onClick={handleCatClick}
      title="Click me to Meow!"
      aria-label="Interactive Oneko Cat"
      className="fixed z-[99999] pointer-events-auto cursor-pointer select-none transition-transform duration-75 active:scale-125 hover:scale-110"
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        left: '50%',
        top: '50%',
        backgroundImage: "url('/oneko.gif')",
        imageRendering: 'pixelated',
        transform: 'translate3d(0, 0, 0)',
      }}
    />
  );
};

export default OnekoCat;
