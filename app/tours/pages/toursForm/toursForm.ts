import { TourService } from "../../service/tour.service.js";
import { TourFormData } from "../../model/tourFormData.model.js";
import { Tour } from "../../model/tour.model.js";
import { KeyPointFormData } from "../../model/keyPointFormData.model.js";

const tourService = new TourService();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get("id"));
let currentTour: Tour | null = null;

function Initialize(): void {
  InitializeAvatarOptions();
  
  if (id !== null && !isNaN(id)) {
    tourService
      .getById(id)
      .then((tour: Tour) => {
        if (tour) {
          currentTour = tour;
        }
        InitializeGlobalButtonListeners();
        InitializeGlobalInputListeners();
        InitializeFirstForm();
      })
      .catch(() => {
        console.warn("Tour nije pronađen, pretpostavljamo novi unos.");
      });
  } else {
      InitializeGlobalButtonListeners();
      InitializeGlobalInputListeners();
      InitializeFirstForm();
  }
}

function InitializeAvatarOptions(): void {
    const avatarBtn = document.getElementById('avatarBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutElement = document.querySelector("#logoutBtn");
    const username = document.querySelector('.username') as HTMLElement;
    username.textContent = localStorage.getItem('username');

    avatarBtn.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!avatarBtn.contains(target) && !dropdownMenu.contains(target)) {
            dropdownMenu.style.display = 'none';
        }
  });

    logoutElement.addEventListener("click", function (event) {
        event.stopPropagation();
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
    });

}

function InitializeGlobalButtonListeners(): void {
  const progressElement = document.querySelector(".progress") as HTMLDivElement;
  const circle2 = document.querySelector("#circle2");
  const backBtn = document.querySelector("#backBtn1");
  const nextBtn2 = document.querySelector("#nextBtn2") as HTMLButtonElement;
  const addKPBtn = document.querySelector("#plusKPBtn");
  const form1 = document.querySelector(".step1");
  const form2 = document.querySelector(".step2");

  backBtn.addEventListener("click", function () {
    form2.classList.add("hidden");
    form1.classList.remove("hidden");
    circle2.classList.remove("active");
    progressElement.style.width = '0';
  });

  nextBtn2.disabled = true;
  nextBtn2.addEventListener("click", function () {
    form2.classList.add("hidden");
    InitializeThirdForm(currentTour);
  });

  addKPBtn.addEventListener("click", function () {
    tourService.addKeyPoint(GetKeyPointFormData(), currentTour.id).then(() => {
      tourService.getById(currentTour.id).then((updatedTour) => {
        currentTour = updatedTour;
        RenderSecondFormTable(currentTour);
      });
    });
  });
  
  const saveBtn = document.querySelector("#saveBtn1");
  const nextBtn = document.querySelector("#nextBtn1");

  saveBtn.addEventListener("click", function () {
    const formData = GetTourFormData();

    if (currentTour && currentTour.id) {
      tourService.update(id, formData).then(() => {
        window.location.href = "../userTours/userTours.html";
      });
    } else {
      tourService.add(formData).then(() => {
        window.location.href = "../userTours/userTours.html";
      });
    }
  });

  nextBtn.addEventListener("click", function () {
    const formData = GetTourFormData();

    if (currentTour && currentTour.id) {
      tourService.update(id, formData).then(() => {
        form1.classList.add("hidden");
        InitializeSecondForm(currentTour);
      });
    } else {
      tourService.add(formData).then((tour: Tour) => {
        if (tour) {
          currentTour = tour;
          form1.classList.add("hidden");
          InitializeSecondForm(currentTour);
        } else {
          return;
        }
      });
    }
  });
}

function 
InitializeGlobalInputListeners(): void {
  const saveBtn1 = document.querySelector("#saveBtn1") as HTMLButtonElement;
  const nextBtn1 = document.querySelector("#nextBtn1") as HTMLButtonElement;

  const tourName = document.querySelector('#nameInput') as HTMLInputElement;
  const tourDescription = document.querySelector('#descriptionInput') as HTMLInputElement;
  const tourDate = document.querySelector('#startDateInput') as HTMLInputElement;
  const tourMaxGuests = document.querySelector('#maxGuestsInput') as HTMLInputElement;

  const tourNameError = document.querySelector('#tourNameError');
  const tourDescError = document.querySelector('#tourDescError');
  const tourDateError = document.querySelector('#tourDateError');
  const tourMaxGuestError = document.querySelector('#tourMaxGuestsError');

  let validTourName;
  let validTourDesc;
  let validTourDate;
  let validTourGuests;
      
  tourName.addEventListener('blur', () => {
      const result = validateInput(tourName, {
        required: true,
        minLength: 8,
        maxLength: 30
      });
    

      if (!result.valid) {
        tourNameError.textContent = result.message;
        tourName.classList.add('input-error');
        validTourName = false;
        UpdateButtons1();
      } else {
        tourNameError.textContent = '';
        tourName.classList.remove('input-error');
        validTourName = true;
        UpdateButtons1();
      }   
    });

    
  tourDescription.addEventListener('blur', () => {
    const result = validateInput(tourDescription, {
      required: true,
      minLength: 250,
      maxLength: 1000
    });
    

    if (!result.valid) {
      tourDescError.textContent = result.message;
      tourDescription.classList.add('input-error');
      validTourDesc = false;
      UpdateButtons1();
    } else {
      tourDescError.textContent = '';
      tourDescription.classList.remove('input-error');
      validTourDesc = true;
      UpdateButtons1();
    }
  })

  tourDate.addEventListener('blur', () => {
    const dateValue = new Date(tourDate.value)

    if (isNaN(dateValue.getTime()) || dateValue < new Date()) {
      tourDateError.textContent = 'Date field is invalid.';
      tourDate.classList.add('input-error');
      validTourDate = false;
      UpdateButtons1();
    } else {
      tourDateError.textContent = '';
      tourDate.classList.remove('input-error');
      validTourDate = true;
      UpdateButtons1();
    }
  })

  tourMaxGuests.addEventListener('blur', () => {
    const maxGuestsValue = tourMaxGuests.value.toString().trim();
    if (maxGuestsValue == "") {
      tourMaxGuestError.textContent = 'Max guests field is required.'
      tourMaxGuests.classList.add('input-error');
      validTourGuests = false;
      UpdateButtons1();
    } else if (parseInt(maxGuestsValue) <= 0) {
      tourMaxGuestError.textContent = 'Value needs to be greater than 0.'
      tourMaxGuests.classList.add('input-error');
      validTourGuests = false;
      UpdateButtons1();
    } else {
      tourMaxGuestError.textContent = '';
      tourMaxGuests.classList.remove('input-error');
      validTourGuests = true;
      UpdateButtons1();
    }
  })

  function UpdateButtons1(): void {
  if (!validTourName || !validTourDesc || !validTourDate || !validTourGuests) {
    saveBtn1.disabled = true;
    nextBtn1.disabled = true;
  } else {
    saveBtn1.disabled = false;
    nextBtn1.disabled = false;
  } 
  }

  const addKPBtn = document.querySelector('#plusKPBtn') as HTMLButtonElement;

  const keyPointName = document.querySelector('#KPNameInput') as HTMLInputElement;
  const keyPointDesc = document.querySelector('#KPDescriptionInput') as HTMLInputElement;
  const keyPointImage = document.querySelector('#KPImageInput') as HTMLInputElement;
  const keyPointLatitude = document.querySelector('#KPLatitudeInput') as HTMLInputElement;
  const keyPointLongitude = document.querySelector('#KPLongitudeInput') as HTMLInputElement;

  const keyPointNameError = document.querySelector('#keyPointNameError');
  const keyPointDescError = document.querySelector('#keyPointDescError');
  const keyPointImageError = document.querySelector('#keyPointImageError');
  const keyPointLatitudeError = document.querySelector('#keyPointLatitudeError');
  const keyPointLongitudeError = document.querySelector('#keyPointLongitudeError');

  let validkeyPointName;
  let validKeyPointDesc;
  let validKeyPointImage;
  let validKeyPointLat;
  let validKeyPointLong;

  keyPointName.addEventListener('blur', () => {
      const result = validateInput(keyPointName, {
        required: true,
        minLength: 8,
        maxLength: 30
      });
    

      if (!result.valid) {
        keyPointNameError.textContent = result.message;
        keyPointName.classList.add('input-error');
        validkeyPointName = false;
        UpdateButtons2();
      } else {
        keyPointNameError.textContent = '';
        keyPointName.classList.remove('input-error');
        validkeyPointName = true;
        UpdateButtons2();
      }   
    });

  keyPointDesc.addEventListener('blur', () => {
      const result = validateInput(keyPointDesc, {
        required: true,
        minLength: 8,
        maxLength: 500
      });
    

      if (!result.valid) {
        keyPointDescError.textContent = result.message;
        keyPointDesc.classList.add('input-error');
        validKeyPointDesc = false;
        UpdateButtons2();
      } else {
        keyPointDescError.textContent = '';
        keyPointDesc.classList.remove('input-error');
        validKeyPointDesc = true;
        UpdateButtons2();
      }   
    });

  keyPointImage.addEventListener('blur', () => {
      if (keyPointImage.value.trim() == '') {
        keyPointImageError.textContent = 'This field is required.';
        keyPointName.classList.add('input-error');
        validKeyPointImage = false;
        UpdateButtons2();
      } else {
        keyPointImageError.textContent = '';
        keyPointImage.classList.remove('input-error');
        validKeyPointImage = true;
        UpdateButtons2();
      }   
    });

  keyPointLatitude.addEventListener('blur', () => {
      const latitudeValue = keyPointLatitude.value.toString().trim();
      if (latitudeValue == '') {
        keyPointLatitudeError.textContent = 'This field is required.';
        keyPointLatitude.classList.add('input-error');
        validKeyPointLat = false;
        UpdateButtons2();
      } else {
        keyPointLatitudeError.textContent = '';
        keyPointLatitude.classList.remove('input-error');
        validKeyPointLat = true;
        UpdateButtons2();
      }   
    });

  keyPointLongitude.addEventListener('blur', () => {
      const longitudeValue = keyPointLongitude.value.toString().trim();
      if (longitudeValue == '') {
        keyPointLongitudeError.textContent = 'This field is required.';
        keyPointLongitude.classList.add('input-error');
        validKeyPointLong = false;
        UpdateButtons2();
      } else {
        keyPointLongitudeError.textContent = '';
        keyPointLongitude.classList.remove('input-error');
        validKeyPointLong = true;
        UpdateButtons2();
      }   
    });

    function UpdateButtons2(): void {
      if (!validkeyPointName || !validKeyPointDesc || !validKeyPointImage || !validKeyPointLat || !validKeyPointLong) {
        addKPBtn.disabled = true;
      } else {
        addKPBtn.disabled = false;
      }  
    }
}

function InitializeFirstForm(): void {
  const tourName = document.querySelector('#nameInput') as HTMLInputElement;
  const tourDescription = document.querySelector('#descriptionInput') as HTMLInputElement;
  const tourDate = document.querySelector('#startDateInput') as HTMLInputElement;
  const tourMaxGuests = document.querySelector('#maxGuestsInput') as HTMLInputElement;

  if (currentTour) {
    FillFirstForm(currentTour);

    setTimeout(() => {
    tourName.dispatchEvent(new Event('blur'));
    tourDescription.dispatchEvent(new Event('blur'));
    tourDate.dispatchEvent(new Event('blur'));
    tourMaxGuests.dispatchEvent(new Event('blur'));
    }, 0);
  }
}

function GetTourFormData(): TourFormData | null {
  try {
    const tourName = (document.querySelector("#nameInput") as HTMLInputElement).value;
    const tourDescription = (document.querySelector("#descriptionInput") as HTMLInputElement).value;

    const tourStartDate = new Date(
      (document.querySelector("#startDateInput") as HTMLInputElement).value
    );
    tourStartDate.setHours(tourStartDate.getHours() + 2);

    const tourMaxGuests = (
      document.querySelector("#maxGuestsInput") as HTMLInputElement
    ).value;


    if (
      tourMaxGuests.toString().trim() == "" ||
      tourStartDate.toString().trim() == "Invalid Date"
    ) {
      return null;
    }

    const formData: TourFormData = {
      name: tourName,
      description: tourDescription,
      dateTime: tourStartDate,
      maxGuests: tourMaxGuests,
      guideId: localStorage.getItem("id"),
    };
    return formData;
  } catch (error) {
    console.error("An error occured while validating data: " + error.message);
  }
}

function FillFirstForm(tour: Tour): void {
  (document.querySelector("#nameInput") as HTMLInputElement).value = tour.name;

  (document.querySelector("#descriptionInput") as HTMLInputElement).value =
    tour.description;

  (document.querySelector("#startDateInput") as HTMLInputElement).value =
    tour.dateTime.toString();

  (document.querySelector("#maxGuestsInput") as HTMLInputElement).value =
    tour.maxGuests.toString();
}

function InitializeSecondForm(tour: Tour = null): void {
  const form2 = document.querySelector(".step2");
  const progressElement = document.querySelector('.progress') as HTMLDivElement;
  const circle2 = document.querySelector("#circle2");

  progressElement.style.width = '50%';
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  if (!id) {
    searchParams.set("id", `${tour.id}`);
    const newUrl = window.location.pathname + "?" + searchParams.toString();
    history.replaceState(null, "", newUrl);
  }
  setTimeout(function () {
    circle2.classList.add("active");
  }, 400);
  form2.classList.remove("hidden");

  RenderSecondFormTable(tour);
}

function RenderSecondFormTable(tour: Tour = null): void {
  const emptyTableMsg = document.querySelector('#emptyTable1');
  const nextBtn = document.querySelector('#nextBtn2') as HTMLButtonElement;
  if (tour) {
    emptyTableMsg.className = 'hidden';
    const table = document.querySelector("#keypoints-table");
    table.innerHTML = "";

    if (tour.keyPoints.length > 0) {
    for (const keypoint of tour.keyPoints) {
        const newRow = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.textContent = keypoint.name;
        newRow.appendChild(cell1);

        const cell2 = document.createElement("td");
        cell2.textContent = keypoint.description;
        newRow.appendChild(cell2);

        const cell3 = document.createElement("td");
        cell3.textContent = keypoint.latitude;
        newRow.appendChild(cell3);

        const cell4 = document.createElement("td");
        cell4.textContent = keypoint.longitude;
        newRow.appendChild(cell4);

        const cell5 = document.createElement("td");
        cell5.textContent = keypoint.imageUrl;
        newRow.appendChild(cell5);

        const cell6 = document.createElement("td");
        newRow.appendChild(cell6);
        const deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.classList.add(".tableDelBtn");
        deleteBtn.addEventListener("click", function () {
          tourService.deleteKeyPoint(tour.id, keypoint.id).then(() => {
            tourService.getById(tour.id).then((updatedTour) => {
              currentTour = updatedTour;
              RenderSecondFormTable(currentTour);
            });
          });
        });
        cell6.appendChild(deleteBtn);
        table.appendChild(newRow);
        nextBtn.disabled = false;
      }
    } else {
        emptyTableMsg.classList.remove('hidden');
        nextBtn.disabled = true;
      }
  }
}

function GetKeyPointFormData(): KeyPointFormData {
  try {
    const keyPointName = (
      document.querySelector("#KPNameInput") as HTMLInputElement
    ).value;
    const keyPointDescription = (
      document.querySelector("#KPDescriptionInput") as HTMLInputElement
    ).value;

    const keyPointImage = (
      document.querySelector("#KPImageInput") as HTMLInputElement
    ).value;

    const keyPointLatitude = (
      document.querySelector("#KPLatitudeInput") as HTMLInputElement
    ).value;

    const keyPointLongitude = (
      document.querySelector("#KPLongitudeInput") as HTMLInputElement
    ).value;

    const orderIds:number [] = []; 

    for (const keypoint of currentTour.keyPoints){
      console.log(keypoint);
      orderIds.push(keypoint.order);
    }
    const orderId = getMaxId(orderIds);

    const formData: KeyPointFormData = {
      name: keyPointName,
      description: keyPointDescription,
      order: orderId,
      imageUrl: keyPointImage,
      latitude: keyPointLatitude,
      longtitude: keyPointLongitude,
    };
    return formData;
  } catch (error) {
    console.error("An error occured while validating data: " + error.message);
  }
}

function InitializeThirdForm(tour: Tour = null): void {
  const form3 = document.querySelector(".step3");
  const backBtn = document.querySelector("#backBtn2");
  const publishBtn = document.querySelector('#publishBtn') as HTMLButtonElement;
  const progressElement = document.querySelector(".progress") as HTMLDivElement;
  const circle3 = document.querySelector("#circle3");
  const tourData = document.querySelector('.data');
  const tourDescription = document.querySelector('.description')
  const successPublish = document.querySelector('#succesPublishSpan');

  form3.classList.remove("hidden");
  progressElement.style.width = "100%";
  setTimeout(function () {
    circle3.classList.add("active");
  }, 400);

  backBtn.addEventListener("click", function () {
    form3.classList.add("hidden");
    circle3.classList.remove("active");
    InitializeSecondForm();
  });
  publishBtn.disabled = true;
  if (tour.description.length >= 250 && tour.keyPoints.length > 0 && tour.status === 'u pripremi'){
    publishBtn.disabled = false;
  }

  console.log (`${tour.description.length}        ${tour.keyPoints.length}`);
  

  publishBtn.onclick = () => {
    if (tour.description.length >= 250 && tour.keyPoints.length > 0){
      publishBtn.disabled = true;
      tour.status = 'objavljeno';
      tourService.publishTour(tour.id, tour).then(updatedTour => {
        if (updatedTour.status === 'objavljeno'){
          successPublish.classList.remove('hidden');
        setTimeout(() => {
          window.location.href = '../userTours/userTours.html';
        }, 2000)
        
      }
      });
    
  }
  };

  tourData.innerHTML = `<p><strong>Name:</strong> ${tour.name}</p>
                        <p><strong>Start time:</strong> ${new Date(tour.dateTime).toLocaleString("sv-SE")}</p>
                        <p><strong>Max tourists:</strong> ${tour.maxGuests}</p>`;
  tourDescription.innerHTML = `<h3>Description</h3>
                              <p>${tour.description}</p>`
                              
  ThirdFormTable(tour);

}

function ThirdFormTable(tour: Tour = null): void {
  const emptyTableMsg = document.querySelector('#emptyTable2');
  if (tour) {
    emptyTableMsg.className = 'hidden';
    const table = document.querySelector("#publish-table");
    table.innerHTML = "";

    if (tour.keyPoints.length > 0) {
    for (const keypoint of tour.keyPoints) {
      const newRow = document.createElement("tr");

      const cell1 = document.createElement("td");
      cell1.textContent = keypoint.name;
      newRow.appendChild(cell1);

      const cell2 = document.createElement("td");
      cell2.textContent = keypoint.description;
      newRow.appendChild(cell2);

      const cell3 = document.createElement("td");
      cell3.textContent = keypoint.latitude;
      newRow.appendChild(cell3);

      const cell4 = document.createElement("td");
      cell4.textContent = keypoint.longitude;
      newRow.appendChild(cell4);

      const cell5 = document.createElement("td");
      cell5.textContent = keypoint.imageUrl;
      newRow.appendChild(cell5);
      
      table.appendChild(newRow);
      }
    } else {
        emptyTableMsg.classList.remove('hidden');
    }
  }
}

function validateInput( 
  inputElement: HTMLInputElement,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): { valid: boolean; message: string } {
  const value = inputElement.value.trim();
  const { minLength = 0, maxLength = Infinity, required = false } = options;

  if (required && value === '') {
    return { valid: false, message: 'This field is required.' };
  }

  if (value.length < minLength) {
    return { valid: false, message: `atleast ${minLength} characters.` };
  }

  if (value.length > maxLength) {
    return { valid: false, message: `Maximum length is ${maxLength} characters.` };
  }

  return { valid: true, message: '' };
}

function getMaxId(numbers: number []): number {
  let maxId = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > maxId) {
      maxId = numbers[i];
    }
  }
  return maxId + 1;
}

document.addEventListener("DOMContentLoaded", Initialize);
