export const exportCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    color: #1e293b;
    background: #f8fafc;
    line-height: 1.6;
  }
  h1, h2, h3 { line-height: 1.3; }
  img { max-width: 100%; height: auto; border-radius: 0.5rem; }
  a { color: #2E8B57; }

  .export-header {
    text-align: center;
    padding: 2rem 1rem 3rem;
    border-bottom: 3px solid #2E8B57;
    margin-bottom: 2rem;
  }
  .export-header h1 { font-size: 2rem; color: #2E8B57; margin-bottom: 0.5rem; }
  .export-header p { color: #64748b; font-size: 0.9rem; }

  .resource-item { margin-bottom: 2rem; page-break-inside: avoid; }

  /* Nature Example */
  .nature-example {
    border: 1px solid #bbf7d0;
    border-radius: 0.75rem;
    overflow: hidden;
    background: white;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  }
  .nature-example-header {
    background: linear-gradient(to right, #f0fdf4, #ecfdf5);
    padding: 1.5rem;
    border-bottom: 1px solid #bbf7d0;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  .nature-example-emoji {
    width: 3.5rem; height: 3.5rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    background: white;
    border-radius: 50%;
    border: 1px solid #bbf7d0;
    flex-shrink: 0;
  }
  .nature-example-title { font-size: 1.4rem; font-weight: 700; color: #166534; }
  .nature-example-content { padding: 0.5rem 1.5rem 1rem; }
  .nature-example-content p { margin: 0.5rem 0; }
  .nature-example-facts {
    background: #fefce8;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #fef08a;
  }
  .nature-example-facts h4 { color: #854d0e; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .nature-example-facts ul { padding-left: 1.25rem; color: #334155; }
  .nature-example-facts li { margin: 0.35rem 0; }

  /* Activity */
  .activity {
    border: 1px solid #c7d2fe;
    border-radius: 0.75rem;
    padding: 1.5rem;
    background: white;
  }
  .activity-title { font-size: 1.2rem; font-weight: 700; color: #1e1b4b; margin-bottom: 0.75rem; }
  .activity-content { color: #475569; }
  .activity-content p { margin: 0.5rem 0; }

  /* Reflection */
  .reflection {
    background: linear-gradient(to bottom right, #faf5ff, white);
    border: 1px solid #e9d5ff;
    border-radius: 0.75rem;
    padding: 1.5rem;
  }
  .reflection-title { font-size: 1.1rem; font-weight: 700; color: #581c87; margin-bottom: 0.75rem; }
  .reflection-content { color: #6b21a8; font-style: italic; }
  .reflection-content p { margin: 0.5rem 0; }

  /* Requirement */
  .requirement {
    border-left: 4px solid #3b82f6;
    background: #eff6ff;
    padding: 1.25rem;
    border-radius: 0 0.5rem 0.5rem 0;
  }
  .requirement-label { color: #1e40af; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; margin-bottom: 0.5rem; }
  .requirement-content { color: #1e3a8a; font-size: 1.05rem; font-weight: 500; }
  .requirement-content p { margin: 0.5rem 0; }

  /* Note */
  .note {
    border-left: 4px solid #facc15;
    background: #fefce8;
    padding: 1rem 1.25rem;
    border-radius: 0 0.375rem 0.375rem 0;
    color: #713f12;
  }
  .note strong { display: block; margin-bottom: 0.25rem; }
  .note p { margin: 0.25rem 0; }

  /* Guidance */
  .guidance {
    border-left: 4px solid #6b7280;
    background: #f3f4f6;
    padding: 1rem 1.25rem;
    border-radius: 0 0.375rem 0.375rem 0;
    color: #374151;
    font-size: 0.9rem;
  }
  .guidance strong { display: block; margin-bottom: 0.25rem; }
  .guidance p { margin: 0.25rem 0; }

  /* Handout */
  .handout {
    border: 1px solid #fde68a;
    border-radius: 0.75rem;
    overflow: hidden;
    background: white;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  }
  .handout img { border-radius: 0; }

  .source-tag {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.35rem;
  }

  @media print {
    body { background: white; padding: 1rem; }
    .resource-item { page-break-inside: avoid; }
    .export-header { page-break-after: always; }
  }
`;
