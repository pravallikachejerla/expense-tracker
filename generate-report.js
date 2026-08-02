const { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        text: "Expense Tracker - Implementation Changes Report",
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: "Generated on: " + new Date().toISOString(),
      }),
      new Paragraph({
        text: "Task Summary",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: "This report summarizes ALL implemented changes across the expense-tracker repository. Work spanned: repository analysis (bugs/security/performance/duplicates), refactors for code quality/readability/maintainability/performance (no functional changes), feature additions (standardized categories/validation, recurring expenses with projections, CSV export), environment-aware API config, full Docker containerization (Mongo + backend + Nginx frontend), and final comprehensive documentation updates (Task Tc072e068). All changes were performed by modifying the existing codebase (per known session facts: before/after modifications, by updating Docker files, etc.). The project remains a pure Node.js full-stack MERN app.",
      }),
      new Paragraph({
        text: "Key Implemented Changes & Refactors",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: "1. Code Quality & Readability (Refactor stage):",
      }),
      new Paragraph({
        text: "- Extracted helpers (validateCategory, buildCSVRow, calculateNextOccurrence) in backend/routes/expenses.js and backend/models/Expense.js.",
      }),
      new Paragraph({
        text: "- Improved pre-save hooks, global error/404 handlers in server.js, centralized constants.js. Dynamic categories in frontend. No duplication.",
      }),
      new Paragraph({
        text: "2. Bug Fixes, Security & Performance (Analysis stage):",
      }),
      new Paragraph({
        text: "- Fixed category validation (Mongoose enums + route checks). Strengthened ownership checks and auth middleware everywhere.",
      }),
      new Paragraph({
        text: "- Performance: DB sorts, single queries, lightweight CSV. No duplicate code identified. Recurring/budget logic hardened.",
      }),
      new Paragraph({
        text: "3. Features Added (modifying existing modules):",
      }),
      new Paragraph({
        text: "- Standardized 12 categories (constants + dynamic UI fetch), recurring support (fields, hook, /recurring endpoint, UI badges/projections using date-fns), CSV /export endpoint + frontend download.",
      }),
      new Paragraph({
        text: "- Budget progress, charts, auth/Theme contexts preserved and enhanced.",
      }),
      new Paragraph({
        text: "4. Environment-Aware Config & Docker (Selected feature):",
      }),
      new Paragraph({
        text: "- Frontend: Updated constants/index.js, Login/Register/App.js, package.json (proxy), added Dockerfile + nginx.conf.",
      }),
      new Paragraph({
        text: "- Backend: Added Dockerfile, health endpoint. Root: docker-compose.yml (Mongo + services with env/volume support).",
      }),
      new Paragraph({
        text: "- Value: One-command `docker compose up --build`, consistent environments, accelerated onboarding, living deployment reference. Aligns with existing architecture.",
      }),
      new Paragraph({
        text: "5. Documentation Updates (Task Tc072e068 - this task):",
      }),
      new Paragraph({
        text: "- Completely refreshed README.md (added TOC, dedicated Setup Guide with local/Docker/npm variants, testing notes).",
      }),
      new Paragraph({
        text: "- Expanded api.md with concrete request/response examples, improved formatting and cross-references.",
      }),
      new Paragraph({
        text: "- Updated architecture.md with Mermaid data-flow diagram, clarified layers/decisions, deployment notes, and task alignment.",
      }),
      new Paragraph({
        text: "- Regenerated this changes-report.docx via updated generate-report.js. All docs now include cross-links, explicit task references, and full coverage of prior stages.",
      }),
      new Paragraph({
        text: "No breaking changes. Existing functionality fully preserved. Coding standards (no stubs/TODOs, constants centralization, error handling, user-scoping, helper extraction) maintained throughout.",
      }),
      new Paragraph({
        text: "Architecture Overview (see architecture.md)",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: "MERN stack (React 18 + MUI + Recharts + Context; Express + Mongoose models with enums/hooks + JWT; MongoDB). User-scoped queries everywhere. Docker Compose for deployment. Data flows: UI -> protected Axios -> auth middleware -> scoped routes/models -> DB. Preserved and documented in detail (with Mermaid).",
      }),
      new Paragraph({
        text: "Verification",
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        text: "• All changes preserve existing functionality and were validated via npm scripts and Docker builds.\n• Report generated via Node 'docx' library.\n• Full documentation now covers README, API (with examples), Architecture (with diagram), Setup Guide, and this auto-generated DOCX.\n• Run 'npm run generate:report' to refresh.\n• Ready for use: docker compose up --build or npm run dev.",
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.SINGLE }, bottom: {}, left: {}, right: {} },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Category")] }),
              new TableCell({ children: [new Paragraph("Status")] }),
              new TableCell({ children: [new Paragraph("Impact")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Refactors & Quality")] }),
              new TableCell({ children: [new Paragraph("Completed")] }),
              new TableCell({ children: [new Paragraph("High - Improved maintainability")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Bug/Security/Perf Fixes")] }),
              new TableCell({ children: [new Paragraph("Completed")] }),
              new TableCell({ children: [new Paragraph("Critical/High - Data integrity & efficiency")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Features (Recurring/CSV/Docker)")] }),
              new TableCell({ children: [new Paragraph("Completed")] }),
              new TableCell({ children: [new Paragraph("High - New capabilities + onboarding")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Documentation (Tc072e068)")] }),
              new TableCell({ children: [new Paragraph("Completed")] }),
              new TableCell({ children: [new Paragraph("High - Complete, readable, up-to-date")] }),
            ]
          }),
        ]
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("changes-report.docx", buffer);
  console.log("✅ changes-report.docx generated successfully!");
}).catch((err) => {
  console.error("Error generating DOCX:", err);
});
