import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task, CreateTask, UpdateTask } from '../models/task.model';

// service für alle api calls - angular nutzt dependency injection
@Injectable({
  providedIn: 'root' // singleton service für ganze app
})
export class TaskService {
  // api url von meinem .net backend
  private apiUrl = 'http://localhost:5019/api/Tasks'; // port muss mit backend übereinstimmen

  // httpclient wird automatisch injected
  constructor(private http: HttpClient) { }

  // alle tasks vom server holen
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        // date strings zu echten date objekten konvertieren
        map(tasks => tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }))),
        catchError(this.handleError) // fehler abfangen
      );
  }

  // einzelnen task über id holen
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(
        // date conversion für einzelnen task
        map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })),
        catchError(this.handleError)
      );
  }

  // neuen task an server schicken
  createTask(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(
        // response auch date konvertieren
        map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })),
        catchError(this.handleError)
      );
  }

  // existierenden task updaten
  updateTask(id: number, task: UpdateTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(
        // wieder date conversion
        map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        })),
        catchError(this.handleError)
      );
  }

  // task vom server löschen
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // tasks nach fertig/unfertig filtern
  getTasksByStatus(isCompleted: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status/${isCompleted}`)
      .pipe(
        // date conversion für gefilterte liste
        map(tasks => tasks.map(task => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }))),
        catchError(this.handleError)
      );
  }

  // zentrale error handling methode
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ein unbekannter Fehler ist aufgetreten!';
    
    if (error.error instanceof ErrorEvent) {
      // client-seitiger fehler (netzwerk, parsing etc.)
      errorMessage = `Fehler: ${error.error.message}`;
    } else {
      // server-seitiger fehler (404, 500 etc.)
      errorMessage = `Server Fehler: ${error.status}\nNachricht: ${error.message}`;
    }
    
    console.error(errorMessage); // für debugging
    return throwError(() => new Error(errorMessage));
  }
}