import { Meal } from "./meal.model";
import { RestaurantReview } from "./restaurant.review.model";

export interface Restaurant {
    id: number;
    name: string;
    description: string;
    capacity: number;
    imageUrl: string;
    latitude: number;
    longitude: number;
    status?: string;
    ownerId: number;
    meals?: Meal[];
    averageRating: number;
    restaurantReviews?: RestaurantReview[];
}