import { Component, ChangeDetectionStrategy, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'schedule.html',
  styleUrls: ['schedule.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Schedule implements OnInit {
  jsonData = signal<{ [key: string]: string[] } | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  daysRemaining: string = '';

  objectKeys = Object.keys;

  constructor(private router: Router) {
    effect(() => {
      console.log('JSON Data:', this.jsonData());
      console.log('Loading:', this.loading());
      console.log('Error:', this.error());
    });
  }

  goToNotes() {
    this.router.navigate(['/notes']);
  }

  goToInstructions() {
    this.router.navigate(['/rules-and-targets']);
  }

  ngOnInit() {
    this.fetchData();
    this.setDaysRemaining(new Date('2066-12-31'));
  }

  setDaysRemaining(targetDate: Date): void {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffInMs = targetDate.getTime() - today.getTime();
    const diffInDays = Math.max(0, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)));

    this.daysRemaining = diffInDays.toString();
  }

  async fetchData() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const response = await fetch('schedule.json');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - Could not find data.json.`);
      }

      const data = await response.json();
      this.jsonData.set(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.error.set(e.message);
      } else {
        this.error.set('An unknown error occurred while fetching data.');
      }
      this.jsonData.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
