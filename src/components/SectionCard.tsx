"use client";

import { useState } from "react";
import { Section, Step } from "@/types/sop";
import StepItem from "./StepItem";
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Zap,
} from "lucide-react";

interface SectionCardProps {
  section: Section;
  sectionIndex: number;
  totalSections: number;
  editMode: boolean;
  stageId: string;
  onUpdateSection: (updated: Section) => void;
  onDeleteSection: () => void;
  onMoveSection: (direction: "up" | "down") => void;
  onAddStep: () => void;
  onUpdateStep: (stepId: string, updated: Step) => void;
  onDeleteStep: (stepId: string) => void;
  onMoveStep: (stepId: string, direction: "up" | "down") => void;
  onShowToast: (msg: string) => void;
}

export default function SectionCard({
  section,
  sectionIndex,
  totalSections,
  editMode,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onMoveStep,
  onShowToast,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title);
  const [editingTrigger, setEditingTrigger] = useState(false);
  const [triggerLabel, setTriggerLabel] = useState(section.trigger?.label || "");
  const [triggerDesc, setTriggerDesc] = useState(section.trigger?.description || "");

  const saveTitle = () => {
    if (titleDraft.trim()) {
      onUpdateSection({ ...section, title: titleDraft.trim() });
    }
    setEditingTitle(false);
  };

  const saveTrigger = () => {
    if (triggerLabel.trim()) {
      onUpdateSection({
        ...section,
        trigger: { label: triggerLabel.trim(), description: triggerDesc.trim() },
      });
    } else {
      const { trigger, ...rest } = section;
      onUpdateSection(rest as Section);
    }
    setEditingTrigger(false);
  };

  const toggleOptional = () => {
    onUpdateSection({ ...section, optional: !section.optional });
  };

  return (
    <div className="border border-motif-medgray rounded-xl overflow-hidden bg-white">
      {/* Section header */}
      <div
        onClick={() => !editingTitle && setCollapsed(!collapsed)}
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-motif-warmgray/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {editMode && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {sectionIndex > 0 && (
                <button
                  onClick={() => onMoveSection("up")}
                  className="p-1 rounded-full hover:bg-motif-warmgray transition-colors text-motif-gold"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
              {sectionIndex < totalSections - 1 && (
                <button
                  onClick={() => onMoveSection("down")}
                  className="p-1 rounded-full hover:bg-motif-warmgray transition-colors text-motif-gold"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
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
                  setTitleDraft(section.title);
                  setEditingTitle(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1 border-b border-motif-darkgray bg-motif-warmgray text-lg font-medium outline-none rounded-none"
            />
          ) : (
            <h3 className="text-lg font-medium text-motif-darkgray">
              {section.title}
              {section.optional && (
                <span className="ml-2 text-sm font-normal text-motif-gold italic font-cambon">(Optional)</span>
              )}
            </h3>
          )}

          {editMode && !editingTitle && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setTitleDraft(section.title);
                  setEditingTitle(true);
                }}
                className="p-1 rounded-full hover:bg-motif-warmgray transition-colors text-motif-gold"
                title="Rename section"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleOptional}
                className={`px-2.5 py-0.5 rounded-pill font-commuters text-[10px] uppercase tracking-wider transition-colors ${
                  section.optional
                    ? "bg-motif-warmgold/40 text-motif-red"
                    : "bg-motif-warmgray text-motif-gold hover:bg-motif-warmgold/20"
                }`}
                title="Toggle optional"
              >
                {section.optional ? "Optional" : "Mark Optional"}
              </button>
              <button
                onClick={onDeleteSection}
                className="p-1 rounded-full hover:bg-motif-pink/30 transition-colors text-motif-gold hover:text-motif-red"
                title="Delete section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {collapsed ? (
          <ChevronDown className="w-5 h-5 text-motif-gold" />
        ) : (
          <ChevronUp className="w-5 h-5 text-motif-gold" />
        )}
      </div>

      {/* Section content */}
      {!collapsed && (
        <div className="px-5 pb-4">
          {/* Trigger */}
          {(section.trigger || editMode) && (
            <div className="mb-4">
              {section.trigger && !editingTrigger ? (
                <div className="flex items-start gap-3 pb-3 border-b border-motif-medgray">
                  <span className="inline-block px-2.5 py-0.5 bg-motif-green text-white font-commuters text-[10px] uppercase tracking-wider rounded mt-0.5">
                    TRIGGER
                  </span>
                  <div>
                    <span className="font-medium text-motif-darkgray">{section.trigger.label}</span>
                    {section.trigger.description && (
                      <span className="ml-2 text-motif-gold">{section.trigger.description}</span>
                    )}
                  </div>
                  {editMode && (
                    <button
                      onClick={() => {
                        setTriggerLabel(section.trigger?.label || "");
                        setTriggerDesc(section.trigger?.description || "");
                        setEditingTrigger(true);
                      }}
                      className="ml-auto p-1 text-motif-gold hover:text-motif-red transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : editingTrigger ? (
                <div className="flex flex-col gap-2 pb-3 border-b border-motif-medgray">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-motif-green" />
                    <span className="font-commuters text-[10px] uppercase tracking-wider text-motif-darkgray">Trigger</span>
                  </div>
                  <input
                    value={triggerLabel}
                    onChange={(e) => setTriggerLabel(e.target.value)}
                    placeholder="Trigger label (e.g., Prospect reach out)"
                    className="px-3 py-2 bg-motif-warmgray border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red"
                  />
                  <input
                    value={triggerDesc}
                    onChange={(e) => setTriggerDesc(e.target.value)}
                    placeholder="Description (e.g., Via phone call, Whatsapp, etc)"
                    className="px-3 py-2 bg-motif-warmgray border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={saveTrigger}
                      className="px-4 py-1.5 bg-motif-red text-white font-commuters text-[10px] uppercase tracking-wider rounded-pill hover:bg-motif-red/90 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTrigger(false)}
                      className="px-4 py-1.5 bg-motif-warmgray text-motif-darkgray font-commuters text-[10px] uppercase tracking-wider rounded-pill hover:bg-motif-medgray transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : editMode && !section.trigger ? (
                <button
                  onClick={() => {
                    setTriggerLabel("");
                    setTriggerDesc("");
                    setEditingTrigger(true);
                  }}
                  className="font-commuters text-[10px] uppercase tracking-wider text-motif-gold hover:text-motif-red transition-colors flex items-center gap-1.5 mb-3"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Add Trigger
                </button>
              ) : null}
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            {section.steps.map((step, stepIdx) => (
              <StepItem
                key={step.id}
                step={step}
                stepIndex={stepIdx}
                totalSteps={section.steps.length}
                editMode={editMode}
                onUpdate={(updated) => onUpdateStep(step.id, updated)}
                onDelete={() => onDeleteStep(step.id)}
                onMove={(dir) => onMoveStep(step.id, dir)}
                onShowToast={onShowToast}
              />
            ))}
          </div>

          {/* Add step button */}
          {editMode && (
            <button
              onClick={onAddStep}
              className="mt-3 w-full py-2.5 border-2 border-dashed border-motif-medgray rounded-xl text-motif-gold hover:border-motif-red hover:text-motif-red transition-colors flex items-center justify-center gap-2 font-commuters text-[10px] uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Step
            </button>
          )}
        </div>
      )}
    </div>
  );
}
