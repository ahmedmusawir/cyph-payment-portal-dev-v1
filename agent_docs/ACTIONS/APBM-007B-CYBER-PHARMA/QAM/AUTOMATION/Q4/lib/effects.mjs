import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const qa=require('../ledger.cjs');
const map={scratch_auth_identities:'new_identities',stripe_customers:'customers',stripe_subscriptions:'subscriptions',test_clocks:'test_clocks',payment_attempt_cents:'attempted_cents',invoice_pay_or_hosted:'pay_or_hosted',email_dispatch:'email_attempts'};
const mutationKeys=['test_clocks','test_clock_advances','stripe_customers','stripe_subscriptions','invoice_create','invoiceitem_create','invoice_finalize','invoice_void','invoice_pay_or_hosted','subscription_mutations','payment_method_attach','default_card_changes','cleanup_test_clock_delete','cleanup_customer_delete','cleanup_subscription_cancel'];
export function reserve(i,op,charges,detail={}){const c={};for(const[k,v]of Object.entries(charges)){if(map[k])c[map[k]]=(c[map[k]]||0)+v;}const mutations=mutationKeys.reduce((sum,k)=>sum+(charges[k]||0),0);if(mutations)c.provider_mutations=mutations;qa.dryRun(i+': '+op,c,op.toLowerCase().includes('cleanup'));return qa.reserve(i+': '+op,c,op.toLowerCase().includes('cleanup'));}
export const settle=(seq,result)=>qa.settle(seq,result);
export const observe=(i,op,d)=>{const n=qa.reserve(i+': '+op,{reads:1});qa.settle(n,d)};
