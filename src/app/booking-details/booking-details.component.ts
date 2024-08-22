import {
  Component,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import intlTelInput from 'intl-tel-input';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BookingDetailsComponent {
  @ViewChild('timePicker') timePicker: NgxMaterialTimepickerComponent | null =
    null;

  @ViewChild('phoneInput', { static: false }) phoneInput!: ElementRef;

  selectedDate: Date = new Date();
  selectedTime: string = this.getCurrentTime();
  minDate: Date = new Date();
  bookingForm: FormGroup;
  emailAddress: any;
  phoneNumber: string = '';
  fName: string = '';
  lName: string = '';

  private mapboxToken =
    'pk.eyJ1IjoibmVoYXAxODAyIiwiYSI6ImNtMDR3ajRqazBid3Mya3F6Y3Y1MzYxc3cifQ.t3nHNiugq4oLWhy7Grj-9A';

  passengers: number = 0;
  luggage: number = 0;
  childSeat: any;
  notes: string = '';
  passengerList: any = [];

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      selectedDate: [
        new Date(),
        [Validators.required, this.dateValidator.bind(this)],
      ],
      selectedTime: [this.selectedTime, Validators.required],
    });
  }

  ngAfterViewInit() {
    const iti = intlTelInput(this.phoneInput.nativeElement, {
      initialCountry: 'auto',
      separateDialCode: true,
      utilsScript: 'assets/utils.js',
    });
    this.phoneInput.nativeElement.addEventListener('input', () => {
      this.validatePhoneNumber(iti);
    });

    mapboxgl.accessToken = this.mapboxToken;

    // Create the map
    const map = new mapboxgl.Map({
      container: 'map', // ID of the container element
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.9851, 40.7411], // Initial center of the map (coordinates)
      zoom: 12, // Initial zoom level
    });

    // Check when the map is loaded
    map.on('load', () => {
      console.log('Map loaded successfully');
    });

    // Error handling
    map.on('error', (e) => {
      console.error('Map error:', e);
    });
  }

  validatePhoneNumber(iti: any) {
    const countryData = iti.getSelectedCountryData();
    const dialCode = countryData?.dialCode || '';
    const maxLength = this.getPhoneMaxLength(dialCode);

    const cursorPosition = this.phoneInput.nativeElement.selectionStart;
    const currentValue = this.phoneInput.nativeElement.value;

    if (currentValue.length > maxLength) {
      this.phoneInput.nativeElement.value = currentValue.slice(0, maxLength);
    }

    // Restore cursor position
    this.phoneInput.nativeElement.selectionStart = cursorPosition;
    this.phoneInput.nativeElement.selectionEnd = cursorPosition;

    // Validate the phone number
    if (!iti.isValidNumber()) {
      this.phoneInput.nativeElement.setCustomValidity(
        'Please enter a valid phone number',
      );
    } else {
      this.phoneInput.nativeElement.setCustomValidity('');
    }
  }

  getPhoneMaxLength(dialCode: any): number {
    const standardPhoneLength = 10;
    return standardPhoneLength;
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Apply the filter to disable past dates
  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };
  // Custom date validator
  dateValidator(control: any): { [key: string]: boolean } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (control.value && new Date(control.value) < today) {
      return { invalidDate: true };
    }
    return null;
  }
  // Open the time picker
  openTimePicker() {
    if (this.timePicker) {
      this.timePicker.open();
    }
  }
  // Update the selected time
  onTimeChange(event: any) {
    this.bookingForm.patchValue({ selectedTime: event });
  }

  createPassenger() {
    const passenger = {
      firstName: this.fName,
      lastName: this.lName,
      mobileNumber: this.phoneNumber,
      email: this.emailAddress,
      passengers: this.passengers,
      luggage: this.luggage,
      childSeat: this.childSeat,
      notes: this.notes,
    };
    this.passengerList.push(passenger);
    this.clearForm();
  }

  readPassenger() {
    console.log(this.passengerList);
  }

  updatePassenger() {
    // Implement logic to update a passenger from the list
  }

  deletePassenger() {
    // Implement logic to delete a passenger from the list
  }

  clearForm() {
    this.fName = '';
    this.lName = '';
    this.phoneNumber = '';
    this.emailAddress = '';
    this.passengers = 0;
    this.luggage = 0;
    this.childSeat = false;
    this.notes = '';
  }
  increasePassengers() {
    if (this.passengers < 10) {
      this.passengers++;
    }
  }

  decreasePassengers() {
    if (this.passengers > 1) {
      this.passengers--;
    }
  }

  increaseLuggage() {
    if (this.luggage < 10) {
      this.luggage++;
    }
  }

  decreaseLuggage() {
    if (this.luggage > 0) {
      this.luggage--;
    }
  }
  childSEat() {
    
  }
}
