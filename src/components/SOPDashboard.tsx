"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SOP, Stage, Section, Step, StepTag, STAGE_COLORS } from "@/types/sop";
import { defaultSOPs } from "@/data/defaultData";
import { supabase } from "@/lib/supabase";
import { v4 as uuid } from "uuid";
import StageAccordion from "./StageAccordion";
import Toast from "./Toast";
import {
  ChevronDown,
  Pencil,
  Plus,
  Save,
  X,
  Loader2,
  Undo2,
} from "lucide-react";

const MAX_UNDO = 10;

// --- Motif Logo SVG (white) ---
function MotifLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 222 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M219.437 1.41943H205.181L205.181 1.42136H200.508H197.867L197.868 1.41943H188.804V1.64705C193.486 2.39031 195.106 4.34178 195.106 10.8428L195.116 10.8085V45.4829L195.106 45.4486C195.106 51.9496 194.612 53.901 189.929 54.6438V54.8719H195.116H197.744H197.868H200.509H208.04V54.6438C203.366 53.902 200.521 51.9529 200.509 45.478V28.9791L200.51 27.7622H205.063C212.537 27.9028 211.005 32.4166 211.739 37.0372H211.966L211.975 28.2672H211.974V26.5294H211.975L211.969 19.7442H211.818C211.332 22.799 210.848 26.367 205.97 26.5071H200.51L200.508 2.98232L205.491 2.94271C218.325 2.94271 218.503 10.5219 221.549 19.4615H221.777L219.437 1.41943Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M145.289 1.41943L145.289 1.42136H142.503H137.11H134.323L134.323 1.41943H123.579L121.701 19.6794H121.929C124.974 10.7403 127.354 2.63486 135.139 2.63486H137.11V45.5462C137.079 51.9621 135.427 53.9054 130.77 54.6438V54.8719H137.11H139.737H139.878H142.503H148.845V54.6438C144.176 53.903 142.519 51.9563 142.503 45.5008V2.63486H144.473C151.751 2.63486 154.075 10.7399 157.121 19.6794H157.348L155.47 1.41943H145.289Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M44.8536 45.5023V10.7848C44.8642 4.51819 48.6207 2.50056 53.1171 1.71717V1.4161H40.249L25.1776 33.2426L10.0154 1.38854H6.4812L0.203949 1.23438V1.47069C4.79696 2.19948 7.27617 4.11032 7.44775 10.3132V45.2872L7.4371 45.2664C7.4371 45.5023 7.41536 45.6951 7.41536 45.9208C7.0935 51.8665 4.51814 53.9479 0 54.6671V54.8923L15.7726 54.871V54.6453C11.1042 53.9054 8.74339 51.9627 8.711 45.524V8.73577L22.4949 38.5803H24.0149L39.4119 6.1628V45.4805C39.4013 51.9515 38.4019 53.9054 33.7335 54.6453V54.871H51.719V54.6453C47.0506 53.9054 44.8648 51.9515 44.8536 45.5023H44.8536Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M86.3404 0C70.4537 0 57.834 13.017 57.7446 28.2242C57.6557 44.6864 71.5686 56.4701 86.3404 56.4701C102.74 56.4701 115.984 43.8924 114.49 25.7986C113.164 9.75487 100.956 7.53774e-06 86.3404 7.53774e-06V0ZM90.1614 54.6082C75.9715 57.4025 65.5951 45.9334 64.3241 30.529C63.1778 16.6465 70.8145 2.677 83.8479 1.492C95.8916 0.405136 106.779 11.6567 108.008 26.5826C109.144 40.3129 102.757 52.1406 90.1614 54.6082H90.1614Z" fill="white"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M175.362 10.8082C175.379 4.35308 177.04 2.40596 181.708 1.66512V1.4375H163.435V1.66512C168.091 2.40406 169.877 4.34729 169.908 10.7632V45.5459C169.877 51.9618 168.091 53.9051 163.435 54.6435V54.8716H181.708V54.6435C177.04 53.9027 175.379 51.9561 175.362 45.5005V10.8082Z" fill="white"/>
    </svg>
  );
}

// --- Supabase helpers ---

interface SOPRow {
  id: string;
  title: string;
  data: { stages: Stage[] };
  created_at: string;
  updated_at: string;
}

function rowToSOP(row: SOPRow): SOP {
  return { id: row.id, title: row.title, stages: row.data.stages };
}

async function fetchAllSOPs(): Promise<SOP[]> {
  const { data, error } = await supabase
    .from("sops")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return [];
  return data.map(rowToSOP);
}

async function upsertSOP(sop: SOP): Promise<void> {
  const { error } = await supabase.from("sops").upsert({
    id: sop.id,
    title: sop.title,
    data: { stages: sop.stages },
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function deleteSopFromDB(id: string): Promise<void> {
  const { error } = await supabase.from("sops").delete().eq("id", id);
  if (error) throw error;
}

async function seedDefaults(): Promise<SOP[]> {
  for (const sop of defaultSOPs) {
    await upsertSOP(sop);
  }
  return defaultSOPs;
}

// --- Component ---

export default function SOPDashboard() {
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [currentSOPId, setCurrentSOPId] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [undoStack, setUndoStack] = useState<SOP[][]>([]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const pushUndo = useCallback(() => {
    setUndoStack((prev) => {
      const next = [...prev, JSON.parse(JSON.stringify(sops))];
      if (next.length > MAX_UNDO) next.shift();
      return next;
    });
  }, [sops]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((stack) => stack.slice(0, -1));
    setSOPs(prev);
    prev.forEach((sop) => {
      upsertSOP(sop).catch(console.error);
    });
    showToast("Undone");
  }, [undoStack, showToast]);

  useEffect(() => {
    async function load() {
      try {
        let data = await fetchAllSOPs();
        if (data.length === 0) {
          data = await seedDefaults();
        }
        setSOPs(data);
        setCurrentSOPId(data[0]?.id || "");
      } catch (err) {
        console.error("Failed to load SOPs:", err);
        setSOPs(defaultSOPs);
        setCurrentSOPId(defaultSOPs[0]?.id || "");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentSOP = sops.find((s) => s.id === currentSOPId);

  const saveSOP = useCallback(
    (sop: SOP) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await upsertSOP(sop);
        } catch (err) {
          console.error("Failed to save:", err);
          showToast("Failed to save changes");
        } finally {
          setSaving(false);
        }
      }, 500);
    },
    [showToast]
  );

  const createNewSOP = async () => {
    const title = prompt("Enter a name for the new SOP:");
    if (!title?.trim()) return;
    const newSOP: SOP = {
      id: uuid(),
      title: title.trim(),
      stages: [
        {
          id: uuid(),
          title: "NEW STAGE",
          color: STAGE_COLORS[0].value,
          sections: [{ id: uuid(), title: "New Section", steps: [] }],
        },
      ],
    };
    pushUndo();
    setSOPs((prev) => [...prev, newSOP]);
    setCurrentSOPId(newSOP.id);
    try {
      await upsertSOP(newSOP);
      showToast(`Created "${title.trim()}"`);
    } catch {
      showToast("Failed to create SOP");
    }
  };

  const renameSOP = () => {
    if (!currentSOP) return;
    const title = prompt("Rename this SOP:", currentSOP.title);
    if (!title?.trim()) return;
    const updated = { ...currentSOP, title: title.trim() };
    updateCurrentSOP(updated);
  };

  const deleteSOP = async () => {
    if (!currentSOP) return;
    if (!confirm(`Delete "${currentSOP.title}"? You can undo this.`)) return;
    pushUndo();
    const remaining = sops.filter((s) => s.id !== currentSOPId);
    setSOPs(remaining);
    setCurrentSOPId(remaining[0]?.id || "");
    setEditMode(false);
    try {
      await deleteSopFromDB(currentSOP.id);
      showToast("SOP deleted");
    } catch {
      showToast("Failed to delete SOP");
    }
  };

  const updateCurrentSOP = (updated: SOP) => {
    pushUndo();
    setSOPs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    saveSOP(updated);
  };

  const addStage = () => {
    if (!currentSOP) return;
    const newStage: Stage = {
      id: uuid(),
      title: "NEW STAGE",
      color: STAGE_COLORS[Math.floor(Math.random() * STAGE_COLORS.length)].value,
      sections: [{ id: uuid(), title: "New Section", steps: [] }],
    };
    updateCurrentSOP({ ...currentSOP, stages: [...currentSOP.stages, newStage] });
  };

  const updateStage = (stageId: string, updated: Stage) => {
    if (!currentSOP) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) => (st.id === stageId ? updated : st)),
    });
  };

  const deleteStage = (stageId: string) => {
    if (!currentSOP) return;
    if (!confirm("Delete this stage and all its contents?")) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.filter((st) => st.id !== stageId),
    });
  };

  const moveStage = (stageId: string, direction: "up" | "down") => {
    if (!currentSOP) return;
    const idx = currentSOP.stages.findIndex((s) => s.id === stageId);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= currentSOP.stages.length) return;
    const newStages = [...currentSOP.stages];
    [newStages[idx], newStages[newIdx]] = [newStages[newIdx], newStages[idx]];
    updateCurrentSOP({ ...currentSOP, stages: newStages });
  };

  const addSection = (stageId: string) => {
    if (!currentSOP) return;
    const newSection: Section = { id: uuid(), title: "New Section", steps: [] };
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId ? { ...st, sections: [...st.sections, newSection] } : st
      ),
    });
  };

  const updateSection = (stageId: string, sectionId: string, updated: Section) => {
    if (!currentSOP) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId
          ? { ...st, sections: st.sections.map((sec) => (sec.id === sectionId ? updated : sec)) }
          : st
      ),
    });
  };

  const deleteSection = (stageId: string, sectionId: string) => {
    if (!currentSOP) return;
    if (!confirm("Delete this section and all its steps?")) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId
          ? { ...st, sections: st.sections.filter((sec) => sec.id !== sectionId) }
          : st
      ),
    });
  };

  const moveSection = (stageId: string, sectionId: string, direction: "up" | "down") => {
    if (!currentSOP) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) => {
        if (st.id !== stageId) return st;
        const idx = st.sections.findIndex((s) => s.id === sectionId);
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= st.sections.length) return st;
        const newSections = [...st.sections];
        [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];
        return { ...st, sections: newSections };
      }),
    });
  };

  const addStep = (stageId: string, sectionId: string) => {
    if (!currentSOP) return;
    const newStep: Step = { id: uuid(), tag: "TASK" as StepTag, title: "New step" };
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId
          ? {
              ...st,
              sections: st.sections.map((sec) =>
                sec.id === sectionId ? { ...sec, steps: [...sec.steps, newStep] } : sec
              ),
            }
          : st
      ),
    });
  };

  const updateStep = (stageId: string, sectionId: string, stepId: string, updated: Step) => {
    if (!currentSOP) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId
          ? {
              ...st,
              sections: st.sections.map((sec) =>
                sec.id === sectionId
                  ? { ...sec, steps: sec.steps.map((step) => (step.id === stepId ? updated : step)) }
                  : sec
              ),
            }
          : st
      ),
    });
  };

  const deleteStep = (stageId: string, sectionId: string, stepId: string) => {
    if (!currentSOP) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId
          ? {
              ...st,
              sections: st.sections.map((sec) =>
                sec.id === sectionId
                  ? { ...sec, steps: sec.steps.filter((step) => step.id !== stepId) }
                  : sec
              ),
            }
          : st
      ),
    });
  };

  const moveStep = (stageId: string, sectionId: string, stepId: string, direction: "up" | "down") => {
    if (!currentSOP) return;
    updateCurrentSOP({
      ...currentSOP,
      stages: currentSOP.stages.map((st) =>
        st.id === stageId
          ? {
              ...st,
              sections: st.sections.map((sec) => {
                if (sec.id !== sectionId) return sec;
                const idx = sec.steps.findIndex((s) => s.id === stepId);
                const newIdx = direction === "up" ? idx - 1 : idx + 1;
                if (newIdx < 0 || newIdx >= sec.steps.length) return sec;
                const newSteps = [...sec.steps];
                [newSteps[idx], newSteps[newIdx]] = [newSteps[newIdx], newSteps[idx]];
                return { ...sec, steps: newSteps };
              }),
            }
          : st
      ),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-motif-cream flex items-center justify-center">
        <div className="flex items-center gap-3 text-motif-gold text-lg font-light">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading SOPs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-motif-cream">
      {/* Header */}
      <header className="bg-black py-5 px-6">
        <div className="flex items-center justify-center gap-4">
          <MotifLogo className="h-6 w-auto" />
          <div className="w-px h-5 bg-white/20" />
          <span className="font-commuters text-xs uppercase tracking-[2px] text-white/80">
            SOPs
          </span>
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin text-motif-pink ml-2" />}
        </div>
      </header>

      {/* Controls bar */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-3 flex items-center justify-between">
        {/* Process dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-motif-medgray rounded-pill shadow-sm hover:border-motif-gold transition-colors font-commuters text-xs uppercase tracking-wider text-motif-darkgray"
          >
            Change Process
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-2 bg-white border border-motif-medgray rounded-2xl shadow-xl z-20 min-w-[280px] py-2 overflow-hidden">
                {sops.map((sop) => (
                  <button
                    key={sop.id}
                    onClick={() => {
                      setCurrentSOPId(sop.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm hover:bg-motif-warmgray transition-colors ${
                      sop.id === currentSOPId
                        ? "bg-motif-warmgray font-medium text-motif-red"
                        : "text-motif-darkgray"
                    }`}
                  >
                    {sop.title}
                  </button>
                ))}
                {editMode && (
                  <>
                    <div className="border-t border-motif-medgray my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        createNewSOP();
                      }}
                      className="w-full text-left px-5 py-3 text-sm text-motif-red hover:bg-motif-warmgray transition-colors flex items-center gap-2 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Create New SOP
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Edit / Save + Undo buttons */}
        <div className="flex items-center gap-3">
          {editMode && undoStack.length > 0 && (
            <button
              onClick={undo}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-motif-medgray rounded-pill font-commuters text-xs uppercase tracking-wider hover:border-motif-gold transition-colors text-motif-darkgray"
              title={`Undo (${undoStack.length} available)`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              Undo
              <span className="text-motif-gold">({undoStack.length})</span>
            </button>
          )}
          <button
            onClick={() => {
              if (editMode) setUndoStack([]);
              setEditMode(!editMode);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-pill font-commuters text-xs uppercase tracking-wider transition-colors ${
              editMode
                ? "bg-motif-red text-white hover:bg-motif-red/90 shadow-md"
                : "bg-white border border-motif-medgray hover:border-motif-gold text-motif-darkgray"
            }`}
          >
            {editMode ? (
              <>
                <Save className="w-3.5 h-3.5" />
                Done Editing
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                Edit this SOP
              </>
            )}
          </button>
        </div>
      </div>

      {/* SOP Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {currentSOP ? (
          <>
            {/* Process title */}
            <div className="mb-8 mt-2">
              <p className="font-commuters text-[11px] uppercase tracking-[2px] text-motif-gold mb-2">
                Process Title
              </p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-light text-motif-darkgray tracking-tight">
                  {currentSOP.title}
                </h2>
                {editMode && (
                  <div className="flex gap-1">
                    <button
                      onClick={renameSOP}
                      className="p-1.5 text-motif-gold hover:text-motif-red transition-colors"
                      title="Rename SOP"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {sops.length > 1 && (
                      <button
                        onClick={deleteSOP}
                        className="p-1.5 text-motif-gold hover:text-motif-burgundy transition-colors"
                        title="Delete SOP"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-5">
              {currentSOP.stages.map((stage, idx) => (
                <StageAccordion
                  key={stage.id}
                  stage={stage}
                  stageIndex={idx}
                  totalStages={currentSOP.stages.length}
                  editMode={editMode}
                  onUpdateStage={(updated) => updateStage(stage.id, updated)}
                  onDeleteStage={() => deleteStage(stage.id)}
                  onMoveStage={(dir) => moveStage(stage.id, dir)}
                  onAddSection={() => addSection(stage.id)}
                  onUpdateSection={(sectionId, updated) => updateSection(stage.id, sectionId, updated)}
                  onDeleteSection={(sectionId) => deleteSection(stage.id, sectionId)}
                  onMoveSection={(sectionId, dir) => moveSection(stage.id, sectionId, dir)}
                  onAddStep={(sectionId) => addStep(stage.id, sectionId)}
                  onUpdateStep={(sectionId, stepId, updated) => updateStep(stage.id, sectionId, stepId, updated)}
                  onDeleteStep={(sectionId, stepId) => deleteStep(stage.id, sectionId, stepId)}
                  onMoveStep={(sectionId, stepId, dir) => moveStep(stage.id, sectionId, stepId, dir)}
                  onShowToast={showToast}
                />
              ))}
            </div>

            {/* Add stage button (edit mode) */}
            {editMode && (
              <button
                onClick={addStage}
                className="mt-5 w-full py-3.5 border-2 border-dashed border-motif-medgray rounded-2xl text-motif-gold hover:border-motif-red hover:text-motif-red transition-colors flex items-center justify-center gap-2 font-commuters text-xs uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Add New Stage
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-motif-gold">
            <p className="text-lg font-light">No SOPs yet.</p>
            <button
              onClick={() => {
                setEditMode(true);
                createNewSOP();
              }}
              className="mt-4 px-8 py-3 bg-motif-red text-white rounded-pill font-commuters text-xs uppercase tracking-wider hover:bg-motif-red/90 transition-colors"
            >
              Create Your First SOP
            </button>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && <Toast message={toast} />}
    </div>
  );
}
