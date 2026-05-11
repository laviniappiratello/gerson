import { useEffect, useState } from 'react';
import {
    getCurrentLunarPhase,
    getLunarPhaseInfo,
    getRituaisByPhase,
    getRitualById,
    type LunarPhase,
    type LunarPhaseInfo,
    type Ritual,
} from '../services/rituals';

export const useRituais = () => {
  const [currentPhase, setCurrentPhase] = useState<LunarPhase>('minguante');
  const [phaseInfo, setPhaseInfo] = useState<LunarPhaseInfo | null>(null);
  const [rituaisPorFase, setRituaisPorFase] = useState<Ritual[]>([]);

  useEffect(() => {
    const phase = getCurrentLunarPhase();
    setCurrentPhase(phase);
    setPhaseInfo(getLunarPhaseInfo(phase));
    setRituaisPorFase(getRituaisByPhase(phase));
  }, []);

  const getRitual = (id: string): Ritual | undefined => {
    return getRitualById(id);
  };

  return {
    currentPhase,
    phaseInfo,
    rituaisPorFase,
    getRitual,
  };
};

export const useRitualDetails = (ritualId: string) => {
  const [ritual, setRitual] = useState<Ritual | null>(null);

  useEffect(() => {
    const foundRitual = getRitualById(ritualId);
    setRitual(foundRitual || null);
  }, [ritualId]);

  return ritual;
};
