import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task, UpdateTask, Priority } from '../../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();

  isEditing = false;
  editTask: UpdateTask = {} as UpdateTask;
  Priority = Priority;

  constructor(private taskService: TaskService) { }

  toggleComplete(): void {
    const updateTask: UpdateTask = {
      title: this.task.title,
      description: this.task.description,
      isCompleted: !this.task.isCompleted,
      priority: this.task.priority
    };

    this.taskService.updateTask(this.task.id, updateTask).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Fehler beim Aktualisieren der Aufgabe');
      }
    });
  }

  startEdit(): void {
    this.isEditing = true;
    this.editTask = {
      title: this.task.title,
      description: this.task.description,
      isCompleted: this.task.isCompleted,
      priority: this.task.priority
    };
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (this.editTask.title.trim() === '') {
      alert('Der Titel darf nicht leer sein');
      return;
    }

    this.taskService.updateTask(this.task.id, this.editTask).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask);
        this.isEditing = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('Fehler beim Aktualisieren der Aufgabe');
      }
    });
  }

  deleteTask(): void {
    if (confirm(`Möchten Sie die Aufgabe "${this.task.title}" wirklich löschen?`)) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.taskDeleted.emit(this.task.id);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Fehler beim Löschen der Aufgabe');
        }
      });
    }
  }

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