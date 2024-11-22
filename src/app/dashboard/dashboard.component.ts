import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormComponent } from './product-form.component';
import { Product, ProductService } from '../services/products.service';
import { ProductViewComponent } from './product-view/product-view.component';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['id', 'title', 'price', 'actions'];
  dataSource = new MatTableDataSource([] as Product[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    console.log("cargando productos");
    
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.initializeProductsData().subscribe((products) => {
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openModal(product: Product | null = null): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '400px',
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

  viewProduct(product: any): void {
    this.dialog.open(ProductViewComponent, {
      width: '400px',
      data: product,
    });
  }  

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id);
    this.loadProducts();
  }
}
