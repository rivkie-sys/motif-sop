export type StepTag =
  | "EMAIL_SCRIPT"
  | "MANAGEMENT_TASK"
  | "LIVE_CALL"
  | "EMAIL_AI_TEMPLATE"
  | "TASK"
  | "REVIEW"
  | "DELIVERY";

export interface Step {
  id: string;
  tag: StepTag;
  title: string;
  link?: { text: string; url: string };
  details?: string[];
  copyableText?: string;
  copyLabel?: string;
}

export interface Section {
  id: string;
  title: string;
  optional?: boolean;
  trigger?: { label: string; description: string };
  steps: Step[];
}

export interface Stage {
  id: string;
  title: string;
  color: string;
  sections: Section[];
}

export interface SOP {
  id: string;
  title: string;
  stages: Stage[];
}

export const TAG_CONFIG: Record<StepTag, { label: string; bg: string; text: string }> = {
  EMAIL_SCRIPT: { label: "EMAIL SCRIPT", bg: "bg-motif-red", text: "text-white" },
  MANAGEMENT_TASK: { label: "MANAGEMENT TASK", bg: "bg-motif-green", text: "text-white" },
  LIVE_CALL: { label: "LIVE CALL", bg: "bg-motif-burgundy", text: "text-white" },
  EMAIL_AI_TEMPLATE: { label: "EMAIL AI TEMPLATE", bg: "bg-motif-blue", text: "text-white" },
  TASK: { label: "TASK", bg: "bg-motif-charcoal", text: "text-white" },
  REVIEW: { label: "REVIEW", bg: "bg-motif-gold", text: "text-motif-charcoal" },
  DELIVERY: { label: "DELIVERY", bg: "bg-motif-pink", text: "text-motif-red" },
};

export const STAGE_COLORS = [
  { name: "Dark Red", value: "#683538" },
  { name: "Blue", value: "#07477b" },
  { name: "Green", value: "#394636" },
  { name: "Burgundy", value: "#e6896e" },
  { name: "Pink", value: "#f3af9b" },
  { name: "Gold", value: "#c6ae94" },
  { name: "Warm Gold", value: "#e6d8a1" },
  { name: "Light Blue", value: "#89c4eb" },
  { name: "Yellow", value: "#d4c757" },
  { name: "Charcoal", value: "#222222" },
];
