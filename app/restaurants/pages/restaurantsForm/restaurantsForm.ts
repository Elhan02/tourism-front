import { Meal } from "../../models/meal.model.js";
import { MealFormData } from "../../models/mealFormData.model.js";
import { Restaurant } from "../../models/restaurant.model.js";
import { RestaurantFormData } from "../../models/restaurantForm.data.model.js";
import { MealService } from "../../services/meal.service.js";
import { RestaurantsServices } from "../../services/restaurant.service.js";
import { InitializeAvatarOptions } from "../../../utils/user.avatar.function.js";

const restaurantServices = new RestaurantsServices();
const mealService = new MealService();

const tabs = Array.from(document.querySelectorAll('.tab')) as HTMLElement[];
const step = Array.from(document.querySelectorAll('.step')) as HTMLElement[];
const probgresBar = document.querySelector('.progress') as HTMLElement;

const saveRestaurantBtn = document.querySelector('#saveBtnRestaurant') as HTMLButtonElement;
const saveMealBtn = document.querySelector('#saveBtnMeal') as HTMLButtonElement;

const nextRestaurantBtn = document.querySelector('#nextBtnRestaurant') as HTMLButtonElement;
const nextMealBtn = document.querySelector('#nextBtnMeal') as HTMLButtonElement;

const publishBtn = document.querySelector('#publishBtn') as HTMLButtonElement;
const backBtn = document.querySelector('#backBtn') as HTMLButtonElement;

const restaurantFormHeadings = document.querySelector('#restaurant-headings');

let currentRestaurant: Restaurant = null;

function initializationForm(): void {
    intializeRestaurantValidationListeners()
    intializeMealValidationListeners()
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')

    if (id) {
        restaurantServices.getById(id)
            .then(restaurant => {
                currentRestaurant = restaurant;
                (document.querySelector('#name') as HTMLInputElement).value = restaurant.name;
                (document.querySelector('#description') as HTMLInputElement).value = restaurant.description;
                (document.querySelector('#capacity') as HTMLInputElement).value = restaurant.capacity.toString();
                (document.querySelector('#restaurantImageUrl') as HTMLInputElement).value = restaurant.imageUrl;
                (document.querySelector('#latitude') as HTMLInputElement).value = restaurant.latitude.toString();
                (document.querySelector('#longitude') as HTMLInputElement).value = restaurant.longitude.toString();
                initializationUpdateRestaurantForm()
            })



    } else {

        initializationAddRestaurantForm()
    }
}

function initializationAddRestaurantForm(): void {
    checkRestaurantValidity()
    tabs[0].style.display = "flex";
    probgresBar.style.width = "0%";
    step[0].classList.add('active');
    restaurantFormHeadings.textContent = "Enter new restaurant data";
    nextRestaurantBtn.addEventListener('click', async function () {
        await submitRestaurant();
        tabs[0].style.display = 'none';
        setTimeout(mealFormHandler, 400)
    })
    saveRestaurantBtn.addEventListener('click', function () {
        submitRestaurant();
        window.location.href = '../restaurants/restaurants.html';
    })
}

function initializationUpdateRestaurantForm(): void {
    checkRestaurantValidity()
    tabs[0].style.display = "flex";
    probgresBar.style.width = "0%";
    step[0].classList.add('active');
    restaurantFormHeadings.textContent = "Update restaurant data"
    nextRestaurantBtn.onclick = function () {
        submitRestaurant();
        tabs[0].style.display = 'none';
        mealFormHandler()
    }
    saveRestaurantBtn.addEventListener('click', function () {
        submitRestaurant();
        window.location.href = '../restaurants/restaurants.html';
    })
}

function initializationMealForm(): void {

    checkMealInputValidity()
    tabs[1].style.display = "flex";
    probgresBar.style.width = "50%";
    step[0].classList.add('active');
    step[1].classList.add('active');
    validationMealNextBtn()
    nextMealBtn.onclick = function () {
        tabs[1].style.display = 'none';
        validationMealNextBtn()
        publishingFromHandler()
    }
    saveMealBtn.onclick = function () {
        checkMealInputValidity()
        submitMeal()
        const mealForm = tabs[1] as HTMLFormElement;
        mealForm.reset()
    }
    backBtn.onclick = function () {
        step[1].classList.remove('active');
        tabs[1].style.display = 'none';
        tabs[0].style.display = 'flex';
        probgresBar.style.width = "0%";
    }
}

async function validationMealNextBtn(): Promise<void> {
    const mealCount = await counterMeals();
    if (mealCount === 0 || mealCount < 5) {
        nextMealBtn.disabled = true;
    } else {
        nextMealBtn.disabled = false;
    }
}

function initializationPublishForm(): void {

    tabs[2].style.display = "flex";
    probgresBar.style.width = "100%";
    step[0].classList.add('active');
    step[1].classList.add('active');
    step[2].classList.add('active');
    publishBtn.onclick = function () {
        publishRestaurant();
    }
}

//RESTAURANT FORM

async function submitRestaurant(): Promise<void> {

    const name = (document.querySelector('#name') as HTMLInputElement).value;
    const description = (document.querySelector('#description') as HTMLInputElement).value;
    const capacity = parseInt((document.querySelector('#capacity') as HTMLInputElement).value);
    const restaurantImageUrl = (document.querySelector('#restaurantImageUrl') as HTMLInputElement).value;
    const latitude = parseFloat((document.querySelector('#latitude') as HTMLInputElement).value);
    const longitude = parseFloat((document.querySelector('#longitude') as HTMLInputElement).value);
    const ownerId = parseInt(localStorage.getItem('id'));


    const reqBody: RestaurantFormData = { name, description, capacity, imageUrl: restaurantImageUrl, latitude, longitude, ownerId }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    try {
        if (id) {

            if (!currentRestaurant) {
                currentRestaurant = await restaurantServices.getById(id);
            }

            if (currentRestaurant.status && currentRestaurant.status.trim() === "objavljeno") {
                await restaurantServices.updateWithStatus(id, currentRestaurant);
            }
            else {
                await restaurantServices.update(id, reqBody);
            }

        } else {
            const restaurant = await restaurantServices.create(reqBody);
            currentRestaurant=restaurant;
            const url = new URL(window.location.href);
            url.searchParams.set('id', restaurant.id.toString());
            history.replaceState(null, "", url.toString());
        }
    } catch (error) {
        console.log("Error:", error.status || error);
    }
}

const nameInputElement = (document.querySelector('#name') as HTMLInputElement)
const descriptionInputElement = (document.querySelector('#description') as HTMLInputElement)
const capacityInputElement = (document.querySelector('#capacity') as HTMLInputElement)
const restaurantImageUrlInputElement = (document.querySelector('#restaurantImageUrl') as HTMLInputElement)
const latitudeInputElement = (document.querySelector('#latitude') as HTMLInputElement)
const longitudeInputElement = (document.querySelector('#longitude') as HTMLInputElement)

function intializeRestaurantValidationListeners(): void {

    const warnColor = '#d9534f';
    nameInputElement.addEventListener('blur', () => {
        if (!isNameValid(nameInputElement)) {
            const nameErrorMessage = document.querySelector('#name-errorMessage') as HTMLSpanElement;
            nameErrorMessage.textContent = 'Field is required. Name must be atleast 2 caracter log.';
            nameErrorMessage.style.color = warnColor;
            nameInputElement.classList.add('error')
            checkRestaurantValidity()
        } else {
            const nameErrorMessage = document.querySelector('#name-errorMessage') as HTMLSpanElement;
            nameErrorMessage.textContent = '';
            nameInputElement.classList.remove('error')
            checkRestaurantValidity()
        }
    })
    descriptionInputElement.addEventListener('blur', () => {
        if (!isDescriptionValid(descriptionInputElement)) {
            const descriptionErrorMessage = document.querySelector('#description-errorMessage') as HTMLSpanElement;
            descriptionErrorMessage.textContent = 'Field is required, cannot be empty.';
            descriptionErrorMessage.style.color = warnColor;
            descriptionInputElement.classList.add('error')
            checkRestaurantValidity()
        } else {
            const descriptionErrorMessage = document.querySelector('#description-errorMessage') as HTMLSpanElement;
            descriptionErrorMessage.textContent = '';
            descriptionInputElement.classList.remove('error')
            checkRestaurantValidity()
        }
    })
    capacityInputElement.addEventListener('blur', () => {
        if (!isCapacityValid(capacityInputElement)) {
            const capacityErrorMessage = document.querySelector('#capacity-errorMessage') as HTMLSpanElement;
            capacityErrorMessage.textContent = 'Field is required. Capacity cannot be empty.';
            capacityErrorMessage.style.color = warnColor;
            capacityInputElement.classList.add('error')
            checkRestaurantValidity()

        } else {
            const capacityErrorMessage = document.querySelector('#capacity-errorMessage') as HTMLSpanElement;
            capacityErrorMessage.textContent = '';
            capacityInputElement.classList.remove('error')
            checkRestaurantValidity()
        }
    })
    restaurantImageUrlInputElement.addEventListener('blur', () => {
        if (!isRestaurantImageUrlValid(restaurantImageUrlInputElement)) {
            const restaurantImageUrlErrorMessage = document.querySelector('#restaurantImageUrl-errorMessage') as HTMLSpanElement;
            restaurantImageUrlErrorMessage.textContent = 'Restaurant image is required, cannot be empty.';
            restaurantImageUrlErrorMessage.style.color = warnColor;
            restaurantImageUrlInputElement.classList.add('error')
            checkRestaurantValidity()

        } else {
            const restaurantImageUrlErrorMessage = document.querySelector('#restaurantImageUrl-errorMessage') as HTMLSpanElement;
            restaurantImageUrlErrorMessage.textContent = '';
            restaurantImageUrlInputElement.classList.remove('error')
            checkRestaurantValidity()
        }
    })
    latitudeInputElement.addEventListener('blur', () => {
        if (!isLatitudeValid(latitudeInputElement)) {
            const latitudeUrlErrorMessage = document.querySelector('#latitude-errorMessage') as HTMLSpanElement;
            latitudeUrlErrorMessage.textContent = 'Field is required, Latitude cannot be empty.';
            latitudeUrlErrorMessage.style.color = warnColor;
            latitudeInputElement.classList.add('error')
            checkRestaurantValidity()

        } else {
            const latitudeImageUrlErrorMessage = document.querySelector('#latitude-errorMessage') as HTMLSpanElement;
            latitudeImageUrlErrorMessage.textContent = '';
            latitudeInputElement.classList.remove('error')
            checkRestaurantValidity()
        }
    })
    longitudeInputElement.addEventListener('blur', () => {
        if (!isLongitudeValid(longitudeInputElement)) {
            const longitudeUrlErrorMessage = document.querySelector('#longitude-errorMessage') as HTMLSpanElement;
            longitudeUrlErrorMessage.textContent = 'Field is required, Longitude cannot be empty.';
            longitudeUrlErrorMessage.style.color = warnColor;
            longitudeInputElement.classList.add('error')
            checkRestaurantValidity()

        } else {
            const longitudeImageUrlErrorMessage = document.querySelector('#longitude-errorMessage') as HTMLSpanElement;
            longitudeImageUrlErrorMessage.textContent = '';
            longitudeInputElement.classList.remove('error')
            checkRestaurantValidity()
        }
    })
}

function isNameValid(nameInputElement: HTMLInputElement): boolean {
    return nameInputElement.value.trim().length >= 2;
}
function isDescriptionValid(descriptionInputElement: HTMLInputElement): boolean {
    return descriptionInputElement.value.trim().length >= 2;
}

function isCapacityValid(capacityInputElement: HTMLInputElement): boolean {
    return capacityInputElement.value.trim().length > 0;
}
function isRestaurantImageUrlValid(restaurantImageUrlInputElement: HTMLInputElement): boolean {
    return restaurantImageUrlInputElement.value.trim().length >= 5;
}
function isLatitudeValid(latitudeInputElement: HTMLInputElement): boolean {
    return latitudeInputElement.value.trim().length > 0;
}
function isLongitudeValid(longitudeInputElement: HTMLInputElement): boolean {
    return longitudeInputElement.value.trim().length > 0;
}

function checkRestaurantValidity() {
    if (isNameValid(nameInputElement) && isDescriptionValid(descriptionInputElement) && isCapacityValid(capacityInputElement)
        && isRestaurantImageUrlValid(restaurantImageUrlInputElement) && isLatitudeValid(latitudeInputElement) && isLongitudeValid(longitudeInputElement)) {
        saveRestaurantBtn.disabled = false;
        nextRestaurantBtn.disabled = false;
    } else {
        saveRestaurantBtn.disabled = true;
        nextRestaurantBtn.disabled = true;
    }
}

//MEAL FORM

function mealFormHandler(): void {
    initializationMealForm()
    updateMealTable()
    checkMealInputValidity()
}

function renderMeals(meals: Meal[], restaurant: Restaurant) {
    const table = document.querySelector('table tbody');
    table.innerHTML = '';
    restaurant.meals.forEach(meal => {
        const tableRow = document.createElement('tr')

        const name = document.createElement('td')
        name.textContent = meal.name;
        tableRow.appendChild(name);

        const price = document.createElement('td')
        price.textContent = meal.price.toString();
        tableRow.appendChild(price);

        const ingredients = document.createElement('td')
        ingredients.textContent = meal.ingredients;
        tableRow.appendChild(ingredients);

        const imageUrl = document.createElement('td')
        imageUrl.textContent = meal.imageUrl;
        tableRow.appendChild(imageUrl);

        const buttonCell1 = document.createElement('td')
        const deleteBtn = document.createElement('td')
        deleteBtn.classList.add("deleteBtn")
        deleteBtn.innerHTML = "<i class=\"fa-solid fa-trash\">";
        deleteBtn.onclick = function () {
            deleteMeal(restaurant, meal);
        }
        buttonCell1.appendChild(deleteBtn)
        tableRow.appendChild(buttonCell1)


        table.appendChild(tableRow);
    })
}

function updateMealTable() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')

    restaurantServices.getById(id)
        .then((restaurant: Restaurant) => {
            if (!restaurant.meals || restaurant.meals.length === 0) {
                createNoDataMessage()
                checkMealInputValidity()
            } else {
                renderMeals(restaurant.meals, restaurant)
            }
        })
        .catch(error => {
            console.log(`Error: `, error.status)
        });
}

function createMealFormData(): MealFormData {
    const name = (document.querySelector('#meal-name') as HTMLInputElement).value;
    const price = parseFloat((document.querySelector('#price') as HTMLInputElement).value);
    const ingredients = (document.querySelector('#ingredients') as HTMLInputElement).value;
    const imageUrl = (document.querySelector('#meal-imageUrl') as HTMLInputElement).value ?? '';

    const reqBody: MealFormData = { name, price, ingredients, imageUrl }
    return reqBody
}

function submitMeal(): void {

    const reqBody: MealFormData = createMealFormData()

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    mealService.create(id, reqBody)
        .then(() => {
            mealFormHandler()
            checkMealInputValidity()
        })
        .catch(error => {
            console.log(`Error:`, error.status)
        })
}

function deleteMeal(restaurant: Restaurant, meal: Meal) {
    mealService.delete(restaurant.id.toString(), meal.id.toString())
        .then(() => {
            mealFormHandler();
        })
        .catch(error => {
            console.log(`Error:`, error.status);
        });
}


async function counterMeals(): Promise<number> {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    try {
        const restaurantData: Restaurant = await restaurantServices.getById(id);
        if (restaurantData.meals && Array.isArray(restaurantData.meals)) {
            return restaurantData.meals.length;
        } else {
            return 0
        }
    } catch (error) {
        console.error("Error while counting meals:", error);
        return 0;
    }

}

//VALIDACIJA JELA
const mealNameInputElement = (document.querySelector('#meal-name') as HTMLInputElement);
const priceInputElement = (document.querySelector('#price') as HTMLInputElement);
const ingredientsInputElement = (document.querySelector('#ingredients') as HTMLInputElement);

function isMealNameValid(mealNameInputElement: HTMLInputElement): boolean {
    return mealNameInputElement.value.trim().length >= 2;
}
function isPriceValid(priceInputElement: HTMLInputElement): boolean {
    return priceInputElement.value.trim().length > 0;
}

function isIngredientsValid(ingredientsInputElement: HTMLInputElement): boolean {
    return ingredientsInputElement.value.trim().length > 5;
}


function checkMealInputValidity() {
    const isValid = isMealNameValid(mealNameInputElement) &&
        isPriceValid(priceInputElement) &&
        isIngredientsValid(ingredientsInputElement);

    if (isValid) {
        saveMealBtn.disabled = false;
    } else {
        saveMealBtn.disabled = true;
    }
}

function intializeMealValidationListeners(): void {
    const warnColor = '#d9534f';

    mealNameInputElement.addEventListener('blur', () => {
        if (!isMealNameValid(mealNameInputElement)) {
            const mealNameErrorMessage = document.querySelector('#meal-name-errorMessage') as HTMLSpanElement;
            mealNameErrorMessage.textContent = 'Field is required. Name must be atleast 2 caracter log.';
            mealNameErrorMessage.style.color = warnColor;
            mealNameInputElement.classList.add('error')
            checkMealInputValidity()
        } else {
            const mealNameErrorMessage = document.querySelector('#meal-name-errorMessage') as HTMLSpanElement;
            mealNameErrorMessage.textContent = '';
            mealNameInputElement.classList.remove('error')
            checkMealInputValidity()
        }
    })
    priceInputElement.addEventListener('blur', () => {
        if (!isPriceValid(priceInputElement)) {
            const priceErrorMessage = document.querySelector('#price-errorMessage') as HTMLSpanElement;
            priceErrorMessage.textContent = 'Field is required, Price cannot be empty.';
            priceErrorMessage.style.color = warnColor;
            priceInputElement.classList.add('error')
            checkMealInputValidity()
        } else {
            const priceErrorMessage = document.querySelector('#price-errorMessage') as HTMLSpanElement;
            priceErrorMessage.textContent = '';
            priceInputElement.classList.remove('error')
            checkMealInputValidity()
        }
    })
    ingredientsInputElement.addEventListener('blur', () => {
        if (!isIngredientsValid(ingredientsInputElement)) {
            const ingredientsErrorMessage = document.querySelector('#ingredients-errorMessage') as HTMLTextAreaElement;
            ingredientsErrorMessage.textContent = 'Field is required, ingredients must be at least 5 characters long.';
            ingredientsErrorMessage.style.color = warnColor;
            ingredientsInputElement.classList.add('error')
            checkMealInputValidity()
        } else {
            const ingredientsErrorMessage = document.querySelector('#ingredients-errorMessage') as HTMLTextAreaElement;
            ingredientsErrorMessage.textContent = '';
            ingredientsInputElement.classList.remove('error')
            checkMealInputValidity()
        }
    })
}

function createNoDataMessage(): void {
    const table = document.querySelector('table tbody');
    table.innerHTML = "";
    const tableRow = document.createElement('tr')
    const tableCell = document.createElement('td')
    tableCell.colSpan = 5;
    tableCell.textContent = 'Restaurant doesen\'t have any meals yet';
    tableCell.style.textAlign = 'center';
    tableRow.appendChild(tableCell);
    table.appendChild(tableRow);
}

//PUBLISH FORM


function publishingFromHandler() {
    renderRestaurantAndMeals()
    validationPublishBtn(currentRestaurant)
    initializationPublishForm()
}

function validationPublishBtn(currentRestaurant: Restaurant): void {
    if (currentRestaurant.status.trim() !== "u pripremi") {
        publishBtn.disabled = true;
    }
}


function renderRestaurantAndMeals(): void {

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id');

    restaurantServices.getById(id)
        .then(restaurant => {
            currentRestaurant = restaurant
            const resturantContainer = document.querySelector('#restaurant-card-container');

            const restaurantCard = document.createElement('div');
            restaurantCard.classList.add('restaurant-card');

            const pictureDiv = document.createElement('div');
            pictureDiv.id = 'card-pictureSection';

            const imgElement = document.createElement('img');
            imgElement.src = `${restaurant["imageUrl"]}`;
            imgElement.alt = 'slika restorana';
            pictureDiv.appendChild(imgElement);
            restaurantCard.appendChild(pictureDiv);

            const mainSectionDiv = document.createElement('div');
            mainSectionDiv.id = 'card-mainSection';

            const p1 = document.createElement('p');
            p1.id = 'restaurantName';
            const strong1 = document.createElement('strong');
            strong1.textContent = 'Name: ';
            p1.appendChild(strong1);
            p1.append(restaurant['name']);
            mainSectionDiv.appendChild(p1);

            const p2 = document.createElement('p');
            const strong2 = document.createElement('strong');
            strong2.textContent = 'Description: ';
            p2.appendChild(strong2);
            p2.append(restaurant['description']);
            mainSectionDiv.appendChild(p2);

            const p3 = document.createElement('p');
            const strong3 = document.createElement('strong');
            strong3.textContent = 'Capacity: ';
            p3.appendChild(strong3);
            p3.append(restaurant['capacity'].toString());
            mainSectionDiv.appendChild(p3);

            const p4 = document.createElement('p');
            const strong4 = document.createElement('strong');
            strong4.textContent = 'Latitude: ';
            p4.appendChild(strong4);
            p4.append(restaurant['latitude'].toString());
            mainSectionDiv.appendChild(p4);

            const p5 = document.createElement('p');
            const strong5 = document.createElement('strong');
            strong5.textContent = 'Longitude: ';
            p5.appendChild(strong5);
            p5.append(restaurant['longitude'].toString());
            mainSectionDiv.appendChild(p5);

            const p6 = document.createElement('p');
            const strong6 = document.createElement('strong');
            strong6.textContent = 'Status: ';
            p6.appendChild(strong6);
            p6.append(restaurant['status']);
            mainSectionDiv.appendChild(p6);

            restaurantCard.appendChild(mainSectionDiv);
            resturantContainer.appendChild(restaurantCard);

            const table = document.querySelector('#publish-meals-table tbody');
            table.innerHTML = '';
            restaurant.meals.forEach(meal => {
                const row = document.createElement('tr')
                const keys = ["name", "price", "ingredients", "imageUrl"]
                keys.forEach(key => {
                    const td = document.createElement('td')
                    td.textContent = meal[key].toString()
                    row.appendChild(td)
                })
                table.appendChild(row)
            })
        })
}

const loadingMessage = document.querySelector('#loading-message');
const successMessage = document.querySelector('#success-message');

function showLoadingMessage(): void {
    loadingMessage.classList.remove('hidden')
}
function hideLoadingMessage(): void {
    loadingMessage.classList.add('hidden')
}

function showSucessMessage(): void {
    loadingMessage.classList.add('hidden')
    successMessage.classList.remove('hidden')
}


function publishRestaurant(): void {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')

    try {
        if (id) {
            restaurantServices.getById(id)
                .then(restaurant => {
                    restaurant.status = "objavljeno"
                    showLoadingMessage();
                    setTimeout(() => {
                        if (publishBtn) {
                            publishBtn.disabled = true;
                        }
                        restaurantServices.updateWithStatus(id, restaurant)
                            .then(() => {
                                hideLoadingMessage();
                                showSucessMessage();
                                setTimeout(() => { window.location.href = "../restaurants/restaurants.html" }, 2000)
                            })
                            .catch(error => {
                                hideLoadingMessage();
                                console.log("Error during update:", error.status || error);
                                if (publishBtn) {
                                    publishBtn.disabled = false;
                                }
                            });

                    }, 2000);

                })
                .catch(error => {
                    console.log("Error getting restaurant:", error.status || error);
                });
        }

    } catch (error) {
        console.log("Error:", error.status || error);
    }
}

InitializeAvatarOptions();

document.addEventListener('DOMContentLoaded', function () {
    initializationForm()
})
