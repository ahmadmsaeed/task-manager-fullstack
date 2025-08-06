import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, Priority } from '../../models/task.model';
import { TaskFormComponent } from '../task-form.component/task-form.component';
import { TaskItemComponent } from '../task-item.component/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error: string | null = null;
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  Priority = Priority;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  // Add getter methods for template usage
  get activeTasksCount(): number {
    return this.tasks.filter(t => !t.isCompleted).length;
  }

  get completedTasksCount(): number {
    return this.tasks.filter(t => t.isCompleted).length;
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Fehler beim Laden der Tasks';
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  applyFilter(): void {
    switch (this.filterStatus) {
      case 'active':
        this.filteredTasks = this.tasks.filter(task => !task.isCompleted);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.isCompleted);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  onFilterChange(filter: 'all' | 'active' | 'completed'): void {
    this.filterStatus = filter;
    this.applyFilter();
  }

  onTaskUpdated(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.applyFilter();
    }
  }

  onTaskDeleted(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.applyFilter();
  }

  onTaskCreated(newTask: Task): void {
    this.tasks.unshift(newTask);
    this.applyFilter();
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
        return 'badge-success';
      case Priority.Medium:
        return 'badge-warning';
      case Priority.High:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}