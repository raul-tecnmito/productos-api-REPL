import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storageKey: string = 'products'; 
  private baseUrl: string = 'https://fakestoreapi.com/products/'; 

  constructor(private httpClient: HttpClient) {}
  
  private getProductsFromLocalStorage(): Product[] {
    const products = localStorage.getItem(this.storageKey);
    return products ? JSON.parse(products) : [];
  }
  
  private saveProductsToLocalStorage(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
  
  private fetchAndStoreProductsFromAPI(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}products`).pipe(
      map((products) => {
        
        this.saveProductsToLocalStorage(products);
        return products;
      }),
      catchError(() => {
        return [];
      })
    );
  }
  
  initializeProductsData(): Observable<Product[]> {
    
    const products = this.getProductsFromLocalStorage();
    if (products.length > 0) {
      return new Observable((observer) => {
        observer.next(products); 
        observer.complete();
      });
    } else {
      
      return this.fetchAndStoreProductsFromAPI();
    }
  }
  
  addProduct(data: Product): void {
    const products = this.getProductsFromLocalStorage();
    products.push(data); 
    this.saveProductsToLocalStorage(products);
  }
  
  updateProduct(id: number, data: Product): void {
    const products = this.getProductsFromLocalStorage();
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...data }; 
      this.saveProductsToLocalStorage(products);
    }
  }
  
  getProductList(): Product[] {
    return this.getProductsFromLocalStorage(); 
  }
  
  deleteProduct(id: number): void {
    let products = this.getProductsFromLocalStorage();
    products = products.filter(product => product.id !== id); 
    this.saveProductsToLocalStorage(products);
  }
}
