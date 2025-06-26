const searchbox = document.querySelector('.searchbox');
const searchbtn = document.querySelector('.searchbtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContainer = document.querySelector('.recipe-details-container');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Fetch recipes from API
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Searching recipes...</h2>";

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        recipeContainer.innerHTML = ''; 

        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');

                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <h3>${meal.strMeal}</h3>
                    <p>${meal.strArea}</p>
                    <p>${meal.strCategory}</p>
                `;

                const button = document.createElement('button');
                button.textContent = "View Recipe";
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                recipeDiv.appendChild(button);
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = `<h2>No recipes found.</h2>`;
        }
    } catch (error) {
        recipeContainer.innerHTML = `<p>Error fetching recipes. Please try again later.</p>`;
        console.error("Fetch error:", error);
    }
};


const getIngredientsList = (meal) => {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

const openRecipePopup = (meal) => {
    recipeDetailsContainer.innerHTML = `
        <h2 class="recipename">${meal.strMeal}</h2>
        <h3 class="ingredientheading">Ingredients:</h3>
        <ul class="Ingredientlist">${getIngredientsList(meal)}</ul>
        <h3>Instructions:</h3>
        <p class="recipeinstruction">${meal.strInstructions}</p>
    `;

    recipeDetailsContainer.parentElement.style.display = "block";
};

searchbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchbox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = '<h2>Please type a meal name in the search box.</h2>';
        return;
    }
    fetchRecipes(searchInput);
});

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContainer.parentElement.style.display = "none";
});
