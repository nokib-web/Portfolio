import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Typewriter — renders text one character at a time with a blinking caret.
 *
 * Props:
 *   text            {string}   — the text to animate
 *   speed           {number}   — ms between characters (default 35)
 *   delay           {number}   — ms before typing starts (default 300)
 *   className       {string}   — extra Tailwind classes
 *   cursorClassName {string}   — custom classes for the caret
 *   onComplete      {function} — called once when animation finishes
 *   showCursorAfter {boolean}  — keep cursor blinking after finish (default false)
 *   natural         {boolean}  — randomise speed ±40 % for a human feel (default true)
 */
const Typewriter = ({
  text = '',
  speed = 35,
  delay = 300,
  className = '',
  cursorClassName = '',
  onComplete,
  showCursorAfter = false,
  natural = true,
}) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  // Honour the initial delay before typing
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Type one character per interval
  useEffect(() => {
    if (!started || done) return;

    if (displayed.length >= text.length) {
      setDone(true);
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    // Natural-feeling variable speed: ±40 % jitter
    const jitter = natural ? speed * (0.6 + Math.random() * 0.8) : speed;

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, jitter);

    return () => clearTimeout(timer);
  }, [started, displayed, text, speed, natural, done, onComplete]);

  const showCursor = !done || showCursorAfter;

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          className={`inline-block w-[2px] h-[1.1em] align-middle ml-0.5 bg-current animate-typewriter-blink ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
};

export default Typewriter;
