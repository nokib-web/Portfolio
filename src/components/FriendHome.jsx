import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaFacebook, FaInstagram, FaGithub, FaEnvelope, FaPaperPlane, FaCheck, FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { appConfig } from '../config';

const EMAILJS_SERVICE_ID = 'service_wiecqoh';
const EMAILJS_TEMPLATE_ID = 'template_pd5vc1f';
const EMAILJS_PUBLIC_KEY = 'GS5FlBE6Yq_LGd1va';

import { resolveMediaUrl, resolveAudioUrl } from '../utils/mediaUtils';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// Realistic 3D Tactile Push-Pin
const PushPin = ({ color = '#FF4757', angle = 0, className = '' }) => (
  <div
    className={`absolute z-30 select-none pointer-events-none drop-shadow-[0_8px_6px_rgba(0,0,0,0.55)] ${className}`}
    style={{ transform: `rotate(${angle}deg)` }}
  >
    <svg width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 22L17.5 37L14.5 37L16 22Z" fill="#71717A" />
      <path d="M16 22L16.6 37H15.4L16 22Z" fill="#E4E4E7" />
      <ellipse cx="16" cy="22" rx="8" ry="3.5" fill="#18181B" />
      <ellipse cx="16" cy="21" rx="7.5" ry="3" fill={color} />
      <path d="M8.5 21C8.5 21 10.5 12 12 9H20C21.5 12 23.5 21 23.5 21H8.5Z" fill={color} />
      <path d="M12 9C10.8 10.2 9.6 16.5 9 21H16V9H12Z" fill="white" opacity="0.3" />
      <circle cx="16" cy="9" r="8" fill={color} />
      <circle cx="13.5" cy="6.5" r="2.8" fill="white" opacity="0.75" />
      <ellipse cx="15" cy="8.5" rx="6" ry="3.5" fill="black" opacity="0.2" />
    </svg>
  </div>
);

// Translucent Washi Tape Strip
const WashiTape = ({ color = '#FFE600', angle = -3, className = '' }) => (
  <div
    className={`h-5 w-20 border border-black/20 backdrop-blur-xs select-none pointer-events-none ${className}`}
    style={{
      backgroundColor: color,
      transform: `rotate(${angle}deg)`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      opacity: 0.9,
    }}
  />
);

const FriendHome = ({ persona }) => {
  // Audio & Podcast Tracks State
  const defaultTracks = [
    {
      id: 'track-1',
      title: 'Welcome to the Friend Space // Dhaka Intro',
      category: 'Voice Greeting',
      tag: 'SIDE A // 01',
      duration: '0:45',
      timestamp: 'Today, 10:42 AM',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      transcript: 'Hey! Thanks for stopping by this corner of the site. Resumes and portfolios can feel way too formal, so I made this friend space. If you\'re ever in Dhaka, let\'s grab some Tong-er cha or coffee. Always down for travel stories, cycling trails, and book discussions.'
    },
    {
      id: 'track-2',
      title: 'Sajek Valley Morning Silence & Hillside Tea',
      category: 'Travel Audio',
      tag: 'SIDE A // 02',
      duration: '1:20',
      timestamp: 'Aug 12, 2026',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      transcript: 'Sitting atop the helipad in Sajek at 5:30 AM before the clouds disperse. There is a deep, quiet calm you only find on top of these hills with a piping hot cup of tea.'
    },
    {
      id: 'track-3',
      title: 'Early Morning Cycling Routes Across Dhaka',
      category: 'Podcast / Story',
      tag: 'SIDE B // 01',
      duration: '2:10',
      timestamp: 'Jul 28, 2026',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      transcript: 'Early morning rides across empty Dhaka bridges. Before the city wakes up, the river breeze and open roads feel like another world entirely.'
    },
    {
      id: 'track-4',
      title: 'Late Night Thoughts on Books & Timeless Ideas',
      category: 'Podcast / Reflection',
      tag: 'SIDE B // 02',
      duration: '1:55',
      timestamp: 'Jun 15, 2026',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      transcript: 'Reflecting on Haruki Murakami and Dostoevsky. The best books aren\'t just entertainment; they offer a lens to understand human emotion and time.'
    }
  ];

  const [audioTracks, setAudioTracks] = useState(persona?.audioTracks || defaultTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(45);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = audioTracks[currentTrackIndex] || audioTracks[0] || defaultTracks[0];

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timeline, setTimeline] = useState(persona?.timeline || []);
  const [gallery, setGallery] = useState(persona?.gallery || []);
  const [teaCups, setTeaCups] = useState(4);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Casual Adda & Tea',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('idle');
  const nameInputRef = useRef(null);

  const userPhoto = '/nokib111.png';
  const targetEmail = 'nokib.dev@gmail.com';

  useEffect(() => {
    fetch(`${appConfig.apiBaseUrl}/api/personas`)
      .then(res => res.json())
      .then(personasData => {
        if (Array.isArray(personasData)) {
          const friendDb = personasData.find(p => p.personaId === 'friend' || p.id === 'friend');
          if (friendDb) {
            if (friendDb.timeline && friendDb.timeline.length > 0) setTimeline(friendDb.timeline);
            if (friendDb.gallery && friendDb.gallery.length > 0) setGallery(friendDb.gallery);
            if (friendDb.audioTracks && friendDb.audioTracks.length > 0) {
              setAudioTracks(friendDb.audioTracks);
            }
          }
        }
      })
      .catch(() => {});
  }, [persona]);

  // Audio Playback Handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setTrackDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      // Auto move to next track
      handleNextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, audioTracks]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Audio playback error:', err);
        setIsPlaying(true);
      });
    }
  };

  const handleSelectTrack = (index) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.load();
        audioRef.current.play().catch((err) => {
          console.warn('Playback error:', err);
        });
      }
    }, 150);
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % audioTracks.length;
    handleSelectTrack(nextIdx);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
    handleSelectTrack(prevIdx);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatSeconds = (sec) => {
    if (isNaN(sec) || sec === null) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const waveBars = [14, 28, 18, 36, 22, 32, 16, 40, 24, 34, 20, 16, 30, 14, 26, 18, 36, 14, 22, 32];

  const pinColors = ['#FF4757', '#FFE600', '#00C2CB', '#FF00FF', '#2ED573'];
  const pinAngles = [-5, 8, -12, 6, -8];
  const polaroidRotations = [-3.5, 2.5, -2, 3.5, -3, 2];
  const stampDates = ['AUG 2023', 'OCT 2022', 'MAY 2020', 'NOV 2018'];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleScrollToContact = () => {
    const el = document.getElementById('contact-box');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => nameInputRef.current?.focus(), 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      Swal.fire({
        title: 'Missing Fields',
        text: 'Please enter your name, email, and message.',
        icon: 'warning',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'border-3 border-black shadow-[8px_8px_0px_#000] rounded-none font-mono',
        },
      });
      return;
    }

    setFormStatus('sending');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          topic: formData.topic,
          message: `[Topic: ${formData.topic}]\n\n${formData.message}`,
          to_name: 'Nokib',
          reply_to: formData.email,
        },
        EMAILJS_PUBLIC_KEY
      );

      setFormStatus('success');
      Swal.fire({
        title: 'Message Sent!',
        text: `Thank you for reaching out, ${formData.name}. I have received your message and will reply to ${formData.email} soon.`,
        icon: 'success',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'border-3 border-black shadow-[8px_8px_0px_#000] rounded-none font-mono',
        },
      });

      setFormData({
        name: '',
        email: '',
        topic: 'Casual Adda & Tea',
        message: '',
      });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setFormStatus('error');
      Swal.fire({
        title: 'Send Failed',
        text: `Could not send automatically. Please send directly to ${targetEmail}`,
        icon: 'error',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'border-3 border-black shadow-[8px_8px_0px_#000] rounded-none font-mono',
        },
      });
    } finally {
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <div className="font-sans text-black dark:text-neutral-100 bg-[#FAF6EE] dark:bg-[#121214] min-h-screen relative overflow-x-hidden selection:bg-[#FFE600] selection:text-black transition-colors duration-300">
      
      {/* Hidden HTML5 Audio Element for Seamless Playback */}
      <audio
        key={currentTrack?.url || currentTrackIndex}
        ref={audioRef}
        src={resolveAudioUrl(currentTrack?.url)}
        muted={isMuted}
        preload="auto"
      />

      {/* ── 1920PX MAX WIDTH CONTAINER ─────────────────────────── */}
      <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-16 space-y-20">

        {/* ── SECTION 1: HERO & BOOMBOX CASSETTE PLAYER ──────────── */}
        <section id="greeting" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: HERO PROFILE CARD (7 cols) */}
          <motion.div 
            {...fadeUp(0)}
            className="lg:col-span-7 bg-white dark:bg-[#1B1B20] text-black dark:text-white border-3 border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative hover:shadow-[10px_10px_0px_#000000] transition-all duration-300"
          >
            
            {/* Top Windows Style Header */}
            <div className="flex items-center justify-between pb-5 border-b-2 border-black mb-8">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF4757] border-2 border-black inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFE600] border-2 border-black inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#2ED573] border-2 border-black inline-block" />
                <span className="ml-2 font-mono font-black text-xs uppercase tracking-wider text-neutral-800 dark:text-neutral-300">
                  persona_friend.exe // Dhaka, BD
                </span>
              </div>
              <span className="bg-[#2ED573] text-black font-mono font-black text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                Status: Off Duty
              </span>
            </div>

            <div className="space-y-6">
              {/* Profile image + Title Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative shrink-0 group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#FFE600] border-3 border-black shadow-[5px_5px_0px_#000] overflow-hidden group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform duration-200">
                    <img
                      src={userPhoto}
                      alt="Nokib"
                      onError={(e) => {
                        e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nokib&backgroundColor=ffdfbf';
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-[#00C2CB] text-black text-[10px] font-black uppercase font-mono px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] rotate-[-3deg]">
                    Human
                  </span>
                </div>

                <div>
                  <div className="inline-block bg-[#FF00FF] text-white font-mono font-bold text-xs uppercase tracking-widest px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-2 rotate-[-1deg]">
                    WELCOME TO MY CORNER
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-black dark:text-white uppercase">
                    NAZMUL HASAN <span className="bg-[#FFE600] text-black px-2 border-2 border-black shadow-[3px_3px_0px_#000]">NOKIB</span>
                  </h1>
                </div>
              </div>

              {/* Tagline Box */}
              <div className="bg-[#00C2CB] border-3 border-black p-4 shadow-[4px_4px_0px_#000]">
                <p className="font-mono font-bold text-black text-sm sm:text-base leading-snug">
                  [ {persona.tagline || 'Roadside Tong-er Cha, Weekend Cycling, Books & Life Beyond Code'} ]
                </p>
              </div>

              {/* Bio */}
              <p className="text-neutral-800 dark:text-neutral-200 text-base sm:text-lg leading-relaxed font-medium">
                {persona.about || "Hey there! I'm Nokib, based in Dhaka, Bangladesh. Beyond debugging code and building web apps, I'm all about roadside hot lemon tea, evening addas with close friends, mountain treks to Sajek & Bandarban, early morning cycling, and getting lost in good books. I believe life's best memories happen off-screen over great conversations and a warm cup of tea."}
              </p>

              {/* Location & Quick Badges */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="bg-[#FFE600] text-black font-mono font-black text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  Location: Dhaka, Bangladesh
                </span>
                <span className="bg-[#2ED573] text-black font-mono font-black text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  Tong-er Cha Lover
                </span>
                <span className="bg-[#00C2CB] text-black font-mono font-black text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  Urban Cyclist
                </span>
                <span className="bg-[#FF00FF] text-white font-mono font-black text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  Avid Book Reader
                </span>
                <span className="bg-[#FAF6EE] text-black font-mono font-black text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                  Sajek &amp; Hill Trekker
                </span>
              </div>
            </div>

            {/* Bottom Actions & Social Bar */}
            <div className="pt-8 mt-8 border-t-2 border-black flex flex-wrap gap-3.5 items-center justify-between">
              
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleScrollToContact}
                  className="bg-[#FFE600] hover:bg-[#FFD700] text-black font-black uppercase tracking-wider text-xs sm:text-sm px-5 py-3 border-3 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FaPaperPlane className="text-sm" />
                  <span>Send Direct Message</span>
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="bg-white dark:bg-[#2A2B32] hover:bg-neutral-50 dark:hover:bg-[#34353E] text-black dark:text-white font-mono font-bold uppercase tracking-wider text-xs sm:text-sm px-4 py-3 border-3 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copiedEmail ? <FaCheck className="text-green-600" /> : <FaEnvelope />}
                  <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                </button>
              </div>

              {/* Social Channels (LinkedIn, Facebook, Instagram, GitHub) */}
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.linkedin.com/in/nazmulhasan-nokib/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-[#00C2CB] hover:bg-[#00d6e0] text-black border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  title="LinkedIn"
                >
                  <FaLinkedin className="text-lg" />
                </a>

                <a
                  href="https://www.facebook.com/NokibHasan.Nazmul"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 bg-[#FF00FF] hover:bg-[#ff24ff] text-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  title="Facebook"
                >
                  <FaFacebook className="text-lg" />
                </a>

                <a
                  href="https://www.instagram.com/nazmulhasan.nokib/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-[#FF4757] hover:bg-[#ff5e6c] text-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  title="Instagram"
                >
                  <FaInstagram className="text-lg" />
                </a>

                <a
                  href="https://github.com/nokib-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-10 h-10 bg-black hover:bg-neutral-800 text-white border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  title="GitHub"
                >
                  <FaGithub className="text-lg" />
                </a>
              </div>

            </div>
          </motion.div>

          {/* RIGHT: NEO-BRUTALIST MULTI-TRACK CASSETTE BOOMBOX PLAYER (5 cols) */}
          <motion.div 
            {...fadeUp(0.15)}
            className="lg:col-span-5 bg-[#FFDE59] border-3 border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden hover:shadow-[10px_10px_0px_#000000] transition-shadow duration-300"
          >
            
            {/* Cassette Header Bar with Track Count */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="bg-black text-white font-mono font-black text-xs px-2.5 py-0.5 uppercase">
                  {currentTrack?.tag || `TAPE #0${currentTrackIndex + 1}`}
                </span>
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-black truncate max-w-[150px] sm:max-w-[200px]">
                  {currentTrack?.category || 'AUDIO PODCAST'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#2ED573] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                  [ {audioTracks.length} TAPES ]
                </span>
                <span className="bg-white font-mono font-black text-xs px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                  {currentTrack?.duration || '0:45'}
                </span>
              </div>
            </div>

            {/* Cassette Body */}
            <div className="bg-black border-3 border-black p-5 shadow-[4px_4px_0px_#000] text-white space-y-4">
              
              {/* Cassette Tape Housing */}
              <div className="bg-[#1A1A1A] border-2 border-white/40 p-4 flex items-center justify-between relative overflow-hidden">
                {/* Reel Left */}
                <div className="w-14 h-14 rounded-full border-3 border-white bg-neutral-900 flex items-center justify-center relative shadow-inner">
                  <div className={`w-7 h-7 border-2 border-dashed border-[#FFE600] rounded-full ${isPlaying ? 'animate-spin' : ''}`} />
                  <div className="w-2.5 h-2.5 bg-white rounded-full absolute" />
                </div>

                {/* Tape center sticker with Current Track Title */}
                <div className="bg-[#FAF6EE] text-black border-2 border-black px-3 py-1.5 text-center font-mono max-w-[180px] rotate-[-1.5deg] shadow-[2px_2px_0px_#000]">
                  <span className="block font-black text-[10px] uppercase text-[#FF00FF] truncate">
                    {currentTrack?.category || 'DHAKA AUDIO TAPE'}
                  </span>
                  <span className="block font-black text-xs text-black truncate leading-tight">
                    {currentTrack?.title || 'Hi-Fi Audio'}
                  </span>
                </div>

                {/* Reel Right */}
                <div className="w-14 h-14 rounded-full border-3 border-white bg-neutral-900 flex items-center justify-center relative shadow-inner">
                  <div className={`w-7 h-7 border-2 border-dashed border-[#00C2CB] rounded-full ${isPlaying ? 'animate-spin' : ''}`} />
                  <div className="w-2.5 h-2.5 bg-white rounded-full absolute" />
                </div>
              </div>

              {/* Scrubber & Live Time Display */}
              <div className="space-y-1 bg-neutral-950 p-2.5 border-2 border-neutral-800">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-400">
                  <span className="text-[#2ED573] font-black">{formatSeconds(currentTime)}</span>
                  <span className="text-white uppercase truncate px-2">{currentTrack?.title}</span>
                  <span>{formatSeconds(trackDuration)}</span>
                </div>

                {/* Scrubber Input Range */}
                <input
                  type="range"
                  min="0"
                  max={trackDuration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-[#2ED573]"
                />

                {/* Live Audio Visualizer Equalizer */}
                <div className="flex items-end gap-[3px] h-6 pt-1">
                  {waveBars.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-[#2ED573] border-t border-white"
                      initial={{ height: 3 }}
                      animate={isPlaying ? { height: [h * 0.15, h * 0.6, h * 0.25] } : { height: 3 }}
                      transition={isPlaying ? { duration: 0.7, repeat: Infinity, repeatType: 'reverse', delay: i * 0.03, ease: 'easeInOut' } : { duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>

              {/* Player Controls Bar (Prev, Play/Pause, Next, Mute) */}
              <div className="grid grid-cols-12 gap-2 pt-1">
                <button
                  onClick={handlePrevTrack}
                  title="Previous Tape"
                  className="col-span-2 py-3 bg-white text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#FFF] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                >
                  <FaStepBackward />
                </button>

                <button
                  onClick={togglePlay}
                  className={`col-span-8 py-3.5 border-3 border-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#FF4757] text-white shadow-[3px_3px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                      : 'bg-[#2ED573] text-black shadow-[3px_3px_0px_#FFF] hover:bg-[#26af5f] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                  }`}
                >
                  {isPlaying ? <FaPause className="text-base" /> : <FaPlay className="text-base" />}
                  <span>{isPlaying ? 'PAUSE TAPE' : 'PLAY AUDIO TAPE'}</span>
                </button>

                <button
                  onClick={handleNextTrack}
                  title="Next Tape"
                  className="col-span-2 py-3 bg-white text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#FFF] hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                >
                  <FaStepForward />
                </button>
              </div>

            </div>

            {/* Transcript Receipt Box for Current Tape */}
            <div className="mt-4 bg-white text-black border-2 border-black border-dashed p-4 font-mono">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-neutral-600 pb-2 border-b border-neutral-300 mb-2">
                <span className="text-neutral-600">TRANSCRIPT // {currentTrack?.tag || 'AUDIO LOG'}</span>
                <span className="text-neutral-600">{currentTrack?.timestamp || 'TODAY'}</span>
              </div>
              <p className="text-xs text-neutral-900 leading-relaxed font-semibold">
                "{currentTrack?.transcript || 'No transcript provided for this audio log.'}"
              </p>
            </div>

          </motion.div>

        </section>

        {/* ── SECTION 2: CASSETTE TAPE RACK & PODCAST PLAYLIST ───── */}
        <section id="audio-rack" className="space-y-6">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#FF00FF] text-white font-mono font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1 rotate-[-1deg]">
                AUDIO PODCASTS &amp; TAPES
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
                CASSETTE TAPE RACK
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#FFE600] text-black font-mono text-xs uppercase font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                TOTAL: {audioTracks.length} TAPES UPLOADED
              </span>
              <span className="font-mono text-xs uppercase font-bold text-neutral-600 dark:text-neutral-400">
                [ CLICK TO LOAD TAPE ]
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audioTracks.map((track, idx) => {
              const isSelected = currentTrackIndex === idx;

              return (
                <motion.div
                  key={track.id || idx}
                  {...fadeUp(0.08 + idx * 0.05)}
                  whileHover={{ y: -6, x: -2 }}
                  onClick={() => handleSelectTrack(idx)}
                  className={`p-6 border-3 border-black flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FFE600] text-black shadow-[8px_8px_0px_#000000] ring-2 ring-black'
                      : 'bg-white dark:bg-[#1C1D22] text-black dark:text-white shadow-[5px_5px_0px_#000000] hover:shadow-[8px_8px_0px_#000000]'
                  }`}
                >
                  <div>
                    {/* Tape Header Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-black text-white font-mono font-black text-xs px-2.5 py-0.5 uppercase">
                        {track.tag || `TAPE #0${idx + 1}`}
                      </span>
                      <span className="font-mono font-black text-[10px] bg-white text-black border border-black px-2 py-0.5 uppercase">
                        {track.duration || '1:00'}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className={`inline-block font-mono font-bold text-[10px] uppercase border px-2 py-0.5 mb-1 ${
                        isSelected 
                          ? 'text-black bg-white/80 border-black' 
                          : 'text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border-black/40'
                      }`}>
                        {track.category || 'Podcast'}
                      </span>
                      <h3 className={`text-lg font-black leading-snug ${isSelected ? 'text-black' : 'text-black dark:text-white'}`}>
                        {track.title}
                      </h3>
                    </div>

                    <p className={`text-xs font-medium line-clamp-3 leading-relaxed mt-2 font-mono ${
                      isSelected 
                        ? 'text-neutral-900 font-semibold' 
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}>
                      "{track.transcript}"
                    </p>
                  </div>

                  {/* Tape Load Action Button */}
                  <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between font-mono text-xs font-black">
                    {isSelected ? (
                      <span className="flex items-center gap-1.5 text-black font-black">
                        <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                        <span>NOW LOADED ON DECK</span>
                      </span>
                    ) : (
                      <span className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white">
                        CLICK TO LOAD ▷
                      </span>
                    )}
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-neutral-800' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {track.timestamp || 'ARCHIVED'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </section>

        {/* ── SECTION 3: VIBE CHECK / HOBBIES BENTO ──────────────── */}
        <section id="vibe-check" className="space-y-6">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#00C2CB] text-black font-mono font-bold text-xs uppercase px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                SPECS &amp; ADDA RITUALS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
                THE OFF-SCREEN VIBE CHECK
              </h2>
            </div>
            <span className="font-mono text-xs uppercase font-bold text-neutral-600 dark:text-neutral-400">
              [ 04 MODULES ACTIVE ]
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Tong-er Cha & Coffee */}
            <motion.div 
              {...fadeUp(0.15)}
              whileHover={{ y: -6 }}
              className="bg-[#FFE600] text-black border-3 border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between hover:shadow-[8px_8px_0px_#000] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-lg bg-black text-white px-2 py-0.5">TEA</span>
                  <span className="bg-black text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase">
                    Adda Fuel
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase mb-1 text-black">Tong-er Cha &amp; Brews</h3>
                <p className="font-mono text-xs font-bold text-black/90 mb-4">Malta Cha, Lemon Tea &amp; V60</p>
                <div className="space-y-1.5 bg-white text-black border-2 border-black p-3 font-mono text-xs font-bold">
                  <div className="flex justify-between text-black">
                    <span className="text-black">Cups Today:</span>
                    <span className="text-[#FF4757] font-black">{teaCups} / 5</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-3.5 border border-black overflow-hidden flex">
                    <div className="bg-[#FF4757] h-full transition-all duration-300" style={{ width: `${Math.min((teaCups / 5) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center">
                <button
                  onClick={() => setTeaCups(c => (c < 6 ? c + 1 : 1))}
                  className="w-full bg-black text-white font-mono font-bold text-xs uppercase py-2 border border-black hover:bg-neutral-800 active:scale-95 transition-all text-center cursor-pointer"
                >
                  + Brew Another Cup
                </button>
              </div>
            </motion.div>

            {/* Card 2: Cycling & Morning Trails */}
            <motion.div 
              {...fadeUp(0.2)}
              whileHover={{ y: -6 }}
              className="bg-[#00C2CB] text-black border-3 border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between hover:shadow-[8px_8px_0px_#000] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-lg bg-black text-white px-2 py-0.5">RIDE</span>
                  <span className="bg-black text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase">
                    On Two Wheels
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase mb-1 text-black">Cycling &amp; Trails</h3>
                <p className="font-mono text-xs font-bold text-black/90 mb-4">Sunrise riverbanks, bridges &amp; quiet lanes</p>
                
                <div className="bg-white text-black border-2 border-black p-3 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-black">
                    <span className="text-black">Usual Route:</span>
                    <span className="bg-[#FFE600] text-black px-1.5 border border-black">Hatirjheel &amp; Trails</span>
                  </div>
                  <p className="text-[10px] text-neutral-800 font-semibold">Routine: Weekend Morning Rides</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black">
                <span className="font-mono font-black text-xs uppercase bg-white text-black border border-black px-2 py-1 block text-center">
                  STATUS: READY TO PEDAL
                </span>
              </div>
            </motion.div>

            {/* Card 3: Reading Books & Philosophy */}
            <motion.div 
              {...fadeUp(0.25)}
              whileHover={{ y: -6 }}
              className="bg-[#FF00FF] text-white border-3 border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between hover:shadow-[8px_8px_0px_#000] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-lg bg-black text-white px-2 py-0.5 border border-white">BOOKS</span>
                  <span className="bg-black text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase border border-white">
                    Reader Log
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase mb-1 text-white">Reading &amp; Ideas</h3>
                <p className="font-mono text-xs font-bold text-white/90 mb-4">Philosophy, Non-Fiction &amp; Tech Essays</p>
                
                <div className="bg-black text-white border-2 border-white p-3 font-mono text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Current Read:</span>
                    <span className="text-[#FFE600]">Philosophy &amp; Essays</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-300 font-bold">
                    <span>Pace:</span>
                    <span>2-3 Books / Month</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black">
                <span className="font-mono font-black text-xs uppercase bg-black text-white border border-white px-2 py-1 block text-center">
                  SHELF: EXPANDING
                </span>
              </div>
            </motion.div>

            {/* Card 4: Travel & Mountain Treks */}
            <motion.div 
              {...fadeUp(0.3)}
              whileHover={{ y: -6 }}
              className="bg-[#2ED573] text-black border-3 border-black shadow-[6px_6px_0px_#000000] p-6 flex flex-col justify-between hover:shadow-[8px_8px_0px_#000] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-lg bg-black text-white px-2 py-0.5">TREK</span>
                  <span className="bg-black text-white font-mono font-bold text-[10px] px-2 py-0.5 uppercase">
                    Outdoors
                  </span>
                </div>
                <h3 className="text-xl font-black uppercase mb-1 text-black">Travel &amp; Mountains</h3>
                <p className="font-mono text-xs font-bold text-black/90 mb-4">Sajek, Bandarban, Nafakhum &amp; Hills</p>
                
                <div className="bg-white text-black border-2 border-black p-3 font-mono text-xs space-y-1">
                  <div className="flex justify-between font-bold text-black">
                    <span className="text-black">Next Destination:</span>
                    <span className="bg-[#2ED573] text-black px-1 border border-black font-bold">Hill Tracts</span>
                  </div>
                  <p className="text-[10px] text-neutral-800 font-semibold">Mode: Backpack &amp; Hiking Boots</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black">
                <span className="font-mono font-black text-xs uppercase bg-white text-black border border-black px-2 py-1 block text-center font-bold">
                  TRAIL: ACTIVE
                </span>
              </div>
            </motion.div>

          </div>

        </section>

        {/* ── SECTION 4: CHAPTERS OF LIFE (TIMELINE) ─────────────── */}
        <section id="chapters" className="space-y-8">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black dark:border-neutral-700">
            <div>
              <div className="inline-block bg-[#FF00FF] text-white font-mono font-bold text-xs uppercase px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] mb-1 rotate-[-1deg]">
                ARCHIVE // MILESTONES
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
                CHAPTERS OF MY LIFE
              </h2>
            </div>
            <span className="font-mono text-xs uppercase font-bold text-neutral-600 dark:text-neutral-400">
              [ 2015 → PRESENT ]
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timeline?.map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(0.08 + idx * 0.05)}
                whileHover={{ y: -6, x: -2 }}
                onClick={() => setSelectedChapterIndex(idx)}
                className="bg-white dark:bg-[#1C1D22] text-black dark:text-white border-3 border-black shadow-[6px_6px_0px_#000000] p-6 sm:p-7 flex flex-col justify-between hover:shadow-[10px_10px_0px_#000] transition-all relative overflow-hidden group cursor-pointer"
              >
                {/* Year Header Block */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="bg-[#FFE600] text-black font-mono font-black text-base px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000]">
                      {item.year}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.readTime && (
                        <span className="font-mono font-bold text-[10px] text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-black px-2 py-0.5">
                          {item.readTime}
                        </span>
                      )}
                      {item.tag && (
                        <span className="bg-neutral-100 dark:bg-neutral-800 font-mono font-bold text-[10px] uppercase px-2 py-0.5 border-2 border-black text-black dark:text-white">
                          #{item.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white leading-snug mb-3 group-hover:text-[#FF00FF] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Index Stamp */}
                <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center font-mono text-xs text-neutral-500 dark:text-neutral-400 font-bold">
                  <span className="bg-[#00C2CB] text-black px-2 py-0.5 border border-black">CHAPTER 0{idx + 1}</span>
                  <span className="text-black dark:text-white font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>READ STORY</span>
                    <span>→</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </section>

        {/* ── SECTION 5: NOSTALGIC PIN-BOARD POLAROID GALLERY ──────── */}
        <section id="gallery" className="space-y-6">
          
          <motion.div {...fadeUp(0.1)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-3 border-black">
            <div>
              <div className="inline-block bg-[#2ED573] text-black font-mono font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] mb-1">
                35MM NOSTALGIA // PINBOARD
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black">
                MOMENTS IN PIXELS
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white font-mono text-xs uppercase font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                PINNED MEMORIES
              </span>
              <span className="font-mono text-xs uppercase font-bold text-neutral-600">
                [ CLICK TO UNPIN &amp; PREVIEW ]
              </span>
            </div>
          </motion.div>

          {/* Dedicated Corkboard / Scrapbook Canvas Frame */}
          <div 
            className="bg-[#EDE1D1] border-4 border-black shadow-[12px_12px_0px_#000000] p-6 sm:p-10 md:p-14 relative overflow-hidden rounded-none"
            style={{
              backgroundImage: 'radial-gradient(#C4B299 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          >

            {/* Corner Decorative Screws/Pins */}
            <PushPin color="#FF4757" angle={-15} className="top-4 left-4" />
            <PushPin color="#00C2CB" angle={20} className="top-4 right-4" />

            {/* Pinned Scrapbook Memo Note */}
            <div className="mb-10 max-w-xl bg-[#FFF9A6] border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] rotate-[-1.5deg] relative">
              <PushPin color="#FF00FF" angle={5} className="-top-3 left-6" />
              <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-2">
                <span className="font-mono font-black text-[10px] uppercase text-black/60 tracking-wider">
                  SCRAPBOOK MEMO // POLAROID LOG
                </span>
                <span className="font-mono font-black text-[10px] bg-black text-white px-2 py-0.5 uppercase">
                  MEMORIES
                </span>
              </div>
              <p className="font-handwritten text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
                "Off-duty moments hit differently. High mountain air in Sajek, rainy day Tong-er cha, cycling through sunrise trails, and reading late at night."
              </p>
            </div>

            {/* Polaroids Grid with Natural Scattered Angles & 3D Push-Pins */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 items-start pt-2 pb-4">
              {gallery?.map((img, idx) => {
                const rotation = polaroidRotations[idx % polaroidRotations.length];
                const pinColor = pinColors[idx % pinColors.length];
                const pinAngle = pinAngles[idx % pinAngles.length];
                const stampDate = stampDates[idx % stampDates.length];

                return (
                  <motion.div
                    key={idx}
                    {...fadeUp(0.1 + idx * 0.08)}
                    whileHover={{
                      scale: 1.06,
                      rotate: 0,
                      y: -10,
                      zIndex: 35,
                      transition: { type: 'spring', stiffness: 350, damping: 20 },
                    }}
                    onClick={() => setSelectedImage(img)}
                    style={{ transformOrigin: 'top center' }}
                    className="relative cursor-pointer select-none group"
                  >
                    {/* 3D Push-Pin at Top Center */}
                    <PushPin
                      color={pinColor}
                      angle={pinAngle}
                      className="-top-4 left-1/2 -translate-x-1/2 group-hover:-translate-y-1 transition-transform"
                    />

                    {/* Masking Washi Tape on Opposite Corner */}
                    <WashiTape
                      color={idx % 2 === 0 ? '#FFE600' : '#00C2CB'}
                      angle={idx % 2 === 0 ? -6 : 8}
                      className={`absolute -top-3 ${idx % 2 === 0 ? 'right-2' : 'left-2'} z-20`}
                    />

                    {/* Authentic Polaroid Photographic Card */}
                    <div
                      style={{ transform: `rotate(${rotation}deg)` }}
                      className="group-hover:rotate-0 transition-transform duration-300 bg-[#FAF8F5] border-3 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[14px_14px_0px_#000000] p-3 sm:p-3.5 pb-6 flex flex-col justify-between"
                    >
                      {/* Photo Area (Gloss Sheen & Vignette) */}
                      <div className="w-full aspect-[4/3.6] bg-neutral-900 border-2 border-black overflow-hidden relative shadow-inner">
                        <img
                          src={resolveMediaUrl(img.url)}
                          alt={img.caption}
                          className="w-full h-full object-cover filter contrast-[1.04] brightness-[0.98] group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Film Frame Grain & Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 pointer-events-none" />
                        
                        {/* Zoom Pill on Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-[#FFE600] text-black font-mono font-black text-xs px-3 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000]">
                            ENLARGE PHOTO
                          </span>
                        </div>

                        {/* Red Corner Film Number */}
                        <div className="absolute bottom-1.5 right-1.5 bg-black/75 text-[#FFE600] font-mono text-[9px] font-bold px-1.5 py-0.5 border border-black">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Polaroid Bottom Chin with Sharpie / Marker Handwriting */}
                      <div className="mt-4 pt-1 space-y-2 text-black">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-handwritten text-2xl font-bold text-black leading-none tracking-wide">
                            {img.caption}
                          </h3>
                        </div>

                        {/* Stamp & Metadata */}
                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-neutral-300 font-mono text-[10px] text-black">
                          <span className="border-2 border-red-700 text-red-700 font-black uppercase px-2 py-0.5 rotate-[-2deg]">
                            {stampDate}
                          </span>
                          <span className="bg-[#00C2CB] text-black font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                            {img.sticker || 'ORIGINAL'}
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Corkboard Watermark */}
            <div className="mt-8 pt-4 border-t-2 border-black/30 flex flex-col sm:flex-row items-center justify-between text-xs font-mono font-black uppercase text-neutral-700 dark:text-neutral-300 gap-2">
              <span>BOARD REF // DHAKA 35MM RETRO LOG</span>
              <span className="bg-black text-white px-2 py-0.5">ALL SHOTS AUTHENTIC</span>
            </div>

          </div>

        </section>

        {/* ── SECTION 6: INVITATION / DHAKA ADDA CALLOUT ───────── */}
        <motion.section 
          id="coffee-invite"
          {...fadeUp(0.1)}
          className="bg-[#FFE600] text-black border-4 border-black shadow-[10px_10px_0px_#000000] p-8 sm:p-12 md:p-16 relative overflow-hidden space-y-6"
        >
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-block bg-black text-white font-mono font-black text-xs uppercase px-3 py-1 border-2 border-black">
              OPEN INVITATION // DHAKA, BANGLADESH
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none">
              ALWAYS DOWN FOR TONG-ER CHA &amp; ADDA.
            </h2>

            <p className="text-neutral-900 font-semibold text-base sm:text-lg leading-relaxed">
              Visiting Dhaka or looking to chat about open-source tech, favorite books, cycling routes, travel stories from Sajek, or just need a good friend for adda? Drop a line and let's grab a hot cup of roadside lemon tea.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={handleScrollToContact}
                className="bg-black hover:bg-neutral-850 text-white font-mono font-black uppercase text-sm sm:text-base px-8 py-4 border-3 border-black shadow-[4px_4px_0px_#FFF] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaPaperPlane />
                <span>SEND DIRECT MESSAGE</span>
              </button>

              <a
                href="https://www.linkedin.com/in/nazmulhasan-nokib/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-neutral-100 text-black font-mono font-black uppercase text-sm sm:text-base px-6 py-4 border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <FaLinkedin />
                <span>LINKEDIN</span>
              </a>

              <a
                href="https://www.facebook.com/NokibHasan.Nazmul"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF00FF] hover:bg-[#ff24ff] text-white font-mono font-black uppercase text-sm sm:text-base px-6 py-4 border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <FaFacebook />
                <span>FACEBOOK</span>
              </a>

              <a
                href="https://www.instagram.com/nazmulhasan.nokib/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF4757] hover:bg-[#ff5e6c] text-white font-mono font-black uppercase text-sm sm:text-base px-6 py-4 border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <FaInstagram />
                <span>INSTAGRAM</span>
              </a>
            </div>
          </div>

          {/* Decorative Giant Background Text */}
          <div className="hidden lg:block absolute -right-8 -bottom-10 opacity-15 pointer-events-none select-none font-black text-[180px] leading-none text-black">
            ADDA
          </div>
        </motion.section>

        {/* ── SECTION 7: REAL INTERACTIVE DIRECT CONTACT FORM ────── */}
        <motion.section 
          id="contact-box"
          {...fadeUp(0.1)}
          className="bg-white dark:bg-[#1B1B20] text-black dark:text-white border-4 border-black shadow-[12px_12px_0px_#000000] p-6 sm:p-10 md:p-14 relative overflow-hidden"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
            
            {/* Left Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block bg-[#00C2CB] text-black font-mono font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                DIRECT INBOX DISPATCH
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tight leading-none">
                DROP A DIRECT MESSAGE.
              </h2>

              <p className="text-neutral-900 dark:text-neutral-200 font-medium text-base sm:text-lg leading-relaxed">
                Send a message straight to my inbox. Whether it's tech, books, cycling trails, or travel stories, I'll get back to you directly.
              </p>

              <div className="bg-[#FAF6EE] dark:bg-[#25262E] text-black dark:text-white border-3 border-black p-5 space-y-3 font-mono shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-between text-xs font-bold border-b border-black pb-2">
                  <span className="text-neutral-600 dark:text-neutral-400 uppercase">DIRECT EMAIL:</span>
                  <span className="text-black dark:text-white font-black">{targetEmail}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-600 dark:text-neutral-400 uppercase">RESPONSE TIME:</span>
                  <span className="text-[#2ED573] bg-black px-2 py-0.5">WITHIN 24 HOURS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleCopyEmail}
                  className="bg-[#FFE600] hover:bg-[#ffd700] text-black font-mono font-bold text-xs uppercase px-4 py-3 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copiedEmail ? <FaCheck className="text-green-700" /> : <FaEnvelope />}
                  <span>{copiedEmail ? 'COPIED NOKIB.DEV@GMAIL.COM' : 'COPY EMAIL ADDRESS'}</span>
                </button>
              </div>

            </div>

            {/* Right Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF6EE] dark:bg-[#25262E] text-black dark:text-white border-3 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000000]">
              
              <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-6">
                <span className="font-mono font-black text-sm uppercase tracking-wider text-black dark:text-white">
                  NEW_MESSAGE_TO_{targetEmail.toUpperCase()}
                </span>
                <span className="bg-[#FFE600] text-black font-mono font-black text-xs px-2 py-0.5 border border-black">
                  INBOX
                </span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono font-black text-xs uppercase mb-1.5 text-black dark:text-white">
                      YOUR NAME *
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Alex"
                      className="w-full bg-white dark:bg-[#1A1A1E] border-2 border-black p-3.5 font-mono text-sm text-black dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#1A1A1E] focus:outline-none shadow-[2px_2px_0px_#000] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono font-black text-xs uppercase mb-1.5 text-black dark:text-white">
                      YOUR EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. alex@gmail.com"
                      className="w-full bg-white dark:bg-[#1A1A1E] border-2 border-black p-3.5 font-mono text-sm text-black dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#1A1A1E] focus:outline-none shadow-[2px_2px_0px_#000] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono font-black text-xs uppercase mb-1.5 text-black dark:text-white">
                    WHAT'S THIS ABOUT?
                  </label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-[#1A1A1E] border-2 border-black p-3.5 font-mono text-sm text-black dark:text-white focus:bg-white dark:focus:bg-[#1A1A1E] focus:outline-none shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
                  >
                    <option value="Casual Adda & Tea" className="dark:bg-[#1A1A1E] dark:text-white">Casual Adda &amp; Tea Session</option>
                    <option value="Cycling & Trails" className="dark:bg-[#1A1A1E] dark:text-white">Cycling &amp; Trail Rides</option>
                    <option value="Book Recommendations" className="dark:bg-[#1A1A1E] dark:text-white">Book Recommendations &amp; Philosophy</option>
                    <option value="Travel & Trekking" className="dark:bg-[#1A1A1E] dark:text-white">Travel Stories &amp; Hill Trekking</option>
                    <option value="Project Collaboration" className="dark:bg-[#1A1A1E] dark:text-white">Project Collaboration / Tech Chat</option>
                    <option value="Just Saying Hi" className="dark:bg-[#1A1A1E] dark:text-white">Just Saying Hi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono font-black text-xs uppercase mb-1.5 text-black dark:text-white">
                    YOUR MESSAGE *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Write whatever is on your mind..."
                    className="w-full bg-white dark:bg-[#1A1A1E] border-2 border-black p-3.5 font-mono text-sm text-black dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#1A1A1E] focus:outline-none shadow-[2px_2px_0px_#000] transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 bg-black hover:bg-neutral-850 text-white font-mono font-black text-sm sm:text-base uppercase tracking-widest border-3 border-black shadow-[4px_4px_0px_#FFE600] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
                >
                  <FaPaperPlane />
                  <span>
                    {formStatus === 'sending' ? 'DISPATCHING TO INBOX...' : 'SEND DIRECT MESSAGE TO INBOX'}
                  </span>
                </button>

              </form>

            </div>

          </div>

          {/* Decorative Giant Background Text */}
          <div className="hidden lg:block absolute -right-8 -bottom-10 opacity-15 pointer-events-none select-none font-black text-[180px] leading-none text-black dark:text-white">
            INBOX
          </div>
        </motion.section>

      </main>

      {/* ── NOSTALGIC POLAROID LIGHTBOX MODAL ────────────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 25 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#FAF8F5] dark:bg-[#1A1A1E] text-black dark:text-white border-4 border-black shadow-[20px_20px_0px_#000] max-w-4xl w-full p-6 sm:p-8 flex flex-col md:flex-row gap-8 relative cursor-default"
            >
              {/* Pushpin at Modal Top */}
              <PushPin color="#FF4757" angle={-8} className="-top-4 left-10" />

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-[#FF4757] text-white w-11 h-11 border-3 border-black font-mono font-black text-xl flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-[#ff2d40] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all z-20 cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="md:w-3/5 bg-neutral-900 border-3 border-black overflow-hidden flex items-center justify-center max-h-[520px] shadow-inner">
                <img
                  src={resolveMediaUrl(selectedImage.url)}
                  alt={selectedImage.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-2/5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFE600] text-black font-mono font-bold text-xs px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                      POLAROID 35MM
                    </span>
                    <span className="border-2 border-red-500 text-red-500 font-mono text-[10px] font-black uppercase px-2 py-0.5 rotate-[-2deg]">
                      ORIGINAL SHOT
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-bold font-handwritten text-neutral-900 dark:text-neutral-100 leading-tight">
                    {selectedImage.caption}
                  </h3>

                  <p className="text-neutral-800 dark:text-neutral-300 text-sm font-medium leading-relaxed font-mono bg-[#EFE5D5] dark:bg-[#25262E] border-2 border-black p-4 shadow-[2px_2px_0px_#000]">
                    Authentic snapshot outside the terminal — capturing life, Sajek mountains, mechanical boards, and evening addas.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full bg-black text-white font-mono font-black text-sm uppercase py-4 border-2 border-black hover:bg-neutral-850 transition-colors shadow-[4px_4px_0px_#FFE600] cursor-pointer"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CHAPTER STORY READER MODAL ─────────────────────────── */}
      <AnimatePresence>
        {selectedChapterIndex !== null && timeline && timeline[selectedChapterIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChapterIndex(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#FAF6EE] dark:bg-[#1A1A1E] text-black dark:text-white border-4 border-black shadow-[20px_20px_0px_#000000] max-w-3xl w-full my-8 p-6 sm:p-10 relative cursor-default"
            >
              {/* Corner Pushpin */}
              <PushPin color="#FFE600" angle={-10} className="-top-4 left-8" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedChapterIndex(null)}
                className="absolute -top-4 -right-4 bg-[#FF4757] text-white w-12 h-12 border-3 border-black font-mono font-black text-xl flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-[#ff2439] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all z-20 cursor-pointer"
                aria-label="Close Story"
              >
                ✕
              </button>

              {/* Story Top Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-3 border-black dark:border-neutral-700 mb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FFE600] text-black font-mono font-black text-sm px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                    CHAPTER 0{selectedChapterIndex + 1}
                  </span>
                  <span className="bg-black text-white font-mono font-bold text-xs px-2.5 py-1 uppercase">
                    {timeline[selectedChapterIndex].year}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                  {timeline[selectedChapterIndex].readTime && (
                    <span className="bg-white dark:bg-neutral-800 text-black dark:text-white border-2 border-black px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">
                      {timeline[selectedChapterIndex].readTime}
                    </span>
                  )}
                  {timeline[selectedChapterIndex].tag && (
                    <span className="bg-[#FF00FF] text-white border-2 border-black px-2.5 py-0.5 shadow-[2px_2px_0px_#000]">
                      #{timeline[selectedChapterIndex].tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Story Title & Location */}
              <div className="space-y-2 mb-6">
                {timeline[selectedChapterIndex].location && (
                  <span className="inline-block bg-[#00C2CB] text-black font-mono font-black text-[11px] uppercase px-2.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
                    Location: {timeline[selectedChapterIndex].location}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tight leading-tight">
                  {timeline[selectedChapterIndex].title}
                </h2>
              </div>

              {/* Story Cover Image (If available) */}
              {timeline[selectedChapterIndex].coverImage && (
                <div className="w-full aspect-[16/8.5] bg-neutral-900 border-3 border-black mb-6 overflow-hidden relative shadow-[6px_6px_0px_#000]">
                  <img
                    src={resolveMediaUrl(timeline[selectedChapterIndex].coverImage)}
                    alt={timeline[selectedChapterIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Story Full Body Content */}
              <div className="bg-white dark:bg-[#25262E] text-black dark:text-white border-3 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000] mb-8 font-sans space-y-4">
                <p className="text-neutral-900 dark:text-neutral-100 font-bold text-base sm:text-lg leading-relaxed border-b-2 border-neutral-200 dark:border-neutral-700 pb-4">
                  "{timeline[selectedChapterIndex].description}"
                </p>

                {timeline[selectedChapterIndex].story ? (
                  timeline[selectedChapterIndex].story.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-neutral-800 dark:text-neutral-200 text-base sm:text-lg leading-relaxed font-medium">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-neutral-700 dark:text-neutral-300 text-base leading-relaxed font-medium">
                    This chapter documents a transformative life milestone. Memories are preserved here as timeless stories outside the terminal.
                  </p>
                )}
              </div>

              {/* Modal Bottom Bar: Next / Prev Chapter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-3 border-black dark:border-neutral-700">
                <button
                  onClick={() => setSelectedChapterIndex((selectedChapterIndex - 1 + timeline.length) % timeline.length)}
                  className="bg-white dark:bg-neutral-800 hover:bg-neutral-100 text-black dark:text-white font-mono font-black text-xs uppercase px-5 py-3 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  ← PREV CHAPTER
                </button>

                <button
                  onClick={() => setSelectedChapterIndex(null)}
                  className="bg-black hover:bg-neutral-800 text-white font-mono font-black text-xs uppercase px-6 py-3 border-2 border-black shadow-[3px_3px_0px_#FFE600] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  CLOSE STORY
                </button>

                <button
                  onClick={() => setSelectedChapterIndex((selectedChapterIndex + 1) % timeline.length)}
                  className="bg-[#FFE600] hover:bg-[#FFD700] text-black font-mono font-black text-xs uppercase px-5 py-3 border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  NEXT CHAPTER →
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2-COLUMN NEO-BRUTALIST FULLSCREEN MENU OVERLAY (SCREENSHOT MATCH) ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#1A1A1E] text-black dark:text-white border-4 border-black shadow-[16px_16px_0px_#000000] max-w-xl w-full p-8 sm:p-12 md:p-14 relative"
            >
              {/* Corner Pushpin Accent */}
              <PushPin color="#FF00FF" angle={-8} className="-top-4 left-8" />

              {/* Title Header */}
              <h2 className="text-center font-mono font-black text-2xl sm:text-3xl tracking-[0.25em] uppercase text-black dark:text-white mb-10 pb-2">
                MENU
              </h2>

              {/* 2-Column Links Grid (100% Friend Persona Sections Only) */}
              <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6">
                
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('greeting')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#FF00FF] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      HOME
                    </button>
                  </div>

                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('vibe-check')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#FF00FF] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      ABOUT
                    </button>
                  </div>

                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('audio-rack')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#FF00FF] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      PODCASTS
                    </button>
                  </div>

                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('contact-box')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#FF00FF] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      CONTACT
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('chapters')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#00C2CB] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      CHAPTERS
                    </button>
                  </div>

                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('gallery')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#00C2CB] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      POLAROIDS
                    </button>
                  </div>

                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('coffee-invite')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#00C2CB] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      TEA &amp; ADDA
                    </button>
                  </div>

                  <div className="border-b-2 border-dotted border-black dark:border-neutral-600 pb-3">
                    <button
                      onClick={() => scrollToSection('top')}
                      className="font-mono font-black text-xl sm:text-2xl uppercase tracking-wider text-black dark:text-white hover:text-[#2ED573] hover:translate-x-2 transition-all block text-left w-full cursor-pointer"
                    >
                      TOP ↑
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BOTTOM-RIGHT NEO-BRUTALIST MENU BUTTON (SCREENSHOT MATCH) ── */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95, y: 1 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`w-14 h-14 sm:w-16 sm:h-16 border-3 border-black flex items-center justify-center font-mono font-black transition-all cursor-pointer ${
            isMenuOpen
              ? 'bg-[#E8DFF5] dark:bg-[#34353E] text-black dark:text-white shadow-[4px_4px_0px_#000000] text-3xl'
              : 'bg-[#E8DFF5] dark:bg-[#34353E] text-black dark:text-white shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] text-xs uppercase'
          }`}
        >
          {isMenuOpen ? (
            <span>✕</span>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="w-6 h-0.5 bg-black dark:bg-white block" />
              <span className="w-6 h-0.5 bg-black dark:bg-white block" />
              <span className="w-6 h-0.5 bg-black dark:bg-white block" />
            </div>
          )}
        </motion.button>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t-3 border-black dark:border-neutral-700 bg-white dark:bg-[#18181B] text-black dark:text-white py-8">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between text-xs font-mono font-bold uppercase gap-4">
          <span>© {new Date().getFullYear()} NAZMUL HASAN NOKIB // OFF-DUTY HUMAN</span>
          <span className="bg-[#FFE600] text-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
            NEO-BRUTALISM EDITION
          </span>
        </div>
      </footer>

    </div>
  );
};

export default FriendHome;
