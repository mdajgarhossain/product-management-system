import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product, ProductService } from '../services/product.service';
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
import { SuccessPopupComponent } from '../popups/success-popup/success-popup.component';
import { WarnPopupComponent } from '../popups/warn-popup/warn-popup.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm: FormGroup;
  categoryForm: FormGroup;
  categories: string[];
  showAddCategoryModal = false;
  readonly dialogRef = inject(MatDialogRef<AddProductComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);
  categoryLimitExceeded: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.categories = this.productService.getCategories();
    if (this.data.isCreate) {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        category: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0.01)]],
        description: [''],
        image: [''],
        quantity: [1, [Validators.required, Validators.min(1)]],
        createDate: ['', Validators.required],
        newCategory: [''],
      });
    } else {
      this.productForm = this.fb.group({
        name: [this.data.product.name, Validators.required],
        category: [this.data.product.category, Validators.required],
        price: [
          this.data.product.price,
          [Validators.required, Validators.min(0.01)],
        ],
        description: [this.data.product.description],
        image: [''],
        quantity: [
          this.data.product.quantity,
          [Validators.required, Validators.min(1)],
        ],
        createDate: [this.data.product.createDate, Validators.required],
        newCategory: [''],
      });
    }

    this.categoryForm = this.fb.group({
      newCategory: ['', Validators.required],
    });

    this.loadCategories();
  }

  loadCategories() {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories);
    } else {
      // Add some default categories
      this.categories = this.productService.getCategories();
      localStorage.setItem('categories', JSON.stringify(this.categories));
    }
  }

  openAddCategoryModal() {
    this.showAddCategoryModal = true;
  }

  closeAddCategoryModal() {
    this.showAddCategoryModal = false;
  }

  addCategory() {
    if (this.categoryForm.valid) {
      const newCategory = this.categoryForm.get('newCategory')?.value;
      this.categories.push(newCategory);
      localStorage.setItem('categories', JSON.stringify(this.categories));
      this.closeAddCategoryModal();
      this.categoryForm.reset();
    }
  }

  onSubmit(): void {
    const newProduct: Product = {
      id: this.data.isCreate ? Date.now() : this.data.product.id,
      name: this.productForm.value.name,
      category: this.productForm.value.category,
      price: this.productForm.value.price,
      description: this.productForm.value.description,
      image: this.productForm.value.image,
      quantity: this.productForm.value.quantity,
      createDate: this.productForm.value.createDate,
    };

    if (this.data.isCreate) {
      this.productService.addProduct(newProduct);
      this.openPopup('Product added successfully!', SuccessPopupComponent);
      this.productForm.reset();
    } else {
      this.productService.updateProduct(newProduct);
      this.openPopup('Product updated successfully!', SuccessPopupComponent);
      this.dialogRef.close();
    }
  }

  openPopup(message: string, componentName: any) {
    this.dialog.open(componentName, {
      data: { message },
      width: '600px',
      height: '150px',
    });
  }

  onCategoryChange(event: any) {
    const existingProducts = this.productService.getProducts();
    const productCountInCategory = existingProducts.filter(
      (p) => p.category === event.target.value
    ).length;

    if (productCountInCategory >= 10) {
      this.categoryLimitExceeded = true;
      this.openPopup(
        'Cannot add more than 10 products of the same category.',
        WarnPopupComponent
      );
    } else {
      this.categoryLimitExceeded = false;
    }
  }
}
