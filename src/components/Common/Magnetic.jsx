import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Magnetic = ({ children, strength = 0.5 }) => {
    const magneticRef = useRef(null);

    useGSAP(() => {
        const xTo = gsap.quickTo(magneticRef.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
        const yTo = gsap.quickTo(magneticRef.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = magneticRef.current.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * strength);
            yTo(y * strength);
        };

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        };

        const element = magneticRef.current;
        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: magneticRef });

    return React.cloneElement(children, { ref: magneticRef });
};

export default Magnetic;
