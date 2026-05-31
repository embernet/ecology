# Tests — Biomimicry & "But Why?" sections

Data-contract tests for the two content sections Forge added to the curriculum
site. They validate the site's **own copied data** (everything the site ships),
confirming it is well-formed and self-contained.

## Run

```bash
cd teams/ecology/projects/ecology
bash tests/run_all.sh
```

## What is covered

`test_content.mjs`:

- **Biomimicry** (`data/biomimicry.json`) — non-empty; every entry has the
  required child-facing fields; every `curriculum_links` item is well-formed
  (subject / key_stage / year_groups / topic / how); ids are unique.
- **But Why?** (`data/but-why.json` + `public/but-why/conversations/*.json`) —
  the index is well-formed; each `url` resolves to a file the site actually
  ships; each conversation satisfies the reader's data contract (title, setting,
  characters, alternating child/adult turns) and carries the teacher-only
  `the_heart_of_it` field for the reader's "For teachers" panel.
- **Reader assets** — `but-why-reader.js` and `.css` are present under
  `public/but-why/`.

The reader component itself has its own behavioural test suite at
`teams/ecology/apps/but-why-reader/tests/`.

## Note

Run `node scripts/sync-ecology-content.mjs` first if the source content in
`teams/ecology/data/` has changed — these tests check the copied result.
