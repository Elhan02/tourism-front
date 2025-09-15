import { Restaurant } from "./restaurant.model";
import { RestaurantReview } from "./restaurant.review.model";

export interface RestaurantReservation{
    id: number,
    touristId: number,
    reservationDate: Date,
    mealType: string,
    numberOfGuests: number,
    restaurantId: number,
    restaurant?: Restaurant,
    review?: RestaurantReview
}