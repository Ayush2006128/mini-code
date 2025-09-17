import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CodeEditorComponent } from './code-editor/code-editor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CodeEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mini-code');
}
