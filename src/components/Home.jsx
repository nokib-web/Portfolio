import React from 'react';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';
import Stats from './Stats';
import Footer from './Footer';

const Home = () => {
    return (
        <div className="flex flex-col space-y-20 md:space-y-32">
            <section id="hero" className="scroll-mt-20">
                <Hero />
            </section>

            <section id="about" className="scroll-mt-24">
                <About />
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
