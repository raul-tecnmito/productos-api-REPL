import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormComponent } from './product-form.component';
import { Product, ProductService } from '../services/products.service';
import { ProductViewComponent } from './product-view/product-view.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'title', 'image', 'price', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  
  name = localStorage.getItem('auth.user.name');
  avatar = localStorage.getItem('auth.user.avatar');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {    
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.initializeProductsData().subscribe((products) => {
      this.dataSource.data = products;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cerrarSesion() {
    this.router.navigate(['/']);

    localStorage.removeItem('auth.isAuthenticated');
    localStorage.removeItem('auth.user.name');
    localStorage.removeItem('auth.user.avatar');
  }

  openModal(product: Product | null = null): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (product) {
          this.productService.updateProduct(product.id, result);
        } else {
          this.productService.addProduct(result);
        }
        this.loadProducts();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewProduct(product: any): void {
    this.dialog.open(ProductViewComponent, {
      width: '500px',
      data: product,
    });
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id);
    this.loadProducts();
  }
}
