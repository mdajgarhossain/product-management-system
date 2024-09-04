import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';
import { WarnPopupComponent } from '../popups/warn-popup/warn-popup.component';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    'productName',
    'category',
    'quantity',
    'price',
    'total',
    'actions',
  ];
  dataSource = new MatTableDataSource<Product>([]);
  pageSize = 50;
  totalSum = 0;
  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    if (typeof localStorage !== 'undefined') {
      const products: Product[] = JSON.parse(
        localStorage.getItem('products') || '[]'
      );
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
      this.calculateTotalSum(products);
    }
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateTotalSum(products: Product[]) {
    this.totalSum = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  }

  createProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      data: { isCreate: true },
      width: '700px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadProducts();
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(AddProductComponent, {
      data: { product, isCreate: false },
      width: '700px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadProducts();
    });
  }

  deleteProduct(product: Product) {
    this.openPopup(product);
  }

  openPopup(product: any) {
    const dialogRef = this.dialog.open(WarnPopupComponent, {
      data: { message: 'Are you sure to delete?', delete: true },
      width: '600px',
      height: '150px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.indexOf(product);
        if (index >= 0) {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
          localStorage.setItem(
            'products',
            JSON.stringify(this.dataSource.data)
          );
          this.calculateTotalSum(this.dataSource.data);
        }
        this.loadProducts();
      }
    });
  }
}

export interface Product {
  productName: string;
  category: string;
  quantity: number;
  price: number;
}
