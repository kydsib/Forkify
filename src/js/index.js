import Search from "./modules/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

// Global state of the app
// - Search Object
// - Current recipe Object
// - Shopping list Object
// - Liked recipes

const state = {};

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

    // 4. Search for recipies
    await state.search.getResults();

    // 5. Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
