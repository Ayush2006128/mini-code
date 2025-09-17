import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CodeEditorComponent } from './code-editor/code-editor';
import { LucideAngularModule, Code2 } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CodeEditorComponent, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mini-code');
  readonly Code2Icon = Code2;
}
