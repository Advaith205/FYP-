import { createContext, useContext } from 'react';
import type React from 'react';
import {
  Hospital,
  RankedHospital,
  AHPResult,
  SystemMeta,
  KneeProcedure,
  TOPSISResult,
} from '@/types/dss';

export interface PatientProfile {
  countries: string[];
  max_budget: number;
  max_waiting_time: number;
  min_quality: number;
  archetype: string;
  procedure_id?: string;
}

export interface FeasibilityDefaults {
  max_budget: number;
  max_waiting_time: number;
}

export const PROCEDURE_FEASIBILITY_DEFAULTS: Record<string, FeasibilityDefaults> = {
  // Primary procedures: $55,000 budget, 35 days max wait
  KNEE01: { max_budget: 55000, max_waiting_time: 35 },
  KNEE02: { max_budget: 55000, max_waiting_time: 35 },
  KNEE04: { max_budget: 55000, max_waiting_time: 35 },
  KNEE06: { max_budget: 55000, max_waiting_time: 35 },
  KNEE07: { max_budget: 55000, max_waiting_time: 35 },
  KNEE08: { max_budget: 55000, max_waiting_time: 35 },
  // Robotic technique scenarios: $65,000 budget, 45 days max wait
  KNEE03: { max_budget: 65000, max_waiting_time: 45 },
  KNEE05: { max_budget: 65000, max_waiting_time: 45 },
  // Revision procedure: $75,000 budget, 60 days max wait
  KNEE09: { max_budget: 75000, max_waiting_time: 60 },
};

export function getProcedureFeasibilityDefaults(procedureId?: string): FeasibilityDefaults {
  const cleanId = (procedureId || 'KNEE01').toUpperCase().trim();
  return PROCEDURE_FEASIBILITY_DEFAULTS[cleanId] || { max_budget: 55000, max_waiting_time: 35 };
}

export interface DSSContextType {
  meta: SystemMeta | null;
  profile: PatientProfile;
  setProfile: React.Dispatch<React.SetStateAction<PatientProfile>>;
  procedures: KneeProcedure[];
  selectedProcedureId: string;
  selectedProcedure: KneeProcedure | null;
  setSelectedProcedureId: (id: string) => Promise<void>;
  resetToProcedureDefaults: (targetProcedureId?: string) => Promise<void>;
  ahpMatrix: number[][];
  setAhpMatrix: React.Dispatch<React.SetStateAction<number[][]>>;
  ahpResult: AHPResult | null;
  rankedHospitals: RankedHospital[];
  rawHospitals: Hospital[];
  rankingResult: TOPSISResult | null;
  isLoading: boolean;
  isCalculating: boolean;
  errorMessage: string | null;
  activeArchetype: string;
  updatePairwiseValue: (i: number, j: number, value: number) => Promise<void>;
  applyPreset: (presetName: string) => Promise<void>;
  refreshRankings: (
    customWeights?: number[],
    customProfile?: PatientProfile,
    customProcedureId?: string
  ) => Promise<void>;
  saveProfileAndRecalculate: (newProfile: PatientProfile) => Promise<void>;
}

export const DEFAULT_PROFILE: PatientProfile = {
  countries: ['India', 'Türkiye', 'Thailand', 'USA'],
  max_budget: 55000,
  max_waiting_time: 35,
  min_quality: 10,
  archetype: 'Balanced',
  procedure_id: 'KNEE01',
};

export const DSSContext = createContext<DSSContextType | undefined>(undefined);

export function useDSS(): DSSContextType {
  const context = useContext(DSSContext);
  if (!context) {
    throw new Error('useDSS must be used within a DSSProvider');
  }
  return context;
}

