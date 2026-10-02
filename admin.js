import {loadLessons} from './app.js';
let remote=false,supabase=null;
try{const cfg=await import('./config.js');const lib=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');supabase=lib.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_PUBLISHABLE_KEY);remote=!cfg.SUPABASE_URL.includes("YOUR-PROJECT")}catch(e){}
document.querySelector('#backendStatus').textContent=remote?'Cloud backend connected':'Demo mode — local browser storage';

async function lessons(){return await loadLessons()}
async function render(){
 const ls=await lessons();document.querySelector('#lessonCount').textContent=ls.length;
 document.querySelector('#lessonAdminList').innerHTML=ls.map((l,i)=>`<div class="admin-row"><div><b>${l.title}</b><small>${l.level||''} · ${l.course||''}</small></div>${remote?'':`<button onclick="window.deleteDemo(${i})" class="tiny danger">Delete</button>`}</div>`).join('');
 let regs=[];
 if(remote){const r=await supabase.from('registrations').select('*').order('created_at',{ascending:false});regs=r.data||[]}
 else regs=JSON.parse(localStorage.getItem('etcRegistrations')||'[]');
 document.querySelector('#regCount').textContent=regs.length;
 document.querySelector('#registrationList').innerHTML=regs.map(r=>`<div class="admin-row"><div><b>${r.name||''}</b><small>${r.phone||''} · ${r.program||''} · ${r.level||''}</small><small>${r.goal||''}</small></div></div>`).join('')||'<p>No registrations yet.</p>';
}
document.querySelector('#lessonForm').addEventListener('submit',async e=>{
 e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());
 if(remote){const {error}=await supabase.from('lessons').insert({...d,published:true});if(error){alert(error.message);return}}
 else {const ls=JSON.parse(localStorage.getItem('etcLessons')||'[]');ls.unshift({...d,published:true,created_at:new Date().toISOString()});localStorage.setItem('etcLessons',JSON.stringify(ls))}
 e.target.reset();await render();
});
window.deleteDemo=async i=>{const ls=JSON.parse(localStorage.getItem('etcLessons')||'[]');ls.splice(i,1);localStorage.setItem('etcLessons',JSON.stringify(ls));render()};
render();