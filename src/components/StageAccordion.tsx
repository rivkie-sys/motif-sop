"use client";

import { useState } from "react";
import { Stage, Section, Step, STAGE_COLORS } from "@/types/sop";
import SectionCard from "./SectionCard";
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Palette,
} from "lucide-react";

interface StageAccordionProps {
  stage: Stage;
  stageIndex: number;
  totalStages: number;
  editMode: boolean;
  onUpdateStage: (updated: Stage) => void;
  onDeleteStage: () => void;
  onMoveStage: (direction: "up" | "down") => void;
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, updated: Section) => void;
  onDeleteSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: "up" | "down") => void;
  onAddStep: (sectionId: string) => void;
  onUpdateStep: (sectionId: string, stepId: string, updated: Step) => void;
  onDeleteStep: (sectionId: string, stepId: string) => void;
  onMoveStep: (sectionId: string, stepId: string, direction: "up" | "down") => void;
  onShowToast: (msg: string) => void;
}

export default function StageAccordion({
  stage,
  stageIndex,
  totalStages,
  editMode,
  onUpdateStage,
  onDeleteStage,
  onMoveStage,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onMoveStep,
  onShowToast,
}: StageAccordionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(stage.title);

  const saveTitle = () => {
    if (titleDraft.trim()) {
      onUpdateStage({ ...stage, title: titleDraft.trim().toUpperCase() });
    }
    setEditingTitle(false);
  };

  // Determine if the stage color is dark for text contrast
  const isDark = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 < 150;
  };

  const textColor = isDark(stage.color) ? "text-white" : "text-gray-900";

  return (
    <div className="rounded-xl overflow-hidden shadow-sm">
      {/* Stage header */}
      <button
        onClick={() => !editingTitle && setCollapsed(!collapsed)}
        className={`w-full flex items-center justify-between px-5 py-3.5 font-bold text-lg tracking-wide transition-colors ${textColor}`}
        style={{ backgroundColor: stage.color }}
      >
        <div className="flex items-center gap-3">
          {editMode && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {stageIndex > 0 && (
                <button
                  onClick={() => onMoveStage("up")}
                  className="p-1 rounded hover:bg-black/10 transition-colors"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {stageIndex < totalStages - 1 && (
                <button
                  onClick={() => onMoveStage("down")}
                  className="p-1 rounded hover:bg-black/10 transition-colors"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setTitleDraft(stage.title);
                  setEditingTitle(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/30 backdrop-blur-sm px-2 py-1 rounded text-lg font-bold uppercase border-none outline-none"
              style={{ color: "inherit" }}
            />
          ) : (
            <span>{stage.title}</span>
          )}

          {editMode && !editingTitle && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setTitleDraft(stage.title);
                  setEditingTitle(true);
                }}
                className="p-1 rounded hover:bg-black/10 transition-colors"
                title="Rename stage"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1 rounded hover:bg-black/10 transition-colors"
                  title="Change color"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>
                {showColorPicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)} />
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-20 p-2 grid grid-cols-5 gap-1">
                      {STAGE_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => {
                            onUpdateStage({ ...stage, color: c.value });
                            setShowColorPicker(false);
                          }}
                          className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                          style={{
                            backgroundColor: c.value,
                            borderColor: stage.color === c.value ? "#333" : "transparent",
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={onDeleteStage}
                className="p-1 rounded hover:bg-red-500/20 transition-colors"
                title="Delete stage"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>

      {/* Stage content */}
      {!collapsed && (
        <div className="bg-white border-x border-b border-gray-200 rounded-b-xl">
          <div className="p-4 space-y-4">
            {stage.sections.map((section, secIdx) => (
              <SectionCard
                key={section.id}
                section={section}
                sectionIndex={secIdx}
                totalSections={stage.sections.length}
                editMode={editMode}
                stageId={stage.id}
                onUpdateSection={(updated) => onUpdateSection(section.id, updated)}
                onDeleteSection={() => onDeleteSection(section.id)}
                onMoveSection={(dir) => onMoveSection(section.id, dir)}
                onAddStep={() => onAddStep(section.id)}
                onUpdateStep={(stepId, updated) => onUpdateStep(section.id, stepId, updated)}
                onDeleteStep={(stepId) => onDeleteStep(section.id, stepId)}
                onMoveStep={(stepId, dir) => onMoveStep(section.id, stepId, dir)}
                onShowToast={onShowToast}
              />
            ))}

            {editMode && (
              <button
                onClick={onAddSection}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
