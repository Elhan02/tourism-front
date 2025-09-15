import { RestaurantReviewFormData } from "../models/restaurant.review.from.data.model";
import { RestaurantReview } from "../models/restaurant.review.model";

export class RestaurantReviewService {
    private readonly apiUrl: string;
    constructor() {
        this.apiUrl = "http://localhost:5105/api/restaurants";
    }

    getAllByRestaurantIdSorted(restaurantId: number, orderBy: string = "DateOfReview"): Promise<RestaurantReview[]> {
        const queryParams = new URLSearchParams({
            orderBy: orderBy
        });

        const url = `${this.apiUrl}/${restaurantId}/reviews?${queryParams.toString()}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json();
            })
            .then((reviews: RestaurantReview[]) => {
                return reviews;
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            });
    }

    create(restaurantId: number, reqBody: RestaurantReviewFormData): Promise<RestaurantReview>{
        return fetch(`${this.apiUrl}/${restaurantId}/reviews`,{
            method: "POST",
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(reqBody)
        })
        .then(response=>{
            if(!response.ok){
                throw{status: response.status, message: response.text}
            }
            return response.json();
        })
        .then((review: RestaurantReview)=>{
            return review;
        })
        .catch(error=>{
            console.log(`Error: `, error.status)
            throw error;
        })
    }
}