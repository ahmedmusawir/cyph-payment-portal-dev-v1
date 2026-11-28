import {realpathSync} from 'node:fs';
import {relative,isAbsolute} from 'node:path';
export const QA_ROOT='/tmp/abm007-final-cody-q4';
export function contained(p) { const r=relative(realpathSync(QA_ROOT),realpathSync(p)); if(r==='..'||r.startsWith('../')||isAbsolute(r)) throw Error('FAIL-CLOSED: outside QA root'); return true; }
export function target(api,sql) { if(api!=='ihgcsrypblqkwommrkgj'||sql!==api) throw Error('FAIL-CLOSED: target'); }
export function role(r) {if(!['ENGINEERING_OWNER_A','ENGINEERING_ADMIN','ENGINEERING_MEMBER', 'ENGINEERING_INVITEE'].includes(r)) throw Error('FAIL-CLOSED: role');}
