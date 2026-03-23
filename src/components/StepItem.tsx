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
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-motif-warmgray flex items-center justify-center text-sm font-medium text-motif-darkgray mt-0.5 border border-motif-medgray">
          {stepNum}
        </div>

        {/* Step content */}
        <div className="flex-1 min-w-0">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block px-2.5 py-0.5 font-commuters text-[10px] uppercase tracking-wider rounded ${tag.bg} ${tag.text}`}
            >
              {tag.label}
            </span>
            {editMode && (
              <div className="relative">
                <button
                  onClick={() => setShowTagPicker(!showTagPicker)}
                  className="text-motif-gold hover:text-motif-red transition-colors"
                  title="Change tag"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                {showTagPicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowTagPicker(false)} />
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl z-20 py-1 min-w-[200px] border border-motif-medgray">
                      {TAG_OPTIONS.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            onUpdate({ ...step, tag: t });
                            setShowTagPicker(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-motif-warmgray flex items-center gap-2.5 transition-colors ${
                            step.tag === t ? "bg-motif-warmgray font-medium" : ""
                          }`}
                        >
                          <span
                            className={`inline-block w-3 h-3 rounded-sm ${TAG_CONFIG[t].bg}`}
                          />
                          <span className="font-commuters text-[10px] uppercase tracking-wider">
                            {TAG_CONFIG[t].label}
                          </span>
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
                className="flex-1 px-3 py-1.5 bg-motif-warmgray border-b border-motif-darkgray text-sm outline-none focus:border-motif-red rounded-none"
              />
            </div>
          ) : (
            <p
              className={`text-sm text-motif-darkgray leading-relaxed ${
                editMode ? "cursor-pointer hover:bg-motif-warmgray/50 rounded px-1 -mx-1 transition-colors" : ""
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
              className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-motif-warmgray rounded-pill text-xs text-motif-darkgray hover:bg-motif-medgray transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-motif-gold" />
              Link: {step.link.text}
            </a>
          )}

          {editingLink && (
            <div className="mt-2 space-y-2 p-4 bg-motif-warmgray rounded-xl">
              <input
                value={linkTextDraft}
                onChange={(e) => setLinkTextDraft(e.target.value)}
                placeholder="Link text"
                className="w-full px-3 py-2 bg-white border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red"
              />
              <input
                value={linkUrlDraft}
                onChange={(e) => setLinkUrlDraft(e.target.value)}
                placeholder="URL (https://...)"
                className="w-full px-3 py-2 bg-white border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={saveLink}
                  className="px-4 py-1.5 bg-motif-red text-white font-commuters text-[10px] uppercase tracking-wider rounded-pill hover:bg-motif-red/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingLink(false)}
                  className="px-4 py-1.5 bg-white text-motif-darkgray font-commuters text-[10px] uppercase tracking-wider rounded-pill border border-motif-medgray hover:bg-motif-medgray/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Details (numbered sub-items) */}
          {step.details && step.details.length > 0 && !editingDetails && (
            <ol className="mt-2.5 ml-4 space-y-1.5">
              {step.details.map((detail, idx) => (
                <li key={idx} className="text-sm text-motif-darkgray flex gap-2">
                  <span className="text-motif-gold font-medium flex-shrink-0">{idx + 1}.</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ol>
          )}

          {editingDetails && (
            <div className="mt-2 p-4 bg-motif-warmgray rounded-xl">
              <p className="font-commuters text-[10px] uppercase tracking-wider text-motif-gold mb-2">One item per line:</p>
              <textarea
                value={detailsDraft}
                onChange={(e) => setDetailsDraft(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 bg-white border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red resize-y"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={saveDetails}
                  className="px-4 py-1.5 bg-motif-red text-white font-commuters text-[10px] uppercase tracking-wider rounded-pill hover:bg-motif-red/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingDetails(false)}
                  className="px-4 py-1.5 bg-white text-motif-darkgray font-commuters text-[10px] uppercase tracking-wider rounded-pill border border-motif-medgray hover:bg-motif-medgray/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action buttons row */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            {/* Copy button */}
            {step.copyableText && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-motif-medgray rounded-pill text-xs text-motif-darkgray hover:border-motif-gold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-motif-green" /> : <Copy className="w-3.5 h-3.5 text-motif-gold" />}
                {step.copyLabel || "Copy Email Text"}
              </button>
            )}

            {/* View Text toggle */}
            {step.copyableText && (
              <button
                onClick={() => setViewTextOpen(!viewTextOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-motif-medgray rounded-pill text-xs text-motif-darkgray hover:border-motif-gold transition-colors"
              >
                View Text
                {viewTextOpen ? <ChevronUp className="w-3.5 h-3.5 text-motif-gold" /> : <ChevronDown className="w-3.5 h-3.5 text-motif-gold" />}
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
                    className="inline-flex items-center gap-1 font-commuters text-[10px] uppercase tracking-wider text-motif-gold hover:text-motif-red transition-colors"
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
                    className="inline-flex items-center gap-1 font-commuters text-[10px] uppercase tracking-wider text-motif-gold hover:text-motif-red transition-colors"
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
                    className="inline-flex items-center gap-1 font-commuters text-[10px] uppercase tracking-wider text-motif-gold hover:text-motif-red transition-colors"
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
                    className="inline-flex items-center gap-1 font-commuters text-[10px] uppercase tracking-wider text-motif-gold hover:text-motif-red transition-colors"
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
            <div className="mt-3 p-4 bg-motif-warmgray rounded-xl border border-motif-medgray">
              <pre className="text-sm text-motif-darkgray whitespace-pre-wrap font-basis leading-relaxed">
                {step.copyableText}
              </pre>
            </div>
          )}

          {/* Edit copyable text */}
          {editingCopyText && (
            <div className="mt-3 p-4 bg-motif-warmgray rounded-xl space-y-2">
              <input
                value={copyLabelDraft}
                onChange={(e) => setCopyLabelDraft(e.target.value)}
                placeholder="Button label (e.g., Copy Email Text)"
                className="w-full px-3 py-2 bg-white border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red"
              />
              <textarea
                value={copyTextDraft}
                onChange={(e) => setCopyTextDraft(e.target.value)}
                rows={6}
                placeholder="Enter the email script or template text..."
                className="w-full px-3 py-2 bg-white border-b border-motif-darkgray rounded-none text-sm outline-none focus:border-motif-red resize-y"
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={saveCopyText}
                  className="px-4 py-1.5 bg-motif-red text-white font-commuters text-[10px] uppercase tracking-wider rounded-pill hover:bg-motif-red/90"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCopyText(false)}
                  className="px-4 py-1.5 bg-white text-motif-darkgray font-commuters text-[10px] uppercase tracking-wider rounded-pill border border-motif-medgray hover:bg-motif-medgray/30"
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
                className="p-1 rounded-full hover:bg-motif-warmgray text-motif-gold transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
            {stepIndex < totalSteps - 1 && (
              <button
                onClick={() => onMove("down")}
                className="p-1 rounded-full hover:bg-motif-warmgray text-motif-gold transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onDelete}
              className="p-1 rounded-full hover:bg-motif-pink/30 text-motif-gold hover:text-motif-red transition-colors"
              title="Delete step"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Separator line */}
      {stepIndex < totalSteps - 1 && <div className="border-b border-motif-medgray/50 mt-3 ml-12" />}
    </div>
  );
}
