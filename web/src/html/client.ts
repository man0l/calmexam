// The only JavaScript the site ships: a small inline script (no framework, no bundle).
// - waitlist forms: fetch JSON POST, inline success message (forms still work without JS)
// - practice problems: check answer in the browser, reveal verified answer/steps/pitfalls,
//   "Explain my mistake" -> POST /api/explain, "New set" -> GET /api/problems
// Markup produced by renderProblem() here must mirror problemHtml() in practice.ts.
const js = String.raw`
(function(){
var d=document,L="ABCD";
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function post(u,b){return fetch(u,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(b)}).then(function(r){return r.json().then(function(j){j._s=r.status;return j})})}
d.querySelectorAll("form[data-wl]").forEach(function(f){
  f.addEventListener("submit",function(e){
    e.preventDefault();
    var m=f.querySelector(".msg"),b=f.querySelector("button[type=submit]"),fd=new FormData(f),o={};
    fd.forEach(function(v,k){o[k]=String(v)});
    m.className="msg";m.textContent="Joining…";b.disabled=true;
    post("/api/waitlist",o).then(function(j){
      if(j.ok){m.className="msg ok";m.textContent=j.already?"You're on the list (you were already signed up).":"You're on the list. We'll email you once at launch.";f.reset()}
      else{m.className="msg err";m.textContent=j.error==="invalid_email"?"Please enter a valid email address.":"Something went wrong. Please try again."}
    }).catch(function(){m.className="msg err";m.textContent="Network error. Please try again."}).then(function(){b.disabled=false});
  });
});
function renderProblem(p,i,names){
  var h='<li class="problem" data-id="'+esc(p.id)+'" data-answer="'+p.answerIndex+'">'
  +'<p class="pmeta"><span>Question '+(i+1)+'</span><span aria-hidden="true">·</span><span>'+esc(names[p.topicId]||"")+'</span><span class="lvl">'+["","Warm-up","Core","Stretch"][p.difficulty]+'</span></p>'
  +'<p class="prompt">'+esc(p.prompt)+'</p><div class="choices" role="group" aria-label="Answer choices for question '+(i+1)+'">';
  p.choices.forEach(function(c,k){h+='<button type="button" class="choice" data-i="'+k+'" aria-pressed="false"><span class="l" aria-hidden="true">'+L[k]+'</span><span class="t">'+esc(c)+'</span></button>'});
  h+='</div><p class="fb" aria-live="polite"></p><details class="sol"><summary>Show verified answer and steps</summary>'
  +'<p class="verified"><b>Verified answer:</b> <span>'+L[p.answerIndex]+') '+esc(p.answer)+'</span></p><ol>';
  p.steps.forEach(function(s){h+='<li>'+esc(s)+'</li>'});
  h+='</ol>';
  if(p.pitfalls.length){h+='<div class="pit"><h3>Common pitfalls</h3><ul>';p.pitfalls.forEach(function(s){h+='<li>'+esc(s)+'</li>'});h+='</ul></div>'}
  return h+'</details><div class="explain" hidden><button type="button" class="btn ghost sm" data-explain>Explain my mistake</button><div class="out" aria-live="polite"></div></div></li>';
}
function score(list){
  var s=list.closest("[data-practice]");if(!s)return;var el=s.querySelector(".score");if(!el)return;
  var all=list.querySelectorAll(".problem"),done=0,ok=0;
  all.forEach(function(p){if(p.dataset.done){done++;if(p.dataset.done==="1")ok++}});
  el.textContent=done?ok+" of "+done+" correct":all.length+" questions";
}
d.addEventListener("click",function(e){
  var t=e.target.closest?e.target.closest("button"):null;if(!t)return;
  var p=t.closest(".problem");
  if(t.classList.contains("choice")&&p&&!p.dataset.done){
    var i=+t.dataset.i,a=+p.dataset.answer,ok=i===a,bs=p.querySelectorAll(".choice");
    bs.forEach(function(b,k){b.disabled=true;if(k===a)b.classList.add("good");if(k===i){b.setAttribute("aria-pressed","true");if(!ok)b.classList.add("bad")}});
    p.dataset.done=ok?"1":"0";p.dataset.chosen=bs[i].querySelector(".t").textContent;
    var fb=p.querySelector(".fb");fb.className="fb "+(ok?"ok":"no");
    fb.textContent=ok?"Correct. That matches the verified answer.":"Not quite. The verified answer is "+L[a]+".";
    p.querySelector("details.sol").open=true;
    if(!ok)p.querySelector(".explain").hidden=false;
    score(p.parentNode);return;
  }
  if(t.hasAttribute("data-explain")&&p){
    var out=p.querySelector(".explain .out");t.disabled=true;out.textContent="Looking at your answer…";
    post("/api/explain",{problemId:p.dataset.id,chosen:p.dataset.chosen||""}).then(function(j){
      if(!j.ok)throw 0;
      out.innerHTML=esc(j.explanation)+'<span class="src">'+(j.source==="ai"?"AI explanation, grounded in the verified answer and steps.":"Built from the verified steps and pitfalls.")+'</span>';
    }).catch(function(){out.textContent="Couldn't load an explanation right now. The verified steps above show the full method.";t.disabled=false});
    return;
  }
  if(t.hasAttribute("data-newset")){
    var s=t.closest("[data-practice]"),list=s.querySelector(".problems"),q="exam="+encodeURIComponent(s.dataset.exam)+(s.dataset.topic?"&topic="+encodeURIComponent(s.dataset.topic):"")+"&count="+s.dataset.count+"&seed="+Math.floor(Math.random()*1e9);
    var names={};try{names=JSON.parse(s.dataset.names||"{}")}catch(_){}
    t.disabled=true;
    fetch("/api/problems?"+q).then(function(r){return r.json()}).then(function(j){
      list.innerHTML=j.problems.map(function(p,i){return renderProblem(p,i,names)}).join("");score(list);
      var f=list.querySelector(".choice");if(f)f.focus();
    }).catch(function(){}).then(function(){t.disabled=false});
  }
});
})();
`;

export const CLIENT_JS = js.trim().replace(/\n\s*/g, '\n');
