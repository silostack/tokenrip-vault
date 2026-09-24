# Generates pages 2-8 for flow-of-funds-v1.html (same template as pages 0-1)
import re, html

TEAL="#0E6B66"; TEAL2="#DCEFEC"; TEAL3="#F0F8F7"; VIOL="#4D4F8F"; VIOL3="#F2F2F9"; INK="#1C2733"; INK2="#4A5768"; GREY="#7A8794"; RULE="#C9D1D9"
MONO="IBM Plex Mono, monospace"; SANS="IBM Plex Sans, sans-serif"

def seq(actors, lanes, arrows, W=340, H=236, notes=(), aria=""):
    """actors: [(label, sub, cls)] cls in plain|reb|lic|teal|chain
       lanes: [(label, y0, y1, 'v'|'t'|'g')]
       arrows: [dict(a,b,y,kind,label,num,mtl=False,self=False,lab2=None)] kind id|money|instr
       notes: [(actor_idx, text, color)] at bottom"""
    n=len(actors); bw=min(96,(W-40)/n-10); margin=bw/2+8; span=(W-2*margin)/(n-1) if n>1 else 0
    xs=[margin+i*span for i in range(n)]
    out=[f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(aria)}">']
    for (lab,y0,y1,c) in lanes:
        fill={'v':VIOL3,'t':TEAL3,'g':'#F4F6F8'}[c]; col={'v':VIOL,'t':TEAL,'g':INK2}[c]
        out.append(f'<rect x="0" y="{y0}" width="{W}" height="{y1-y0}" fill="{fill}"/>')
        out.append(f'<text x="4" y="{y0+9}" font-family="{MONO}" font-size="6.5" font-weight="600" fill="{col}" letter-spacing=".08em">{html.escape(lab)}</text>')
    out.append(f'<g stroke="{RULE}" stroke-width="1">'+''.join(f'<line x1="{x:.1f}" y1="34" x2="{x:.1f}" y2="{H-6}"/>' for x in xs)+'</g>')
    out.append(f'<g font-family="{SANS}" font-size="8.3" text-anchor="middle" font-weight="600">')
    for (lab,sub,cls),x in zip(actors,xs):
        fill,stroke,tc={'plain':('#fff',INK,INK),'reb':('#fff',VIOL,VIOL),'lic':(TEAL2,TEAL,TEAL),'teal':('#fff',TEAL,TEAL),'chain':(VIOL3,VIOL,VIOL)}[cls]
        out.append(f'<rect x="{x-bw/2:.1f}" y="8" width="{bw:.1f}" height="26" rx="2" fill="{fill}" stroke="{stroke}"/>')
        if sub:
            out.append(f'<text x="{x:.1f}" y="19" fill="{tc}">{html.escape(lab)}</text><text x="{x:.1f}" y="29" font-size="6.3" font-weight="400" fill="{tc}">{html.escape(sub)}</text>')
        else:
            out.append(f'<text x="{x:.1f}" y="24" fill="{tc}">{html.escape(lab)}</text>')
    out.append('</g>')
    for ar in arrows:
        k=ar['kind']; y=ar['y']
        stroke,dash,mk,w={'id':(VIOL,'4 3','ah-v',1.2),'money':(TEAL,None,'ah-t',1.6),'instr':(GREY,'1.5 2.5','ah-g',1.1)}[k]
        da=f' stroke-dasharray="{dash}"' if dash else ''
        if ar.get('self'):
            x=xs[ar['a']]; L=ar.get('left')
            if L:
                out.append(f'<path d="M{x:.1f},{y-6} h-26 v12 h24" fill="none" stroke="{stroke}" stroke-width="{w}"{da} marker-end="url(#{mk})"/>')
                lx=x-30; anc='end'; cx=x-14
            else:
                out.append(f'<path d="M{x:.1f},{y-6} h26 v12 h-24" fill="none" stroke="{stroke}" stroke-width="{w}"{da} marker-end="url(#{mk})"/>')
                lx=x+30; anc='start'; cx=x+14
            out.append(f'<text x="{lx:.1f}" y="{y-2}" text-anchor="{anc}" font-family="{SANS}" font-size="6.8" fill="{INK2}">{html.escape(ar["label"])}</text>')
            if ar.get('lab2'): out.append(f'<text x="{lx:.1f}" y="{y+6}" text-anchor="{anc}" font-family="{SANS}" font-size="6.8" fill="{INK2}">{html.escape(ar["lab2"])}</text>')
            cy=y+12
        else:
            xa,xb=xs[ar['a']],xs[ar['b']]; d=1 if xb>xa else -1
            x1=xa; x2=xb-2*d
            out.append(f'<line x1="{x1:.1f}" y1="{y}" x2="{x2:.1f}" y2="{y}" stroke="{stroke}" stroke-width="{w}"{da} marker-end="url(#{mk})"/>')
            lc=INK if k!='instr' else INK2
            if ar['label']:
                if abs(xb-xa)<150:
                    lx=xa+20*d; anc='start' if d>0 else 'end'
                else:
                    lx=(xa+xb)/2; anc='middle'
                out.append(f'<text x="{lx:.1f}" y="{y-4}" text-anchor="{anc}" font-family="{SANS}" font-size="7.4" fill="{lc}">{html.escape(ar["label"])}</text>')
            if ar.get('mtl'):
                bx=xb-34 if d>0 else xb+12
                out.append(f'<rect x="{bx:.1f}" y="{y+3}" width="22" height="11" rx="1.5" fill="{TEAL}"/><text x="{bx+11:.1f}" y="{y+11.5}" font-family="{MONO}" font-size="6.5" font-weight="600" fill="#fff" text-anchor="middle">MTL</text>')
            cx=xa+11*d; cy=y
        if ar.get('num'):
            col={'id':VIOL,'money':TEAL,'instr':GREY}[k]
            out.append(f'<circle cx="{cx:.1f}" cy="{cy}" r="6" fill="{col}"/><text x="{cx:.1f}" y="{cy+2.5}" text-anchor="middle" font-family="{MONO}" font-size="7" font-weight="600" fill="#fff">{ar["num"]}</text>')
    for (i,text,col) in notes:
        out.append(f'<text x="{xs[i]:.1f}" y="{H-10}" text-anchor="middle" font-family="{MONO}" font-size="6.4" font-weight="600" fill="{col}">{html.escape(text)}</text>')
    out.append('</svg>')
    return '\n'.join(out)

def hd(n,title,sub):
    return f'''<header class="hd"><div><div class="kicker">Flow of funds · Page {n} of 9</div><h1>{title} <span>— {sub}</span></h1></div>
    <div class="right"><b>RebelFi × BIGG Digital Assets</b>Draft for discussion · v2 · 23 August 2026<br>Prepared by RebelFi</div></header>'''

def strip(items):
    cells=''.join(f'<div class="sc"><span>{i+1}</span>{html.escape(t)}</div>' for i,t in enumerate(items))
    return f'<div class="strip"><div class="sl">Customer sees</div>{cells}</div>'

def steps(rows,start=1):
    cls={'id':'v','money':'t','instr':'g'}
    return '<ol class="steps">'+''.join(f'<li><span class="n {cls[k]}">{i+start}</span><span>{t}</span></li>' for i,(k,t) in enumerate(rows))+'</ol>'

def table(head,rows,widths=None):
    th=''.join(('<th style="width:%s">%s</th>'%(widths[i],h)) if (widths and widths[i]) else '<th>%s</th>'%h for i,h in enumerate(head))
    tr=''.join('<tr>'+''.join(('<td class="id">%s</td>'%c) if (j==0 and str(c).startswith('?')) else '<td>%s</td>'%c for j,c in enumerate(r))+'</tr>' for r in rows)
    return f'<table><tr>{th}</tr>{tr}</table>'

T=lambda c:f'<span class="tag {c}">{ {"c":"C","n":"N","a":"A","mtl":"MTL"}[c]}</span>'
K=lambda t:f'<span class="tag k">{t}</span>'
AS='<span class="st as">Assumed</span>'


pages=[]
BIG='Blockchain Intelligence Group'
KYTB=K('KYT')

# ---------------- PAGE 1: onboarding (B2B, B2B2B) ----------------
A=[("Business","customer","plain"),("RebelFi","","reb"),("Licensed entity","Balance US · Netcoins CA","lic"),("Business","wallet(s)","plain")]
L=[("IDENTITY PATH",42,122,'v'),("MONEY PATH",126,226,'t')]
m2=seq(A,L,[
 dict(a=0,b=2,y=66,kind='id',label='entity documents · owners · signatories',num=1),
 dict(a=2,b=1,y=90,kind='id',label='result + reference ID + approved risk policy',num=2),
 dict(a=2,b=2,y=108,kind='id',label='monitoring and re-verification',num=3,self=True),
 dict(a=0,b=2,y=152,kind='money',label='fiat (USD / CAD)',num=4,mtl=True),
 dict(a=2,b=3,y=180,kind='money',label='USDC',num=5),
 dict(a=1,b=3,y=208,kind='instr',label='gates every outbound instruction against policy',num=6),
],W=500,H=236,notes=[(2,'CUSTOMER-OF-RECORD',TEAL)],aria="B2B onboarding: business KYB to the licensed entity, result and risk policy to RebelFi; fiat to the licensed entity, USDC to a business-controlled wallet, with RebelFi gating instructions.")
A3=[("End user","","plain"),("Partner","introducer","plain"),("RebelFi","","reb"),("Licensed entity","Balance · Netcoins CA","lic"),("Wallet","partner / user","plain")]
L3=[("IDENTITY PATH",42,134,'v'),("MONEY PATH",138,226,'t')]
m3=seq(A3,L3,[
 dict(a=1,b=3,y=64,kind='id',label='KYB as introducing partner',num=1),
 dict(a=0,b=1,y=84,kind='id',label='KYC to standard',num=2),
 dict(a=1,b=3,y=104,kind='id',label='pass-through via API',num=3),
 dict(a=3,b=2,y=124,kind='id',label='per-user result + ref ID',num=4),
 dict(a=0,b=3,y=162,kind='money',label='fiat, via the partner\'s interface',num=5,mtl=True),
 dict(a=3,b=4,y=188,kind='money',label='USDC',num=6),
 dict(a=1,b=4,y=212,kind='instr',label='instructions · RebelFi routes · sub-ledger',num=7),
],W=500,H=236,notes=[(3,'CUSTOMER-OF-RECORD',TEAL),(1,'INTRODUCER · NOT A TRANSMITTER',INK2)],aria="B2B2B onboarding: the partner completes KYB and passes end-user KYC through to the licensed entity, which is customer-of-record for end-user money; RebelFi routes on partner instructions.")
p1=f"""<section class="page">{hd(1,"Onboarding and KYC","customer-of-record")}
<p class="lede">In both onboarding models the licensed entity is customer-of-record for every money leg, and identity data and money travel on separate paths. RebelFi receives a verification result and a reference ID, not documents. Screening on every flow is provided by {BIG}. Grey dotted arrows are RebelFi instructions.</p>
<div class="two-fig">
 <div class="fig"><div class="fh">Model 1 · Direct business (B2B) <span class="note" style="font-weight:400">— treasury, merchant or B2B payer is the customer</span></div><figure>{m2}</figure>
 {steps([('id','Business submits entity documents, beneficial owners and authorised signatories to the licensed entity\'s KYB programme '+K('KYC')+'.'),('id','Result + reference ID to RebelFi, which records the approved risk policy: thresholds, protocol whitelist, permitted counterparties.'),('id','Ongoing monitoring and periodic re-verification by the licensed entity; transaction screening by '+BIG+' '+KYTB+'.'),('money','Fiat legs: the licensed entity is customer-of-record '+T('c')+' '+T('mtl')+'.'),('money','USDC delivered to business-controlled wallet(s) '+T('n')+'.'),('instr','Policy engine gates every outbound instruction against the recorded policy.')])}
 <div class="open"><b>?8</b> large business customers: Balance directly, or via Netcoins USA for OTC liquidity</div></div>
 <div class="fig"><div class="fh">Model 2 · Partner\'s end users (B2B2B, pass-through) <span class="note" style="font-weight:400">— a payment network, fintech or marketplace brings its own users</span></div><figure>{m3}</figure>
 {steps([('id','Partner completes KYB and is approved as an introducing partner under the licensed entity\'s programme.'),('id','Partner collects end-user KYC to the licensed entity\'s standard '+K('KYC')+'.'),('id','Passed through via API; end users become customers of the licensed entity.'),('id','Per-user result + reference ID to RebelFi, mapped to partner sub-accounts under the partner\'s risk policy.'),('money','End-user fiat legs: licensed entity is customer-of-record, partner is introducer '+T('c')+' '+T('mtl')+'. The partner is not a money transmitter.'),('money','USDC to partner-controlled (omnibus + sub-ledger) or per-user wallets '+T('n')+'.'),('instr','End users transact in the partner\'s interface; RebelFi routes; the licensed entity settles.')])}
 <div class="open"><b>?2</b> acceptance of pass-through KYC and its standard · <b>?9</b> omnibus vs per-user wallets for partners\' end users</div></div>
</div>
<div class="ft" style="grid-template-columns:1.35fr 1fr;margin-top:4px">
 <div><h2>Who holds what, after onboarding</h2>{table(["Party","Holds","Does not hold"],[["Licensed entity (Balance / Netcoins CA)","Identity documents, KYC/KYB file, customer-of-record relationship, fiat balances, monitoring obligations","Control over non-custodial wallets or on-chain positions"],["RebelFi","Verification status, tier, limits, reference IDs, the customer\'s or partner\'s risk policy, wallet mappings","Identity documents, fiat, customer funds of any kind"],["Customer / partner","Wallet keys; (partner) its end-user relationship and interface","Money-transmission obligations for the licensed legs"]],["150px",None,None])}</div>
 <div><h2>Assumptions to validate · open items added</h2>{table(["#","Item","Source"],[["A","The licensed entity\'s KYC programme can be called via API and returns results only, not documents "+AS,"Balance"],["B","Pass-through KYC (Model 2) is acceptable to Balance at a defined standard "+AS,"Balance"],["?7","Treatment of customers resident in states not covered by Balance","BIGG / Balance"],["?8","Onboarding route for large business customers needing OTC liquidity","BIGG"],["?9","Omnibus vs per-user wallets for partners\' end users","BIGG / Balance"]],["26px",None,"92px"])}</div>
</div></section>"""
pages.append(p1)

# ---------------- PAGE 2: on/off ramp ----------------
A=[("Customer","bank account","plain"),("RebelFi","","reb"),("Bank partner","USD virtual acct","teal"),("Balance","US licensed","lic"),("Circle","USDC","teal"),("Customer","wallet","plain")]
L=[("INSTRUCTIONS",42,90,'g'),("MONEY PATH",94,226,'t')]
on=seq(A,L,[
 dict(a=0,b=1,y=66,kind='instr',label='on-ramp request: amount, destination wallet',num=1),
 dict(a=1,b=3,y=82,kind='instr',label='instruction + customer reference ID',num=2),
 dict(a=0,b=2,y=120,kind='money',label='USD to the customer\'s virtual account',num=3),
 dict(a=2,b=3,y=146,kind='money',label='USD credited · converted',num=4,mtl=True),
 dict(a=3,b=4,y=172,kind='money',label='mint USDC',num=5),
 dict(a=4,b=5,y=198,kind='money',label='USDC delivered',num=6),
 dict(a=3,b=1,y=218,kind='instr',label='confirmation',num=7),
],W=500,H=236,notes=[(3,'CUSTOMER-OF-RECORD',TEAL)],aria="On-ramp: USD enters the customer's virtual account at the bank partner, Balance converts and mints USDC via Circle, USDC is delivered to the customer wallet.")
off=seq(A,L,[
 dict(a=0,b=1,y=66,kind='instr',label='off-ramp request: amount, bank account',num=1),
 dict(a=1,b=3,y=82,kind='instr',label='instruction + reference ID · deposit address',num=2),
 dict(a=5,b=3,y=120,kind='money',label='USDC to Balance deposit address',num=3),
 dict(a=3,b=4,y=146,kind='money',label='redeem USDC',num=4),
 dict(a=4,b=2,y=172,kind='money',label='USD to the virtual account',num=5),
 dict(a=2,b=0,y=198,kind='money',label='USD payout',num=6,mtl=True),
 dict(a=3,b=1,y=218,kind='instr',label='confirmation',num=7),
],W=500,H=236,notes=[(3,'CUSTOMER-OF-RECORD',TEAL)],aria="Off-ramp: USDC is sent to Balance, redeemed with Circle, and paid out in USD through the bank partner to the customer's bank account.")
p2=f"""<section class="page">{hd(2,"On-ramp and off-ramp","the licensed legs")}
<p class="lede">The two ends of every flow are the only legs that require a money-transmission licence. Fiat enters and leaves through a virtual account at the bank partner; Balance converts and transmits; USDC is minted or redeemed with Circle. Everything between the two ends is on-chain.</p>
{strip(["Funds the virtual account by ACH or wire","USDC arrives in the wallet","To exit, sends USDC to the off-ramp address","USD arrives in the bank account"])}
<div class="two-fig">
 <div class="fig"><div class="fh">On-ramp · USD → USDC</div><figure>{on}</figure>
 {steps([('instr','Customer requests an on-ramp; RebelFi records amount and destination wallet.'),('instr','RebelFi instructs Balance with the customer reference ID from onboarding.'),('money','Customer sends USD to their virtual account at the bank partner '+T('c')+'.'),('money','Balance converts and transmits '+T('mtl')+'.'),('money','USDC minted with Circle (directly or via Netcoins USA).'),('money','USDC delivered to the customer wallet '+T('n')+'.'),('instr','Balance confirms; RebelFi updates the customer ledger.')])}</div>
 <div class="fig"><div class="fh">Off-ramp · USDC → USD</div><figure>{off}</figure>
 {steps([('instr','Customer requests an off-ramp to a registered bank account.'),('instr','RebelFi instructs Balance; Balance issues a deposit address.'),('money','Customer sends USDC to the deposit address; Balance now custodies '+T('c')+'.'),('money','Balance redeems USDC for USD with Circle.'),('money','USD lands in the customer\'s virtual account.'),('money','Bank partner pays out to the customer\'s bank account '+T('mtl')+'.'),('instr','Balance confirms; RebelFi closes the request.')])}</div>
</div>
<div class="ft" style="margin-top:4px">
 <div><h2>Custody along the flow</h2>{table(["Stage","Funds held by","Perimeter"],[["Fiat in the virtual account","Bank partner "+T('c'),"Inside"],["Conversion and transmission","Balance "+T('c')+" "+T('mtl'),"Inside"],["Mint / redeem","Circle "+T('c'),"Inside; outside the group"],["USDC in the customer wallet","Customer "+T('n'),"Outside"]])}
 <p class="note"><b>Canada.</b> Netcoins Canada performs both the banking and the licensed legs in CAD. Same sequence, one entity.</p></div>
 <div><h2>Open items added</h2>{table(["#","Item","Source"],[["?10","Deposit-address model for off-ramps: per customer or omnibus with reference","Balance"],["?11","Settlement windows for virtual-account funding and payouts","Bank partner / Balance"]],["26px",None,"110px"])}</div>
</div></section>"""
pages.append(p2)

# ---------------- PAGE 3: yield ----------------
A=[("Customer / partner","wallet","plain"),("RebelFi","policy engine","reb"),("Protocol","whitelisted · on-chain","chain")]
L=[("INSTRUCTIONS",42,122,'g'),("MONEY PATH",126,226,'t')]
yd=seq(A,L,[
 dict(a=0,b=1,y=66,kind='instr',label='risk policy: thresholds, protocol whitelist, limits',num=1),
 dict(a=1,b=1,y=88,kind='instr',label='evaluates idle balance against policy',num=2,self=True),
 dict(a=1,b=0,y=114,kind='instr',label='proposed deployment, for approval',num=3),
 dict(a=0,b=2,y=152,kind='money',label='USDC into a position owned by the wallet',num=4),
 dict(a=2,b=0,y=176,kind='money',label='accrual',num=5),
 dict(a=1,b=1,y=196,kind='instr',label='monitors venue risk · rebalances within policy',num=6,self=True),
 dict(a=2,b=0,y=218,kind='money',label='USDC returned on withdrawal',num=7),
],W=520,H=236,aria="Yield: the wallet sets a risk policy, RebelFi proposes deployments within it, USDC moves into protocol positions owned by the wallet, accrues, and returns on withdrawal.")
p3=f"""<section class="page">{hd(3,"Yield on idle balances","no licensed leg")}
<p class="lede">Idle USDC is deployed into whitelisted protocols under a per-customer risk policy. Funds move from the customer's wallet into on-chain positions the customer owns. No entity takes custody and no licensed leg is involved.</p>
{strip(["Sets a risk policy, or accepts the partner default","Idle balance is deployed within policy","Accrual is visible; withdraw at any time"])}
<div class="two-fig" style="grid-template-columns:1.3fr 1fr">
 <div class="fig"><div class="fh">Deployment and withdrawal</div><figure>{yd}</figure>
 {steps([('instr','Customer or partner sets the risk policy; for B2B2B, the partner sets defaults per sub-account.'),('instr','RebelFi evaluates idle balance against thresholds and the whitelist.'),('instr','Proposed deployment goes to the wallet owner for approval, or executes automatically within pre-approved limits.'),('money','USDC moves into a protocol position owned by the wallet '+T('n')+'.'),('money','Accrual is tracked and attributed per wallet or sub-account.'),('instr','RebelFi monitors venue risk and rebalances only within the policy.'),('money','On withdrawal, USDC returns to the wallet.')])}</div>
 <div class="fig"><div class="fh">Policy options</div>
  <div class="pad">{table(["Option","Effect"],[["Approval thresholds","Amounts above the threshold require explicit approval"],["Protocol whitelist","Only named venues are eligible"],["Insured deposits","Restricts to venues with deposit cover"],["Sharia-compliant","Restricts to compliant venues and structures"],["Partner defaults","Applied across a partner's sub-accounts (B2B2B)"],["Treasury mode","Business balances swept above a floor, returned on demand"]])}</div>
  <h2 style="margin-top:8px">Custody along the flow</h2><div class="pad">{table(["Stage","Funds held by"],[["Idle balance","Customer / partner wallet "+T('n')],["Deployed","On-chain position owned by the wallet "+T('n')],["RebelFi","Instructions only "+T('a')]])}</div></div>
</div>
<div class="ft" style="margin-top:4px">
 <div><h2>Notes</h2><p class="note">Yield is a feature applied to balances that already sit in a wallet; it does not change who holds the funds. Partner-level sweeps use the same sequence with the partner wallet as the owner.</p></div>
 <div><h2>Open items added</h2>{table(["#","Item","Source"],[["?12","Availability of yield to Netcoins Canada customers under its existing approvals","Netcoins"],["?13","Whether group treasury balances participate (treasury mode for Netcoins entities)","BIGG"]],["26px",None,"110px"])}</div>
</div></section>"""
pages.append(p3)

# ---------------- PAGE 4: escrow ----------------
A=[("Payer","wallet","plain"),("RebelFi","","reb"),("Escrow contract","permissionless · on-chain","chain"),("Payee","wallet","plain")]
L=[("INSTRUCTIONS",42,102,'g'),("MONEY PATH",106,226,'t')]
es=seq(A,L,[
 dict(a=0,b=1,y=66,kind='instr',label='payment terms: amount, payee, release conditions',num=1),
 dict(a=1,b=2,y=88,kind='instr',label='deploys and parameterises the escrow',num=2),
 dict(a=0,b=2,y=130,kind='money',label='USDC locked in escrow',num=3),
 dict(a=1,b=1,y=154,kind='instr',label='monitors conditions: time · attestation · approval',num=4,self=True),
 dict(a=2,b=3,y=182,kind='money',label='release when conditions are met',num=5),
 dict(a=2,b=0,y=210,kind='money',label='refund on expiry or dispute outcome',num=6),
],W=520,H=236,notes=[(2,'NO PARTY CAN REDIRECT FUNDS',VIOL)],aria="Escrow: payer locks USDC in a permissionless contract parameterised by RebelFi; the contract releases to the payee when conditions are met, or refunds the payer on expiry.")
p4=f"""<section class="page">{hd(4,"Escrow payments","conditional release on-chain")}
<p class="lede">The payer funds a permissionless escrow contract; funds release to the payee only when pre-set conditions are met. While funds are in escrow, neither RebelFi nor any licensed entity can move them. Fiat entry and exit use the on-ramp and off-ramp legs.</p>
{strip(["Payer creates a payment with terms","Funds are locked in escrow","Conditions met: payee is paid","Not met by expiry: payer is refunded"])}
<div class="two-fig" style="grid-template-columns:1.3fr 1fr">
 <div class="fig"><div class="fh">Lock, release, refund</div><figure>{es}</figure>
 {steps([('instr','Payer sets amount, payee and release conditions.'),('instr','RebelFi deploys the escrow with those parameters; the contract is permissionless once live.'),('money','Payer locks USDC in the contract '+T('n')+'.'),('instr','RebelFi monitors the conditions and submits attestations where it is the designated source.'),('money','Contract releases to the payee when conditions are met.'),('money','Contract refunds the payer on expiry or per the dispute outcome.')])}</div>
 <div class="fig"><div class="fh">Release conditions and use cases</div>
  <div class="pad">{table(["Condition type","Example"],[["Time","Release on date; refund after expiry"],["Attestation","Delivery confirmed by a designated source"],["Multi-party approval","Both parties, or an agreed third party, sign off"],["Milestone","Partial releases against agreed stages"]])}</div>
  <div class="pad" style="margin-top:6px">{table(["Use case","Shape"],[["B2B invoice settlement","Lock on invoice, release on acceptance"],["Merchant acceptance","Lock at checkout, release on delivery"],["Cross-border supplier payment","Escrow between two off-ramps"],["Agent-initiated payments","An agent locks funds for work that takes time (page 5)"]])}</div></div>
</div>
<div class="ft" style="margin-top:4px">
 <div><h2>Custody along the flow</h2>{table(["Stage","Funds held by"],[["Before lock","Payer wallet "+T('n')],["In escrow","Contract — no party can move the funds "+T('n')],["After release","Payee wallet "+T('n')],["RebelFi","Deploys and monitors "+T('a')]])}</div>
 <div><h2>Open items added</h2>{table(["#","Item","Source"],[["?14","Which merchant and B2B use cases BIGG prioritises for launch","BIGG"],["?15","Attestation sources and dispute handling: who is designated to attest","BIGG / RebelFi"]],["26px",None,"110px"])}</div>
</div></section>"""
pages.append(p4)

# ---------------- PAGE 5: agentic payments ----------------
A=[("Owner","business · KYC\'d","plain"),("Agent","operator","plain"),("RebelFi","builds · verifies","reb"),("Agent account","policy-bound · on-chain","chain"),("Payee","or escrow","plain")]
L=[("INSTRUCTIONS",42,126,'g'),("MONEY PATH",130,226,'t')]
ag=seq(A,L,[
 dict(a=0,b=3,y=64,kind='instr',label='creates the account · sets each agent\'s spending limit · can pause',num=1),
 dict(a=1,b=2,y=82,kind='instr',label='payment intent: amount, payee',num=2),
 dict(a=2,b=1,y=98,kind='instr',label='unsigned transaction · matches the intent',num=3),
 dict(a=1,b=3,y=114,kind='instr',label='signs locally · submits',num=4),
 dict(a=0,b=3,y=154,kind='money',label='funds the account',num=5),
 dict(a=3,b=3,y=176,kind='money',label='within limit: executes',lab2='over limit: rejected',num=6,self=True,left=True),
 dict(a=3,b=4,y=206,kind='money',label='payment, direct or into escrow',num=7),
],W=560,H=236,notes=[(0,'CUSTOMER-OF-RECORD',TEAL),(3,'OWNER CONTROLS · NON-CUSTODIAL',VIOL)],aria="Agentic payment: a KYC'd business owner creates a policy-bound account and sets per-agent spending limits; the agent forms a payment intent, RebelFi builds an unsigned transaction that matches it, the agent signs locally, and the account enforces the limit on-chain before paying the payee or an escrow.")
p5=f"""<section class="page">{hd(5,"Agentic payments","policy-bound agent accounts")}
<p class="lede">An AI agent pays from a policy-bound account owned by a KYC'd business. The owner sets each agent's spending limit and the account enforces it on-chain, so a mistaken or compromised agent cannot overspend. <b>Agents never become customers</b>: the owner is customer-of-record, the agent is an operator on the owner's account, and fiat legs run through the licensed entity as on any other flow. Compatible with agent payment rails such as x402.</p>
{strip(["Business creates an agent account and sets a limit per agent","Agent pays within its limit; over-limit attempts are rejected by the account","Payments for work that takes time sit in escrow until delivered","Idle balances earn yield under the owner's policy"])}
<div class="two-fig" style="grid-template-columns:1.35fr 1fr">
 <div class="fig"><div class="fh">Authority, intent, enforcement</div><figure>{ag}</figure>
 {steps([('instr','Owner creates the account, adds each agent as an operator with its own spending limit, and can pause all agents at once.'),('instr','Agent forms a payment intent: amount and payee.'),('instr','RebelFi builds the unsigned transaction; the agent checks that it matches the intent before signing.'),('instr','Agent signs on its own machine and submits. RebelFi never holds agent keys.'),('money','Owner funds the account; on-ramp as on page 2.'),('money','The account enforces the limit: within limit the payment executes; over limit it is rejected by the chain, not by the agent '+T('n')+'.'),('money','Payment lands with the payee directly, or in escrow for work that takes time (page 4).')])}</div>
 <div class="fig"><div class="fh">Controls</div>
  <div class="pad">{table(["Control","Enforced by","Status"],[["Per-agent spending limit","The account, on-chain","Existing"],["Pause all agents","Owner, instantly","Existing"],["Owner override","Owner acts without limits; agents cannot","Existing"],["Intent check before signing","Agent-side library","Existing"],["Escrow for work that takes time","Contract","Existing"],["Period limits and allowlists","The account","Next"],["Conditional release from escrow","Contract","Next"]],[None,None,"56px"])}</div>
  <h2 style="margin-top:8px">Where it sits</h2><div class="pad">{table(["Item","Position"],[["Customer-of-record","The owner (business), via the licensed entity"],["The agent","Operator on the owner's account; not a customer"],["Fiat in / out","On-ramp and off-ramp legs, unchanged"],["Screening",BIG+" on every transaction "+KYTB],["Custody","Owner controls; RebelFi holds no keys "+T('a')]])}</div></div>
</div>
<div class="ft" style="margin-top:4px">
 <div><h2>Agent payment rails</h2><p class="note">Rails such as x402 define how an agent pays a service. The account defines whether it may, and how much. The rail requests; the account authorises within the owner's limits; screening applies as on any flow.</p></div>
 <div><h2>Open items added</h2>{table(["#","Item","Source"],[["?16","Agent use cases BIGG prioritises: treasury agents, procurement, agent-to-agent services","BIGG"],["?17","Target chain for redeployment of the account and escrow programs","BIGG / RebelFi"]],["26px",None,"110px"])}</div>
</div></section>"""
pages.append(p5)

# ---------------- PAGE 6: CCTP + clean wallets ----------------
A=[("Source wallet","chain A","plain"),("RebelFi","relay","reb"),("Circle CCTP","burn · attest · mint","teal"),("Destination","chain B · clean wallet","plain")]
L=[("INSTRUCTIONS",42,78,'g'),("MONEY PATH",82,226,'t')]
cc=seq(A,L,[
 dict(a=0,b=1,y=66,kind='instr',label='transfer request: amount, destination chain',num=1),
 dict(a=0,b=2,y=108,kind='money',label='burn USDC on chain A',num=2),
 dict(a=2,b=1,y=132,kind='instr',label='attestation',num=3),
 dict(a=1,b=2,y=156,kind='instr',label='relays attestation to chain B',num=4),
 dict(a=2,b=3,y=184,kind='money',label='mint USDC on chain B',num=5),
 dict(a=1,b=3,y=210,kind='instr',label='source check at entry',num=6),
],W=520,H=236,notes=[(2,'NO CUSTODIAN IN FLIGHT',TEAL)],aria="Cross-chain: USDC is burned on the source chain, Circle attests, RebelFi relays the attestation, USDC is minted on the destination chain into a clean wallet after a source check.")
p6=f"""<section class="page">{hd(6,"Cross-chain transfers and clean wallets","CCTP")}
<p class="lede">USDC moves between chains by burn-and-mint through Circle's CCTP; no custodian holds funds in flight. A <b>clean wallet</b> (also known as a ring-fenced wallet) accepts only balances whose source passes screening, so everything inside it has a known origin.</p>
{strip(["Chooses the destination chain","USDC is burned on the source chain","USDC is minted on the destination chain, within minutes"])}
<div class="two-fig" style="grid-template-columns:1.3fr 1fr">
 <div class="fig"><div class="fh">Burn, attest, mint</div><figure>{cc}</figure>
 {steps([('instr','Wallet owner requests a transfer to another chain.'),('money','USDC is burned on the source chain '+T('n')+'.'),('instr','Circle issues an attestation for the burn.'),('instr','RebelFi relays the attestation to the destination chain.'),('money','USDC is minted on the destination chain '+T('n')+'.'),('instr','For clean-wallet destinations, the source is screened by '+BIG+' before the balance is accepted '+KYTB+'.')])}</div>
 <div class="fig"><div class="fh">Clean wallets</div>
  <div class="pad"><p class="note" style="margin:0 0 5px">A clean wallet is a customer- or partner-owned wallet with entry rules enforced by RebelFi. It is used where a counterparty, auditor or regulator needs assurance that every balance has a known source.</p>
  {table(["Rule","Effect"],[["Accepted sources","On-ramp output, identified counterparties, transfers from other clean wallets"],["Screening at entry","Inbound balances are checked by "+BIG+" before acceptance; failures are rejected or quarantined "+KYTB],["Source trail","Origin recorded per unit for audit and reporting"],["Outbound","Unrestricted; the wallet owner controls keys "+T('n')]])}</div></div>
</div>
<div class="ft" style="margin-top:4px">
 <div><h2>Custody along the flow</h2>{table(["Stage","Funds held by"],[["Before burn","Source wallet "+T('n')],["In flight","None — burned on A, minted on B"],["After mint","Destination wallet "+T('n')]])}</div>
 <div><h2>Open items added</h2>{table(["#","Item","Source"],[["?18","Chains supported at launch","BIGG / RebelFi"]],["26px",None,"110px"])}</div>
</div></section>"""
pages.append(p6)

# ---------------- PAGE 7: cross-border ----------------
A=[("Canadian sender","CAD bank","plain"),("RebelFi","","reb"),("Netcoins Canada","CA licensed","lic"),("Stablecoin leg","on-chain","chain"),("Balance","US licensed","lic"),("Bank partner","USD virtual acct","teal"),("US recipient","USD bank","plain")]
L=[("INSTRUCTIONS",42,78,'g'),("MONEY PATH",82,226,'t')]
xb=seq(A,L,[
 dict(a=0,b=1,y=62,kind='instr',label='payment: amount, US recipient',num=1),
 dict(a=1,b=4,y=76,kind='instr',label='instruction + matching reference IDs to both licensed entities',num=2),
 dict(a=0,b=2,y=108,kind='money',label='CAD',num=3,mtl=True),
 dict(a=2,b=3,y=130,kind='money',label='CAD → USDC · sent on-chain',num=4),
 dict(a=3,b=4,y=156,kind='money',label='USDC received',num=5),
 dict(a=4,b=5,y=182,kind='money',label='redeem → USD',num=6,mtl=True),
 dict(a=5,b=6,y=208,kind='money',label='USD payout',num=7),
],W=1040,H=236,notes=[(2,'CUSTOMER-OF-RECORD · CA',TEAL),(4,'CUSTOMER-OF-RECORD · US',TEAL),(3,'NO CUSTODIAN',VIOL)],aria="Cross-border: CAD enters Netcoins Canada, becomes USDC on-chain, is received by Balance, redeemed to USD and paid out through the bank partner to the US recipient.")
p7=f"""<section class="page">{hd(7,"Cross-border Canada ↔ United States","two licensed legs, one stablecoin leg")}
<p class="lede">A Canadian-dollar payment settles in US dollars by passing through both licensed entities with a stablecoin leg between them. Each entity handles its own domestic leg; the stablecoin leg in between has no custodian. The reverse runs the same sequence: Balance sends, Netcoins Canada pays out in CAD.</p>
{strip(["Canadian sender funds CAD and names the US recipient","USD arrives in the recipient's account","Reverse: US sender funds USD, CAD arrives in Canada"])}
<div class="fig"><div class="fh">Canada → United States</div><figure>{xb}</figure></div>
<div class="three-col">
 <div>{steps([('instr','Sender creates the payment; RebelFi resolves the recipient to a US payout.'),('instr','RebelFi instructs both licensed entities with matching reference IDs.'),('money','Sender funds CAD with Netcoins Canada '+T('c')+' '+T('mtl')+'.'),('money','Netcoins Canada converts CAD to USDC and sends it on-chain; CCTP if the chains differ.')])}</div>
 <div>{steps([('money','Balance receives the USDC '+T('c')+'.'),('money','Balance redeems to USD into the recipient-side virtual account '+T('mtl')+'.'),('money','Bank partner pays out to the US recipient\'s bank account.')],start=5)}
  <h2 style="margin-top:6px">Custody along the flow</h2>{table(["Stage","Funds held by"],[["CAD leg","Netcoins Canada "+T('c')],["Stablecoin leg","None in flight; wallet-to-wallet "+T('n')],["USD leg","Balance, then bank partner "+T('c')]])}</div>
 <div><h2>Notes</h2><p class="note">The FX rate is set at the CAD → USDC conversion. Timing is dominated by the two domestic legs; the stablecoin leg settles in minutes.</p>
  <h2 style="margin-top:6px">Open items added</h2>{table(["#","Item","Source"],[["?6","Canadian leg: Netcoins Canada custody vs non-custodial path","BIGG / Netcoins"],["?19","Which entity quotes FX and holds the spread","BIGG"],["?20","Onboarding for Canadian senders: existing Netcoins customers vs new","Netcoins"]],["26px",None,"96px"])}</div>
</div></section>"""
pages.append(p7)

# ---------------- PAGE 8: back office ----------------
def block(x,y,w,h,title,sub,cls):
    fill,stroke,tc={'lic':(TEAL2,TEAL,TEAL),'teal':('#fff',TEAL,TEAL),'reb':(VIOL3,VIOL,VIOL),'plain':('#fff',INK,INK)}[cls]
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/>'
    s+=f'<text x="{x+w/2}" y="{y+16}" text-anchor="middle" font-family="{SANS}" font-size="9" font-weight="600" fill="{tc}">{html.escape(title)}</text>'
    if sub: s+=f'<text x="{x+w/2}" y="{y+28}" text-anchor="middle" font-family="{SANS}" font-size="7" fill="{tc}">{html.escape(sub)}</text>'
    return s
def lbl(x,y,text,col=INK,size=7.2,anchor='middle'):
    w=len(text)*size*0.56+8
    x0=x-w/2 if anchor=='middle' else (x-4 if anchor=='start' else x-w+4)
    return f'<rect x="{x0:.1f}" y="{y-size}" width="{w:.1f}" height="{size+4}" fill="#fff" opacity=".92"/><text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{SANS}" font-size="{size}" fill="{col}">{html.escape(text)}</text>'
def ln(x1,y1,x2,y2,kind='money'):
    stroke,dash,mk,w={'money':(TEAL,None,'ah-t',1.6),'instr':(GREY,'1.5 2.5','ah-g',1.1),'fee':(VIOL,'4 3','ah-v',1.2)}[kind]
    da=f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{w}"{da} marker-end="url(#{mk})"/>'
bo='<svg viewBox="0 0 1040 250" role="img" aria-label="Entity-level value flows: Circle supplies USDC to Netcoins Canada, Netcoins USA and Balance; Balance and the bank partner hold the US float; Blockchain Intelligence Group screens every flow; RebelFi, outside the perimeter, orchestrates the licensed entities and bills platform fees, with intercompany service fees between group entities.">'
bo+=f'<rect x="0" y="0" width="1040" height="146" fill="{TEAL3}"/><text x="6" y="12" font-family="{MONO}" font-size="6.5" font-weight="600" fill="{TEAL}" letter-spacing=".08em">REGULATED PERIMETER</text>'
bo+=f'<rect x="0" y="154" width="1040" height="90" fill="{VIOL3}"/><text x="6" y="166" font-family="{MONO}" font-size="6.5" font-weight="600" fill="{VIOL}" letter-spacing=".08em">OUTSIDE THE PERIMETER</text>'
bo+=block(40,40,160,40,"Netcoins Canada","CAD float · CA customers",'lic')
bo+=block(300,40,160,40,"Circle","USDC mint / redeem",'teal')
bo+=block(560,40,160,40,"Netcoins USA","liquidity · OTC",'lic')
bo+=block(820,40,160,40,"Balance","US float · US customers",'lic')
bo+=block(820,100,160,36,"Bank partner","USD virtual accounts",'teal')
bo+=block(40,100,200,36,"Blockchain Intelligence Group","screening · monitoring",'teal')
bo+=ln(300,60,202,60)+lbl(250,52,"mint / redeem, CAD leg")
bo+=ln(460,60,558,60)+lbl(509,52,"mint / redeem at scale")
bo+=ln(720,60,818,60)+lbl(769,52,"USDC to the US float")
bo+=ln(900,82,900,98)+lbl(955,93,"USD ↔ USDC")
bo+=block(430,190,180,44,"RebelFi","orchestration · ledger · fees",'reb')
bo+=ln(470,190,130,82,'fee')+lbl(330,128,"instructions · service fee",VIOL)
bo+=ln(520,190,620,82,'fee')+lbl(600,140,"liquidity at group rate",VIOL)
bo+=ln(570,190,880,82,'fee')+lbl(740,140,"instructions · service fee",VIOL)
bo+=ln(240,118,430,200,'instr')+lbl(300,172,"screening results, every flow",INK2)
bo+=f'<text x="520" y="242" text-anchor="middle" font-family="{MONO}" font-size="6.4" font-weight="600" fill="{VIOL}">CUSTOMER FEES BILLED BY REBELFI · SETTLED TO EACH ENTITY FOR ITS LEG · ASSUMED</text>'
bo+='</svg>'
p8=f"""<section class="page">{hd(8,"Liquidity, settlement and intercompany","current understanding")}
<p class="lede">How value and fees move between the entities behind the flows. This page sets out RebelFi's current understanding as a baseline to align on; every item is assumed until confirmed. {AS}</p>
<div class="fig"><div class="fh">Entity-level value flows</div><figure>{bo}</figure></div>
<div class="three-col" style="grid-template-columns:1.2fr 1fr 1fr">
 <div><h2>Fee capture by flow {AS}</h2>{table(["Flow","Fee","Captured by"],[["On-ramp / off-ramp","Conversion spread or fixed fee","Balance / Netcoins CA for the leg; RebelFi platform fee on top"],["Yield","Platform fee on accrual","RebelFi"],["Escrow and agent payments","Per-transaction fee","RebelFi"],["Cross-chain","Network cost, passed through","—"],["Cross-border","FX spread at conversion","?19"],["Liquidity","USDC at group rate","Netcoins USA"],["Screening","Group service",BIG+", intercompany"]])}</div>
 <div><h2>Settlement and reconciliation {AS}</h2>{table(["Item","Understanding"],[["Fiat legs","Domestic rail timing; T+0 to T+1"],["On-chain legs","Minutes; final on confirmation"],["Reconciliation","Three-way, daily: RebelFi ledger ↔ licensed-entity statements ↔ on-chain"],["Exceptions","Handled by the licensed entity's operations team, with RebelFi tooling"],["Reporting","Per-entity activity reports for compliance and audit; screening records from "+BIG]])}</div>
 <div><h2>Intercompany {AS}</h2>{table(["Item","Understanding"],[["RebelFi's role","Service provider to the licensed entities for orchestration, policy and ledger"],["Licensed entities' role","Customer-of-record, custody and transmission for their legs"],["Screening",BIG+" to RebelFi and the licensed entities"],["Liquidity","Sourced through Netcoins USA for the group"],["Pricing","Set at group level"]])}
  <h2 style="margin-top:6px">Open items added</h2>{table(["#","Item","Source"],[["?21","Intercompany pricing model between RebelFi, "+BIG+" and the licensed entities","BIGG"],["?22","Who operates settlement and exceptions day to day","BIGG"],["?23","Treasury policy for the US float: USD vs USDC holdings","BIGG / Balance"]],["26px",None,"80px"])}</div>
</div></section>"""
pages.append(p8)

# ---------------- PAGE 9: register + build notes ----------------
reg=[
 ("?1","0","US bank partner identity; virtual-account model assumed","BIGG"),
 ("?2","0 · 1","BIGG ↔ Balance relationship: programme/agent or customer — customer-of-record and KYC programme","BIGG / Balance"),
 ("?3","0","Which entity is the Circle counterparty","BIGG"),
 ("?4","0","States outside Balance coverage: geo-restrict or alternate partner","BIGG / Balance"),
 ("?5","0","Placement of the additional merchant-payments technology under evaluation","BIGG"),
 ("?6","0 · 7","Canadian leg: Netcoins Canada custody vs non-custodial path","BIGG / Netcoins"),
 ("?7","1","Customers resident in states not covered by Balance","BIGG / Balance"),
 ("?8","1","Onboarding route for large business customers needing OTC liquidity","BIGG"),
 ("?9","1","Omnibus vs per-user wallets for partners' end users","BIGG / Balance"),
 ("?10","2","Deposit-address model for off-ramps","Balance"),
 ("?11","2","Settlement windows for virtual-account funding and payouts","Bank partner / Balance"),
 ("?12","3","Yield availability to Netcoins Canada customers under existing approvals","Netcoins"),
 ("?13","3","Group treasury balances in treasury mode","BIGG"),
 ("?14","4","Merchant and B2B use cases prioritised for launch","BIGG"),
 ("?15","4","Attestation sources and dispute handling","BIGG / RebelFi"),
 ("?16","5","Agent use cases prioritised: treasury, procurement, agent-to-agent services","BIGG"),
 ("?17","5","Target chain for redeployment of the account and escrow programs","BIGG / RebelFi"),
 ("?18","6","Chains supported at launch","BIGG / RebelFi"),
 ("?19","7 · 8","Which entity quotes FX and holds the spread","BIGG"),
 ("?20","7","Onboarding for Canadian senders","Netcoins"),
 ("?21","8","Intercompany pricing model","BIGG"),
 ("?22","8","Day-to-day settlement and exceptions operations","BIGG"),
 ("?23","8","Treasury policy for the US float","BIGG / Balance"),
]
build=[
 ("Orchestration API and risk-policy engine","Existing","—"),
 ("Yield routing and monitoring","Existing","—"),
 ("Clean wallets and CCTP relay","Existing","—"),
 ("Escrow contracts","Existing","Redeploy"),
 ("Policy-bound agent accounts and agent SDK","Existing","Redeploy"),
 ("Partner sub-ledger (B2B2B)","Existing, partial","S"),
 ("Balance integration: KYC programme, on/off-ramp, deposit addresses","New integration","M"),
 ("Bank partner virtual accounts","New integration","M"),
 ("Netcoins Canada integration: CAD legs","New integration","M"),
 ("Circle / Netcoins USA liquidity","New integration","S"),
 (BIG+" screening at entry points","New integration","S"),
 ("Cross-border orchestration (two-entity instruction and matching)","New","M"),
 ("Settlement, reconciliation and reporting","New","M"),
 ("Agent account: period limits, allowlists, conditional release","New","M"),
]
p9=f"""<section class="page">{hd(9,"Open items and build notes","what is needed to complete the map")}
<p class="lede">Every open item from the preceding pages, with the page it appears on and who holds the answer. Build notes mark what exists today versus integration or new work; sizes are rough.</p>
<div class="two-fig" style="grid-template-columns:1.45fr 1fr">
 <div><h2>Open items register</h2>{table(["#","Page","Item","Source"],[list(r) for r in reg],["26px","40px",None,"110px"])}</div>
 <div><h2>Build notes</h2>{table(["Component","Status","Size"],[list(r) for r in build],[None,"96px","52px"])}
  <p class="note" style="margin-top:6px">Existing components were demonstrated on 18 August. Integrations depend on partner APIs and are sized on the assumption that programme terms (?2) are settled first. Sizes: S — weeks; M — one to two months; subject to partner readiness.</p></div>
</div></section>"""
pages.append(p9)
# ---- extra CSS for new pages
css='''
  .strip{display:flex;gap:6px;align-items:stretch;margin:2px 0}
  .model{border:1px solid var(--rule)}
  .strip .sc{flex:1}
  .strip .sl{font-family:var(--mono);font-size:7.8px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);align-self:center;padding-right:4px}
  .strip .sc{border:1px solid var(--rule);border-radius:3px;padding:4px 8px 4px 26px;position:relative;font-size:9px;background:var(--panel)}
  .strip .sc span{position:absolute;left:7px;top:5px;font-family:var(--mono);font-size:7.5px;font-weight:600;color:var(--ink-2)}
  .two-fig{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:6px}
  .fig{border:1px solid var(--rule);border-radius:3px;overflow:hidden;display:flex;flex-direction:column}
  .fig .fh{padding:4px 8px;background:var(--panel);border-bottom:1px solid var(--rule-2);font-weight:600;font-size:9.8px}
  .fig figure{margin:0;padding:4px 6px 0}
  .fig svg{display:block;width:100%;height:auto}
  .fig .steps{padding:4px 8px 6px}
  .fig .pad{padding:6px 8px}
  .fig h2{margin-left:8px;margin-right:8px}
  .three-col .steps{padding:0}
'''
src=open('flow-of-funds-v1.html').read()
import re as _re
src=_re.sub(r'/\*GEN-CSS-START\*/.*?/\*GEN-CSS-END\*/','/*GEN-CSS-START*/'+css.replace('\\','\\\\')+'/*GEN-CSS-END*/',src,flags=_re.S)
src=_re.sub(r'<!-- GEN START -->.*?<!-- GEN END -->','<!-- GEN START -->\n'+'\n'.join(pages).replace('\\','\\\\')+'\n<!-- GEN END -->',src,flags=_re.S)
open('flow-of-funds-v1.html','w').write(src)
print('pages appended:',len(pages))
