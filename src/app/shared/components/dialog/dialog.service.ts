import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector } from '@angular/core';

import { ZardDialogRef, ZardDialogConfig } from './dialog-ref';

@Injectable({
  providedIn: 'root',
})
export class ZardDialogService {
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);

  open<T, R = unknown>(component: any, config?: ZardDialogConfig): ZardDialogRef<T, R> {
    const overlayRef = this.createOverlay(config);
    const dialogRef = new ZardDialogRef<T, R>(component, config, overlayRef);
    const portal = new ComponentPortal(component, null, this.createInjector(dialogRef));
    
    overlayRef.attach(portal);
    this.listenToBackdropClick(overlayRef, dialogRef, config);

    return dialogRef;
  }

  private createOverlay(config?: ZardDialogConfig): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'z-dialog-backdrop',
      panelClass: 'z-dialog-panel'
    });
  }

  private createInjector<T, R>(dialogRef: ZardDialogRef<T, R>): Injector {
    return Injector.create({
      providers: [{ provide: ZardDialogRef, useValue: dialogRef }],
      parent: this.injector
    });
  }

  private listenToBackdropClick<T, R>(
    overlayRef: OverlayRef,
    dialogRef: ZardDialogRef<T, R>,
    config?: ZardDialogConfig
  ): void {
    if (!config?.disableClose) {
      overlayRef.backdropClick().subscribe(() => {
        dialogRef.close();
        overlayRef.dispose();
      });
    }
  }
}