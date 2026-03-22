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
      // Remove trigger if label is empty
      const { trigger, ...rest } = section;
      onUpdateSection(rest as Section);
    }
    setEditingTrigger(false);
  };

  const toggleOptional = () => {
    onUpdateSection({ ...section, optional: !section.optional });
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Section header */}
      <div
        onClick={() => !editingTitle && setCollapsed(!collapsed)}
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {editMode && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {sectionIndex > 0 && (
                <button
                  onClick={() => onMoveSection("up")}
                  className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              )}
              {sectionIndex < totalSections - 1 && (
                <button
                  onClick={() => onMoveSection("down")}
                  className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
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
              className="px-2 py-1 border border-gray-300 rounded text-lg font-semibold outline-none focus:border-blue-400"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">
              {section.title}
              {section.optional && (
                <span className="ml-2 text-sm font-normal text-gray-400">(Optional)</span>
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
                className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-400"
                title="Rename section"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleOptional}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  section.optional
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500 hover:bg-amber-50"
                }`}
                title="Toggle optional"
              >
                {section.optional ? "Optional" : "Mark Optional"}
              </button>
              <button
                onClick={onDeleteSection}
                className="p-1 rounded hover:bg-red-100 transition-colors text-gray-400 hover:text-red-500"
                title="Delete section"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {collapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Section content */}
      {!collapsed && (
        <div className="px-5 pb-4">
          {/* Trigger */}
          {(section.trigger || editMode) && (
            <div className="mb-4">
              {section.trigger && !editingTrigger ? (
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                  <span className="inline-block px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded mt-0.5">
                    TRIGGER
                  </span>
                  <div>
                    <span className="font-semibold text-gray-900">{section.trigger.label}</span>
                    {section.trigger.description && (
                      <span className="ml-2 text-gray-500">{section.trigger.description}</span>
                    )}
                  </div>
                  {editMode && (
                    <button
                      onClick={() => {
                        setTriggerLabel(section.trigger?.label || "");
                        setTriggerDesc(section.trigger?.description || "");
                        setEditingTrigger(true);
                      }}
                      className="ml-auto p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : editingTrigger ? (
                <div className="flex flex-col gap-2 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Trigger</span>
                  </div>
                  <input
                    value={triggerLabel}
                    onChange={(e) => setTriggerLabel(e.target.value)}
                    placeholder="Trigger label (e.g., Prospect reach out)"
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
                  />
                  <input
                    value={triggerDesc}
                    onChange={(e) => setTriggerDesc(e.target.value)}
                    placeholder="Description (e.g., Via phone call, Whatsapp, etc)"
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveTrigger}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTrigger(false)}
                      className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded hover:bg-gray-300 transition-colors"
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
                  className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-3"
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
              className="mt-3 w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          )}
        </div>
      )}
    </div>
  );
}
