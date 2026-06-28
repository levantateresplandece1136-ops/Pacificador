import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  BookOpen, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  ArrowRight, 
  User, 
  ShieldAlert, 
  FileText, 
  Clock, 
  ChevronRight, 
  CheckSquare, 
  Square,
  Volume2,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message, Conflict } from "./types";
import { BIBLE_VERSES, MODEL_STEPS_GUIDE, RELATIONSHIPS } from "./data";

export default function App() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [activeConflictId, setActiveConflictId] = useState<string | null>(null);
  
  // New conflict form state
  const [newParty, setNewParty] = useState("");
  const [newRelationship, setNewRelationship] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImpact, setNewImpact] = useState("");

  // UI Tabs / Accordions
  const [activeStepTab, setActiveStepTab] = useState<'paso1' | 'paso2' | 'paso3' | 'resumen'>('paso1');

  // Confession generator state
  const [mySpecificSin, setMySpecificSin] = useState("");
  const [damageCaused, setDamageCaused] = useState("");
  const [excusesEliminated, setExcusesEliminated] = useState("");
  const [isGeneratingConfession, setIsGeneratingConfession] = useState(false);
  const [confessionError, setConfessionError] = useState<string | null>(null);

  // Prayer generator state
  const [isGeneratingPrayer, setIsGeneratingPrayer] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);

  // Notification / Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Grace & Comfort panel state
  const [currentGraceVerseIdx, setCurrentGraceVerseIdx] = useState(0);
  const [isGraceOpen, setIsGraceOpen] = useState(true);

  // UI Tabs / Accordions

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("pacificador_conflicts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConflicts(parsed);
        if (parsed.length > 0) {
          setActiveConflictId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error parsing conflicts from localStorage", e);
      }
    }
  }, []);

  // Save to LocalStorage
  const saveConflicts = (updated: Conflict[]) => {
    setConflicts(updated);
    localStorage.setItem("pacificador_conflicts", JSON.stringify(updated));
  };

  const activeConflict = conflicts.find(c => c.id === activeConflictId) || null;

  // Handle Copy text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Create new conflict
  const handleCreateConflict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParty.trim() || !newRelationship || !newDescription.trim()) {
      return;
    }

    const initialWelcomeMessage: Message = {
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: `Hola, soy Pacificador. Estoy aquí para acompañarte pastoralmente en este conflicto con ${newParty}. He leído los detalles que compartiste.\n\nPara comenzar a buscar la paz de manera sincera ante el Señor, debemos iniciar con el **PASO 1 — Agradar a Dios**.\n\nEn lugar de enfocarte en cambiar a ${newParty} o ganar la discusión, ¿qué crees que Dios te está pidiendo que hagas hoy para honrarle en medio de esta circunstancia?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newConflict: Conflict = {
      id: "conflict-" + Date.now(),
      title: `Conflicto con ${newParty}`,
      party: newParty,
      relationshipType: newRelationship,
      description: newDescription,
      impact: newImpact,
      currentStep: "PASO1",
      status: "active",
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      
      // Step 1
      step1Reflection: "",
      step1GodsWill: "",
      step1WinOrPlease: "",
      step1ControlOnly: "",
      step1Completed: false,
      
      // Step 2
      step2ConsumeThoughts: "",
      step2SinToGetIt: "",
      step2SinWhenFailed: "",
      step2DesireIdentified: "",
      step2MySpecificSin: "",
      step2DamageCaused: "",
      step2ExcusesEliminated: "",
      confessionDraft: "",
      step2Completed: false,
      
      // Step 3
      step3GraceAttitudesChecked: [],
      step3PrerequisitesChecked: [],
      step3ServicePlan: "",
      step3ForgivenessAttitudinalChecked: false,
      step3ForgivenessTransactionalChecked: false,
      step3Completed: false,
      
      customPrayer: "",
      chats: [initialWelcomeMessage]
    };

    const updated = [newConflict, ...conflicts];
    saveConflicts(updated);
    setActiveConflictId(newConflict.id);
    setActiveStepTab('paso1');

    // Reset form fields
    setNewParty("");
    setNewRelationship("");
    setNewDescription("");
    setNewImpact("");
  };

  // Delete conflict
  const handleDeleteConflict = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de que deseas eliminar este proceso de consejería? Esta acción no se puede deshacer.")) {
      const updated = conflicts.filter(c => c.id !== id);
      saveConflicts(updated);
      if (activeConflictId === id) {
        setActiveConflictId(updated.length > 0 ? updated[0].id : null);
      }
    }
  };

  // Step 1 Field update
  const handleUpdateStep1 = (field: 'step1Reflection' | 'step1GodsWill' | 'step1WinOrPlease' | 'step1ControlOnly', value: string) => {
    if (!activeConflict) return;

    const isStep1Finished = 
      (field === 'step1GodsWill' ? value : activeConflict.step1GodsWill).trim().length > 5 &&
      (field === 'step1WinOrPlease' ? value : activeConflict.step1WinOrPlease).trim().length > 5 &&
      (field === 'step1ControlOnly' ? value : activeConflict.step1ControlOnly).trim().length > 5;

    const updated: Conflict = {
      ...activeConflict,
      [field]: value,
      step1Completed: isStep1Finished,
      // Auto transition visual indicator if they completed Step 1
      currentStep: isStep1Finished && activeConflict.currentStep === "PASO1" ? "PASO2" : activeConflict.currentStep
    };

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Step 2 Field update
  const handleUpdateStep2 = (field: 'step2ConsumeThoughts' | 'step2SinToGetIt' | 'step2SinWhenFailed' | 'step2DesireIdentified' | 'step2MySpecificSin' | 'step2DamageCaused' | 'step2ExcusesEliminated', value: string) => {
    if (!activeConflict) return;

    const updated: Conflict = {
      ...activeConflict,
      [field]: value
    };

    // Evaluate step 2 completeness
    const isStep2Finished = 
      updated.step2DesireIdentified.trim().length > 3 &&
      updated.step2MySpecificSin.trim().length > 5 &&
      updated.step2DamageCaused.trim().length > 5;

    updated.step2Completed = isStep2Finished;
    if (isStep2Finished && activeConflict.currentStep === "PASO2") {
      updated.currentStep = "PASO3";
    }

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Toggle checklist item in Step 3
  const handleToggleStep3Check = (listField: 'step3GraceAttitudesChecked' | 'step3PrerequisitesChecked', value: string) => {
    if (!activeConflict) return;

    const currentList = activeConflict[listField] || [];
    const updatedList = currentList.includes(value)
      ? currentList.filter(item => item !== value)
      : [...currentList, value];

    const updated: Conflict = {
      ...activeConflict,
      [listField]: updatedList
    };

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Toggle boolean in Step 3
  const handleToggleStep3Bool = (field: 'step3ForgivenessAttitudinalChecked' | 'step3ForgivenessTransactionalChecked', value: boolean) => {
    if (!activeConflict) return;

    const updated: Conflict = {
      ...activeConflict,
      [field]: value
    };

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Update Service plan
  const handleUpdateServicePlan = (value: string) => {
    if (!activeConflict) return;

    const updated: Conflict = {
      ...activeConflict,
      step3ServicePlan: value,
      step3Completed: value.trim().length > 10
    };

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Toggle boolean in Action Plan
  const handleToggleActionPlanBool = (field: 'actionPlanInnerMeditate' | 'actionPlanInnerIdol' | 'actionPlanInnerPrayer' | 'actionPlanOuterConfess' | 'actionPlanOuterService' | 'actionPlanOuterGrace') => {
    if (!activeConflict) return;

    const updated: Conflict = {
      ...activeConflict,
      [field]: !activeConflict[field]
    };

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Update Action Plan additional notes
  const handleUpdateActionPlanNotes = (value: string) => {
    if (!activeConflict) return;

    const updated: Conflict = {
      ...activeConflict,
      actionPlanNotes: value
    };

    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
  };

  // Generate 7-Step Confession Draft from API
  const handleGenerateConfession = async () => {
    if (!activeConflict) return;
    
    setIsGeneratingConfession(true);
    setConfessionError(null);

    try {
      const response = await fetch("/api/pacificador/draft-confession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conflict: activeConflict,
          reflections: {
            mySpecificSin: activeConflict.step2MySpecificSin || mySpecificSin,
            damageCaused: activeConflict.step2DamageCaused || damageCaused,
            excusesEliminated: activeConflict.step2ExcusesEliminated || excusesEliminated
          }
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar con el redactor de confesiones.");
      }

      const data = await response.json();
      
      const updated: Conflict = {
        ...activeConflict,
        confessionDraft: data.confessionDraft
      };
      saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));

      // Append encouragement from system to chats
      const promptAssistantMsg: Message = {
        id: "msg-assistant-conf-" + Date.now(),
        role: "assistant",
        content: `He redactado un borrador de confesión de 7 pasos personalizado en la pestaña **Paso 2**. \n\nRecuerda el pasaje de Mateo 7:3-5. Esta confesión asume la responsabilidad total de tu parte del conflicto. Te animo a revisarlo con detenimiento, meditarlo en oración y adaptarlo a tus propias palabras antes de hablar con la persona.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const withChatUpdate: Conflict = {
        ...updated,
        chats: [...updated.chats, promptAssistantMsg]
      };
      saveConflicts(conflicts.map(c => c.id === activeConflict.id ? withChatUpdate : c));

    } catch (err: any) {
      console.error(err);
      setConfessionError(err.message || "Error al solicitar el borrador.");
    } finally {
      setIsGeneratingConfession(false);
    }
  };

  // Generate Custom Prayer from API
  const handleGeneratePrayer = async () => {
    if (!activeConflict) return;

    setIsGeneratingPrayer(true);
    setPrayerError(null);

    try {
      const response = await fetch("/api/pacificador/generate-prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conflict: activeConflict })
      });

      if (!response.ok) {
        throw new Error("No se pudo generar la oración pastoral en este momento.");
      }

      const data = await response.json();

      const updated: Conflict = {
        ...activeConflict,
        customPrayer: data.prayer
      };
      saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));

      // Add assistant message to guide user to look at it
      const systemWelcome: Message = {
        id: "msg-prayer-notif-" + Date.now(),
        role: "assistant",
        content: `He compuesto una oración pastoral para ti basándome en tus respuestas. He puesto tus dolores y anhelos delante del trono de la gracia. La puedes encontrar en la parte superior del chat. Que el Señor fortalezca tu fe hoy.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const withChatUpdate: Conflict = {
        ...updated,
        chats: [...updated.chats, systemWelcome]
      };
      saveConflicts(conflicts.map(c => c.id === activeConflict.id ? withChatUpdate : c));

    } catch (err: any) {
      console.error(err);
      setPrayerError(err.message || "Error al redactar la oración.");
    } finally {
      setIsGeneratingPrayer(false);
    }
  };

  // Helper: Manually change step
  const handleSetStep = (step: 'PASO1' | 'PASO2' | 'PASO3') => {
    if (!activeConflict) return;
    const updated: Conflict = { ...activeConflict, currentStep: step };
    saveConflicts(conflicts.map(c => c.id === activeConflict.id ? updated : c));
    
    // Switch left panel tab accordingly
    if (step === "PASO1") setActiveStepTab("paso1");
    if (step === "PASO2") setActiveStepTab("paso2");
    if (step === "PASO3") setActiveStepTab("paso3");
  };



  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col font-sans text-gray-800 antialiased selection:bg-emerald-100 selection:text-[#1A4331]">
      
      {/* HEADER BAR */}
      <header className="border-b border-[#E1EAE4] bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-5 py-4 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#1A4331] flex items-center justify-center border border-emerald-100/80 shadow-xs">
              <Heart className="h-6 w-6 fill-[#1A4331] stroke-[#1A4331]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A4331] tracking-tight flex items-center gap-2">
                Pacificador
                <span className="text-xs bg-emerald-50 text-[#1A4331] px-3 py-1 rounded-full font-semibold border border-emerald-100 font-sans">
                  Consejería Bíblica
                </span>
              </h1>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Modelo de Robert D. Jones — "En busca de la paz"
              </p>
            </div>
          </div>

          {/* Quick Info & Bible banner */}
          <div className="flex items-center gap-3 bg-[#FAF9F5] border border-[#EBE7DF] rounded-xl px-4 py-2.5 max-w-md shadow-3xs">
            <BookOpen className="h-5 w-5 text-[#A88C52] shrink-0" />
            <p className="text-xs italic text-gray-600 font-serif leading-relaxed line-clamp-1">
              "Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios." — Mateo 5:9
            </p>
          </div>
        </div>
      </header>

      {/* CONFIDENTIALITY NOTIFICATION BANNER */}
      <div className="bg-[#FAF7F2] border-b border-[#EBE5DB] text-center py-2.5 px-4 text-xs font-medium text-gray-600 flex items-center justify-center gap-2.5">
        <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Privacidad Asegurada:</strong> Todas tus respuestas se guardan localmente de forma privada en tu navegador actual.
        </span>
      </div>

      {/* MAIN LAYOUT SPLIT */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-5 sm:p-8 lg:p-10 flex flex-col gap-8">
        
        {/* LEFT COLUMN: ACTIVE CONFLICTS & STEPS REFLECTION ENGINE */}
        <div className="w-full flex flex-col gap-8">
          
          {/* 1. SELECCIÓN DE CONFLICTOS / HISTORIAL */}
          <div className="bg-white border border-[#E2EDE5] rounded-3xl p-6 shadow-sm shadow-emerald-950/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-widest text-[#1A4331] uppercase">
                Tus Procesos de Paz
              </h2>
              {activeConflictId && (
                <button
                  onClick={() => setActiveConflictId(null)}
                  className="text-xs text-[#1A4331] hover:text-[#2E6B50] font-bold flex items-center gap-1.5 transition-colors bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100"
                >
                  <Plus className="h-3.5 w-3.5" /> Nuevo Proceso
                </button>
              )}
            </div>

            {conflicts.length === 0 ? (
              <div className="text-center py-8 bg-[#FAFBF9] rounded-2xl border-2 border-dashed border-[#E1EAE4]">
                <p className="text-sm font-medium text-gray-400">No tienes ningún proceso registrado todavía.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {conflicts.map((c) => {
                  const isActive = c.id === activeConflictId;
                  return (
                    <motion.div
                      key={c.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveConflictId(c.id);
                        // Default to current steps
                        if (c.currentStep === 'PASO1') setActiveStepTab('paso1');
                        if (c.currentStep === 'PASO2') setActiveStepTab('paso2');
                        if (c.currentStep === 'PASO3') setActiveStepTab('paso3');
                      }}
                      className={`cursor-pointer px-4 py-3 rounded-2xl border transition-all flex items-center gap-3 text-sm ${
                        isActive
                          ? "bg-[#1A4331] text-white border-[#1A4331] shadow-md shadow-emerald-950/20"
                          : "bg-white text-gray-700 border-[#E4EDE6] hover:bg-emerald-50/40 hover:border-emerald-200"
                      }`}
                    >
                      <User className={`h-4.5 w-4.5 ${isActive ? "text-emerald-200" : "text-emerald-700"}`} />
                      <div className="text-left">
                        <div className="font-bold tracking-tight">
                          {c.party} 
                        </div>
                        <div className={`text-[11px] font-medium ${isActive ? "text-emerald-200/85" : "text-gray-400"}`}>
                          {c.relationshipType} • {c.currentStep}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConflict(c.id, e)}
                        className={`ml-3 p-1.5 rounded-xl hover:bg-black/10 transition-colors ${
                          isActive ? "text-emerald-200 hover:text-white" : "text-gray-400 hover:text-red-600"
                        }`}
                        title="Eliminar conflicto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. MAIN WORKSPACE / CREATOR OR STEPS PANEL */}
          <div className="bg-white border border-[#E2EDE5] rounded-3xl shadow-sm shadow-[#1A4331]/5 overflow-hidden flex-1 flex flex-col">
            
            {!activeConflict ? (
              /* IF NO ACTIVE CONFLICT, SHOW REGISTER FORM */
              <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full text-center mb-8">
                  <div className="mx-auto w-14 h-14 bg-emerald-50 text-[#1A4331] flex items-center justify-center rounded-2xl mb-4 border border-emerald-100">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-[#1A4331] tracking-tight mb-3">
                    Iniciar un Nuevo Proceso de Paz
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    Somete tu conflicto interpersonal al examen de las Escrituras. Te guiaremos paso a paso a agradar a Dios, examinar tu viga primero y restaurar la relación con el poder del Evangelio.
                  </p>
                </div>

                <form onSubmit={handleCreateConflict} className="space-y-6 max-w-xl mx-auto w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1A4331] tracking-wider uppercase mb-2">
                        ¿Con quién tienes el conflicto? *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParty}
                        onChange={(e) => setNewParty(e.target.value)}
                        placeholder="Ej: Mi esposo Carlos, mi jefe"
                        className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1A4331] tracking-wider uppercase mb-2">
                        Tipo de Relación *
                      </label>
                      <select
                        required
                        value={newRelationship}
                        onChange={(e) => setNewRelationship(e.target.value)}
                        className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs cursor-pointer text-gray-700"
                      >
                        <option value="">Selecciona...</option>
                        {RELATIONSHIPS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A4331] tracking-wider uppercase mb-2">
                      Describe brevemente qué sucedió *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Ej: Tuvimos una fuerte discusión anoche por las finanzas de la casa. Me gritó y yo le respondí encerrándome en el cuarto y usando la ley del hielo."
                      className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A4331] tracking-wider uppercase mb-2">
                      ¿Cómo te ha afectado o cómo te hace sentir? (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newImpact}
                      onChange={(e) => setNewImpact(e.target.value)}
                      placeholder="Ej: Me siento con amargura, triste o a la defensiva."
                      className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1A4331] text-white py-4 rounded-xl font-bold text-base hover:bg-[#133224] transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 cursor-pointer active:scale-[0.99]"
                  >
                    <Sparkles className="h-5 w-5 text-emerald-300" /> Comenzar Proceso de Paz
                  </button>
                </form>

                {/* Short Pastoral Disclaimer */}
                <div className="max-w-xl mx-auto w-full mt-8 bg-[#FAF7F2] rounded-2xl border border-[#EDE5D8] p-4 flex gap-3 shadow-3xs">
                  <ShieldAlert className="h-5 w-5 text-[#A88C52] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    <strong>Importante:</strong> Esta herramienta es un asistente bíblico pastoral que fomenta la auto-reflexión saludable y bíblica. No sustituye la consejería pastoral presencial ni la ayuda profesional en situaciones de abuso, violencia o crisis de salud mental.
                  </p>
                </div>
              </div>
            ) : (
              /* IF ACTIVE CONFLICT EXISTS, SHOW 3 STEPS WORKSPACE */
              <div className="flex-1 flex flex-col">
                
                {/* 2.1 CONFLICT TOP SUMMARY HEADER */}
                <div className="bg-[#FAFBF9] border-b border-[#E2EDE5] p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A4331]/75">
                      Proceso Activo de Reconciliación
                    </span>
                    <h3 className="text-xl font-extrabold text-[#1A4331] tracking-tight mt-0.5">
                      {activeConflict.party} ({activeConflict.relationshipType})
                    </h3>
                    <p className="text-xs font-medium text-gray-500 line-clamp-1 mt-1 italic">
                      "{activeConflict.description}"
                    </p>
                  </div>
                  
                  {/* Step status badges click to navigate */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-white border border-[#E2EDE5] p-1.5 rounded-2xl shadow-3xs">
                    {(['PASO1', 'PASO2', 'PASO3'] as const).map((step, idx) => {
                      const isActive = activeConflict.currentStep === step;
                      const isStepDone = 
                        (step === 'PASO1' && activeConflict.step1Completed) ||
                        (step === 'PASO2' && activeConflict.step2Completed) ||
                        (step === 'PASO3' && activeConflict.step3Completed);

                      return (
                        <button
                          key={step}
                          onClick={() => handleSetStep(step)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-[#1A4331] text-white shadow-xs"
                              : isStepDone
                              ? "bg-emerald-50 text-[#1A4331] border border-emerald-100"
                              : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                          }`}
                          title={`Ver ${step}`}
                        >
                          Paso {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2.2 NAVIGATION TABS FOR REFLECTIONS ENGINE */}
                <div className="flex border-b border-[#E2EDE5] bg-white text-sm overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveStepTab('paso1')}
                    className={`flex-1 min-w-[130px] py-3.5 px-4 text-center font-bold border-b-2 transition-all text-xs tracking-wider uppercase ${
                      activeStepTab === 'paso1'
                        ? "border-[#1A4331] text-[#1A4331] bg-emerald-50/15"
                        : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    1. Agradar a Dios
                    {activeConflict.step1Completed && (
                      <span className="ml-1.5 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveStepTab('paso2')}
                    className={`flex-1 min-w-[130px] py-3.5 px-4 text-center font-bold border-b-2 transition-all text-xs tracking-wider uppercase ${
                      activeStepTab === 'paso2'
                        ? "border-[#1A4331] text-[#1A4331] bg-emerald-50/15"
                        : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    2. Mi Viga
                    {activeConflict.step2Completed && (
                      <span className="ml-1.5 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveStepTab('paso3')}
                    className={`flex-1 min-w-[130px] py-3.5 px-4 text-center font-bold border-b-2 transition-all text-xs tracking-wider uppercase ${
                      activeStepTab === 'paso3'
                        ? "border-[#1A4331] text-[#1A4331] bg-emerald-50/15"
                        : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    3. Amar al Otro
                    {activeConflict.step3Completed && (
                      <span className="ml-1.5 inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveStepTab('resumen')}
                    className={`flex-1 min-w-[130px] py-3.5 px-4 text-center font-bold border-b-2 transition-all text-xs tracking-wider uppercase ${
                      activeStepTab === 'resumen'
                        ? "border-[#1A4331] text-[#1A4331] bg-emerald-50/15"
                        : "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50/50"
                    }`}
                  >
                    Resumen de Paz
                  </button>
                </div>

                {/* REFUGIO DE GRACIA Y PAZ INTERIOR: BIBLE VERSES & REMINDERS OF GOD'S LOVE TO ONESELF */}
                {(() => {
                  const graceVerses = BIBLE_VERSES.filter(v => !v.category.startsWith("Paso"));
                  const currentVerse = graceVerses[currentGraceVerseIdx] || graceVerses[0];

                  const reminders = [
                    {
                      title: "Amor Incondicional",
                      text: "La gracia de Dios no depende de tu desempeño o de tu éxito resolviendo este conflicto. Eres amado/a y aceptado/a eternamente en Cristo."
                    },
                    {
                      title: "No hay Condenación",
                      text: "Incluso si te diste cuenta de que cometiste errores graves en esta discusión, el Señor no te condena. Su perdón limpia toda tu culpa."
                    },
                    {
                      title: "Paz Interior Primero",
                      text: "Para extender perdón y misericordia a otros, primero debes recibirla tú del Señor. Descansa en su fidelidad antes de intentar restaurar la relación."
                    },
                    {
                      title: "Tu Identidad en Cristo",
                      text: "Tu valor no se define por las palabras hirientes del ofensor ni por tus reacciones pasadas, sino por lo que Dios dice de ti: eres su hijo/a amado/a."
                    }
                  ];

                  const handlePrevVerse = () => {
                    setCurrentGraceVerseIdx((prev) => (prev === 0 ? graceVerses.length - 1 : prev - 1));
                  };

                  const handleNextVerse = () => {
                    setCurrentGraceVerseIdx((prev) => (prev === graceVerses.length - 1 ? 0 : prev + 1));
                  };

                  return (
                    <div className="mx-6 sm:mx-8 mt-6 bg-[#FAF6EE] border border-[#E5DCC5] rounded-2xl overflow-hidden shadow-2xs">
                      <div 
                        onClick={() => setIsGraceOpen(!isGraceOpen)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F5ECD7] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-rose-500 fill-rose-500/20 shrink-0" />
                          <div>
                            <h4 className="font-serif font-bold text-[#5C4D37] text-sm sm:text-base">Refugio de Gracia y Paz Interior</h4>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              Promesas bíblicas y recordatorios de la misericordia, perdón y bondad de Dios hacia ti
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Consuelo
                          </span>
                          <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isGraceOpen ? "rotate-90" : ""}`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isGraceOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-[#E5DCC5] bg-white overflow-hidden"
                          >
                            <div className="p-5 sm:p-6 space-y-6">
                              {/* Verses Carousel */}
                              <div className="bg-[#FAFBF9] border border-emerald-100/70 rounded-xl p-4 sm:p-5 relative shadow-3xs">
                                <div className="flex justify-between items-center mb-2.5">
                                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                                    <BookOpen className="h-3.5 w-3.5" /> Promesa de Gracia
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    {currentGraceVerseIdx + 1} de {graceVerses.length}
                                  </span>
                                </div>
                                <div className="min-h-[70px] flex flex-col justify-center">
                                  <p className="italic text-gray-700 text-xs sm:text-sm font-serif leading-relaxed pr-8">
                                    "{currentVerse?.text}"
                                  </p>
                                  <p className="text-right text-xs font-bold text-[#1A4331] mt-2 font-mono">
                                    — {currentVerse?.reference}
                                  </p>
                                </div>
                                
                                {/* Carousel Controls inside card */}
                                <div className="absolute right-4 top-4 flex gap-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handlePrevVerse(); }}
                                    className="p-1 hover:bg-emerald-50 rounded-full transition-colors text-emerald-800 cursor-pointer"
                                    title="Anterior"
                                  >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleNextVerse(); }}
                                    className="p-1 hover:bg-emerald-50 rounded-full transition-colors text-emerald-800 cursor-pointer"
                                    title="Siguiente"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Grace Reminders Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {reminders.map((rem, i) => (
                                  <div key={i} className="border border-amber-100/50 rounded-xl p-3.5 bg-amber-50/15 hover:bg-amber-50/30 transition-all shadow-3xs">
                                    <span className="text-xs font-bold text-[#5C4D37] block mb-1 uppercase tracking-wider">
                                      ✨ {rem.title}
                                    </span>
                                    <p className="text-xs text-gray-600 leading-relaxed font-serif">
                                      {rem.text}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {/* Self-Compassion Pastoral Counsel */}
                              <div className="bg-[#FAF7F2] border border-[#EDE5D8] rounded-xl p-4 text-xs text-gray-600 flex gap-3 shadow-3xs">
                                <Info className="h-4.5 w-4.5 text-[#A88C52] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-gray-800 block mb-0.5">Nota Pastoral de Auto-Perdón:</span>
                                  A veces somos nuestros jueces más crueles. Recuerda que no podemos ofrecer a otros lo que no hemos recibido primero de Dios. Si el Creador del universo perdonó tu pecado en la Cruz y echó tus rebeliones en lo profundo del mar, ¿quién eres tú para seguir condenándote? Suelta la culpa, abraza su paz y camina en la victoria de su resurrección.
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })()}

                {/* 2.3 ENGINE PANELS CONTENT */}
                <div className="flex-1 p-6 sm:p-8 space-y-6">
                  
                  {/* TAB 1: AGRADAR A DIOS */}
                  {activeStepTab === 'paso1' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-8"
                    >
                      {/* Enfoque de Consejería */}
                      <div className="bg-[#FAFBF9] border border-[#E2EDE5] rounded-2xl p-6 shadow-3xs">
                        <h4 className="font-bold text-[#1A4331] text-lg tracking-tight">
                          {MODEL_STEPS_GUIDE.paso1.title}
                        </h4>
                        <p className="text-xs text-emerald-700 italic mt-1 font-medium">
                          "{MODEL_STEPS_GUIDE.paso1.tagline}"
                        </p>
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed font-medium">
                          {MODEL_STEPS_GUIDE.paso1.description}
                        </p>
                      </div>

                      {/* Bible Verse Spotlight */}
                      <div className="border border-emerald-100 rounded-2xl p-4 bg-emerald-50/40 text-sm shadow-3xs">
                        <span className="font-bold text-[#1A4331] block mb-1">Versículo Clave de Enfoque:</span>
                        <p className="italic text-gray-700 font-serif leading-relaxed">
                          "Oye, oh Señor... Examíname, oh Dios, y conoce mi corazón; pruébame y conoce mis pensamientos." — Salmo 139:23
                        </p>
                      </div>

                      {/* Reflection Inputs (Preguntas al final) */}
                      <div className="space-y-6 pt-4 border-t border-[#E2EDE5]">
                        <div className="flex items-center gap-2 pb-1">
                          <FileText className="h-5 w-5 text-[#A88C52] shrink-0" />
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Preguntas de Reflexión Personal</span>
                        </div>

                        <div className="space-y-5">
                          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-3">
                            <label className="block text-sm font-bold text-gray-800 leading-snug">
                              1. {MODEL_STEPS_GUIDE.paso1.keyQuestions[0].label}
                            </label>
                            <textarea
                              rows={4}
                              value={activeConflict.step1GodsWill}
                              onChange={(e) => handleUpdateStep1('step1GodsWill', e.target.value)}
                              placeholder={MODEL_STEPS_GUIDE.paso1.keyQuestions[0].placeholder}
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400 leading-relaxed"
                            />
                          </div>

                          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-3">
                            <label className="block text-sm font-bold text-gray-800 leading-snug">
                              2. {MODEL_STEPS_GUIDE.paso1.keyQuestions[1].label}
                            </label>
                            <textarea
                              rows={4}
                              value={activeConflict.step1WinOrPlease}
                              onChange={(e) => handleUpdateStep1('step1WinOrPlease', e.target.value)}
                              placeholder={MODEL_STEPS_GUIDE.paso1.keyQuestions[1].placeholder}
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400 leading-relaxed"
                            />
                          </div>

                          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-3">
                            <label className="block text-sm font-bold text-gray-800 leading-snug">
                              3. {MODEL_STEPS_GUIDE.paso1.keyQuestions[2].label}
                            </label>
                            <textarea
                              rows={4}
                              value={activeConflict.step1ControlOnly}
                              onChange={(e) => handleUpdateStep1('step1ControlOnly', e.target.value)}
                              placeholder={MODEL_STEPS_GUIDE.paso1.keyQuestions[2].placeholder}
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400 leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Helper status */}
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2EDE5]">
                        <span className="text-sm font-semibold text-gray-500">
                          {activeConflict.step1Completed 
                            ? "✅ Reflexión de Paso 1 completa" 
                            : "⚠️ Por favor, responde las 3 preguntas para completar este paso"}
                        </span>
                        {!activeConflict.step1Completed ? (
                          <button
                            onClick={() => handleUpdateStep1('step1GodsWill', activeConflict.step1GodsWill || 'Señor, quiero agradarte')}
                            className="w-full sm:w-auto bg-[#1A4331] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#133224] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                          >
                            Marcar Completado
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveStepTab('paso2')}
                            className="w-full sm:w-auto bg-[#1A4331] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#133224] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                          >
                            Ir a Paso 2 <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: EXAMINAR LA VIGA / ARREPENTIRSE */}
                  {activeStepTab === 'paso2' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-8"
                    >
                      {/* Enfoque de Consejería */}
                      <div className="bg-[#FAFBF9] border border-[#E2EDE5] rounded-2xl p-6 shadow-3xs">
                        <h4 className="font-bold text-[#1A4331] text-lg tracking-tight">
                          {MODEL_STEPS_GUIDE.paso2.title}
                        </h4>
                        <p className="text-xs text-emerald-700 italic mt-1 font-medium">
                          "{MODEL_STEPS_GUIDE.paso2.tagline}"
                        </p>
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed font-medium">
                          {MODEL_STEPS_GUIDE.paso2.description}
                        </p>
                      </div>

                      {/* 2A: Desire Analysis */}
                      <div className="space-y-4 pt-2 border-t border-[#E2EDE5]">
                        <div className="flex items-center gap-2 pb-1">
                          <span className="text-xs font-bold bg-emerald-50 text-[#1A4331] px-2.5 py-1 rounded-lg border border-emerald-100">PARTE 2A</span>
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Los deseos del corazón (Santiago 4:1-3)</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          Identifica qué "buen deseo" se convirtió en un "ídolo" (ej: el deseo de tener la razón, el orden, que te valoren, la sumisión).
                        </p>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2 leading-snug">
                              ¿Cuál es el deseo profundo que se convirtió en una exigencia?
                            </label>
                            <input
                              type="text"
                              value={activeConflict.step2DesireIdentified}
                              onChange={(e) => handleUpdateStep2('step2DesireIdentified', e.target.value)}
                              placeholder="Ej: El deseo de ser escuchado/a con respeto absoluto."
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400"
                            />
                          </div>

                          {/* Three Tests Inputs */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div className="bg-emerald-50/20 rounded-xl p-4 border border-emerald-100/50">
                              <span className="text-xs font-bold text-[#1A4331] tracking-wide uppercase">¿Consume tu mente?</span>
                              <textarea
                                rows={3}
                                value={activeConflict.step2ConsumeThoughts}
                                onChange={(e) => handleUpdateStep2('step2ConsumeThoughts', e.target.value)}
                                placeholder="Ej: Sí, no puedo dejar de pensar en lo injusto..."
                                className="w-full mt-2 px-3 py-2.5 text-sm bg-white border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-3xs placeholder:text-gray-400"
                              />
                            </div>
                            <div className="bg-emerald-50/20 rounded-xl p-4 border border-emerald-100/50">
                              <span className="text-xs font-bold text-[#1A4331] tracking-wide uppercase">¿Pecas para conseguirlo?</span>
                              <textarea
                                rows={3}
                                value={activeConflict.step2SinToGetIt}
                                onChange={(e) => handleUpdateStep2('step2SinToGetIt', e.target.value)}
                                placeholder="Ej: Sí, peco usando palabras duras e hiriendo..."
                                className="w-full mt-2 px-3 py-2.5 text-sm bg-white border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-3xs placeholder:text-gray-400"
                              />
                            </div>
                            <div className="bg-emerald-50/20 rounded-xl p-4 border border-emerald-100/50">
                              <span className="text-xs font-bold text-[#1A4331] tracking-wide uppercase">¿Pecas al no tenerlo?</span>
                              <textarea
                                rows={3}
                                value={activeConflict.step2SinWhenFailed}
                                onChange={(e) => handleUpdateStep2('step2SinWhenFailed', e.target.value)}
                                placeholder="Ej: Sí, me encierro con amargura y guardo silencio..."
                                className="w-full mt-2 px-3 py-2.5 text-sm bg-white border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-3xs placeholder:text-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2B: Specific Conduct & Confession Helper */}
                      <div className="space-y-4 pt-2 border-t border-[#E2EDE5]">
                        <div className="flex items-center gap-2 pb-1">
                          <span className="text-xs font-bold bg-emerald-50 text-[#1A4331] px-2.5 py-1 rounded-lg border border-emerald-100">PARTE 2B</span>
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Borrador de tu confesión (Mateo 7:3-5)</span>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2 leading-snug">
                              ¿Cuáles fueron tus palabras o conductas pecaminosas específicas? *
                            </label>
                            <input
                              type="text"
                              value={activeConflict.step2MySpecificSin}
                              onChange={(e) => handleUpdateStep2('step2MySpecificSin', e.target.value)}
                              placeholder="Ej: Le grité de forma áspera, le insulté diciendo que es un egoísta."
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2 leading-snug">
                              ¿Qué daño específico le causaste a la otra persona? *
                            </label>
                            <input
                              type="text"
                              value={activeConflict.step2DamageCaused}
                              onChange={(e) => handleUpdateStep2('step2DamageCaused', e.target.value)}
                              placeholder="Ej: La humillé públicamente, rompí su confianza y le provoqué enojo."
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2 leading-snug">
                              ¿Qué excusas debes eliminar por completo?
                            </label>
                            <input
                              type="text"
                              value={activeConflict.step2ExcusesEliminated}
                              onChange={(e) => handleUpdateStep2('step2ExcusesEliminated', e.target.value)}
                              placeholder="Ej: Eliminar el culpar al cansancio, el trabajo o decir 'pero es que tú...'"
                              className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        {/* Interactive Confession Generator Block */}
                        <div className="bg-[#FAFBF9] border border-[#E2EDE5] rounded-3xl p-6 mt-4 space-y-4 shadow-3xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex gap-3">
                              <Sparkles className="h-6 w-6 text-[#1A4331] shrink-0 mt-0.5 animate-pulse" />
                              <div>
                                <h5 className="text-sm font-bold text-[#1A4331]">Generar Confesión Sólida de 7 Pasos</h5>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Pacificador redactará un borrador pastoral libre de justificaciones para que puedas pedir perdón de corazón.</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleGenerateConfession}
                              disabled={isGeneratingConfession || !activeConflict.step2MySpecificSin || !activeConflict.step2DamageCaused}
                              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
                                !activeConflict.step2MySpecificSin || !activeConflict.step2DamageCaused
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                  : "bg-[#1A4331] text-white hover:bg-[#133224] shadow-md cursor-pointer active:scale-95"
                              }`}
                            >
                              {isGeneratingConfession ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" /> Redactando...
                                </>
                              ) : (
                                "Redactar Confesión"
                              )}
                            </button>
                          </div>

                          {confessionError && (
                            <p className="text-xs text-red-600 font-bold">{confessionError}</p>
                          )}

                          {activeConflict.confessionDraft && (
                            <div className="bg-white border border-[#E2EDE5] rounded-2xl p-5 relative shadow-3xs">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-[#1A4331] block mb-2">
                                Borrador Sugerido de Confesión:
                              </span>
                              <div className="text-sm text-gray-700 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap font-serif">
                                {activeConflict.confessionDraft}
                              </div>
                              
                              <button
                                onClick={() => handleCopy(activeConflict.confessionDraft, "conf-draft")}
                                className="absolute top-3 right-3 p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-[#1A4331] transition-colors border border-gray-100"
                                title="Copiar borrador"
                              >
                                {copiedId === "conf-draft" ? (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Foot Status */}
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2EDE5]">
                        <span className="text-sm font-semibold text-gray-500">
                          {activeConflict.step2Completed 
                            ? "✅ Reflexión de Paso 2 completa" 
                            : "⚠️ Completa tu pecado de conducta y el daño para finalizar"}
                        </span>
                        
                        <button
                          onClick={() => setActiveStepTab('paso3')}
                          className="w-full sm:w-auto bg-[#1A4331] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#133224] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] ml-auto"
                        >
                          Ir a Paso 3 <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: AMAR / EXTEENDER GRACIA */}
                  {activeStepTab === 'paso3' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-8"
                    >
                      {/* Enfoque de Consejería */}
                      <div className="bg-[#FAFBF9] border border-[#E2EDE5] rounded-2xl p-6 shadow-3xs">
                        <h4 className="font-bold text-[#1A4331] text-lg tracking-tight">
                          {MODEL_STEPS_GUIDE.paso3.title}
                        </h4>
                        <p className="text-xs text-emerald-700 italic mt-1 font-medium">
                          "{MODEL_STEPS_GUIDE.paso3.tagline}"
                        </p>
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed font-medium">
                          {MODEL_STEPS_GUIDE.paso3.description}
                        </p>
                      </div>

                      {/* 3A: Grace Attitudes Checklist */}
                      <div className="space-y-3 pt-2 border-t border-[#E2EDE5]">
                        <span className="text-sm font-bold text-gray-800 block uppercase tracking-wider">
                          3A. Cultivar Actitudes de Gracia (Efesios 4:32)
                        </span>
                        <p className="text-sm text-gray-500 font-medium">
                          ¿Qué virtudes del fruto del Espíritu necesitas ejercitar activamente antes de hablar con la persona?
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {["Paciencia (Soportar retrasos)", "Mansedumbre (Trato amable)", "Compasión por su debilidad", "Amabilidad en palabras", "Humildad intelectual", "Control de impulsos de ira"].map((virtue) => {
                            const checked = activeConflict.step3GraceAttitudesChecked?.includes(virtue) || false;
                            return (
                              <button
                                key={virtue}
                                type="button"
                                onClick={() => handleToggleStep3Check('step3GraceAttitudesChecked', virtue)}
                                className={`flex items-center gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                  checked 
                                    ? "bg-emerald-50/50 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs" 
                                    : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                }`}
                              >
                                {checked ? (
                                  <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0" />
                                ) : (
                                  <Square className="h-5 w-5 text-gray-400 shrink-0" />
                                )}
                                <span className="leading-snug">{virtue}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3B: Forgiveness and Bitterness truths */}
                      <div className="space-y-4 border-t border-[#E2EDE5] pt-4">
                        <span className="text-sm font-bold text-gray-800 block uppercase tracking-wider">
                          3B. Elegir el camino del Perdón
                        </span>
                        <p className="text-sm text-gray-500 font-medium">
                          Robert D. Jones nos enseña que la amargura se vence contemplando el Evangelio. Marca tu compromiso sincero:
                        </p>

                        <div className="space-y-3 pt-1">
                          <label className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                            activeConflict.step3ForgivenessAttitudinalChecked 
                              ? "bg-emerald-50/40 border-[#A3C8B5] shadow-2xs" 
                              : "bg-white border-gray-100 hover:border-emerald-100"
                          }`}>
                            <input
                              type="checkbox"
                              checked={activeConflict.step3ForgivenessAttitudinalChecked || false}
                              onChange={(e) => handleToggleStep3Bool('step3ForgivenessAttitudinalChecked', e.target.checked)}
                              className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="space-y-1">
                              <span className="font-bold text-gray-900 text-sm block">Compromiso de Perdón Actitudinal (Incondicional):</span>
                              <span className="text-gray-600 text-xs leading-relaxed font-medium block">
                                Decido perdonar de corazón delante de Dios. Renuncio a la venganza mental, entrego el juicio al Señor, y no mantendré resentimiento contra la persona, sin importar si me pide perdón o no.
                              </span>
                            </div>
                          </label>

                          <label className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                            activeConflict.step3ForgivenessTransactionalChecked 
                              ? "bg-emerald-50/40 border-[#A3C8B5] shadow-2xs" 
                              : "bg-white border-gray-100 hover:border-emerald-100"
                          }`}>
                            <input
                              type="checkbox"
                              checked={activeConflict.step3ForgivenessTransactionalChecked || false}
                              onChange={(e) => handleToggleStep3Bool('step3ForgivenessTransactionalChecked', e.target.checked)}
                              className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="space-y-1">
                              <span className="font-bold text-gray-900 text-sm block">Disponibilidad de Perdón Transaccional:</span>
                              <span className="text-gray-600 text-xs leading-relaxed font-medium block">
                                Estoy dispuesto/a a conversar, reconciliarme y restaurar activamente nuestra relación de manera mutua cuando hablemos y haya un espacio para la confesión sincera.
                              </span>
                            </div>
                          </label>
                        </div>

                        {/* Gospel truths drawer inline */}
                        <div className="bg-[#FAFBF9] border border-[#E2EDE5] rounded-2xl p-5 shadow-3xs">
                          <span className="text-xs font-bold text-[#1A4331] block uppercase tracking-wider mb-3">
                            Las 6 Verdades del Evangelio contra la Amargura:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {MODEL_STEPS_GUIDE.paso3.gospelTruths.map((truth, i) => (
                              <div key={i} className="bg-white p-3 rounded-xl border border-[#EDF5F0] shadow-3xs space-y-0.5">
                                <span className="font-bold text-gray-800 text-xs block">{truth.title}</span>
                                <span className="text-gray-500 text-[11px] font-medium leading-relaxed block">{truth.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 3C: Confrontation Prereqs (if they plan to speak) */}
                      <div className="space-y-3 border-t border-[#E2EDE5] pt-4">
                        <span className="text-sm font-bold text-gray-800 block uppercase tracking-wider">
                          3C. Prerrequisitos Bíblicos antes de Confrontar (Mateo 18:15)
                        </span>
                        <p className="text-sm text-gray-500 font-medium">
                          Si crees que la ofensa es grave y requieres confrontar a {activeConflict.party} con amor, verifica si cumples con las condiciones previas antes de dar el paso:
                        </p>

                        <div className="grid grid-cols-1 gap-2.5 pt-1">
                          {MODEL_STEPS_GUIDE.paso3.confrontPrereqs.map((prereq, index) => {
                            const isChecked = activeConflict.step3PrerequisitesChecked?.includes(prereq) || false;
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleToggleStep3Check('step3PrerequisitesChecked', prereq)}
                                className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                                  isChecked 
                                    ? "bg-emerald-50/50 border-[#A3C8B5] text-[#1A4331] font-bold shadow-3xs" 
                                    : "bg-white border-gray-100 text-gray-600 hover:border-emerald-100"
                                }`}
                              >
                                {isChecked ? (
                                  <CheckCircle2 className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                ) : (
                                  <div className="h-5 w-5 border border-gray-300 rounded-full shrink-0 mt-0.5" />
                                )}
                                <span className="leading-relaxed text-sm font-medium">{prereq}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3D: Service Plan input */}
                      <div className="space-y-4 border-t border-[#E2EDE5] pt-4">
                        <span className="text-sm font-bold text-gray-800 block uppercase tracking-wider">
                          3D. Plan Práctico de Servicio (Efesios 4:25-5:2)
                        </span>
                        <label className="block text-sm text-gray-500 font-medium">
                          ¿Qué acción bondadosa, desinteresada y visible vas a realizar para bendecir o servir a {activeConflict.party} en los próximos días?
                        </label>
                        <textarea
                          rows={4}
                          value={activeConflict.step3ServicePlan}
                          onChange={(e) => handleUpdateServicePlan(e.target.value)}
                          placeholder="Ej: Prepararle su comida favorita sin que me lo pida, enviarle un mensaje amable validando su esfuerzo, escuchar pacientemente sin interrumpir..."
                          className="w-full px-4.5 py-3.5 text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400 leading-relaxed"
                        />
                      </div>

                      {/* Helper status */}
                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2EDE5]">
                        <span className="text-sm font-semibold text-gray-500">
                          {activeConflict.step3Completed 
                            ? "✅ Plan de Servicio Activo listo" 
                            : "⚠️ Escribe tu plan de servicio práctico para marcar la obediencia completa"}
                        </span>
                        
                        <button
                          onClick={() => setActiveStepTab('resumen')}
                          className="w-full sm:w-auto bg-[#1A4331] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#133224] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] ml-auto"
                        >
                          Ver Resumen de Paz <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: CONSOLIDATED PEACE JOURNAL SUMMARY */}
                  {activeStepTab === 'resumen' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="border border-[#CCDCD4] bg-[#FAFBF9] rounded-2xl p-6 sm:p-8 relative shadow-3xs">
                        <div className="text-center pb-5 border-b border-[#D0DFD7] mb-6">
                          <span className="text-xs uppercase tracking-widest font-bold text-[#1A4331] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Diario de Confidencialidad</span>
                          <h4 className="font-bold text-2xl text-gray-900 mt-3">Plan de Reconciliación con {activeConflict.party}</h4>
                          <p className="text-xs text-gray-500 mt-2 font-medium">
                            Generado y almacenado de forma segura en tu navegador — {activeConflict.updatedAt}
                          </p>
                        </div>

                        {/* Copy Entire Plan Button */}
                        <div className="flex justify-center sm:justify-end mb-6">
                          <button
                            onClick={() => {
                              const fullText = `DIARIO DE PACIFICACIÓN Y CONCILIACIÓN
Conflicto con: ${activeConflict.party} (${activeConflict.relationshipType})
Fecha de inicio: ${activeConflict.createdAt}

PASO 1: AGRADAR A DIOS
- Qué quiere Dios que haga: ${activeConflict.step1GodsWill || 'No completado'}
- Enfoque de ganar vs agradar: ${activeConflict.step1WinOrPlease || 'No completado'}
- Soltar el control: ${activeConflict.step1ControlOnly || 'No completado'}

PASO 2: EXAMINAR MI VIGA (ARREPENTIMIENTO)
- Deseo del corazón identificado: ${activeConflict.step2DesireIdentified || 'No completado'}
- Mi pecado de conducta: ${activeConflict.step2MySpecificSin || 'No completado'}
- Daño visible que causé: ${activeConflict.step2DamageCaused || 'No completado'}
- Excusas eliminadas: ${activeConflict.step2ExcusesEliminated || 'No completado'}

PASO 3: AMAR A LA PERSONA
- Compromiso de perdón actitudinal: ${activeConflict.step3ForgivenessAttitudinalChecked ? 'Sí, decidido' : 'No marcado'}
- Disponibilidad perdón transaccional: ${activeConflict.step3ForgivenessTransactionalChecked ? 'Sí, dispuesto' : 'No marcado'}
- Plan de servicio práctico: ${activeConflict.step3ServicePlan || 'No completado'}

ORACIÓN DE PACIFICACIÓN COMPUESTA:
${activeConflict.customPrayer || 'No generada todavía'}

BORRADOR DE CONFESIÓN:
${activeConflict.confessionDraft || 'No generado todavía'}`;
                              handleCopy(fullText, "full-plan");
                            }}
                            className="w-full sm:w-auto bg-white border border-[#CCDCD4] text-gray-800 hover:bg-[#FAFBF9] hover:border-emerald-500 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                          >
                            {copiedId === "full-plan" ? (
                              <>
                                <Check className="h-4 w-4 text-emerald-600" /> ¡Copiado con éxito!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 text-[#1A4331]" /> Copiar Diario de Paz Completo
                              </>
                            )}
                          </button>
                        </div>

                        {/* Summary breakdown content */}
                        <div className="space-y-6">
                          {/* Step 1 recap */}
                          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-3xs space-y-3">
                            <span className="text-sm font-bold text-[#1A4331] block border-b border-gray-50 pb-1.5">Paso 1: Agradar a Dios</span>
                            <p className="text-sm text-gray-700 leading-relaxed"><strong className="text-gray-900 font-bold block mb-0.5">Voluntad de Dios:</strong> {activeConflict.step1GodsWill || <span className="italic text-gray-400 font-medium">Sin responder todavía</span>}</p>
                            <p className="text-sm text-gray-700 leading-relaxed"><strong className="text-gray-900 font-bold block mb-0.5">¿Agradar o ganar?:</strong> {activeConflict.step1WinOrPlease || <span className="italic text-gray-400 font-medium">Sin responder todavía</span>}</p>
                          </div>

                          {/* Step 2 recap */}
                          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-3xs space-y-3">
                            <span className="text-sm font-bold text-[#1A4331] block border-b border-gray-50 pb-1.5">Paso 2: Mi Viga (Arrepentimiento)</span>
                            <p className="text-sm text-gray-700 leading-relaxed"><strong className="text-gray-900 font-bold block mb-0.5">Deseo del Corazón:</strong> {activeConflict.step2DesireIdentified || <span className="italic text-gray-400 font-medium">Sin identificar aún</span>}</p>
                            <p className="text-sm text-gray-700 leading-relaxed"><strong className="text-gray-900 font-bold block mb-0.5">Mi Pecado de Conducta:</strong> {activeConflict.step2MySpecificSin || <span className="italic text-gray-400 font-medium">Sin describir aún</span>}</p>
                            <p className="text-sm text-gray-700 leading-relaxed"><strong className="text-gray-900 font-bold block mb-0.5">Daño Causado:</strong> {activeConflict.step2DamageCaused || <span className="italic text-gray-400 font-medium">Sin describir aún</span>}</p>
                          </div>

                          {/* Step 3 recap */}
                          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-3xs space-y-3">
                            <span className="text-sm font-bold text-[#1A4331] block border-b border-gray-50 pb-1.5">Paso 3: Amar y Servir con Gracia</span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              <strong className="text-gray-900 font-bold block mb-1">Compromisos de Perdón:</strong>{' '}
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100/50">
                                {activeConflict.step3ForgivenessAttitudinalChecked ? "Perdón Actitudinal de corazón" : "Perdón actitudinal pendiente"}
                              </span>
                              {'  '}
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100/50">
                                {activeConflict.step3ForgivenessTransactionalChecked ? "Reconciliación transaccional dispuesta" : "Pendiente de reconciliación transaccional"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed"><strong className="text-gray-900 font-bold block mb-0.5">Plan de Servicio:</strong> {activeConflict.step3ServicePlan || <span className="italic text-gray-400 font-medium">Sin planificar aún</span>}</p>
                          </div>

                          {/* Render custom prayer if generated */}
                          {activeConflict.customPrayer && (
                            <div className="bg-[#FAFBF9] border border-[#E2EDE5] rounded-2xl p-6 relative shadow-3xs">
                              <span className="font-bold text-[#1A4331] text-sm block mb-2 uppercase tracking-wider">Oración de Humildad Compuesta</span>
                              <div className="italic text-gray-800 leading-relaxed font-serif whitespace-pre-wrap text-sm sm:text-base">
                                "{activeConflict.customPrayer}"
                              </div>
                            </div>
                          )}

                          {/* PLAN DE ACCIÓN DEFINIDO */}
                          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100/60 shadow-md space-y-6">
                            <div>
                              <span className="text-xs uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">Plan de Acción Definido</span>
                              <h4 className="font-extrabold text-xl text-gray-900 mt-2.5">Buscando la Paz Interior y con Otros</h4>
                              <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed">
                                Un mapa práctico e interactivo diseñado para dar pasos concretos de obediencia, fe y reconciliación bíblica en el día a día.
                              </p>
                            </div>

                            {/* Section 1: Paz Interior */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 border-b border-[#E2EDE5] pb-2">
                                <span className="text-xs font-bold bg-emerald-50 text-[#1A4331] px-2.5 py-1 rounded-lg border border-emerald-100">PASO A</span>
                                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Mi Paz Interior (Conexión con Dios y Control Propio)</span>
                              </div>

                              <div className="grid grid-cols-1 gap-3">
                                {/* Item 1 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionPlanBool('actionPlanInnerMeditate')}
                                  className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                    activeConflict.actionPlanInnerMeditate
                                      ? "bg-emerald-50/40 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs"
                                      : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                  }`}
                                >
                                  {activeConflict.actionPlanInnerMeditate ? (
                                    <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-1">
                                    <span className="font-bold text-sm text-gray-900 block leading-snug">1. Meditación Diaria y Entrega</span>
                                    <span className="text-xs text-gray-500 font-medium block leading-relaxed">
                                      Meditar en mi entrega voluntaria al Señor en lugar de intentar cambiar a la otra persona: <strong className="text-emerald-800 font-bold">"{activeConflict.step1GodsWill || 'Vivir para agradar al Señor antes que ganar'}"</strong>
                                    </span>
                                  </div>
                                </button>

                                {/* Item 2 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionPlanBool('actionPlanInnerIdol')}
                                  className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                    activeConflict.actionPlanInnerIdol
                                      ? "bg-emerald-50/40 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs"
                                      : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                  }`}
                                >
                                  {activeConflict.actionPlanInnerIdol ? (
                                    <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-1">
                                    <span className="font-bold text-sm text-gray-900 block leading-snug">2. Desarmar Exigencias del Corazón</span>
                                    <span className="text-xs text-gray-500 font-medium block leading-relaxed">
                                      Detectar y arrepentirme de inmediato cuando el deseo de <strong className="text-emerald-800 font-bold">"{activeConflict.step2DesireIdentified || 'ser valorado/a o escuchado/a'}"</strong> intente gobernar mis palabras y hacerme pecar.
                                    </span>
                                  </div>
                                </button>

                                {/* Item 3 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionPlanBool('actionPlanInnerPrayer')}
                                  className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                    activeConflict.actionPlanInnerPrayer
                                      ? "bg-emerald-50/40 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs"
                                      : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                  }`}
                                >
                                  {activeConflict.actionPlanInnerPrayer ? (
                                    <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-1">
                                    <span className="font-bold text-sm text-gray-900 block leading-snug">3. Oración Constante de Humildad</span>
                                    <span className="text-xs text-gray-500 font-medium block leading-relaxed">
                                      Orar diariamente la Oración de Humildad Compuesta para derribar el orgullo, rendir mis derechos imaginarios y extinguir toda amargura.
                                    </span>
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Section 2: Paz con Otros */}
                            <div className="space-y-4 pt-2">
                              <div className="flex items-center gap-2 border-b border-[#E2EDE5] pb-2">
                                <span className="text-xs font-bold bg-emerald-50 text-[#1A4331] px-2.5 py-1 rounded-lg border border-emerald-100">PASO B</span>
                                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Mi Paz con Otros (Reconciliación y Amor Práctico)</span>
                              </div>

                              <div className="grid grid-cols-1 gap-3">
                                {/* Item 4 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionPlanBool('actionPlanOuterConfess')}
                                  className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                    activeConflict.actionPlanOuterConfess
                                      ? "bg-emerald-50/40 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs"
                                      : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                  }`}
                                >
                                  {activeConflict.actionPlanOuterConfess ? (
                                    <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-1">
                                    <span className="font-bold text-sm text-gray-900 block leading-snug">4. Pedir Perdón Sincero (Mateo 7:3-5)</span>
                                    <span className="text-xs text-gray-500 font-medium block leading-relaxed">
                                      Agendar un espacio de conversación con <strong className="font-bold text-gray-800">{activeConflict.party}</strong> para confesar mi pecado específico sin defenderme ni justificarme, usando el borrador de confesión redactado.
                                    </span>
                                  </div>
                                </button>

                                {/* Item 5 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionPlanBool('actionPlanOuterService')}
                                  className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                    activeConflict.actionPlanOuterService
                                      ? "bg-emerald-50/40 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs"
                                      : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                  }`}
                                >
                                  {activeConflict.actionPlanOuterService ? (
                                    <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-1">
                                    <span className="font-bold text-sm text-gray-900 block leading-snug">5. Ejecutar mi Plan Práctico de Servicio</span>
                                    <span className="text-xs text-gray-500 font-medium block leading-relaxed">
                                      Bendecir desinteresadamente a <strong className="font-bold text-gray-800">{activeConflict.party}</strong> con mi plan de servicio: <strong className="text-emerald-800 font-bold">"{activeConflict.step3ServicePlan || 'Servir en amor concreto y visible'}"</strong>
                                    </span>
                                  </div>
                                </button>

                                {/* Item 6 */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleActionPlanBool('actionPlanOuterGrace')}
                                  className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                                    activeConflict.actionPlanOuterGrace
                                      ? "bg-emerald-50/40 border-[#A3C8B5] text-[#1A4331] font-bold shadow-2xs"
                                      : "bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/10"
                                  }`}
                                >
                                  {activeConflict.actionPlanOuterGrace ? (
                                    <CheckSquare className="h-5 w-5 text-[#1A4331] shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                  )}
                                  <div className="space-y-1">
                                    <span className="font-bold text-sm text-gray-900 block leading-snug">6. Extender Gracia y Sostener el Perdón</span>
                                    <span className="text-xs text-gray-500 font-medium block leading-relaxed">
                                      Mantener mi compromiso de perdón incondicional (no recordar la ofensa para herir, no hablar mal de la persona, no dejar que la amargura vuelva a crecer).
                                    </span>
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Additional Notes input area */}
                            <div className="space-y-3 pt-4 border-t border-gray-100">
                              <label className="block text-sm font-bold text-gray-800 leading-snug">
                                📅 Fecha Compromiso & Notas de Seguimiento
                              </label>
                              <textarea
                                rows={4}
                                value={activeConflict.actionPlanNotes || ""}
                                onChange={(e) => handleUpdateActionPlanNotes(e.target.value)}
                                placeholder="Escribe aquí las fechas clave para conversar, recordatorios bíblicos adicionales o notas sobre los avances de restauración de su relación..."
                                className="w-full px-4.5 py-3.5 text-sm sm:text-base bg-gray-50/60 border border-[#E4EDE6] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-3xs placeholder:text-gray-400 leading-relaxed font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-[#E8E2D5] bg-[#FAF9F5] py-4 text-center text-xs text-gray-500">
        <p>
          "En busca de la paz" de Robert D. Jones. Un recurso de orientación y pacificación pastoral bíblica.
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Pacificador © 2026. Tu información pastoral se procesa con discreción y se almacena en el caché de este navegador de manera privada.
        </p>
      </footer>
    </div>
  );
}
