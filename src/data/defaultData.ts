import { SOP } from "@/types/sop";
import { v4 as uuid } from "uuid";

export const defaultSOPs: SOP[] = [
  {
    id: uuid(),
    title: "Shopify/eCommerce Website Process",
    stages: [
      {
        id: uuid(),
        title: "PROPOSAL STAGE",
        color: "#a8e6cf",
        sections: [
          {
            id: uuid(),
            title: "Fit Call",
            trigger: {
              label: "Prospect reach out",
              description: "Via phone call, Whatsapp, Linkedin, etc",
            },
            steps: [
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Use Inquiry Email Script to schedule Fit Call",
                copyableText:
                  "Hi [Name],\n\nThank you so much for reaching out! We'd love to learn more about your project.\n\nWould you be available for a quick 15-20 minute call this week to discuss your needs? Here are a few times that work on our end:\n\n- [Time slot 1]\n- [Time slot 2]\n- [Time slot 3]\n\nLooking forward to connecting!\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
              {
                id: uuid(),
                tag: "MANAGEMENT_TASK",
                title: "Gather Fit Prep info on new Website Client Template",
                link: { text: "Website Client Template", url: "#" },
              },
              {
                id: uuid(),
                tag: "LIVE_CALL",
                title:
                  "Conduct Zoom or phone call with client while filling out Fit Call Notes",
                link: { text: "Website Client Template", url: "#" },
              },
              {
                id: uuid(),
                tag: "LIVE_CALL",
                title:
                  "Conduct Zoom or phone call with client while filling out Fit Call Notes",
                link: { text: "Website Client Template", url: "#" },
                details: [
                  'Use your judgment to decide if you should encourage them to begin with a full project, or an audit.',
                  'End call with: "I\'ll send the proposal within 24-48 hours." (For tighter weeks, clearly let them know when they can expect proposal and why.)',
                  '"If you\'d like to review the proposal together we can have a follow-up call."',
                  '"When should I expect a response from you? If I don\'t hear back from you by [X], expect me to send a nudge!"',
                  'Consult with Rivkie on relevant details. Write those details down in "Rivkie Notes" on Fit Call Template.',
                ],
              },
              {
                id: uuid(),
                tag: "EMAIL_AI_TEMPLATE",
                title: "Write client email with AI template",
                copyableText:
                  "You are a professional web design agency writing a follow-up email after a discovery/fit call with a potential client. Write a warm, professional email that:\n\n1. Thanks them for their time\n2. Summarizes the key points discussed\n3. Outlines next steps\n4. Sets expectations for the proposal timeline\n\nUse the following notes from the call:\n[PASTE FIT PREP NOTES HERE]\n[PASTE FIT CALL NOTES HERE]",
                copyLabel: "Copy AI Template Text",
                details: [
                  "Copy-paste the following template into ChatGPT. Below that, copy-paste all of your Fit Prep notes and Fit Call Notes.",
                  "Review and edit the email for accuracy",
                  "Remove em dashes and other telltale AI signs.",
                ],
              },
            ],
          },
          {
            id: uuid(),
            title: "Audit",
            optional: true,
            steps: [
              {
                id: uuid(),
                tag: "TASK",
                title: "Review client's current website and document findings",
              },
              {
                id: uuid(),
                tag: "DELIVERY",
                title: "Prepare and deliver audit report to client",
              },
            ],
          },
          {
            id: uuid(),
            title: "Proposal",
            steps: [
              {
                id: uuid(),
                tag: "TASK",
                title: "Draft proposal using Proposal Template",
                link: { text: "Proposal Template", url: "#" },
              },
              {
                id: uuid(),
                tag: "REVIEW",
                title: "Review proposal with Rivkie before sending",
              },
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Send proposal to client via email",
                copyableText:
                  "Hi [Name],\n\nIt was great speaking with you! As promised, please find attached our proposal for your [project type].\n\nThe proposal outlines our recommended approach, timeline, and investment. Please take your time reviewing it, and feel free to reach out with any questions.\n\nWould you like to schedule a call to walk through it together?\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "KICKOFF",
        color: "#f4a8a8",
        sections: [
          {
            id: uuid(),
            title: "Onboarding",
            steps: [
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Send onboarding welcome email with intake form",
                copyableText:
                  "Hi [Name],\n\nWelcome to Motif Studio! We're so excited to work with you.\n\nTo get started, please complete the intake form linked below at your earliest convenience:\n[INTAKE FORM LINK]\n\nThis helps us understand your brand, goals, and preferences so we can hit the ground running.\n\nLooking forward to creating something amazing together!\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
              {
                id: uuid(),
                tag: "MANAGEMENT_TASK",
                title: "Set up project in project management tool",
              },
              {
                id: uuid(),
                tag: "LIVE_CALL",
                title: "Conduct kickoff call to review project scope and timeline",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "CREATIVE",
        color: "#b5e8b5",
        sections: [
          {
            id: uuid(),
            title: "Design Phase",
            steps: [
              {
                id: uuid(),
                tag: "TASK",
                title: "Create mood board and design direction",
              },
              {
                id: uuid(),
                tag: "TASK",
                title: "Design homepage mockup",
              },
              {
                id: uuid(),
                tag: "REVIEW",
                title: "Present designs to client for feedback",
              },
              {
                id: uuid(),
                tag: "TASK",
                title: "Revise designs based on client feedback",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "DEVELOPMENT",
        color: "#8ed68e",
        sections: [
          {
            id: uuid(),
            title: "Build Phase",
            steps: [
              {
                id: uuid(),
                tag: "TASK",
                title: "Set up Shopify store and configure settings",
              },
              {
                id: uuid(),
                tag: "TASK",
                title: "Develop custom theme based on approved designs",
              },
              {
                id: uuid(),
                tag: "TASK",
                title: "Add products, collections, and content",
              },
              {
                id: uuid(),
                tag: "REVIEW",
                title: "Internal QA review before client preview",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "LAUNCH",
        color: "#6ec46e",
        sections: [
          {
            id: uuid(),
            title: "Go Live",
            steps: [
              {
                id: uuid(),
                tag: "REVIEW",
                title: "Final client review and approval",
              },
              {
                id: uuid(),
                tag: "TASK",
                title: "Connect domain and configure DNS",
              },
              {
                id: uuid(),
                tag: "TASK",
                title: "Launch website and verify everything works",
              },
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Send launch confirmation email to client",
                copyableText:
                  "Hi [Name],\n\nExciting news - your website is now LIVE! 🎉\n\n[WEBSITE URL]\n\nPlease take some time to review everything and let us know if you spot anything that needs adjusting.\n\nWe'll also be monitoring the site over the next few days to ensure everything runs smoothly.\n\nCongratulations on your new website!\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "POST LAUNCH",
        color: "#4eb04e",
        sections: [
          {
            id: uuid(),
            title: "Follow-up",
            steps: [
              {
                id: uuid(),
                tag: "TASK",
                title: "Schedule 2-week post-launch check-in",
              },
              {
                id: uuid(),
                tag: "LIVE_CALL",
                title: "Conduct post-launch review call",
              },
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Send testimonial/review request",
                copyableText:
                  "Hi [Name],\n\nIt's been a few weeks since your website launched and we hope you're loving it!\n\nIf you've had a positive experience working with us, we'd be so grateful if you could leave us a quick review:\n[REVIEW LINK]\n\nYour feedback helps other businesses find us and means the world to our team.\n\nThank you so much!\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uuid(),
    title: "Informational Website Process",
    stages: [
      {
        id: uuid(),
        title: "PROPOSAL STAGE",
        color: "#a8e6cf",
        sections: [
          {
            id: uuid(),
            title: "Initial Contact",
            trigger: {
              label: "Prospect reach out",
              description: "Via phone call, Whatsapp, Linkedin, etc",
            },
            steps: [
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Send inquiry response email",
                copyableText: "Hi [Name],\n\nThank you for reaching out about your informational website project!\n\nWe'd love to learn more about your goals. Could we schedule a brief call this week?\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "KICKOFF",
        color: "#f4a8a8",
        sections: [{ id: uuid(), title: "Onboarding", steps: [] }],
      },
      {
        id: uuid(),
        title: "CREATIVE",
        color: "#b5e8b5",
        sections: [{ id: uuid(), title: "Design Phase", steps: [] }],
      },
      {
        id: uuid(),
        title: "DEVELOPMENT",
        color: "#8ed68e",
        sections: [{ id: uuid(), title: "Build Phase", steps: [] }],
      },
      {
        id: uuid(),
        title: "LAUNCH",
        color: "#6ec46e",
        sections: [{ id: uuid(), title: "Go Live", steps: [] }],
      },
    ],
  },
  {
    id: uuid(),
    title: "Brand Process",
    stages: [
      {
        id: uuid(),
        title: "DISCOVERY",
        color: "#c4b5e0",
        sections: [
          {
            id: uuid(),
            title: "Brand Discovery Call",
            trigger: {
              label: "New brand project",
              description: "Client needs branding or rebrand",
            },
            steps: [
              {
                id: uuid(),
                tag: "LIVE_CALL",
                title: "Conduct brand discovery call",
              },
              {
                id: uuid(),
                tag: "MANAGEMENT_TASK",
                title: "Document brand goals and preferences",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "STRATEGY",
        color: "#a8e6cf",
        sections: [{ id: uuid(), title: "Brand Strategy", steps: [] }],
      },
      {
        id: uuid(),
        title: "DESIGN",
        color: "#b5e8b5",
        sections: [{ id: uuid(), title: "Visual Identity", steps: [] }],
      },
      {
        id: uuid(),
        title: "DELIVERY",
        color: "#8ed68e",
        sections: [{ id: uuid(), title: "Brand Package", steps: [] }],
      },
    ],
  },
  {
    id: uuid(),
    title: "General Processes",
    stages: [
      {
        id: uuid(),
        title: "CLIENT COMMUNICATION",
        color: "#87ceeb",
        sections: [
          {
            id: uuid(),
            title: "Email Templates",
            steps: [
              {
                id: uuid(),
                tag: "EMAIL_SCRIPT",
                title: "Follow-up email after no response (1 week)",
                copyableText: "Hi [Name],\n\nJust checking in! I wanted to follow up on my previous email.\n\nPlease let me know if you have any questions or if there's anything I can help with.\n\nBest,\n[Your Name]\nMotif Studio",
                copyLabel: "Copy Email Text",
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        title: "INTERNAL PROCESSES",
        color: "#f0e68c",
        sections: [{ id: uuid(), title: "Team Workflows", steps: [] }],
      },
    ],
  },
];
