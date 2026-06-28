import React, { useRef } from 'react';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';
import Stats from './Stats';
import Footer from './Footer';
import FloatingProfilePhoto from './FloatingProfilePhoto';

const Home = () => {
    const heroAnchorRef = useRef(null);
    const aboutAnchorRef = useRef(null);

    return (
        <div className="w-full mx-auto px-4 md:px-8 lg:px-12 flex flex-col space-y-12 md:space-y-20 relative">
            {/* Scroll-traveling Profile Photo */}
            <FloatingProfilePhoto 
                heroAnchorRef={heroAnchorRef} 
                aboutAnchorRef={aboutAnchorRef} 
            />

            <section id="hero" className="scroll-mt-20">
                <Hero heroAnchorRef={heroAnchorRef} />
            </section>

            <section id="about" className="scroll-mt-24">
                <About aboutAnchorRef={aboutAnchorRef} />
            </section>

            <section id="skills" className="scroll-mt-24">
                <Skills />
            </section>

            <section id="experience" className="scroll-mt-24">
                <Experience />
            </section>

            <section id="projects" className="scroll-mt-24">
                <Projects />
            </section>

            <section id="education" className="scroll-mt-24">
                <Education />
            </section>

            <section id="contact" className="scroll-mt-24">
                <Contact />
            </section>

            <section id="stats" className="scroll-mt-24">
                <Stats />
            </section>

            <Footer />
        </div>
    );
};

export default Home;
