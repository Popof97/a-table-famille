const SUPABASE_URL='https://lsjiabifrbebrzxjrcic.supabase.co';
const SUPABASE_KEY='sb_publishable_hd_L9FfA0Niui3ErzriyfQ_q4EZtDnB';
const FAMILY_ID='f2bd9f20-94f2-4b06-b580-33bd7fca0e4a';
const syncStatus=document.createElement('span');
syncStatus.className='sync-status';
syncStatus.textContent='Synchronisation...';
document.querySelector('.topbar').append(syncStatus);
const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'};
let syncing=false,lastRemote='';
function snapshot(){return Object.fromEntries(Object.keys(localStorage).filter(key=>key.startsWith('atable-')).map(key=>[key,localStorage.getItem(key)]));}
function stableJson(value){if(value===null||typeof value!=='object')return JSON.stringify(value);if(Array.isArray(value))return `[${value.map(stableJson).join(',')}]`;return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;}
function applySnapshot(data){Object.entries(data).forEach(([key,value])=>localStorage.setItem(key,value));}
async function pull(){try{const response=await fetch(`${SUPABASE_URL}/rest/v1/family_state?id=eq.${FAMILY_ID}&select=data`,{headers});if(!response.ok)throw new Error();const rows=await response.json();if(!rows.length){syncStatus.textContent='Synchronisation prete';return;}const remote=stableJson(rows[0].data),local=stableJson(snapshot()),alreadyApplied=sessionStorage.getItem('atable-sync-last-applied');if(remote!==lastRemote&&remote!==local){if(alreadyApplied===remote){lastRemote=remote;syncStatus.textContent='Synchronise';return;}syncing=true;sessionStorage.setItem('atable-sync-last-applied',remote);applySnapshot(rows[0].data);lastRemote=remote;syncStatus.textContent='Mise a jour recue';setTimeout(()=>location.reload(),400);return;}lastRemote=remote;syncStatus.textContent='Synchronise';}catch{syncStatus.textContent='Synchronisation a activer';}}
let timer;
function schedulePush(){if(syncing)return;clearTimeout(timer);timer=setTimeout(push,700);}
async function push(){try{const data=snapshot();const response=await fetch(`${SUPABASE_URL}/rest/v1/family_state?on_conflict=id`,{method:'POST',headers:{...headers,Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({id:FAMILY_ID,data,updated_at:new Date().toISOString()})});if(!response.ok)throw new Error();lastRemote=stableJson(data);syncStatus.textContent='Synchronise';}catch{syncStatus.textContent='Synchronisation a activer';}}
const originalSetItem=Storage.prototype.setItem;
Storage.prototype.setItem=function(key,value){originalSetItem.call(this,key,value);if(key.startsWith('atable-'))schedulePush();};
pull();setInterval(pull,12000);
