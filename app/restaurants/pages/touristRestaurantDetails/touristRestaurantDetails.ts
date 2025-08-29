import { Meal } from "../../models/meal.model";
import { RestaurantReservationService } from "../../services/restaurant.reservation.service.js";
import { RestaurantsServices } from "../../services/restaurant.service.js";
import { RestaurantReservationFormData } from "../../models/restaurant.reservation.formData.model.js";
import { RestaurantReservation } from "../../models/restaurant.reservation.model.js";
import { InitializeAvatarOptions } from "../../../../dist/utils/user.avatar.function.js"
import { Restaurant } from "../../models/restaurant.model";
import { RestaurantReviewService } from "../../services/restaurant.review.service.js";
import { RestaurantReview } from "../../models/restaurant.review.model";

const restaurantsService = new RestaurantsServices();
const restaurantReservationService = new RestaurantReservationService();
const restaurantReviewService = new RestaurantReviewService();

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

                const butttonContainer = document.createElement('div');
                butttonContainer.classList.add('reserve-container');
                const reserveBtn = document.createElement('button');
                reserveBtn.id = "reserveBtn";
                reserveBtn.textContent = "Reserve";

                const modalInputForm = document.querySelector('#reservation-intput-form') as HTMLFormElement;
                reserveBtn.onclick = function () {
                    const reservationInputModal = document.querySelector(".modal") as HTMLDivElement;
                    modalInputForm.reset();
                    const errorMessage = document.querySelector('#reservationDate-errorMessage') as HTMLSpanElement;
                    errorMessage.textContent = '';
                    reservationInputModal.style.display = "flex";
                    checkValidity();
                }

                HandleReservationData();

                HandleReservationInputModal();

                butttonContainer.appendChild(reserveBtn);
                restaurantDescriptionSection.appendChild(butttonContainer);

                restautrantContainer.appendChild(restaurantDescriptionSection);

                restaurantMainContainer.appendChild(restautrantContainer);

                // MEAL SECTION
                RenderMeals(restaurant, restaurantMainContainer);

                //Reviews Section

                renderReviews(restaurant, restaurantMainContainer);

            })
    }

    function renderReviews(restaurant: Restaurant, restaurantMainContainer: Element, sortBy: string = "DateOfReview") {
        let reviewContainer = document.querySelector("#review-container") as HTMLDivElement;
        // reviewContainer.innerHTML="";

        if (!reviewContainer) {
            reviewContainer = document.createElement("div");
            reviewContainer.id = "review-container";
            restaurantMainContainer.appendChild(reviewContainer);
        }

        const reviewContainerTitle = document.createElement('h1');
        reviewContainerTitle.id = "reviews-title";
        reviewContainerTitle.textContent = "Reviews";
        reviewContainer.appendChild(reviewContainerTitle);

        const selectionContainer = document.createElement('div');
        selectionContainer.id = "view-option-section";

        const orderByListLabel = document.createElement('label');
        orderByListLabel.htmlFor = "SortBy";
        orderByListLabel.textContent = "Sort By:  ";
        selectionContainer.appendChild(orderByListLabel);

        const orderByList = document.createElement("select");
        orderByList.id = "SortBy";

        const option1 = document.createElement("option");
        option1.value = "DateOfReview";
        option1.textContent = "Date of review";
        orderByList.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = "Rating";
        option2.textContent = "Rating";
        orderByList.appendChild(option2);

        orderByList.value = sortBy;

        selectionContainer.appendChild(orderByList);

        reviewContainer.appendChild(selectionContainer);
        restaurantReviewService.getAllByRestaurantIdSorted(restaurant.id, sortBy)
            .then((reviews: RestaurantReview[]) => {
                if (!(reviews.length == 0)) {
                    reviews.forEach(review => {
                        const reviewCard = document.createElement('div');
                        reviewCard.classList.add('review-card');
                        
                        const userSection = document.createElement('div');
                        userSection.classList.add("user-section");

                        const username = document.createElement('h3');
                        username.classList.add("tourist-username");
                        username.textContent = review.tourist.username;
                        userSection.appendChild(username);

                        reviewCard.appendChild(userSection);

                        const reviewSection = document.createElement('div');
                        reviewSection.classList.add("review-section");

                        const rating = document.createElement('p');
                        rating.classList.add("rating");
                        rating.textContent = review.rating.toFixed(2);
                        reviewSection.appendChild(rating);

                        const reviewComment = document.createElement('p');
                        reviewComment.textContent = review.comment;
                        reviewSection.appendChild(reviewComment);

                        const dateOfReview = document.createElement('p')
                        dateOfReview.textContent = (new Date(review.dateOfReview)).toDateString();
                        reviewSection.appendChild(dateOfReview);
                        reviewCard.appendChild(reviewSection);

                        reviewContainer.appendChild(reviewCard);
                    });
                }else{
                        const noReviewsMessage = document.createElement('h3');
                        noReviewsMessage.id = "no-reviews-message";
                        noReviewsMessage.textContent = "This restaurant hasn’t received any reviews so far.";
                        reviewContainer.appendChild(noReviewsMessage);
                }
            })

        orderByList.addEventListener("change", () => {
            reviewContainer.innerHTML = "";
            renderReviews(restaurant, restaurantMainContainer, orderByList.value);
        })
    }
}


const mealTypeInput = document.querySelector("#mealType") as HTMLSelectElement;
const reservationDateInput = document.querySelector("#reservationDate") as HTMLInputElement;
const numberOfGuestsInput = document.querySelector("#number-of-guests") as HTMLInputElement;

const confirmReservationBtn = document.querySelector('#confirmReservationBtn') as HTMLButtonElement;

function HandleReservationInputModal() {
    const closeElement = document.querySelector('.close') as HTMLSpanElement;
    const reservationInputModal = document.querySelector(".modal") as HTMLDivElement;
    const reservationInputModalContext = document.querySelector(".input-modal-content") as HTMLDivElement;

    reservationInputModal.onclick = function () {
        reservationInputModal.style.display = "none";
    };

    reservationInputModalContext.onclick = (e) => {
        e.stopPropagation();
    };

    closeElement.onclick = function () {
        reservationInputModal.style.display = "none";
    };
}

function HandleReservationData() {
    const confirmReservationBtn = document.querySelector('#confirmReservationBtn') as HTMLButtonElement;
    confirmReservationBtn.onclick = function () {
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get('id');

        const resultModal = document.querySelector('.modal2') as HTMLDivElement;
        const resultModalText = document.querySelector('#modal-text') as HTMLParagraphElement;
        const resultModalContent = document.querySelector('.result-modal-content') as HTMLDivElement;

        const reqBody: RestaurantReservationFormData = getReservationData();

        (async () => {
            try {
                const restaurantReservation = await restaurantsService.createRestaurantReservation(restaurantId, reqBody);
                resultModal.style.display = 'flex';
                resultModalContent.classList.remove('error');
                const reservationDay = new Date(restaurantReservation.reservationDate).getUTCDate();
                const reservationMonth = new Date(restaurantReservation.reservationDate).getMonth() + 1;
                const reservationYear = new Date(restaurantReservation.reservationDate).getFullYear();
                resultModalText.textContent = `You successfully created restaurant reservation for ${restaurantReservation.mealType} on ${reservationDay}.${reservationMonth}.${reservationYear}.`;
                setTimeout(() => {
                    resultModal.style.display = 'none';
                }, 4000);
            } catch (error: unknown) {
                resultModal.style.display = 'flex';
                resultModalContent.classList.add('error');
                if (error instanceof Error) {
                    resultModalText.textContent = error.message;
                    setTimeout(() => {
                        resultModal.style.display = 'none';
                    }, 4000);
                } else {
                    resultModalText.textContent = "An unknown error occurred.";
                    setTimeout(() => {
                        resultModal.style.display = 'none';
                    }, 4000);
                }
            }
        })();

    };
}

function RenderMeals(restaurant: Restaurant, restaurantMainContainer: Element) {
    const mealsContainer = document.createElement('div');
    mealsContainer.id = "meals-container";
    const maelsMenuElement = document.createElement('h1');
    maelsMenuElement.id = "restaurant-menu-title";
    maelsMenuElement.innerHTML = "<i class=\"fa-solid fa-utensils\"></i>";
    maelsMenuElement.append(`  Menu`);
    mealsContainer.appendChild(maelsMenuElement);

    restaurant.meals.forEach((meal: Meal) => {


        // MEAL CARD SECTION
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');

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
        mealDecriptionSectionElement.classList.add('meal-desription');

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
    });
}

function getReservationData(): RestaurantReservationFormData {

    const touristId = parseInt(localStorage.getItem("id"));

    const mealType = (mealTypeInput.value).trim().toLowerCase();
    const reservationDate = new Date(reservationDateInput.value);


    if (mealType === 'breakfast') {
        reservationDate.setUTCHours(8, 0, 0)
    } else if (mealType === 'lunch') {
        reservationDate.setUTCHours(13, 0, 0)
    } else if (mealType === 'dinner') {
        reservationDate.setUTCHours(18, 0, 0)
    }
    const numberOfGuests = parseInt(numberOfGuestsInput.value);
    checkValidity()
    const reservationReqBody: RestaurantReservationFormData = { touristId, mealType, reservationDate, numberOfGuests }
    return reservationReqBody;
}

function isMealTypeValid(mealType: HTMLSelectElement): boolean {
    return mealType.value.trim().length !== 0;
}

function isReservationDateValid(reservationDate: HTMLInputElement): boolean {
    return new Date(reservationDate.value) >= new Date()
}

function isNumberOfGuestsValid(numberOfGuests: HTMLInputElement): boolean {
    return !isNaN(parseInt(numberOfGuests.value));
}

function checkValidity(): void {
    if (isMealTypeValid(mealTypeInput) && isReservationDateValid(reservationDateInput) && isNumberOfGuestsValid(numberOfGuestsInput)) {
        confirmReservationBtn.disabled = false;
    } else {
        confirmReservationBtn.disabled = true;
    }
}

mealTypeInput.addEventListener('blur', () => {
    checkValidity();
})
reservationDateInput.addEventListener('blur', () => {
    const errorMessage = document.querySelector('#reservationDate-errorMessage') as HTMLSpanElement;
    if (!isReservationDateValid(reservationDateInput)) {
        const errorMessage = document.querySelector('#reservationDate-errorMessage') as HTMLSpanElement;
        errorMessage.style.color = '#d9534f';
        errorMessage.textContent = "Reservation date cannot be in the past.";
        checkValidity();
    } else {
        errorMessage.textContent = '';
        checkValidity();
    }
})

numberOfGuestsInput.addEventListener('blur', () => {
    checkValidity();
})


InitializeAvatarOptions();

addEventListener("DOMContentLoaded", renderData)