function lunchNeed(day){
  const atHome=2+(!day.dad)+(!day.liam);
  return atHome+(day.dad?1:0);
}

function recomputePlan(){
  week.forEach((day,index)=>{
    const next=week[index+1];
    if(next?.leftover&&day.manualCook){
      const need=lunchNeed(next),available=Math.max(0,day.cook-4);
      day.leftovers=available>=need?`${available} portions pour ${days[index+1].split('.')[0].toLowerCase()}`:`${available} portions — il manque ${need-available} pour ${days[index+1].split('.')[0].toLowerCase()}`;
    }else if(next?.leftover){
      const portions=lunchNeed(next);
      day.cook=4+portions;
      day.leftovers=`${portions} portions pour ${days[index+1].split('.')[0].toLowerCase()}`;
    }else{day.cook=4;day.leftovers='Aucun reste';}
  });
}

function generateCoherentWeek(){
  const menus=[
    {lunch:'Soupe & tartines',dinner:'r0-7',dad:true,liam:true},
    {lunch:'Restes de gratin',dinner:'r1-15',dad:true,liam:true,leftover:true},
    {lunch:'Restes de poulet',dinner:'r0-9',dad:true,liam:true,leftover:true},
    {lunch:'Restes de lasagnes',dinner:'r0-2',dad:true,liam:true,leftover:true},
    {lunch:'Restes de pâtes',dinner:'r2-14',dad:true,liam:true,leftover:true},
    {lunch:'Déjeuner simple en famille',dinner:'r1-7',dad:false,liam:false},
    {lunch:'Restes de hachis',dinner:'r2-14',dad:false,liam:false,leftover:true}
  ];
  const built=menus.map(item=>({...item,leftovers:'Aucun reste'}));
  built.forEach((day,index)=>{
    const dinnerPeople=4;
    const next=built[index+1];
    if(next?.leftover){
      const portions=lunchNeed(next);
      day.cook=dinnerPeople+portions;
      day.leftovers=`${portions} portions pour ${days[index+1].split('.')[0].toLowerCase()}`;
    }else day.cook=dinnerPeople;
  });
  return built;
}

if(!week.every(day=>typeof day.cook==='number')){
  week=generateCoherentWeek();
  save();
  renderWeek();
  shopping();
}

document.getElementById('generate-week').addEventListener('click',()=>{
  week=generateCoherentWeek();
  save();
  renderWeek();
  shopping();
  document.querySelector('.planner-note').innerHTML='<b>Semaine générée !</b> Chaque reste affiché couvre exactement le déjeuner suivant.';
});
