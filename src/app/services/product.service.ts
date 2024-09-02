import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  quantity: number;
  createDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private categories: string[] = ['Electronics', 'Apparel', 'Beauty Products', 'Home Decor'];
  // private productCategories = {"electronics": 0, "apparel": 0, "beautyProducts": 0, "homeDecor": 0};

  constructor() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    }
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product): void {
    this.products.push(product);
    // this.productCategories[product.category] = 1;
    this.saveProducts();
  }


  getCategories(): string[] {
    return this.categories;
  }

  private saveProducts(): void {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}
