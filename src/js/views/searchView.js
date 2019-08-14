import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearSerchResults = () => {
  elements.searchResultList.innerHTML = "";
};
/*
How limitRecipeTitle works: examp. title - "Pasta with tomato sauce and spinach"
title.split = ['Pasta', 'with', 'tomato', 'sauce', 'and', 'spinach']
accumulator (acc): 0 / acc + cur lenght = 5 / newTitle = ['Pasta']
ratas suksis kol sekantis pilnas zodis tilps i 17. Jei pilnas zodis nebetilps
funkcija grazins newTitle val?
*/
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

// recipes gauna visa objekta is idex.js -> searchView.renderResults(state.search.result);
// ir visa ta data paduodama kaip recipes = {}? butu logiska nes parametrus pasiimu per .
export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
