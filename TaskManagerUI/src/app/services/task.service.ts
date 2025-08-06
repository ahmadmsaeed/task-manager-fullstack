import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task, CreateTask, UpdateTask } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5019/api/Tasks'; // Fixed casing to match API

  constructor(private http: HttpClient) { }

  // Alle Tasks abrufen
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        map(tasks => tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }))),
        catchError(this.handleError)
      );
  }

  // Einzelnen Task abrufen
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(
        map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })),
        catchError(this.handleError)
      );
  }

  // Neuen Task erstellen
  createTask(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(
        map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })),
        catchError(this.handleError)
      );
  }

  // Task aktualisieren
  updateTask(id: number, task: UpdateTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(
        map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })),
        catchError(this.handleError)
      );
  }

  // Task löschen
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Tasks nach Status filtern
  getTasksByStatus(isCompleted: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${isCompleted}`)
      .pipe(
        map(tasks => tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }))),
        catchError(this.handleError)
      );
  }

  // Error Handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ein unbekannter Fehler ist aufgetreten!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-seitiger Fehler
      errorMessage = `Fehler: ${error.error.message}`;
    } else {
      // Server-seitiger Fehler
      errorMessage = `Server Fehler: ${error.status}\nNachricht: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}