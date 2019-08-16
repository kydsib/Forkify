import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearSerchResults = () => {
  elements.searchResultList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((accumulator, cur) => {
      if (accumulator + cur.length <= limit) {
        newTitle.push(cur);
      }
      return accumulator + cur.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

// type : previous or next
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
  <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "prev" ? "left" : "right"
        }"></use>
    </svg>
    
  </button>
`;

const rnederButtons = (page, numResults, resPerPage) => {
  // Using Match.ceil if api would change the number of results it delivers in future
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to the next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both buttons
    button = `
      ${createButton(page, "prev")}
      ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    // Only perevious button
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Current page results
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  //works because slice excludes the end
  recipes.slice(start, end).forEach(renderRecipe);
  // Rendering pagination buttons
  rnederButtons(page, recipes.length, resPerPage);
};
