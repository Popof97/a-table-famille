function lunchNeed(day){const atHome=2+(!day.dad)+(!day.liam);return atHome+(day.dad?1:0);}
function recomputePlan(){week.forEach((day,index)=>{const next=week[index+1];if(next?.leftover&&day.manualCook){const need=lunchNeed(next),available=Math.max(0,day.cook-4);day.leftovers=available>=need?`${available} portions pour ${days[index+1].split('.')[0].toLowerCase()}`:`${available} portions - il manque ${need-available} pour ${days[index+1].split('.')[0].toLowerCase()}`;}else if(next?.leftover){const portions=lunchNeed(next);day.cook=4+portions;day.leftovers=`${portions} portions pour ${days[index+1].split('.')[0].toLowerCase()}`;}else{day.cook=4;day.leftovers='Aucun reste';}});}
function generateCoherentWeek(){
  const pizza=recipes.find(recipe=>recipe.name.toLocaleLowerCase('fr').includes('pizza maison'))||recipes.find(recipe=>recipe.id==='r2-14')||recipes[0];
  const choices=recipes.filter(recipe=>recipe.id!==pizza.id&&(recipe.tag==='xxl'||recipe.tag==='gamelle')).sort(()=>Math.random()-.5);
  const selected=choices.slice(0,6);while(selected.length<6)selected.push(choices[selected.length%choices.length]||recipes[selected.length]);
  const presence=week.map(day=>({dad:day.dad,liam:day.liam}));
  const menus=[
    {lunch:'Soupe et tartines',dinner:selected[0].id,...presence[0],leftover:true},
    {lunch:`Restes de ${selected[0].name.toLocaleLowerCase('fr')}`,dinner:selected[1].id,...presence[1],leftover:true},
    {lunch:`Restes de ${selected[1].name.toLocaleLowerCase('fr')}`,dinner:selected[2].id,...presence[2],leftover:true},
    {lunch:`Restes de ${selected[2].name.toLocaleLowerCase('fr')}`,dinner:selected[3].id,...presence[3],leftover:true},
    {lunch:`Restes de ${selected[3].name.toLocaleLowerCase('fr')}`,dinner:selected[4].id,...presence[4]},
    {lunch:'Dejeuner simple en famille',dinner:selected[5].id,...presence[5],leftover:true},
    {lunch:`Restes de ${selected[5].name.toLocaleLowerCase('fr')}`,dinner:pizza.id,...presence[6]}
  ];
  const built=menus.map(item=>({...item,leftovers:'Aucun reste'}));
  built.forEach((day,index)=>{const next=built[index+1];if(next?.leftover){const portions=lunchNeed(next);day.cook=4+portions;day.leftovers=`${portions} portions pour ${days[index+1].split('.')[0].toLowerCase()}`;}else day.cook=4;});
  return built;
}
if(!week.every(day=>typeof day.cook==='number')){week=generateCoherentWeek();save();renderWeek();shopping();}
document.getElementById('generate-week').addEventListener('click',()=>{week=generateCoherentWeek();save();renderWeek();shopping();document.querySelector('.planner-note').innerHTML='<b>Nouvelle semaine generee !</b> Les repas et les restes changent, sauf votre pizza maison du dimanche soir.';});
