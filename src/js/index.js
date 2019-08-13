import axios from 'axios';

async function getResults(query) {
    const key = '298560efeb6876ee6445c8625f6b5f8d';
    try {
        const result = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = result.data.recipes;
        console.log(recipes);
    } catch (error) {
        alert(error);
    }

}

getResults('pizza');