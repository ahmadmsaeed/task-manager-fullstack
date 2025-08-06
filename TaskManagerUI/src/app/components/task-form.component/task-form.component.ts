import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CreateTask, Task, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<Task>();

  newTask: CreateTask = {
    title: '',
    description: '',
    priority: Priority.Medium
  };

  Priority = Priority;
  isSubmitting = false;
  showForm = false;

  constructor(private taskService: TaskService) { }

  onSubmit(): void {
    if (this.newTask.title.trim() === '') {
      alert('Bitte geben Sie einen Titel ein');
      return;
    }

    this.isSubmitting = true;
    
    this.taskService.createTask(this.newTask).subscribe({
      next: (task) => {
        this.taskCreated.emit(task);
        this.resetForm();
        this.isSubmitting = false;
        this.showForm = false;
      },
      error: (error) => {
        console.error('Error creating task:', error);
        alert('Fehler beim Erstellen der Aufgabe');
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      priority: Priority.Medium
    };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }
}