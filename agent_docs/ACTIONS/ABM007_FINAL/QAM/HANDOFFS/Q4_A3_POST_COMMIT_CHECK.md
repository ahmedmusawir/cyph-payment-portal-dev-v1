# A3 post-commit identity check

After Tony commits the repaired trees, run from the Account & Billing repository:

    python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit ob --commit HEAD
    python3 agent_docs/ACTIONS/ABM007_FINAL/QAM/AUTOMATION/Q4_A3/manifest.py post-commit pp --commit HEAD

These commands are read-only. They compare the complete scoped path sets and modes, SHA-256 of Git blob bytes, and symlink targets against the A3 manifests in QAM/evidence/Q4/A3. The repair commit must descend from its Q2 base. QAM, installed packages, build output and environment/credential files are excluded from the candidate identity. The regenerated Portal optional lists were included in the pins and omission will be reported.

Expected OwedBook manifest SHA-256: `38ebe196201fef9e52826a3d6ad6bb9ada254ac32ffc58a183bb2977e7c82603`.

Expected Account & Billing manifest SHA-256: `bb27c2ee7515d9c2a2d9df5dd537fdd0d02313816b2e5c0798bf6ca38402ee98`.

Success means both outputs have empty mismatches arrays and the expected exact manifest digests. Supply both repair commit SHAs and the two outputs to Friday. If HEAD includes later out-of-manifest records, use the exact repair commit SHA in the argument. Friday disposes any difference before certification.
