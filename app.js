let remote = false;
let supabase = null;
try {
  const cfg = await import('./config.js');
  const lib = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabase = lib.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_PUBLISHABLE_KEY);
  remote = !cfg.SUPABASE_URL.includes("YOUR-PROJECT");
} catch(e) {}

const demoLessons=[
 {title:"Simple Present",level:"Pre-2 / A1",course:"english",description:"Rules, examples and everyday use of the simple present.",video_url:"",pdf_url:""},
 {title:"Present Continuous",level:"Pre-2 / A1",course:"english",description:"Actions happening now with clear examples and guided explanation.",video_url:"",pdf_url:""},
 {title:"My Family",level:"Pre-2",course:"english",description:"Speaking practice about family members and useful expressions.",video_url:"",pdf_url:""},
 {title:"Daily Routines",level:"Pre-1",course:"english",description:"Everyday English using usually, sometimes and other routine expressions.",video_url:"",pdf_url:""}
];

export async function loadLessons(){
 if(remote){const {data,error}=await supabase.from('lessons').select('*').eq('published',true).order('created_at',{ascending:false});if(!error&&data)return data;}
 return JSON.parse(localStorage.getItem('etcLessons')||'null')||demoLessons;
}

async function renderLessons(){
 const el=document.querySelector('#lessonGrid'); if(!el)return;
 const lessons=await loadLessons();
 el.innerHTML=lessons.map(l=>`<article class="lesson"><label>${l.level||'ETC LESSON'}</label><h3>${escapeHtml(l.title)}</h3><p>${escapeHtml(l.description||'')}</p><div class="lesson-links">${l.video_url?`<a href="${safe(l.video_url)}" target="_blank">Watch video →</a>`:''}${l.pdf_url?`<a href="${safe(l.pdf_url)}" target="_blank">Open PDF →</a>`:''}</div></article>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function safe(s){return String(s).replace(/"/g,'%22')}

const form=document.querySelector('#registrationForm');
if(form)form.addEventListener('submit',async e=>{
 e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());
 if(remote){const {error}=await supabase.from('registrations').insert(data);if(error){document.querySelector('#regMessage').textContent='Could not submit yet. Please use WhatsApp.';return}}
 else {const rows=JSON.parse(localStorage.getItem('etcRegistrations')||'[]');rows.unshift({...data,created_at:new Date().toISOString()});localStorage.setItem('etcRegistrations',JSON.stringify(rows))}
 form.reset();document.querySelector('#regMessage').textContent='Thank you. Your registration has been received.';
});
document.querySelector('#year').textContent=new Date().getFullYear();
renderLessons();