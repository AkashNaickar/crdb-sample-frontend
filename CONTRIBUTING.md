# Contributing

Thanks for taking a look. This repository is a small static rebuild, so the
workflow is intentionally lightweight.

## Getting set up

```bash
git clone https://github.com/AkashNaickar/crdb-sample-frontend.git
cd crdb-sample-frontend
npm test          # verify every local asset reference resolves
npm run serve     # preview at http://localhost:8123
```

No dependencies are required for the tests or the preview server; both use only
the Node.js standard library (Node 20+).

## Making a change

1. Branch off `main`: `git checkout -b overhaul/<topic>`.
2. Keep the `site/` directory self-contained. Anything in `site/` is shipped to
   the live deployment, so do not place originals or credentials there.
3. Add or update a test when you change how assets are referenced.
4. Run `npm test` before opening a pull request.
5. Open a PR and fill in the pull request template.

## Commit messages

Use short, imperative, human-sounding messages that describe the change, for
example `fix broken footer link` rather than `update files`. No emoji or
"AI-generated" markers.

## Scope

- `site/` is the deliverable: plain HTML/CSS/JS captured from the original site.
- `recon/` is the local reverse-engineering scrape and is intentionally ignored
  by git.
- Third-party assets retain their original ownership; see the README.

## Reporting issues

Use the issue templates. For security concerns, follow `SECURITY.md` instead of
opening a public issue.
