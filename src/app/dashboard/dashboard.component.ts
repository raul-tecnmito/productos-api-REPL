import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../services/products.service';
import { ProductFormComponent } from './product-form/product-form.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'price', 'actions'];
  dataSource = new MatTableDataSource([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataSource.data = this.productService.getProductList();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openModal(product: any = null): void {
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

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id);
    this.loadProducts();
  }
}
