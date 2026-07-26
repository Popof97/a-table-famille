const searchBox=document.createElement('input');
searchBox.type='search';
searchBox.id='recipe-search';
searchBox.placeholder='Rechercher une recette : pizza, pâtes, poulet…';
searchBox.setAttribute('aria-label','Rechercher une recette');
document.querySelector('.filter-row').before(searchBox);
function filterRecipeCards(){const query=searchBox.value.trim().toLocaleLowerCase('fr');document.querySelectorAll('.recipe-card').forEach(card=>{card.hidden=query!==''&&!card.textContent.toLocaleLowerCase('fr').includes(query)});}
searchBox.addEventListener('input',filterRecipeCards);
document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>setTimeout(filterRecipeCards,0)));
