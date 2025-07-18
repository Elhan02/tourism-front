import { Meal } from "../../models/meal.model";
import { RestaurantsServices } from "../../services/restaurant.services.js";

const restaurantsService = new RestaurantsServices();

function renderData(): void {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if (id) {
        restaurantsService.getById(id)
            .then(restaurant => {
                const restaurantMainContainer = document.querySelector('#main-container')
                restaurantMainContainer.innerHTML = "";

                const restautrantContainer = document.createElement('div');
                restautrantContainer.id = "restaurant-container";

                // PICTURE SECTION
                const restaurantPictureSection = document.createElement('div');
                restaurantPictureSection.id = "restaurant-picture-section";
                const restaurantImg = document.createElement('img');
                restaurantImg.classList.add("restaurant-img");
                restaurantImg.src = restaurant.imageUrl;
                restaurantImg.alt = "Restaurant picture";
                restaurantPictureSection.appendChild(restaurantImg);

                restautrantContainer.appendChild(restaurantPictureSection);

                // DESCRIPTION SECTION
                const restaurantDescriptionSection = document.createElement('div')
                restaurantDescriptionSection.id = "description-section";


                const restaurantName = document.createElement('h1');
                restaurantName.textContent = restaurant.name;
                restaurantDescriptionSection.appendChild(restaurantName);

                const horizontalLine = document.createElement('div');
                horizontalLine.classList.add('horizontal-line');
                restaurantDescriptionSection.appendChild(horizontalLine);

                const restaurantDescriptionTitle = document.createElement('h3');
                restaurantDescriptionTitle.textContent = "Description:";
                restaurantDescriptionSection.appendChild(restaurantDescriptionTitle);

                const descritpionElement = document.createElement('p');
                descritpionElement.textContent = restaurant.description;
                restaurantDescriptionSection.appendChild(descritpionElement);

                const restaurantCapacityTitle = document.createElement('h3');
                restaurantCapacityTitle.textContent = "Capacity:";
                restaurantDescriptionSection.appendChild(restaurantCapacityTitle);

                const capacityElement = document.createElement('p');
                capacityElement.innerHTML = "<i class=\"fa-solid fa-user\"></i>";
                capacityElement.append(` x ${restaurant.capacity.toString()}`);
                restaurantDescriptionSection.appendChild(capacityElement);

                restautrantContainer.appendChild(restaurantDescriptionSection);

                restaurantMainContainer.appendChild(restautrantContainer);

                // MEAL SECTION
                const mealsContainer = document.createElement('div');
                mealsContainer.id = "meals-container";
                const maelsMenuElement = document.createElement('h1')
                maelsMenuElement.id = "restaurant-menu-title"
                maelsMenuElement.innerHTML = "<i class=\"fa-solid fa-utensils\"></i>"
                maelsMenuElement.append(`  Menu`);
                mealsContainer.appendChild(maelsMenuElement)

                restaurant.meals.forEach((meal: Meal) => {


                    // MEAL CARD SECTION
                    const mealCard = document.createElement('div');
                    mealCard.classList.add('meal-card')

                    //MEAL PICTURE SECTION
                    const mealPictureSectionElement = document.createElement('div');
                    mealPictureSectionElement.classList.add('meal-picture-section');

                    const mealImgElement = document.createElement('img');
                    mealImgElement.classList.add('meal-img');
                    mealImgElement.src = meal.imageUrl;
                    mealImgElement.alt = "Meal Picture";

                    mealPictureSectionElement.appendChild(mealImgElement);
                    mealCard.appendChild(mealPictureSectionElement);

                    //MEAL DECRIPTION SECTION
                    const mealDecriptionSectionElement = document.createElement('div');
                    mealDecriptionSectionElement.classList.add('meal-desription')

                    const mealName = document.createElement('h3');
                    mealName.classList.add('meal-name');
                    mealName.textContent = meal.name;
                    mealDecriptionSectionElement.appendChild(mealName);

                    const mealIngredients = document.createElement('p');
                    mealIngredients.textContent = meal.ingredients;
                    mealDecriptionSectionElement.appendChild(mealIngredients);

                    mealCard.appendChild(mealDecriptionSectionElement);

                    mealsContainer.appendChild(mealCard);
                    restaurantMainContainer.appendChild(mealsContainer);
                })

            })
    }
}

const logout = document.querySelector('#logout');
logout.addEventListener('click', function () {
    handleLogout()
    window.location.href = "../../../users/pages/login/login.html";
})


function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
}

addEventListener("DOMContentLoaded", renderData)