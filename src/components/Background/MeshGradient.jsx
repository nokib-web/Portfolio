import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const MeshGradient = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const blobs = gsap.utils.toArray('.blob');

        blobs.forEach((blob, i) => {
            gsap.to(blob, {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "none",
                delay: i * 2
            });
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Dark Mode Mesh */}
            <div className="hidden dark:block">
                <div className="blob absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/20 blur-[120px] rounded-full" />
                <div className="blob absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
                <div className="blob absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            {/* Light Mode Mesh */}
            <div className="dark:hidden">
                <div className="blob absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-100/40 blur-[100px] rounded-full" />
                <div className="blob absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 blur-[100px] rounded-full" />
                <div className="blob absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-blue-50/40 blur-[100px] rounded-full" />
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default MeshGradient;
