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
  EMAIL_SCRIPT: { label: "EMAIL SCRIPT", bg: "bg-purple-500", text: "text-white" },
  MANAGEMENT_TASK: { label: "MANAGEMENT TASK", bg: "bg-yellow-700", text: "text-white" },
  LIVE_CALL: { label: "LIVE CALL", bg: "bg-red-500", text: "text-white" },
  EMAIL_AI_TEMPLATE: { label: "EMAIL AI TEMPLATE", bg: "bg-blue-500", text: "text-white" },
  TASK: { label: "TASK", bg: "bg-gray-600", text: "text-white" },
  REVIEW: { label: "REVIEW", bg: "bg-amber-500", text: "text-white" },
  DELIVERY: { label: "DELIVERY", bg: "bg-indigo-500", text: "text-white" },
};

export const STAGE_COLORS = [
  { name: "Green", value: "#a8e6cf" },
  { name: "Coral", value: "#f4a8a8" },
  { name: "Mint", value: "#b5e8b5" },
  { name: "Sage", value: "#8ed68e" },
  { name: "Forest", value: "#6ec46e" },
  { name: "Emerald", value: "#4eb04e" },
  { name: "Sky", value: "#87ceeb" },
  { name: "Lavender", value: "#c4b5e0" },
  { name: "Peach", value: "#ffdab9" },
  { name: "Sand", value: "#f0e68c" },
];
