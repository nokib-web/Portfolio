import { FaCode, FaPenNib, FaUserFriends, FaBrain } from 'react-icons/fa';
import developerJson from '../content/personas/developer.json';
import writerJson from '../content/personas/writer.json';
import friendJson from '../content/personas/friend.json';
import philosopherJson from '../content/personas/philosopher.json';

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
    ...philosopherJson,
    icon: FaBrain,
    iconColor: 'text-purple-400'
  }
];

export const getPersonaById = (id) => {
  if (!id) return personas[0];
  const cleanId = id.toLowerCase().trim();
  return personas.find(p => p.id === cleanId || p.slug === cleanId || p.personaId === cleanId) || null;
};
