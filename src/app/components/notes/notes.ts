import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface NoteEntry {
  key: string;
  value: string;
}

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'notes.html',
  styleUrls: ['notes.css']
})
export class Notes implements OnInit {
  textInput = '';
  notes: NoteEntry[] = [];
  editingIndex: number | null = null; // Track which note is being edited

  constructor(private router: Router) { }

  ngOnInit() {
    this.resetNotesIfFirstDay();
    this.loadNotes();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  submitNote() {
    if (!this.textInput.trim()) return;

    if (this.editingIndex !== null) {
      // Update existing note
      this.notes[this.editingIndex].value = this.textInput.trim();
      this.editingIndex = null;
    } else {
      // Add new note with formatted date key (DD-MM-YYYY)
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const entry: NoteEntry = {
        key: `${day}-${month}-${year}`, // ✅ DD-MM-YYYY
        value: this.textInput.trim()
      };
      this.notes.push(entry);
    }

    this.saveNotes();
    this.textInput = '';
  }

  editNote(index: number) {
    this.textInput = this.notes[index].value;
    this.editingIndex = index;
  }

  deleteNote(index: number) {
    this.notes.splice(index, 1);
    this.saveNotes();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
    const today = new Date();

    if (today.getDate() === 1) {
      localStorage.setItem('isToBeDeleted', JSON.stringify(false));
    } else {
      localStorage.setItem('isToBeDeleted', JSON.stringify(true));
    }
  }

  loadNotes() {
    const stored = localStorage.getItem('notes');
    if (stored) {
      this.notes = JSON.parse(stored);
    }
  }

  // ✅ New: Reset notes if it's the 1st day of the month
  resetNotesIfFirstDay() {
    const today = new Date();
    if (today.getDate() === 1 && JSON.parse(localStorage.getItem('isToBeDeleted')!)) {
      localStorage.setItem('notes', JSON.stringify([]));
    }
  }
}
