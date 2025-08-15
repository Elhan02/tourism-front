import { Restaurant } from "./restaurant.model";

export interface RestaurantReservation{
    id: number,
    touristId: number,
    reservationDate: Date,
    mealType: string,
    numberOfGuests: number,
    restaurantId: number,
    restaurant?: Restaurant
}