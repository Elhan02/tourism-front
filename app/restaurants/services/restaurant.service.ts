import { Restaurant } from "../models/restaurant.model";
import { RestaurantReservation } from "../models/restaurant.reservation";
import { RestaurantReservationFormData } from "../models/restaurant.reservation.formData.model";
import { RestaurantsResult } from "../models/restaurant.result.model";
import { RestaurantFormData } from "../models/restaurantForm.data.model";


export class RestaurantsServices {

    private apiUrl: string;
    constructor() {
        this.apiUrl = "http://localhost:5105/api/restaurants";
    }

    getAllByOwnerId(ownerId: string): Promise<Restaurant[]> {
        return fetch(`${this.apiUrl}?ownerId=${ownerId}`)
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json();
            })
            .then(restaurants => {
                return restaurants;
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            })
    }

    getById(id: string): Promise<Restaurant> {
        return fetch(`${this.apiUrl}/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json();
            })
            .then((restaurant: Restaurant) => {
                return restaurant;
            })
            .catch(error => {
                console.log(`Error: `, error.status);
                throw error
            })
    }

    getAllPublishRestaurants(orderBy: string = "Name", orderDirection: string = "ASC", currentPage: number = 1, pageSize: number = 10): Promise<RestaurantsResult> {
        const queryParams = new URLSearchParams({
            orderBy: orderBy,
            orderDirection: orderDirection,
            pageSize: pageSize.toString(),
            page: currentPage.toString()
        });

        const url = `${this.apiUrl}?${queryParams.toString()}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json();
            })
            .then((restaurants: RestaurantsResult) => {
                return restaurants
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error
            });
    }


    create(reqBody: RestaurantFormData): Promise<Restaurant> {
        return fetch(this.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json()
            })
            .then((resaturant: Restaurant) => {
                return resaturant;
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            })
    }

    update(id: string, reqBody: RestaurantFormData): Promise<Restaurant> {
        return fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json()
            })
            .then((resaturant: Restaurant) => {
                return resaturant;
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            })
    }

    updateWithStatus(id: string, restaurant: Restaurant): Promise<Restaurant> {
        return fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(restaurant)
        })
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json()
            })
            .then((updatedRestaurant: Restaurant) => {
                return updatedRestaurant
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error
            })
    }

    delete(id: string): Promise<void> {
        return fetch(`${this.apiUrl}/${id}`, { method: "DELETE" })
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            })
    }

    async createRestaurantReservation(id: string, regBody: RestaurantReservationFormData): Promise<RestaurantReservation> {
        const response =  await fetch(`${this.apiUrl}/${id}/reservations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regBody)
        });
            if(!response.ok){
                const errorText = await response.text();
                throw new Error(errorText);
            }
            return await response.json();
    }

}

