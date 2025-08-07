import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, UpdateTask, Priority } from '../../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// komponente für einzelne task items - handling von edit, delete, toggle
@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], // DatePipe für datum formatting
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  // props von parent komponente
  @Input() task!: Task; // der anzuzeigende task
  @Output() taskUpdated = new EventEmitter<Task>(); // wenn task geändert wird
  @Output() taskDeleted = new EventEmitter<number>(); // wenn task gelöscht wird

  // state für edit modus
  isEditing = false;
  editTask: UpdateTask = {} as UpdateTask; // copy des tasks für editing
  Priority = Priority; // für template zugriff

  constructor(private taskService: TaskService) { }

  // task completion status umschalten
  toggleComplete(): void {
    const updateTask: UpdateTask = {
      title: this.task.title,
      description: this.task.description,
      isCompleted: !this.task.isCompleted, // status umkehren
      priority: this.task.priority
    };

    this.taskService.updateTask(this.task.id, updateTask).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask); // parent informieren
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Fehler beim Aktualisieren der Aufgabe');
      }
    });
  }

  // edit modus aktivieren
  startEdit(): void {
    this.isEditing = true;
    // copy der aktuellen werte für editing
    this.editTask = {
      title: this.task.title,
      description: this.task.description,
      isCompleted: this.task.isCompleted,
      priority: this.task.priority
    };
  }

  // edit modus abbrechen
  cancelEdit(): void {
    this.isEditing = false;
  }

  // änderungen speichern
  saveEdit(): void {
    // validation
    if (this.editTask.title.trim() === '') {
      alert('Der Titel darf nicht leer sein');
      return;
    }

    this.taskService.updateTask(this.task.id, this.editTask).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask); // parent über änderung informieren
        this.isEditing = false; // edit modus verlassen
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Fehler beim Aktualisieren der Aufgabe');
      }
    });
  }

  // task löschen mit bestätigung
  deleteTask(): void {
    if (confirm(`Möchten Sie die Aufgabe "${this.task.title}" wirklich löschen?`)) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.taskDeleted.emit(this.task.id); // parent über löschung informieren
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Fehler beim Löschen der Aufgabe');
        }
      });
    }
  }

  // helper für priority anzeige
  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return 'Niedrig';
      case Priority.Medium:
        return 'Mittel';
      case Priority.High:
        return 'Hoch';
      default:
        return 'Unbekannt';
    }
  }

  // helper für priority bootstrap klassen
  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return 'success';
      case Priority.Medium:
        return 'warning';
      case Priority.High:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}