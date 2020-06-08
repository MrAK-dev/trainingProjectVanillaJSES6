import { elements, elementStrings } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active');
  });

  document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add('results__link--active');
};

/*
How reduce works:
// 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle =['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle =['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle =['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle =['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle =['Pasta', 'with', 'tomato']
 */
export const limitRecipeTitle = (title, limit = 15) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    // return the result
    return `${newTitle.join()} ...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
                <img src="https://spoonacular.com/recipeImages/${
                  recipe.image
                }" alt="${recipe.title}">
            </figure>
             <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">It takes about ${
                  recipe.readyInMinutes
                } minutes to cook</p>
             </div>
        </a>
    </li>
    `;

  elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
  <button class="${elementStrings.btnInline} results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
<span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
        type === 'prev' ? 'left' : 'right'
      }"></use>
    </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // Both buttons
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

//Pagination logic emplemented here.
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
