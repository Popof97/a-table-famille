const calendarControls=document.createElement('div');
calendarControls.className='calendar-controls';
calendarControls.innerHTML='<button class="button" id="this-week">Cette semaine</button><button class="button" id="next-week">Semaine prochaine</button>';
document.querySelector('.page-head').append(calendarControls);
let calendarOffset=0;
const today=new Date();
function mondayOf(date){const result=new Date(date);const day=(result.getDay()+6)%7;result.setDate(result.getDate()-day);result.setHours(0,0,0,0);return result;}
function dateFor(offset,index){const monday=mondayOf(today);monday.setDate(monday.getDate()+offset*7+index);return monday;}
function formatDay(date){return new Intl.DateTimeFormat('fr-FR',{weekday:'short',day:'numeric'}).format(date).replace('.','');}
function formatRange(){const first=dateFor(calendarOffset,0),last=dateFor(calendarOffset,6);return `Du ${new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long'}).format(first)} au ${new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long'}).format(last)}`;}
function switchWeek(offset){localStorage.setItem(`atable-plan-week-${calendarOffset}`,JSON.stringify(week));calendarOffset=offset;const saved=JSON.parse(localStorage.getItem(`atable-plan-week-${calendarOffset}`)||'null');week=saved||week.map(day=>({...day}));days.splice(0,days.length,...days.map((_,index)=>formatDay(dateFor(calendarOffset,index))));document.getElementById('week-title').textContent=formatRange();renderWeek();shopping();document.querySelectorAll('.day-column').forEach((column,index)=>{const date=dateFor(calendarOffset,index);column.classList.toggle('today',calendarOffset===0&&date.toDateString()===today.toDateString());});document.getElementById('this-week').classList.toggle('primary',calendarOffset===0);document.getElementById('next-week').classList.toggle('primary',calendarOffset===1);}
document.getElementById('this-week').onclick=()=>switchWeek(0);
document.getElementById('next-week').onclick=()=>switchWeek(1);
switchWeek(0);
