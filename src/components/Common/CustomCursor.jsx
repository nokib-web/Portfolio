import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isPointer, setIsPointer] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        const handlePointerEntry = () => setIsPointer(true);
        const handlePointerLeave = () => setIsPointer(false);

        window.addEventListener("mousemove", moveCursor);

        const interactiveElements = document.querySelectorAll('a, button, [role="button"], .interactive');
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", handlePointerEntry);
            el.addEventListener("mouseleave", handlePointerLeave);
        });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener("mouseenter", handlePointerEntry);
                el.removeEventListener("mouseleave", handlePointerLeave);
            });
        };
    }, []);

    useEffect(() => {
        if (isPointer) {
            gsap.to(cursorRef.current, { scale: 0, duration: 0.2 });
            gsap.to(followerRef.current, {
                scale: 2,
                backgroundColor: "rgba(139, 92, 246, 0.2)",
                mixBlendMode: "difference",
                duration: 0.3
            });
        } else {
            gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
            gsap.to(followerRef.current, {
                scale: 1,
                backgroundColor: "transparent",
                mixBlendMode: "normal",
                duration: 0.3
            });
        }
    }, [isPointer]);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-primary-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-primary-500/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />
        </>
    );
};

export default CustomCursor;
