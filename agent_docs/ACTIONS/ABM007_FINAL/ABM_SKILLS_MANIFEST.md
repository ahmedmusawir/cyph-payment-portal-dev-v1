# ABM_SKILLS_MANIFEST — ABM007_FINAL

The author had no access to either repository or to the Director's machine. No skill was installed, activated or tested for this pack. Every activation below is **NOT VERIFIED**; the Engineer records actual locations and versions in the plan.

| Skill or method | Purpose in this module | Expected location | Activation |
|---|---|---|---|
| Repository root instructions (`CLAUDE.md`, `AGENTS.md`; `CLAUDE.local.md` in OwedBook) | Base rules, records, protected files. Obeyed under the authority rule in `CONTRACTS/NO_BREAK_AND_PATHS.md` section 3 | Each repository root | NOT VERIFIED by the author; the recon states the Engineer read them on 23 Nov |
| Engineering recon skill used for the pre-ABM recon | Entry checks E-1 to E-6 | As installed on the Director's machine | NOT VERIFIED |
| Existing deployment workflow (`./deploy.sh` per repository; the deploy skills named in project memory) | Authorized alpha redeploys | Each repository root | NOT VERIFIED. Read the script before use; no re-initialization, no secret re-entry |
| Design reference tooling in this pack (`DESIGN/source/gen_tokens.py`, `build_refs.py`, `render_refs.mjs`, `verify_colors.mjs`) | Regenerate the token file from the approved hex values; rebuild and re-render the style tile and samples; resolve every token in a browser and compute contrast, with failing controls | `DESIGN/source/` | Run by the author in the authoring workspace on 23 Nov (Python 3, Node 22, Playwright 1.63 with Chromium). Not run on the Director's machine |
| October Portal design package scripts (`build.mjs`, `render.mjs`, `check.mjs`, `tools/contrast.py`) | Optional state references and overflow or contrast checks | `PAYMENT_PORTAL_FFM_COMPONENTS.zip`, not bundled | Inspected, not run |
| Portal browser helpers `e2e/contrast.ts`, `e2e/gate-m.ts` | Rendered contrast, overflow and target-size probes | Portal repository | NOT VERIFIED by the author; described in recon 8.3 |

| Governing playbooks (`QAM/GOVERNING/`: ABM_PLAYBOOK v1.0, QAM_PLAYBOOK v1.0, QA_PLAYBOOK v1.2, DESIGNER_PLAYBOOK, GLOBAL_DESIGN_SYSTEM_HANDBOOK) | The method this pack follows. Local byte copies with hashes and provenance in `QAM/GOVERNING/PROVENANCE.md` | `QAM/GOVERNING/` | Read by the author. Source is the project-supplied copy of 23 Nov; no Hub commit identity was provided, and none is claimed |

No new builder skill is authored for this module. The execution method is this pack's `ABM_ENTRY.md`.
