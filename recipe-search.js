const searchBox=document.createElement('input');
searchBox.type='search';
searchBox.id='recipe-search';
searchBox.placeholder='Rechercher dans vos recettes';
searchBox.setAttribute('aria-label','Rechercher dans vos recettes');
const marmitonButton=document.createElement('button');
marmitonButton.className='button';
marmitonButton.type='button';
marmitonButton.textContent='Chercher sur Marmiton';
const searchRow=document.createElement('div');
searchRow.className='recipe-search-row';
searchRow.append(searchBox,marmitonButton);
document.querySelector('.filter-row').before(searchRow);
function filterRecipeCards(){const query=searchBox.value.trim().toLocaleLowerCase('fr');document.querySelectorAll('.recipe-card').forEach(card=>{card.hidden=query!==''&&!card.textContent.toLocaleLowerCase('fr').includes(query)});}
searchBox.addEventListener('input',filterRecipeCards);
document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>setTimeout(filterRecipeCards,0)));
marmitonButton.addEventListener('click',()=>{const query=searchBox.value.trim();if(!query){searchBox.focus();searchBox.placeholder='Tape ce que tu cherches, par exemple gratin de pates';return;}window.open(`https://www.marmiton.org/recettes/recherche.aspx?aqt=${encodeURIComponent(query)}`,'_blank','noopener');});
