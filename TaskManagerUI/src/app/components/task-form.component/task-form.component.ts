import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CreateTask, Task, Priority } from '../../models/task.model';

// form komponente für neue tasks erstellen
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // brauche FormsModule für ngModel
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  // event emitter um parent komponente über neue tasks zu informieren
  @Output() taskCreated = new EventEmitter<Task>();

  // form model für two-way data binding
  newTask: CreateTask = {
    title: '',
    description: '',
    priority: Priority.Medium // standard priorität
  };

  // für template zugriff
  Priority = Priority;
  isSubmitting = false; // verhindert doppelte submits
  showForm = false; // toggle für form anzeige

  constructor(private taskService: TaskService) { }

  // form submit handler
  onSubmit(): void {
    // einfache validation
    if (this.newTask.title.trim() === '') {
      alert('Bitte geben Sie einen Titel ein');
      return;
    }

    this.isSubmitting = true;
    
    // task über service erstellen
    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.taskCreated.emit(task); // parent benachrichtigen
        this.resetForm();
        this.isSubmitting = false;
        this.showForm = false; // form verstecken nach erfolgreichem erstellen
      },
      error: (error) => {
        console.error('Error creating task:', error);
        alert('Fehler beim Erstellen der Aufgabe');
        this.isSubmitting = false;
      }
    });
  }

  // form zurücksetzen
  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      priority: Priority.Medium
    };
  }

  // form ein/ausblenden
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm(); // form leeren wenn versteckt
    }
  }
}