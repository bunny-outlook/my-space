import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface NoteEntry {
  key: string;
  value: string;
}

interface DaySection {
  title: string;
  storageKey: string;
  baseSchedule: string[];   // <-- Different schedule per section
  data: NoteEntry[];
}

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'day.html',
  styleUrls: ['day.css']
})
export class Day implements OnInit {

  constructor(private router: Router) { }

  dateKey = 'dailyKeyInputsDate';

  // 4 independent sections with different schedules
  sections: DaySection[] = [
    {
      title: 'Weekdays (Normal)',
      storageKey: 'weekdays_normal',
      baseSchedule: [
        '04:00 - 05:00',
        '05:00 - 07:00',
        '07:00 - 08:00',
        '08:00 - 09:00',
        '09:00 - 16:00',
        '16:00 - 17:00',
        '17:00 - 17:30',
        '17:30 - 18:30',
        '18:30 - 19:00',
        '19:00 - 20:00',
        '20:00 - 23:00',
        '23:00 - 04:00'
      ],
      data: []
    },
    {
      title: 'Weekends (Normal)',
      storageKey: 'weekend_normal',
      baseSchedule: [
        '04:00 - 05:00',
        '05:00 - 07:00',
        '07:00 - 08:00',
        '08:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 19:00',
        '19:00 - 21:00',
        '21:00 - 22:00',
        '22:00 - 23:00',
        '23:00 - 04:00'
      ],
      data: []
    },
    {
      title: 'Weekdays (Night Shift)',
      storageKey: 'weekdays_night_shift',
      baseSchedule: [
        '03:30 - 09:30',
        '09:30 - 10:30',
        '10:30 - 11:00',
        '11:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 19:00',
        '19:00 - 20:00',
        '20:00 - 03:00',
        '03:00 - 03:30'
      ],
      data: []
    },
    {
      title: 'Weekends (Night Shift)',
      storageKey: 'weekend_night_shift',
      baseSchedule: [
        '03:30 - 09:30',
        '09:30 - 10:30',
        '10:30 - 11:00',
        '11:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 19:00',
        '19:00 - 20:00',
        '20:00 - 03:00',
        '03:00 - 03:30'
      ],
      data: []
    }
  ];

  ngOnInit() {
    this.checkDailyReset();
    this.initSections();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  // Reset every day
  checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem(this.dateKey);

    if (storedDate !== today) {
      this.sections.forEach(s => {
        localStorage.removeItem(s.storageKey);
      });

      localStorage.setItem(this.dateKey, today);
    }
  }

  // Initialize all sections
  initSections() {
    this.sections.forEach(section => {
      section.data = this.createBase(section.baseSchedule);
      this.loadSection(section);
    });
  }

  // Create schedule for specific section
  private createBase(schedule: string[]): NoteEntry[] {
    return schedule.map(time => ({
      key: time,
      value: ''
    }));
  }

  // Load section data
  loadSection(section: DaySection) {
    const saved = localStorage.getItem(section.storageKey);

    if (!saved) return;

    const parsed: NoteEntry[] = JSON.parse(saved);

    if (!Array.isArray(parsed)) return;

    section.data = section.data.map((item, i) => ({
      key: item.key,
      value: parsed[i]?.value || ''
    }));
  }

  // Save section
  saveSection(section: DaySection) {
    localStorage.setItem(
      section.storageKey,
      JSON.stringify(section.data)
    );
  }

  // Clear one item
  clearItem(section: DaySection, index: number) {
    section.data[index].value = '';
    this.saveSection(section);
  }
}