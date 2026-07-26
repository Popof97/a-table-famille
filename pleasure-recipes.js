const pleasureMeals=['Burgers maison et frites','Nuggets maison et frites','Fish sticks et frites','Hot-dogs et frites','Wrap kebab maison et frites','Tacos doux poulet-fromage','Fajitas douces au poulet','Raclette légère pommes de terre-charcuterie','Gratin de gnocchis jambon-fromage','Crêpes salées jambon-fromage','Soirée sandwichs chauds et frites','Plateau télé maison : croques et frites'];
pleasureMeals.forEach((name,index)=>{const id=`plaisir-${index}`;if(!recipes.some(recipe=>recipe.id===id))recipes.push({id,name,tag:'rapide',image:index%2?'assets/poulet-riz.png':'assets/pates-gratin.png',price:8+index%5,time:25+index%4*10,portions:4,note:'Repas plaisir · frites possibles',ingredients:''});});
const pleasureChip=document.createElement('button');
pleasureChip.className='chip';pleasureChip.textContent='Repas plaisir';
pleasureChip.addEventListener('click',()=>{currentFilter='all';renderRecipes();document.querySelectorAll('.recipe-card').forEach(card=>{card.hidden=!pleasureMeals.includes(card.querySelector('h2').textContent)});document.querySelectorAll('.chip').forEach(chip=>chip.classList.toggle('selected',chip===pleasureChip));});
document.querySelector('.filter-row').append(pleasureChip);
renderRecipes();
