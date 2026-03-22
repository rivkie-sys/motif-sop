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
} from "lucide-react";

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

  // Load data from Supabase on mount
  useEffect(() => {
    async function load() {
      try {
        let data = await fetchAllSOPs();
        if (data.length === 0) {
          // First time: seed with default SOPs
          data = await seedDefaults();
        }
        setSOPs(data);
        setCurrentSOPId(data[0]?.id || "");
      } catch (err) {
        console.error("Failed to load SOPs:", err);
        // Fallback to defaults if Supabase fails
        setSOPs(defaultSOPs);
        setCurrentSOPId(defaultSOPs[0]?.id || "");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const currentSOP = sops.find((s) => s.id === currentSOPId);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Debounced save to Supabase whenever an SOP changes
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

  // --- SOP-level operations ---
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
          sections: [
            { id: uuid(), title: "New Section", steps: [] },
          ],
        },
      ],
    };
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
    if (!confirm(`Delete "${currentSOP.title}"? This cannot be undone.`)) return;
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
    setSOPs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    saveSOP(updated);
  };

  // --- Stage operations ---
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

  // --- Section operations ---
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

  // --- Step operations ---
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400 text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading SOPs...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-xl font-semibold text-center tracking-wide">Motif Studio SOPs</h1>
          {saving && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
      </header>

      {/* Controls bar */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        {/* Process dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Change Process
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-[260px] py-1 overflow-hidden">
                {sops.map((sop) => (
                  <button
                    key={sop.id}
                    onClick={() => {
                      setCurrentSOPId(sop.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors ${
                      sop.id === currentSOPId ? "bg-green-100 font-medium" : ""
                    }`}
                  >
                    {sop.title}
                  </button>
                ))}
                {editMode && (
                  <>
                    <div className="border-t border-gray-200 my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        createNewSOP();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors flex items-center gap-2 font-medium"
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

        {/* Edit / Save button */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
            editMode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {editMode ? (
            <>
              <Save className="w-4 h-4" />
              Done Editing
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit this SOP
            </>
          )}
        </button>
      </div>

      {/* SOP Content */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        {currentSOP ? (
          <>
            {/* Process title */}
            <div className="mb-6 mt-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Process Title</p>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{currentSOP.title}</h2>
                {editMode && (
                  <div className="flex gap-1">
                    <button
                      onClick={renameSOP}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Rename SOP"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {sops.length > 1 && (
                      <button
                        onClick={deleteSOP}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
            <div className="space-y-4">
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
                className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add New Stage
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No SOPs yet.</p>
            <button
              onClick={() => {
                setEditMode(true);
                createNewSOP();
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
