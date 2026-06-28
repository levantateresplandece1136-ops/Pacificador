export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conflict {
  id: string;
  title: string;
  party: string;
  relationshipType: string;
  description: string;
  impact: string;
  currentStep: 'PASO1' | 'PASO2' | 'PASO3';
  status: 'active' | 'resolved';
  createdAt: string;
  updatedAt: string;
  
  // Step 1: Agradar a Dios
  step1Reflection: string;
  step1GodsWill: string;
  step1WinOrPlease: string;
  step1ControlOnly: string;
  step1Completed: boolean;
  
  // Step 2: Arrepentirse
  // 2A. Desire tests (Santiago 4:1-3)
  step2ConsumeThoughts: string;
  step2SinToGetIt: string;
  step2SinWhenFailed: string;
  step2DesireIdentified: string;
  // 2B. Conduct
  step2MySpecificSin: string;
  step2DamageCaused: string;
  step2ExcusesEliminated: string;
  confessionDraft: string;
  step2Completed: boolean;
  
  // Step 3: Amar
  step3GraceAttitudesChecked: string[];
  step3PrerequisitesChecked: string[];
  step3ServicePlan: string;
  step3ForgivenessAttitudinalChecked: boolean;
  step3ForgivenessTransactionalChecked: boolean;
  step3Completed: boolean;
  
  // Custom generated items
  customPrayer: string;
  
  // Plan de Acción de Pacificación
  actionPlanInnerMeditate?: boolean;
  actionPlanInnerIdol?: boolean;
  actionPlanInnerPrayer?: boolean;
  actionPlanOuterConfess?: boolean;
  actionPlanOuterService?: boolean;
  actionPlanOuterGrace?: boolean;
  actionPlanNotes?: string;
  
  // Chat history with "Pacificador" for this specific conflict
  chats: Message[];
}
