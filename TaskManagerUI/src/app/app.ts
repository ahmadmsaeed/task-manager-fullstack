import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list.component/task-list.component';

// root komponente der app - entry point für angular anwendung
@Component({
  selector: 'app-root', // css selector für diese komponente
  imports: [RouterOutlet, TaskListComponent], // direkte imports bei standalone komponenten
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // signal für reaktiven titel (angular 17 feature)
  protected readonly title = signal('TaskManagerUI');
}
