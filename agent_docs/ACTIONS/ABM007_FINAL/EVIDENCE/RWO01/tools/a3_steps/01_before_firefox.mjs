import { grid } from '/home/moose/NEXTJS/CYBER_PHARMA/cyph-payment-portal-dev-v1/agent_docs/ACTIONS/ABM007_FINAL/EVIDENCE/RWO01/tools/lib_a3.mjs';
export default async ({ pages, OB, log }) => ({ firefox: await grid(pages.firefox, OB, log) });
