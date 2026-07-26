const SUPABASE_URL='https://lsjiabifrbebrzxjrcic.supabase.co';
const SUPABASE_KEY='sb_publishable_hd_L9FfA0Niui3ErzriyfQ_q4EZtDnB';
const FAMILY_ID='f2bd9f20-94f2-4b06-b580-33bd7fca0e4a';
const syncStatus=document.createElement('span');
syncStatus.className='sync-status';
syncStatus.textContent='Synchronisation…';
document.querySelector('.topbar').append(syncStatus);
const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'};
let syncing=false,lastRemote='';
function snapshot(){return Object.fromEntries(Object.keys(localStorage).filter(key=>key.startsWith('atable-')).map(key=>[key,localStorage.getItem(key)]));}
function applySnapshot(data){Object.entries(data).forEach(([key,value])=>localStorage.setItem(key,value));}
async function pull(){try{const response=await fetch(`${SUPABASE_URL}/rest/v1/family_state?id=eq.${FAMILY_ID}&select=data,updated_at`,{headers});if(!response.ok)throw new Error();const rows=await response.json();if(!rows.length){syncStatus.textContent='Synchronisation prête';return;}const row=rows[0],remote=JSON.stringify(row.data);if(remote!==lastRemote&&remote!==JSON.stringify(snapshot())){syncing=true;applySnapshot(row.data);lastRemote=remote;syncStatus.textContent='Mise à jour reçue';setTimeout(()=>location.reload(),400);}else{lastRemote=remote;syncStatus.textContent='Synchronisé';}}catch{syncStatus.textContent='Synchronisation à activer';}}
let timer;
function schedulePush(){if(syncing)return;clearTimeout(timer);timer=setTimeout(push,700);}
async function push(){try{const data=snapshot();const response=await fetch(`${SUPABASE_URL}/rest/v1/family_state?on_conflict=id`,{method:'POST',headers:{...headers,Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({id:FAMILY_ID,data,updated_at:new Date().toISOString()})});if(!response.ok)throw new Error();lastRemote=JSON.stringify(data);syncStatus.textContent='Synchronisé';}catch{syncStatus.textContent='Synchronisation à activer';}}
const originalSetItem=Storage.prototype.setItem;
Storage.prototype.setItem=function(key,value){originalSetItem.call(this,key,value);if(key.startsWith('atable-'))schedulePush();};
pull();setInterval(pull,12000);
