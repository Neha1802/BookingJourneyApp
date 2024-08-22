import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookingDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bookJourney';
}
