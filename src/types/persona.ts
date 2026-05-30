export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  codeLink?: string;
  liveLink?: string;
  keyPoints?: string[];
}

export interface SkillItem {
  name: string;
  level?: string;
  color?: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface PersonaTheme {
  accentColor: string;          // e.g., 'text-cyan-400', 'text-indigo-400'
  bgColor: string;              // e.g., 'bg-slate-950', 'bg-zinc-950'
  textColor: string;            // e.g., 'text-slate-200', 'text-zinc-200'
  fontFamily: string;           // e.g., 'font-mono', 'font-serif', 'font-sans'
  gradient: string;             // e.g., 'from-blue-600 to-cyan-500'
  meshGradientColor?: string;   // Optional mesh color values
}

export interface Persona {
  id: string;
  title: string;
  slug: string;
  route: string;
  tagline: string;
  description: string;
  theme: PersonaTheme;
  about: string;
  projects: Project[];
  skills: SkillCategory[];
}
