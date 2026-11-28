# Director's post-commit manifest verification

Run from the Portal repository after committing both repaired trees on qa/abm007-final.

    python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4/manifest.py post-commit ob --commit HEAD
    python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4/manifest.py post-commit pp --commit HEAD

The script reads the two manifest JSON files in QAM/evidence/Q4/01. It uses the saved Q2 base as the ancestor check and Git reads only to compare the committed path set, each blob's SHA-256 and file mode, and the three pre-existing Portal symlink targets. The expected output is an empty mismatches array for both app manifests. The QAM lane, installed packages, build output and environment/credential files are outside the identity comparison. Both optional Portal archive pairs were included in the pinned path set because the amendment matched the union of both Portal lists. Omission from the commit is reported as a mismatch.

Provide both committed HEADs and the two output rows to Friday. A difference means that commit is not the exact Q4 candidate. Friday decides the effect on coverage. Certification waits for the Director's commit and confirmation.

27 November closeout qualification. Portal's later CHANGELOG.md entry and new session_2026-11-27.md are outside the pinned served pair. The closeout evidence records their exact differences. The strict check requires a commit with the tested bytes and path set. If the later records are captured in a subsequent commit, run the same commands with the full tested repair commit SHA in place of HEAD for that repository. Report the tested repair SHA and the later records SHA, as applicable. Friday rules on any mismatch. Cody did not stage or change those files.
