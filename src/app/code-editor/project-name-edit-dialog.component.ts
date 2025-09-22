import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZardDialogRef } from '@shared/components/dialog/dialog-ref';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-project-name-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ZardInputDirective, ZardButtonComponent],
  template: `
    <div class="space-y-4 z-dialog-content bg-black p-4 m-4 border-2 border-radius-md">
      <div class="space-y-2">
        <label for="project-name" class="text-sm p-4 text-white font-bold">Project Name</label>
        <input
          id="project-name"
          z-input
          [(ngModel)]="projectName"
          placeholder="Enter project name"
          (keydown.enter)="onSave()"
          class="w-full text-white"
        />
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button z-button zType="outline" (click)="onCancel()">
          Cancel
        </button>
        <button z-button [disabled]="!projectName.trim()" (click)="onSave()">
          Save
        </button>
      </div>
    </div>
  `,
})
export class ProjectNameEditDialogComponent implements OnInit {
  private readonly dialogRef = inject(ZardDialogRef);
  
  projectName = '';
  private initialProjectName = '';

  ngOnInit() {
    // Get initial data from dialog ref
    const data = this.dialogRef.config?.data as { projectName?: string };
    if (data?.projectName) {
      this.projectName = data.projectName;
      this.initialProjectName = data.projectName;
    }
    
    // Focus the input after a short delay
    setTimeout(() => {
      const input = document.getElementById('project-name') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  onSave() {
    if (this.projectName.trim()) {
      this.dialogRef.close({ projectName: this.projectName.trim() });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
