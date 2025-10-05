import { signal } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

export interface ZardDialogConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  data?: unknown;
  disableClose?: boolean;
}

export class ZardDialogRef<T = unknown, R = unknown> {
  private readonly _afterClosed = signal<R | undefined>(undefined);

  constructor(
    public readonly component: T,
    public readonly config?: ZardDialogConfig,
    private readonly overlayRef?: OverlayRef
  ) {}

  afterClosed() {
    return this._afterClosed.asReadonly();
  }

  close(result?: R) {
    this._afterClosed.set(result);
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }
}