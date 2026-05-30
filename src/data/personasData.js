import { FaCode, FaPenNib, FaUserFriends, FaBrain } from 'react-icons/fa';
import developerJson from '../content/personas/developer.json';
import writerJson from '../content/personas/writer.json';
import friendJson from '../content/personas/friend.json';

export const personas = [
  {
    ...developerJson,
    icon: FaCode,
    iconColor: 'text-cyan-400'
  },
  {
    ...writerJson,
    icon: FaPenNib,
    iconColor: 'text-amber-500'
  },
  {
    ...friendJson,
    icon: FaUserFriends,
    iconColor: 'text-rose-400'
  },
  {
    id: 'philosopher',
    title: 'Deep Thinker / Philosopher',
    slug: 'philosopher',
    route: '/philosopher',
    tagline: "Asking the big questions about life and tech.",
    description: "Reflections on logic, consciousness, systems, and ethics in the digital age.",
    icon: FaBrain,
    iconColor: 'text-purple-400',
    theme: {
      accentColor: "text-purple-400",
      bgColor: "bg-neutral-950",
      textColor: "text-neutral-200",
      fontFamily: "font-serif",
      gradient: "from-purple-600 to-indigo-500"
    },
    about: "I believe that technology is an extension of human intention. As we build increasingly advanced systems, understanding the philosophical frameworks under which they operate is paramount.",
    projects: [
      {
        "title": "A Treatise on Artificial Agency",
        "description": "An essay on whether neural network architectures can form intentional mental states.",
        "tech": ["Philosophy", "Cognitive Science"],
        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ],
    skills: [
      {
        "category": "Interests",
        "items": [
          { "name": "Epistemology", "level": "Theory of knowledge" },
          { "name": "Ethics of AI", "level": "Value alignment" },
          { "name": "Systems Thinking", "level": "Complexity theory" }
        ]
      }
    ]
  }
];

export const getPersonaById = (id) => {
  return personas.find(p => p.id === id);
};
