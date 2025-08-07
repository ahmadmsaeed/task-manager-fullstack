import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, Priority } from '../../models/task.model';
import { TaskFormComponent } from '../task-form.component/task-form.component';
import { TaskItemComponent } from '../task-item.component/task-item.component';

// hauptkomponente für task liste - zeigt alle tasks und filter optionen
@Component({
  selector: 'app-task-list',
  standalone: true, // angular 17 standalone komponente
  imports: [CommonModule, TaskFormComponent, TaskItemComponent], // direkte imports statt module
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  // state variablen für die komponente
  tasks: Task[] = []; // alle tasks vom server
  filteredTasks: Task[] = []; // gefilterte tasks für anzeige
  loading = false; // loading spinner
  error: string | null = null; // fehlermeldungen
  filterStatus: 'all' | 'active' | 'completed' = 'all'; // aktueller filter
  Priority = Priority; // enum für template zugriff

  // service injection
  constructor(private taskService: TaskService) { }

  // wird nach component initialization aufgerufen
  ngOnInit(): void {
    this.loadTasks();
  }

  // getter für task statistics im template
  get activeTasksCount(): number {
    return this.tasks.filter(t => !t.isCompleted).length;
  }

  get completedTasksCount(): number {
    return this.tasks.filter(t => t.isCompleted).length;
  }

  // alle tasks vom server laden
  loadTasks(): void {
    this.loading = true;
    this.error = null;
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter(); // filter nach dem laden anwenden
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Fehler beim Laden der Tasks';
        this.loading = false;
        console.error('Error loading tasks:', error);
      }
    });
  }

  // filter auf task liste anwenden
  applyFilter(): void {
    switch (this.filterStatus) {
      case 'active':
        this.filteredTasks = this.tasks.filter(task => !task.isCompleted);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.isCompleted);
        break;
      default:
        this.filteredTasks = [...this.tasks]; // alle tasks
    }
  }

  // filter ändern (wird von template aufgerufen)
  onFilterChange(filter: 'all' | 'active' | 'completed'): void {
    this.filterStatus = filter;
    this.applyFilter();
  }

  // event handler für task updates von child komponenten
  onTaskUpdated(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.applyFilter(); // neu filtern nach update
    }
  }

  // event handler für task löschen
  onTaskDeleted(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.applyFilter();
  }

  // event handler für neue tasks
  onTaskCreated(newTask: Task): void {
    this.tasks.unshift(newTask); // neuen task an anfang hinzufügen
    this.applyFilter();
  }

  // helper methode für priority labels im template
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

  // helper methode für priority css klassen
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