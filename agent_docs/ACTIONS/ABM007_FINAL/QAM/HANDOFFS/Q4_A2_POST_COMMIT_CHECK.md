# A2 post-commit identity check

After Tony commits the repaired trees, run from the Account & Billing repository:

    python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A2/manifest.py post-commit ob --commit HEAD
    python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A2/manifest.py post-commit pp --commit HEAD

These commands are read-only. They compare the complete scoped path sets and modes, SHA-256 of Git blob bytes, and symlink targets against the A2 manifests in QAM/evidence/Q4/A2. The repair commit must descend from its Q2 base. QAM, installed packages, build output and environment/credential files are excluded from the candidate identity. The regenerated Portal optional lists were included in the pins and omission will be reported.

Expected OwedBook manifest SHA-256: `cdecd74b3c9e26ab9987122b0c55c0d3ddf9486f00ca32061e56367268bb8742`.

Expected Account & Billing manifest SHA-256: `80d5d7285238cdb6fe3d23745f28d7ab984afeba8960c5d1ad1e5da45fbcd527`.

Success means both outputs have empty mismatches arrays and the expected exact manifest digests. Supply both repair commit SHAs and the two outputs to Friday. If HEAD includes later out-of-manifest records, use the exact repair commit SHA in the argument. Friday disposes any difference before certification.
