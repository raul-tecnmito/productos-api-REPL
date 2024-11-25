import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../services/products.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {    
    this.productForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      price: [data?.price || '', [Validators.required, Validators.min(0)]],
      description: [data?.description || '', Validators.required],
      category: [data?.category || '', Validators.required],
      image: [data?.image || '', Validators.required],
      rating: this.fb.group({
        rate: [data?.rating?.rate || '', [Validators.required, Validators.min(0), Validators.max(5)]],
        count: [data?.rating?.count || '', [Validators.required, Validators.min(0)]],
      }),
    });
  }

  save(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
