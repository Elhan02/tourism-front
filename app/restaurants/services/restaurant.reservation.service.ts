import { RestaurantReservation } from "../models/restaurant.reservation.model";

export class RestaurantReservationService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = "http://localhost:5105/api/reservations";
    }

    getAllByTouristId(touristId: number): Promise<RestaurantReservation[]> {
        return fetch(`${this.apiUrl}?touristId=${touristId}`)
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json();
            })
            .then((reservations: RestaurantReservation[]) => {
                return reservations;
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            })
    }

    deleteReservation(reservationId: number): Promise<void>{
        return fetch(`${this.apiUrl}/${reservationId}`, {method:'DELETE'})
            .then(response => {
                if(!response.ok){
                    throw{status: response.status, message: response.text}
                }
            })
            .catch(error => {
                console.log(`Error: `, error.status)
                throw error;
            });

    }

    getById(reservationId: number): Promise<RestaurantReservation>{
        return fetch(`${this.apiUrl}/${reservationId}`)
        .then(response=>{
            if(!response.ok){
                throw{status: response.status, message: response.text}
            }
            return response.json();
        })
        .then((reservation: RestaurantReservation)=>{
            return reservation;
        })
        .catch(error=>{
            console.log(`Error: `, error.status);
            throw error;
        })
    }
}