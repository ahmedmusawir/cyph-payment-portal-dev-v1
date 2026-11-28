/** @jest-environment node */
import {NextRequest} from 'next/server';
const mockQuote = jest.fn(async (_c:unknown, input:unknown)=>({amountCents:4900,input}));
jest.mock('@/server/storeOperations',()=>({quoteAddStore:(...a:unknown[])=>mockQuote(a[0],a[1])}));
jest.mock('@/utils/supabase/server',()=>({createClient:async()=>({})}));
import {POST} from '@/app/api/stores/add/quote/route';
import {buildQuote,recurringCents} from '@/server/pricing';
beforeAll(()=>{process.env.NEXT_PUBLIC_APP_ENV='local-proof';process.env.NEXT_PUBLIC_SITE_URL='http://localhost:3101'});
const request=(extra:Record<string,unknown>)=>new NextRequest('http://localhost:3101/api/stores/add/quote',{method:'POST',headers:{origin:'http://localhost:3101','content-type':'application/json'},body:JSON.stringify({storeName:'QA unit only',npi:'1234567890',...extra})});
it('passing control: valid shape reaches the mocked quote boundary',async()=>{const r=await POST(request({}));expect(r.status).toBe(200);expect(mockQuote).toHaveBeenCalledTimes(1)});
it.each(['amount','amountCents','price','totalCents'])('tampered browser %s rejected before quote/provider',async key=>{mockQuote.mockClear();const r=await POST(request({[key]:1}));expect(r.status).toBe(400);expect(mockQuote).not.toHaveBeenCalled()});
it('actual server pricing remains 9900 then 4900 per additional pharmacy',()=>{expect(recurringCents(1)).toBe(9900);expect(recurringCents(2)).toBe(14800);expect(buildQuote(null).totalCents).toBe(9900)});
