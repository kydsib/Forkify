import axios from "axios";
import { key } from "../config";

// kazkaip ateis is SearchView
export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert(`Ants stole the whole food :( try again.`);
    }
  }
  // Asumption that for every three ingredients we need 10 min.
  calcTime() {
    const munIng = this.ingredients.length;
    const periods = Math.ceil(munIng / 3);
    this.time = periods * 10;
  }

  // Picking random number
  calcServings() {
    this.servings = 6;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map(el => {
      // Make units same (tablespoon, tbsp etc.)
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // Parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // Examp. 4 1/2 cups, arrCount is [4, 1/2]
        // eval('4 + 1/2') --> 4.5
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit, but 1st elem is numb
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        // if no unit no number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
}
