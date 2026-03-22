"use client";

import { useState } from "react";
import { Step, StepTag, TAG_CONFIG } from "@/types/sop";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Link as LinkIcon,
  List,
  FileText,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

interface StepItemProps {
  step: Step;
  stepIndex: number;
  totalSteps: number;
  editMode: boolean;
  onUpdate: (updated: Step) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onShowToast: (msg: string) => void;
}

const TAG_OPTIONS: StepTag[] = [
  "EMAIL_SCRIPT",
  "MANAGEMENT_TASK",
  "LIVE_CALL",
  "EMAIL_AI_TEMPLATE",
  "TASK",
  "REVIEW",
  "DELIVERY",
];

export default function StepItem({
  step,
  stepIndex,
  totalSteps,
  editMode,
  onUpdate,
  onDelete,
  onMove,
  onShowToast,
}: StepItemProps) {
  const [viewTextOpen, setViewTextOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(step.title);
  const [editingCopyText, setEditingCopyText] = useState(false);
  const [copyTextDraft, setCopyTextDraft] = useState(step.copyableText || "");
  const [copyLabelDraft, setCopyLabelDraft] = useState(step.copyLabel || "Copy Email Text");
  const [editingLink, setEditingLink] = useState(false);
  const [linkTextDraft, setLinkTextDraft] = useState(step.link?.text || "");
  const [linkUrlDraft, setLinkUrlDraft] = useState(step.link?.url || "");
  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsDraft, setDetailsDraft] = useState(step.details?.join("\n") || "");
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const tag = TAG_CONFIG[step.tag];
  const stepNum = String(stepIndex + 1).padStart(2, "0");

  const handleCopy = async () => {
    if (!step.copyableText) return;
    try {
      await navigator.clipboard.writeText(step.copyableText);
      setCopied(true);
      onShowToast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast("Failed to copy");
    }
  };

  const saveTitle = () => {
    if (titleDraft.trim()) {
      onUpdate({ ...step, title: titleDraft.trim() });
    }
    setEditingTitle(false);
  };

  const saveCopyText = () => {
    onUpdate({
      ...step,
      copyableText: copyTextDraft.trim() || undefined,
      copyLabel: copyLabelDraft.trim() || undefined,
    });
    setEditingCopyText(false);
  };

  const saveLink = () => {
    if (linkTextDraft.trim()) {
      onUpdate({
        ...step,
        link: { text: linkTextDraft.trim(), url: linkUrlDraft.trim() || "#" },
      });
    } else {
      onUpdate({ ...step, link: undefined });
    }
    setEditingLink(false);
  };

  const saveDetails = () => {
    const items = detailsDraft
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdate({ ...step, details: items.length > 0 ? items : undefined });
    setEditingDetails(false);
  };

  return (
    <div className="relative group">
      <div className="flex gap-3">
        {/* Step number */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 mt-0.5">
          {stepNum}
        </div>

        {/* Step content */}
        <div className="flex-1 min-w-0">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${tag.bg} ${tag.text}`}
            >
              {tag.label}
            </span>
            {editMode && (
              <div className="relative">
                <button
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  title="Change tag"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                {showTagPicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowTagPicker(false)} />
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-20 py-1 min-w-[180px] border border-gray-200">
                      {TAG_OPTIONS.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            onUpdate({ ...step, tag: t });
                            setShowTagPicker(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                            step.tag === t ? "bg-gray-50 font-medium" : ""
                          }`}
                        >
                          <span
                            className={`inline-block w-3 h-3 rounded ${TAG_CONFIG[t].bg}`}
                          />
                          {TAG_CONFIG[t].label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          {editingTitle ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setTitleDraft(step.title);
                    setEditingTitle(false);
                  }
                }}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
              />
            </div>
          ) : (
            <p
              className={`text-sm text-gray-800 leading-relaxed ${
                editMode ? "cursor-pointer hover:bg-blue-50 rounded px-1 -mx-1 transition-colors" : ""
              }`}
              onClick={() => {
                if (editMode) {
                  setTitleDraft(step.title);
                  setEditingTitle(true);
                }
              }}
            >
              {step.title}
            </p>
          )}

          {/* Link */}
          {step.link && !editingLink && (
            <a
              href={step.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-gray-100 rounded-md text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Link: {step.link.text}
            </a>
          )}

          {editingLink && (
            <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded-lg">
              <input
                value={linkTextDraft}
                onChange={(e) => setLinkTextDraft(e.target.value)}
                placeholder="Link text"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
              />
              <input
                value={linkUrlDraft}
                onChange={(e) => setLinkUrlDraft(e.target.value)}
                placeholder="URL (https://...)"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveLink}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingLink(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Details (numbered sub-items) */}
          {step.details && step.details.length > 0 && !editingDetails && (
            <ol className="mt-2 ml-4 space-y-1.5">
              {step.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-gray-400 font-medium flex-shrink-0">{idx + 1}.</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ol>
          )}

          {editingDetails && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">One item per line:</p>
              <textarea
                value={detailsDraft}
                onChange={(e) => setDetailsDraft(e.target.value)}
                rows={5}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400 resize-y"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={saveDetails}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingDetails(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action buttons row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Copy button */}
            {step.copyableText && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {step.copyLabel || "Copy Email Text"}
              </button>
            )}

            {/* View Text toggle */}
            {step.copyableText && (
              <button
                onClick={() => setViewTextOpen(!viewTextOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                View Text
                {viewTextOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Edit mode: additional action buttons */}
            {editMode && (
              <>
                {!step.link && !editingLink && (
                  <button
                    onClick={() => {
                      setLinkTextDraft("");
                      setLinkUrlDraft("");
                      setEditingLink(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Add Link
                  </button>
                )}
                {step.link && !editingLink && (
                  <button
                    onClick={() => {
                      setLinkTextDraft(step.link?.text || "");
                      setLinkUrlDraft(step.link?.url || "");
                      setEditingLink(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Edit Link
                  </button>
                )}
                {!editingDetails && (
                  <button
                    onClick={() => {
                      setDetailsDraft(step.details?.join("\n") || "");
                      setEditingDetails(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <List className="w-3.5 h-3.5" />
                    {step.details ? "Edit Details" : "Add Details"}
                  </button>
                )}
                {!editingCopyText && (
                  <button
                    onClick={() => {
                      setCopyTextDraft(step.copyableText || "");
                      setCopyLabelDraft(step.copyLabel || "Copy Email Text");
                      setEditingCopyText(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {step.copyableText ? "Edit Script" : "Add Script"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* View Text expanded */}
          {viewTextOpen && step.copyableText && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {step.copyableText}
              </pre>
            </div>
          )}

          {/* Edit copyable text */}
          {editingCopyText && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <input
                value={copyLabelDraft}
                onChange={(e) => setCopyLabelDraft(e.target.value)}
                placeholder="Button label (e.g., Copy Email Text)"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400"
              />
              <textarea
                value={copyTextDraft}
                onChange={(e) => setCopyTextDraft(e.target.value)}
                rows={6}
                placeholder="Enter the email script or template text..."
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-400 resize-y"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveCopyText}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCopyText(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit mode: move/delete controls on right side */}
        {editMode && (
          <div className="flex flex-col gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {stepIndex > 0 && (
              <button
                onClick={() => onMove("up")}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
            {stepIndex < totalSteps - 1 && (
              <button
                onClick={() => onMove("down")}
                className="p-1 rounded hover:bg-gray-200 text-gray-400 transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete step"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Separator line */}
      {stepIndex < totalSteps - 1 && <div className="border-b border-gray-100 mt-3 ml-12" />}
    </div>
  );
}
