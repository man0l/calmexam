// "Riverstone" design tokens (docs/DESIGN.md). One shared stylesheet, inlined in every page.
const css = String.raw`
:root{--bg:#F4F7F5;--surface:#fff;--inset:#E9EFEC;--border:#DCE5E1;--edge:#CBD8D2;--ink:#10232A;--muted:#52656B;--faint:#8A9A9E;
--primary:#147A6E;--pressed:#0F675C;--pedge:#0B5248;--psoft:#D5EEE7;--amber:#D9962B;--asoft:#FAEBCD;--ok:#2E9466;--oksoft:#DCF2E6;
--bad:#C4553C;--badsoft:#F8E1DA;--night:#0D3A36;--lagedge:#072624;--lagmuted:#9CC9C0;--mint:#8FD8C4;--sand:#F2D9A9;--coral:#F2876A;
--oktext:#217350;--serif:Lexend,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
--sans:Lexend,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--shadow:0 3px 0 var(--edge);
--dots:radial-gradient(rgba(255,255,255,.09) 1.2px,transparent 1.3px) 0 0/16px 16px}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.6 var(--sans);font-variant-numeric:tabular-nums}
img,svg{max-width:100%}
a{color:var(--primary);text-underline-offset:3px}
a:hover{color:var(--pressed)}
:focus-visible{outline:3px solid var(--primary);outline-offset:2px;border-radius:6px}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.12;letter-spacing:-.025em;margin:0 0 .5em}
h1{font-size:clamp(34px,6vw,58px)}h2{font-size:clamp(26px,4vw,38px)}h3{font-size:21px}
p{margin:0 0 1em}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.narrow{max-width:760px}
.skip{position:absolute;left:-999px;top:8px;background:var(--surface);padding:8px 12px;z-index:9}
.skip:focus{left:8px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
header.top{position:sticky;top:0;z-index:5;background:rgba(244,247,245,.92);backdrop-filter:blur(8px);border-bottom:1.5px solid var(--border)}
header.top .wrap{display:flex;align-items:center;gap:16px;height:64px}
.brand{display:flex;align-items:center;gap:10px;font:600 20px var(--serif);letter-spacing:-.02em;color:var(--ink);text-decoration:none}
.brand svg{width:30px;height:30px}
nav.main{margin-left:auto;display:flex;gap:4px;align-items:center}
nav.main a{color:var(--muted);text-decoration:none;font-size:15px;padding:8px 10px;border-radius:10px}
nav.main a:hover{color:var(--ink);background:var(--inset)}
nav.main .btn{color:#fff;padding:0 16px;height:40px;font-size:15px;border-radius:14px}
nav.main .hide-sm{display:none}
@media(min-width:760px){nav.main .hide-sm{display:inline-block}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:56px;padding:0 24px;border:0;border-radius:18px;
background:var(--primary);color:#fff;font:600 17px var(--sans);text-decoration:none;cursor:pointer;box-shadow:0 4px 0 var(--pedge);transition:transform .08s,box-shadow .08s}
.btn:hover{background:var(--pressed);color:#fff}
.btn:active{transform:translateY(4px);box-shadow:0 0 0 var(--pedge)}
.btn.ghost{background:var(--surface);color:var(--primary);border:1.5px solid var(--border);box-shadow:0 4px 0 var(--edge)}
.btn.ghost:hover{background:var(--psoft);color:var(--pressed)}
.btn.sm{height:44px;font-size:15px;padding:0 16px;border-radius:14px}
section{padding:56px 0}
@media(min-width:900px){section{padding:88px 0}}
.eyebrow{display:inline-block;font:600 12px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--primary);margin-bottom:12px}
.lead{font-size:19px;color:var(--muted);max-width:620px}
.muted{color:var(--muted)}.faint{color:var(--muted);font-size:14px}
[id]{scroll-margin-top:80px}
.card{background:var(--surface);border:1.5px solid var(--border);border-radius:24px;padding:24px;box-shadow:var(--shadow)}
.grid{display:grid;gap:20px}
@media(min-width:760px){.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}}
.hero{padding-top:40px}
.hero .wrap{display:grid;gap:40px;align-items:center}
@media(min-width:960px){.hero .wrap{grid-template-columns:1.1fr .9fr}.hero{padding-top:72px}}
.hero h1 em{font-style:normal;color:var(--primary);background:linear-gradient(transparent 62%,var(--mint) 62%,var(--mint) 88%,transparent 88%)}
.stage{position:relative;background:var(--night) var(--dots);border-radius:32px;padding:44px 24px 36px;box-shadow:0 6px 0 var(--lagedge);display:grid;justify-items:center;overflow:hidden}
.stage::after{content:"";position:absolute;left:-10%;right:-10%;bottom:46px;height:60px;border-top:2px solid rgba(143,216,196,.35);border-radius:50%}
.stage .phone{z-index:1}
.stage .stones{position:absolute;left:18px;bottom:30px;display:none;flex-direction:column-reverse;gap:16px;align-items:flex-start;z-index:2}
@media(min-width:600px){.stage .stones{display:flex}}
.stage .stones i{display:block;border-radius:50%;box-shadow:0 4px 0 rgba(0,0,0,.25)}
.stage .stones i:nth-child(1){width:40px;height:18px;background:var(--sand)}.stage .stones i:nth-child(2){width:46px;height:20px;background:var(--mint);margin-left:20px}.stage .stones i:nth-child(3){width:54px;height:24px;background:#fff;margin-left:6px}
.phone img.shot{display:block;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:34px}
.badges{margin-top:28px}
.badges .soon{display:flex;align-items:center;gap:8px;font:600 13px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:0 0 4px}
.badges .soon span{background:var(--psoft);color:var(--pressed);border-radius:999px;padding:2px 10px;letter-spacing:.02em;text-transform:none}
.badges .row{display:flex;flex-wrap:wrap;align-items:center}
.badges a{display:inline-block;border-radius:10px;line-height:0}
.badges .apple{height:40px;width:auto;margin:10px}
.badges .google{height:59.5px;width:auto}
form.wl{display:grid;gap:14px;margin-top:28px;max-width:520px}
.field label,.field legend{display:block;font:600 14px var(--sans);margin-bottom:6px;color:var(--ink)}
.field input[type=email],.field select{width:100%;height:52px;border:1.5px solid var(--border);border-radius:14px;background:var(--surface);
color:var(--ink);font:400 17px var(--sans);padding:0 14px}
.field select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);
background-position:calc(100% - 22px) 23px,calc(100% - 16px) 23px;background-size:6px 6px;background-repeat:no-repeat}
.field input:focus,.field select:focus{border-color:var(--primary);outline:3px solid var(--psoft);outline-offset:0}
.row2{display:grid;gap:14px}
@media(min-width:560px){.row2{grid-template-columns:1fr 1fr}}
fieldset.seg{border:0;padding:0;margin:0;min-width:0}
.seg .opts{display:flex;background:var(--inset);border-radius:14px;padding:4px;gap:4px}
.seg .opts label{flex:1;margin:0;position:relative}
.seg input{position:absolute;opacity:0;inset:0;width:100%;height:100%;margin:0;cursor:pointer}
.seg .opts span{display:flex;align-items:center;justify-content:center;height:44px;border-radius:11px;font:600 15px var(--sans);color:var(--muted)}
.seg input:checked+span{background:var(--surface);color:var(--primary);box-shadow:0 1px 2px rgba(30,42,47,.1)}
.seg input:focus-visible+span{outline:3px solid var(--primary);outline-offset:1px}
.msg{min-height:1.5em;margin:0;font-weight:600}
.msg.ok{color:var(--oktext)}.msg.err{color:var(--bad)}
.thanks{background:var(--oksoft);color:#25603D;border-radius:16px;padding:14px 18px;font-weight:600;margin-top:20px}
.thanks.err{background:var(--badsoft);color:#8E3E2C}
.steps3{counter-reset:s}
.steps3 .card{position:relative;padding-top:64px}
.steps3 .card::before{counter-increment:s;content:counter(s);position:absolute;top:22px;left:24px;width:30px;height:30px;border-radius:999px;
background:var(--psoft);color:var(--pressed);font:600 15px/30px var(--sans);text-align:center}
.band{background:var(--night) var(--dots);color:#E8EEEC}
.band h2,.band h3{color:#fff}.band .lead,.band .muted{color:var(--lagmuted)}
.band .eyebrow{color:var(--mint)}
.gallery{display:grid;grid-auto-flow:column;grid-auto-columns:280px;gap:28px;overflow-x:auto;scroll-snap-type:x mandatory;padding:8px 20px 24px;margin:0 -20px}
@media(min-width:1000px){.gallery{grid-auto-flow:row;grid-template-columns:repeat(3,280px);justify-content:space-between;overflow:visible;margin:0;padding:8px 0}}
.gallery figure{margin:0;scroll-snap-align:center}
.gallery figcaption{margin-top:16px}
.gallery figcaption strong{display:block;font:600 18px var(--serif);color:#fff;letter-spacing:-.01em}
.gallery figcaption span{font-size:15px;color:var(--lagmuted)}
.gallery img{display:block;width:280px;height:auto;border-radius:44px}
/* phone frame + mockups */
.phone{width:280px;height:580px;border-radius:44px;background:#061A18;padding:10px;box-shadow:0 20px 50px rgba(0,0,0,.28);position:relative;flex:none}
.phone::before{content:"";position:absolute;top:20px;left:50%;width:84px;height:24px;margin-left:-42px;background:#061A18;border-radius:999px;z-index:2}
.screen{height:100%;border-radius:34px;background:var(--bg);overflow:hidden;padding:52px 16px 16px;display:flex;flex-direction:column;gap:10px;
font:400 13px/1.4 var(--sans);color:var(--ink);text-align:left}
.screen .st{position:absolute;top:22px;left:36px;font:600 12px var(--sans);color:var(--ink)}
.screen h4{font:600 19px/1.2 var(--sans);margin:2px 0 4px}
.screen .cap{font-size:11px;color:var(--faint)}
.screen .mcard{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px}
.screen .opt{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:10px 12px;font-weight:600}
.screen .opt.sel{background:var(--psoft);border-color:var(--primary);color:var(--pressed)}
.screen .opt.good{background:var(--oksoft);border-color:var(--ok)}
.screen .opt.bad{background:var(--badsoft);border-color:var(--bad)}
.screen .ico{width:32px;height:32px;border-radius:10px;background:var(--inset);display:grid;place-items:center;font:600 12px var(--sans);color:var(--primary);flex:none}
.screen .opt small{display:block;font-weight:400;color:var(--faint);font-size:11px}
.screen .mbtn{margin-top:auto;height:44px;border-radius:14px;background:var(--primary);color:#fff;display:grid;place-items:center;font:600 14px var(--sans)}
.screen .prog{display:flex;gap:4px}.screen .prog i{flex:1;height:5px;border-radius:9px;background:var(--inset)}.screen .prog i.on{background:var(--primary)}
.screen .chips{display:flex;flex-wrap:wrap;gap:6px}.screen .chip{background:var(--psoft);color:var(--pressed);border-radius:999px;padding:3px 10px;font-weight:600;font-size:11px}
.screen ol{margin:0;padding-left:18px}.screen li{margin:2px 0}
.screen .pit{background:var(--inset);border-radius:12px;padding:8px 10px;font-size:12px}
.screen .pro{background:var(--asoft);color:#7A5520;border-radius:999px;padding:2px 8px;font-weight:600;font-size:10px}
.screen .ver{color:var(--oktext);font-weight:600;font-size:12px}
.screen .bub{border-radius:16px;padding:9px 12px;max-width:88%}
.screen .bub.me{align-self:flex-end;background:var(--primary);color:#fff;border-bottom-right-radius:6px}
.screen .bub.ai{background:var(--surface);border:1px solid var(--border);border-bottom-left-radius:6px}
.screen .inp{margin-top:auto;height:40px;border-radius:14px;background:var(--inset);color:var(--faint);display:flex;align-items:center;padding:0 12px}
.screen .week{display:flex;justify-content:space-between}.screen .week span{display:grid;justify-items:center;gap:4px;font-size:11px;color:var(--faint)}
.screen .week b{width:22px;height:22px;border-radius:999px;background:var(--inset);display:block}.screen .week b.on{background:var(--primary)}.screen .week b.now{background:var(--surface);border:2px solid var(--primary)}
.screen .rowx{display:flex;align-items:center;justify-content:space-between;gap:8px}
.hero .phone{margin:0 auto}
@media(min-width:960px){.hero .phone{transform:rotate(2deg)}}
/* practice problems */
.problems{list-style:none;padding:0;margin:0;display:grid;gap:20px}
.problem{background:var(--surface);border:1.5px solid var(--border);border-radius:24px;padding:20px;box-shadow:var(--shadow)}
@media(min-width:760px){.problem{padding:28px}}
.pmeta{font-size:13px;color:var(--muted);margin-bottom:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.pmeta .lvl{color:var(--primary);font-weight:600}
.prompt{font-size:19px;line-height:1.5;margin-bottom:16px;white-space:pre-line}
.choices{display:grid;gap:10px}
@media(min-width:640px){.choices{grid-template-columns:1fr 1fr}}
.choice{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;text-align:left;background:var(--surface);border:1.5px solid var(--border);border-radius:18px;
padding:10px 14px;font:400 17px var(--sans);color:var(--ink);cursor:pointer;font-variant-numeric:tabular-nums;box-shadow:0 4px 0 var(--edge);transition:transform .08s,box-shadow .08s}
.choice:active:not(:disabled){transform:translateY(3px);box-shadow:0 1px 0 var(--edge)}
.choice:hover{border-color:var(--primary)}
.choice .l{flex:none;width:30px;height:30px;border-radius:10px;background:var(--inset);display:grid;place-items:center;font:600 14px var(--sans);color:var(--muted)}
.choice[aria-pressed=true]{background:var(--psoft);border-color:var(--primary)}
.choice.good{background:var(--oksoft);border-color:var(--ok);box-shadow:0 4px 0 var(--oktext)}
.choice.bad{background:var(--badsoft);border-color:var(--bad);box-shadow:0 4px 0 var(--bad)}
.choice.good .l{background:var(--ok);color:#fff}.choice.bad .l{background:var(--bad);color:#fff}
.choice:disabled{cursor:default}
.choice:disabled:hover{border-color:var(--border)}.choice.good:disabled{border-color:var(--ok)}.choice.bad:disabled{border-color:var(--bad)}
.fb{margin:14px 0 0;font-weight:600;min-height:0}
.fb.ok{color:var(--oktext)}.fb.no{color:var(--bad)}
details.sol{margin-top:14px;border-top:1px solid var(--border);padding-top:12px}
details.sol summary{cursor:pointer;color:var(--primary);font-weight:600;list-style-position:inside}
.verified{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;background:var(--oksoft);border-radius:14px;padding:10px 14px;margin:12px 0}
.verified b{color:#25603D}
.sol ol{padding-left:22px;margin:0 0 12px}.sol li{margin:4px 0}
.pit{background:var(--inset);border-radius:14px;padding:12px 16px}
.pit h3{font:600 14px var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 4px}
.pit ul{margin:0;padding-left:20px}
.explain{margin-top:12px}
.explain .out{margin-top:12px;background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px;white-space:pre-line}
.explain .out:empty{display:none}
.explain .src{display:block;font-size:13px;color:var(--muted);margin-top:6px}
.setbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin:0 0 20px}
.score{font-weight:600;color:var(--muted)}
/* content */
.crumbs{font-size:14px;color:var(--muted);margin:24px 0 0}.crumbs a{color:var(--muted)}
.pagehead{padding:24px 0 8px}
.tlinks{display:grid;gap:12px}
@media(min-width:640px){.tlinks{grid-template-columns:1fr 1fr}}
@media(min-width:960px){.tlinks{grid-template-columns:repeat(3,1fr)}}
.tlink{display:block;background:var(--surface);border:1.5px solid var(--border);box-shadow:0 3px 0 var(--edge);border-radius:18px;padding:16px 18px;text-decoration:none;color:var(--ink)}
.tlink:hover{border-color:var(--primary);color:var(--ink)}
.tlink strong{display:block;color:var(--primary)}.tlink span{font-size:15px;color:var(--muted)}
.hubcard{display:flex;flex-direction:column;gap:8px;text-decoration:none;color:var(--ink)}
.hubcard:hover{border-color:var(--primary);color:var(--ink)}
.hubcard .tag{align-self:flex-start;font:600 12px var(--sans);background:var(--psoft);color:var(--pressed);border-radius:999px;padding:3px 10px}
.hubcard .go{margin-top:auto;color:var(--primary);font-weight:600}
.vs{display:grid;gap:20px}
@media(min-width:760px){.vs{grid-template-columns:1fr 1fr}}
.vs ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.vs li{padding-left:28px;position:relative}
.vs li::before{position:absolute;left:0;top:0;font-weight:600}
.vs .them li::before{content:"?";color:var(--faint)}
.vs .us{border-color:var(--primary)}
.vs .us li::before{content:"✓";color:var(--ok)}
.faq details{background:var(--surface);border:1.5px solid var(--border);box-shadow:0 3px 0 var(--edge);border-radius:18px;padding:0 20px;margin-bottom:12px}
.faq summary{cursor:pointer;font-weight:600;padding:18px 0;list-style-position:outside}
.faq details p{color:var(--muted)}
.prose h2{font-size:28px;margin-top:1.6em}.prose ul{padding-left:22px}
.cta{text-align:center}.cta form.wl{margin-left:auto;margin-right:auto;text-align:left}
.cta .badges .row,.cta .badges .soon{justify-content:center}
footer.foot{border-top:1.5px solid var(--border);padding:48px 0 32px;font-size:15px;color:var(--muted)}
footer.foot .cols{display:grid;gap:28px}
@media(min-width:760px){footer.foot .cols{grid-template-columns:1.3fr 1fr 1fr 1fr}}
footer.foot h2{font:600 14px var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--ink);margin-bottom:10px}
footer.foot ul{list-style:none;padding:0;margin:0;display:grid;gap:6px}
footer.foot a{color:var(--muted);text-decoration:none}footer.foot a:hover{color:var(--primary);text-decoration:underline}
footer.foot .legal{margin-top:32px;font-size:13px;color:var(--muted)}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
`;

export const CSS = css.replace(/\n/g, '').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}');
