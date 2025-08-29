import { User } from "../../users/model/user.model";

export interface RestaurantReview{

    id: number,
    rating: number,
    comment: string,
    dateOfReview: Date,
    touristId: number,
    restaurantId: number,
    tourist?: User,
}