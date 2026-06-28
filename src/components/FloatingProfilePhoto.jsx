import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const PHOTO_SRC = 'https://i.ibb.co.com/gLxfJKQQ/nokib111.png';

/**
 * FloatingProfilePhoto
 * ─────────────────────
 * • Tracks elements in absolute document space so it perfectly sticks to the layout
 * • Transforms to fixed viewport coordinates for rendering to eliminate lag
 */
export default function FloatingProfilePhoto({ heroAnchorRef, aboutAnchorRef }) {
  const photoRef = useRef(null);

  useEffect(() => {
    const photo = photoRef.current;
    if (!photo) return;

    const lerp  = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const getPageY = (el) => el ? el.getBoundingClientRect().top + window.scrollY : 0;
    const getPageX = (el) => el ? el.getBoundingClientRect().left + window.scrollX : 0;
    const getPageBottom = (el) => el ? el.getBoundingClientRect().bottom + window.scrollY : 0;

    let scrollStart = 0;
    let scrollEnd   = 800;

    const updateCheckpoints = () => {
      const heroEl   = document.getElementById('hero');
      const anchorEl = aboutAnchorRef?.current;
      const aboutEl  = document.getElementById('about');
      if (!heroEl) return;

      scrollStart = getPageBottom(heroEl) - window.innerHeight * 0.6;

      if (anchorEl) {
        scrollEnd = getPageY(anchorEl) + anchorEl.offsetHeight / 2 - window.innerHeight * 0.5;
      } else if (aboutEl) {
        scrollEnd = getPageY(aboutEl) + aboutEl.offsetHeight * 0.3 - window.innerHeight * 0.5;
      }
      if (scrollEnd <= scrollStart + 300) scrollEnd = scrollStart + 600;
    };

    updateCheckpoints();
    const cpTimer = setTimeout(updateCheckpoints, 250);

    const getProgress = () =>
      clamp((window.scrollY - scrollStart) / (scrollEnd - scrollStart), 0, 1);

    // Initial absolute position
    const hEl = heroAnchorRef?.current;
    const h0 = hEl ? {
      x: getPageX(hEl),
      y: getPageY(hEl),
      w: hEl.getBoundingClientRect().width,
      h: hEl.getBoundingClientRect().height
    } : { x: window.innerWidth * 0.6, y: window.innerHeight * 0.25, w: 340, h: 340 };
    
    // cur tracks the ABSOLUTE page position
    let cur = { ...h0 };
    let floatOffset = 0;
    let floatTime   = 0;
    const FLOAT_AMP   = 12;
    const FLOAT_SPEED = 0.0011;
    const EASE = 0.15; // slightly faster ease since it's animating absolute coordinates

    let rafId;
    let lastTs    = null;
    let enterDone = false;

    const tick = (ts) => {
      const dt = lastTs ? ts - lastTs : 16;
      lastTs = ts;

      const p = getProgress();
      const aEl = aboutAnchorRef?.current;
      const hEl = heroAnchorRef?.current;

      const hPage = hEl ? {
        x: getPageX(hEl),
        y: getPageY(hEl),
        w: hEl.getBoundingClientRect().width,
        h: hEl.getBoundingClientRect().height
      } : h0;

      const aPage = aEl ? {
        x: getPageX(aEl),
        y: getPageY(aEl),
        w: aEl.getBoundingClientRect().width,
        h: aEl.getBoundingClientRect().height
      } : hPage;

      // Target position in absolute page coordinates
      const tx = lerp(hPage.x, aPage.x, p);
      const ty = lerp(hPage.y, aPage.y, p);
      const tw = lerp(hPage.w, aPage.w, p);
      const th = lerp(hPage.h, aPage.h, p);

      // Float effect only active in hero (p near 0)
      const floatStrength = clamp(1 - p / 0.12, 0, 1);
      if (floatStrength > 0 && enterDone) {
        floatTime   += dt;
        floatOffset  = Math.sin(floatTime * FLOAT_SPEED) * FLOAT_AMP * floatStrength;
      } else {
        floatOffset = lerp(floatOffset, 0, 0.06);
      }

      // Smooth absolute interpolation
      if (enterDone) {
        cur.x = lerp(cur.x, tx, EASE);
        cur.y = lerp(cur.y, ty, EASE);
        cur.w = lerp(cur.w, tw, EASE);
        cur.h = lerp(cur.h, th, EASE);
      }

      const flipDeg = p * 360;

      // Convert absolute coordinates back to fixed viewport coordinates for rendering
      // This is instantaneous and exactly cancels out scroll tracking lag
      const screenX = cur.x - window.scrollX;
      const screenY = cur.y - window.scrollY + floatOffset;

      photo.style.left      = `${screenX}px`;
      photo.style.top       = `${screenY}px`;
      photo.style.width     = `${cur.w}px`;
      photo.style.height    = `${cur.h}px`;
      photo.style.transform = `perspective(900px) rotateY(${flipDeg}deg)`;

      rafId = requestAnimationFrame(tick);
    };

    gsap.set(photo, { rotationY: 360, scale: 0.12, opacity: 0 });
    gsap.to(photo, {
      rotationY: 0,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'back.out(1.3)',
      delay: 0.3,
      onComplete: () => { enterDone = true; },
    });

    rafId = requestAnimationFrame(tick);

    const onResize = () => updateCheckpoints();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(cpTimer);
      gsap.killTweensOf(photo);
      window.removeEventListener('resize', onResize);
    };
  }, [heroAnchorRef, aboutAnchorRef]);

  return (
    <div
      ref={photoRef}
      style={{
        position:        'fixed',
        overflow:        'hidden',
        borderRadius:    '20px',
        border:          '1.5px solid rgba(139,92,246,0.22)',
        pointerEvents:   'none',
        zIndex:          90,
        opacity:         0,
        transformOrigin: 'center center',
        willChange:      'transform, top, left, width, height',
        boxShadow:       '0 12px 40px rgba(0,0,0,0.22)',
      }}
    >
      <img
        src={PHOTO_SRC}
        alt="Nokib"
        style={{
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'top center',
          display:        'block',
          pointerEvents:  'none',
          userSelect:     'none',
          draggable:      'false',
        }}
        draggable={false}
      />
      <div
        style={{
          position:      'absolute',
          inset:         0,
          background:    'linear-gradient(160deg, rgba(139,92,246,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
