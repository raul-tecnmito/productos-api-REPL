import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
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
  private baseUrl: string = 'https://fakestoreapi.com/products'; 

  constructor(private httpClient: HttpClient) {
  }
  
  private getProductsFromLocalStorage(): Product[] {
    const products = localStorage.getItem(this.storageKey);
    return products ? JSON.parse(products) : [];
  }
  
  private saveProductsToLocalStorage(products: Product[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
  
  private fetchAndStoreProductsFromAPI(): Observable<Product[]> {
    return new Observable((observer) => {
      this.httpClient.get<Product[]>(this.baseUrl).subscribe({
        next: (products) => {          
          this.saveProductsToLocalStorage(products);
          observer.next(products);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching products from API', error);
          observer.next([]);
          observer.complete();
        },
      });
    });
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
