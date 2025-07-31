import { Keypoint } from "../model/keyPoint.model";
import { Tour } from "../model/tour.model";
import { TourFormData } from "../model/tourFormData.model";
import { KeyPointFormData } from "../model/keyPointFormData.model";
import { TourResults } from "../model/TourResults";
import { Reservation } from "../model/reservation.model";

export class TourService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5105/api/tours";
  }

  getAllPublished(orderBy: string = 'Name', orderDirection: string = 'ASC', currentPage: number = 1, toursSize: number = 10): Promise<TourResults> {
    const queryParams = new URLSearchParams({
      orderBy: orderBy,
      orderDirection: orderDirection,
      page: currentPage.toString(),
      pageSize: toursSize.toString()
    });

    const url = `${this.apiUrl}?${queryParams.toString()}`;

    return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw {status: response.status, message: response.text};
          }
          return response.json();
        })
        .then((tours: TourResults) => {
          return tours;
        })
        .catch(error => {
          console.error ('Error:', error.status);
          throw error;
        })
  }

  getAllByGuideId(id: number): Promise<Tour[]> {
    return fetch(`${this.apiUrl}?guideId=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }

        return response.json();
      })
      .then(tours => {
        return tours;
      })
      .catch((error) => {
        console.error("Error:", error.status);
        throw error;
      });
  }

  getById(tourId: number): Promise<Tour> {
    return fetch(`${this.apiUrl}/${tourId}`)
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .catch((error) => {
        console.error(
          "Error occured while trying to get tour. Please try again."
        );
        console.error(`Error: ${error.message}  Status: ${error.status}`);
        throw error;
      });
  }

  add(formData: TourFormData): Promise<Tour> {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error: " + error.status);

        if (error.status && error.status === 400) {
          console.error("Data is invalid");
        } else {
          console.error(
            "An error occured while creating tour. Please try again"
          );
        }
      });
  }

  update(tourId: number, formData: TourFormData): Promise<Tour> {
    return fetch(`${this.apiUrl}/${tourId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error: " + error.status);

        if (error.status && error.status === 400) {
          console.error("Data is invalid");
        } else {
          console.error(
            "An error occured while updating tour. Please try again."
          );
        }
      });
  }

  publishTour(tourId: number, tour:Tour): Promise<Tour> {
    return fetch(`${this.apiUrl}/${tourId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tour)
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error: " + error.status);

        if (error.status && error.status === 400) {
          console.error("Data is invalid");
        } else {
          console.error(
            "An error occured while publishing tour. Please try again."
          );
        }
      });
  }

  delete(tourId: number): Promise<void> {
    return fetch(`${this.apiUrl}/${tourId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
      })
      .catch((error) => {
        console.error(
          "An error occured while deleting user. Please try again."
        );
        console.error(`Error: ${error.message}  Status: ${error.status}`);
      });
  }

  addKeyPoint(formData: KeyPointFormData, tourId:number): Promise<Keypoint> {
      return fetch(`${this.apiUrl}/${tourId}/key-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error: " + error.status);

        if (error.status && error.status === 400) {
          console.error("Data is invalid");
        } else {
          console.error(
            "An error occured while creating keypoint. Please try again"
          );
        }
      });
  }

    deleteKeyPoint(tourId: number ,keyPointId: number): Promise<void> {
    return fetch(`${this.apiUrl}/${tourId}/key-points/${keyPointId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
      })
      .catch((error) => {
        console.error(
          "An error occured while deleting keyPoint. Please try again."
        );
        console.error(`Error: ${error.message}  Status: ${error.status}`);
      });
  }

  getTouristReservations(userId: number): Promise<Reservation[]> {
    return fetch(`${this.apiUrl}/reservations/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
        return response.json();
      })
      .catch((error) => {
        console.error(
          "Error occured while trying to get reservations. Please try again."
        );
        console.error(`Error: ${error.message}  Status: ${error.status}`);
        throw error;
      });
  }

  createReservation(userId: number, guestsCount: number, tourId: number) {
    const data = {
      tourId: tourId,
      touristId: userId,
      guests: guestsCount
    };
    return fetch(`${this.apiUrl}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (!response.ok) {
        throw { status: response.status, message: response.text() };
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error: " + error.status);
      if (error.status && error.status === 400) {
        return error.message;
      } else {
        console.error(
          "An error occured while creating keypoint. Please try again"
        );
      }
    })
  }

  cancelReservation(reservationId: number) {
   return fetch(`${this.apiUrl}/reservations/${reservationId}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw { status: response.status, message: response.text };
        }
      })
      .catch((error) => {
        console.error(
          "An error occured while deleting reservation. Please try again."
        );
        console.error(`Error: ${error.message}  Status: ${error.status}`);
      });
  }
}
