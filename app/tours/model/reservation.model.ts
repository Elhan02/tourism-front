import { Tour } from "./tour.model";
export interface Reservation {
    id: number;
    touristId: number;
    guests: number;
    tourId: number;
    tour?: Tour;
}