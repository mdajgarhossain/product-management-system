import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product, ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent {
  productForm: FormGroup;
  categories: string[];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.categories = this.productService.getCategories();
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
  }

  onSubmit(): void {
    const newProduct: Product = {
      id: Date.now(),
      name: this.productForm.value.name,
      category: this.productForm.value.category,
      price: this.productForm.value.price,
      description: this.productForm.value.description,
      image: this.productForm.value.image,
      quantity: this.productForm.value.quantity,
      createDate: this.productForm.value.createDate,
    };

    const existingProducts = this.productService.getProducts();
    const productCountInCategory = existingProducts.filter(
      (p) => p.category === newProduct.category
    ).length;

    if (productCountInCategory >= 10) {
      alert('Cannot add more than 10 products in the same category.');
      return;
    }

    this.productService.addProduct(newProduct);
    this.productForm.reset();
  }
}
