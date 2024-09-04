import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-warn-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './warn-popup.component.html',
  styleUrl: './warn-popup.component.scss',
})
export class WarnPopupComponent {
  readonly dialogRef = inject(MatDialogRef<WarnPopupComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor() {
    if (!this.data?.delete) {
      setTimeout(() => {
        this.dialogRef.close();
      }, 3000);
    }
  }

  onDialogClose() {
    this.dialogRef.close();
  }
}
