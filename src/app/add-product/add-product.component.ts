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
  categoryForm: FormGroup;
  categories: string[];
  showAddCategoryModal = false;

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
