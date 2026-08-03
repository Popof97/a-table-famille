function lunchNeed(day){const atHome=2+(!day.dad)+(!day.liam);return atHome+(day.dad?1:0);}
function recomputePlan(){week.forEach((day,index)=>{const next=week[index+1];if(next?.leftover&&day.manualCook){const need=lunchNeed(next),available=Math.max(0,day.cook-4);day.leftovers=available>=need?`${available} portions pour ${days[index+1].split('.')[0].toLowerCase()}`:`${available} portions - il manque ${need-available} pour ${days[index+1].split('.')[0].toLowerCase()}`;}else if(next?.leftover){const portions=lunchNeed(next);day.cook=4+portions;day.leftovers=`${portions} portions pour ${days[index+1].split('.')[0].toLowerCase()}`;}else{day.cook=4;day.leftovers='Aucun reste';}});}
function generateCoherentWeek(){
  if(!recipes.length)return plan.map((day,index)=>({...day,dad:week[index]?.dad??day.dad,liam:week[index]?.liam??day.liam}));
  const choices=[...recipes].sort(()=>Math.random()-.5);
  const presence=week.map(day=>({dad:day.dad,liam:day.liam}));
  const menus=days.map((day,index)=>({lunch:'À planifier',dinner:choices[index%choices.length].id,...presence[index],leftover:false}));
  const built=menus.map(item=>({...item,leftovers:'Aucun reste'}));
  built.forEach((day,index)=>{const next=built[index+1];if(next?.leftover){const portions=lunchNeed(next);day.cook=4+portions;day.leftovers=`${portions} portions pour ${days[index+1].split('.')[0].toLowerCase()}`;}else day.cook=4;});
  return built;
}
if(!week.every(day=>typeof day.cook==='number')){week=generateCoherentWeek();save();renderWeek();shopping();}
document.getElementById('generate-week').addEventListener('click',()=>{if(!recipes.length){document.querySelector('.planner-note').innerHTML='<b>Ajoutez d’abord une recette.</b> Vous pourrez ensuite générer la semaine.';return;}week=generateCoherentWeek();save();renderWeek();shopping();document.querySelector('.planner-note').innerHTML='<b>Nouvelle semaine générée !</b> Les repas et les restes ont été recalculés.';});
