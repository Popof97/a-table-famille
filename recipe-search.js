const searchBox=document.createElement('input');
searchBox.type='search';
searchBox.id='recipe-search';
searchBox.placeholder='Rechercher dans vos recettes';
searchBox.setAttribute('aria-label','Rechercher dans vos recettes');
const webButton=document.createElement('button');
webButton.className='button';
webButton.type='button';
webButton.textContent='Chercher sur internet';
const webResults=document.createElement('div');
webResults.id='web-recipe-results';
const searchRow=document.createElement('div');
searchRow.className='recipe-search-row';
searchRow.append(searchBox,webButton);
document.querySelector('.filter-row').before(searchRow,webResults);
function filterRecipeCards(){const query=searchBox.value.trim().toLocaleLowerCase('fr');document.querySelectorAll('.recipe-card').forEach(card=>{card.hidden=query!==''&&!card.textContent.toLocaleLowerCase('fr').includes(query)});}
searchBox.addEventListener('input',filterRecipeCards);
document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>setTimeout(filterRecipeCards,0)));
function mealIngredients(meal){return Array.from({length:20},(_,index)=>{const ingredient=(meal[`strIngredient${index+1}`]||'').trim();const measure=(meal[`strMeasure${index+1}`]||'').trim();return ingredient?`${measure} ${ingredient}`.trim():'';}).filter(Boolean).join('\n');}
function showWebResults(meals){webResults.innerHTML='';if(!meals?.length){webResults.textContent='Aucune recette trouvee. Essaie par exemple pasta, chicken ou pizza.';return;}const title=document.createElement('p');title.className='muted';title.textContent='Resultats internet : choisis une recette a ajouter, puis tu pourras la modifier en francais dans l application.';webResults.append(title);meals.slice(0,6).forEach(meal=>{const card=document.createElement('article');card.className='web-recipe-card';card.innerHTML=`<img src="${meal.strMealThumb}" alt=""><div><strong>${meal.strMeal}</strong><small>${meal.strCategory||'Recette'}</small></div>`;const add=document.createElement('button');add.className='button primary';add.type='button';add.textContent='Ajouter';add.onclick=()=>{const recipe={id:`internet-${meal.idMeal}-${Date.now()}`,name:meal.strMeal,ingredients:mealIngredients(meal),price:10,time:35,portions:4,image:'assets/pates-gratin.png',tag:'rapide',note:'Importee depuis une recette internet - a ajuster',custom:true};recipes.push(recipe);localStorage.setItem('atable-recipes-v2',JSON.stringify(recipes));renderRecipes();filterRecipeCards();webResults.innerHTML='<p class="web-success">Recette ajoutee : clique dessus pour traduire, ajuster les ingredients et les portions.</p>';};card.append(add);webResults.append(card);});}
webButton.addEventListener('click',async()=>{const query=searchBox.value.trim();if(!query){searchBox.focus();searchBox.placeholder='Tape pizza, pasta, chicken...';return;}webButton.disabled=true;webButton.textContent='Recherche...';webResults.textContent='Recherche en cours...';try{const response=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);if(!response.ok)throw new Error();const data=await response.json();showWebResults(data.meals);}catch{webResults.textContent='La recherche internet est indisponible pour le moment. Reessaie plus tard.';}finally{webButton.disabled=false;webButton.textContent='Chercher sur internet';}});
