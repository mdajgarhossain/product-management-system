import { Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  { path: 'add-product', component: AddProductComponent },
  { path: '', component: ProductListComponent },
];
