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
  selector: 'app-success-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './success-popup.component.html',
  styleUrl: './success-popup.component.scss',
})
export class SuccessPopupComponent {
  readonly dialogRef = inject(MatDialogRef<SuccessPopupComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 2000);
  }
}
