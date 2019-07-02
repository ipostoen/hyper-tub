import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarRef, MatSnackBarVerticalPosition} from '@angular/material';

@Injectable({providedIn: 'root'})
export class NotifyService {
  snackBarRef = null;
  constructor(public snackBar: MatSnackBar) {
  }

  open(text: string, panelClass = 'warning', position: MatSnackBarVerticalPosition = 'top', duration = 5000,
    actionText = '', actionCb?: Function) {
    this.snackBarRef = this.snackBar.open(text, actionText, {
      verticalPosition: position,
      duration: duration,
      panelClass: panelClass
    });
    if (actionCb) {
      this.snackBarRef.onAction().subscribe(() => {
        actionCb();
      });
    }
  }
  success(text: string) {
    this.open(text, 'success', 'top', 5000)
  }
  error(text: string) {
    this.open(text);
  }
  close() {
    this.snackBarRef.dismiss();
  }
}
