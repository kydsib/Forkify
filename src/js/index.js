import Search from "./modules/Search";
import Recipe from "./modules/Recipe";
import List from "./modules/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

// Global state of the app
// - Search Object
// - Current recipe Object
// - Shopping list Object
// - Liked recipes

const state = {};
/*
--  SEARCH CONTROLLER
*/
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2. Create new search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearSerchResults();
    renderLoader(elements.searchRes);

    try {
      // 4. Search for recipies
      await state.search.getResults();
      // 5. Render results on UI
      clearLoader();

      // 6. Check if there is sutch recipe

      if (state.search.result.length === 0) {
        searchView.noResults(query);
      } else {
        // 7. Render results to the UI
        searchView.renderResults(state.search.result);
      }
    } catch (err) {
      console.log(`Error in recipe search. Please try again!`);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearSerchResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/*
--  RECIPE CONTROLLER
*/
const controlRecipe = async () => {
  // Taking ID from window.location using hash
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe); // need to pass in the parrent so it would know where to load
    // Create new rcp obj
    state.recipe = new Recipe(id);

    // Higlighting selected recipe in search results
    if (state.search) searchView.highlightSelected(id);

    try {
      // Geting rcp data, parcing ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Servings and time calc
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Rendering rcp
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert(`Error in recipe processing!`);
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// //this one is in case user saves page link and opens it directly
// window.addEventListener("load", controlRecipe);

// Puting it to one function
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

// Handling recipe button clicks
elements.recipe.addEventListener("click", e => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
  if (e.target.matches(".btn-decrease, .btn-decrease * ")) {
    // * indicates that children of it are included
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngrdients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase * ")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngrdients(state.recipe);
  }
});
