import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Brand } from 'src/app/domain/brand';
import { BrandService } from 'src/app/services/brand.service';
import { Category } from 'src/app/domain/category';
import { CategoryService } from 'src/app/services/category.service';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Product } from 'src/app/domain/product';
import { ProductService } from 'src/app/services/product.service';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { of } from 'rxjs';
import { CurrencyPipe, formatCurrency } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  id: string | null = null;
  submitted = false;
  action = '';
  productForm!: FormGroup;
  dutyVeterinarian = false;
  product = new Product();
  showSpinner = false;
  categories: Category[] = [];
  brands: Brand[] = [];
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private snackBar: MatSnackBar,
    @Inject(LOCALE_ID) public locale: string,) { }

  ngOnInit(): void {
    this.getCategories(null);

    this.id = this.route.snapshot.paramMap.get('id');
    this.createForm(this.id);

    if (this.id == null) {
      this.action = "Adicionar";
    } else {
      this.action = "Editar";
    }

    this.manageForm();
  }

  createForm(id: string | null): void {
    this.product = new Product();

    if (id != null) {
      this.updateForm(id);
    }

    this.productForm = this.fb.group({
      id: [this.product.id],
      name: [this.product.name, Validators.required],
      code: [this.product.code, Validators.required],
      categoryId: [this.product.categoryId, Validators.required],
      brandId: [this.product.brandId, Validators.required],
      description: [this.product.description, Validators.required],
      costValue: [this.product.costValue, Validators.required],
      profitMargin: [this.product.profitMargin, Validators.required],
      saleValue: [this.product.saleValue, Validators.required],
      stockQuantity: [this.product.stockQuantity, Validators.required],
      active: [this.product.active],
    });

    this.productForm.get('brandId')?.disable();
    this.productForm.get('saleValue')?.disable();
  }

  get f() { return this.productForm; }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    this.showSpinner = true;
    this.productForm.get('active')?.setValue(true);

    if (this.action == 'Adicionar') {
      this.productService.addProduct(this.productForm.getRawValue())
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Produto cadastrado com sucesso!", "OK",
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });

           this.onReset();
        },
        error: (error) => {
          this.showSpinner = false;
          let duration: number = 5000;
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');

          if (errorMessages.length > 5) {
            duration = 10000;
          }

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

          return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
    } else {
      this.productService.updateProduct(this.productForm.getRawValue())
      .subscribe({
        next: (result) => {
          this.productForm.patchValue(result);

          this.snackBar.open(
            "Os dados foram alterados com sucesso!", "OK",
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
        },
        error: (error) => {
          this.showSpinner = false;
          let duration: number = 5000;
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');

          if (errorMessages.length > 5) {
            duration = 10000;
          }

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

          return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
    }
  }

  cancelForm(): void {
    this.router.navigateByUrl('list-products');
  }

  onReset(): void {
    this.submitted = false;
    this.productForm.reset();

    for (let name in this.productForm.controls) {
      this.f.get(name)?.clearValidators();
      this.f.get(name)?.updateValueAndValidity();
    }
  }

  updateForm(id: string): void {
    this.showSpinner = true;

    this.productService.getProductById(id)
      .subscribe({
        next: (result) => {
          // formatCurrency(result.costValue, this.locale, '');
          // const foo = Math.round((result.costValue + Number.EPSILON) * 100) / 100
          // result.costValue = result.costValue.toFixed(2);

          this.productForm.patchValue(result);
          // this.f.get('costValue')?.setValue(Math.round(result.costValue * 100) / 100);
          this.selectedCategory = result.categoryId;
          this.getBrands(result.categoryId, result.brandId);
        },
        error: (error) => {
          this.showSpinner = false;

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

           return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      });
  }

  getCategories(selectedCategoryId: string | null): void {
    this.categoryService.getAll()
      .subscribe({
        next: (result) => {
          this.categories = result;

          if (selectedCategoryId != null) {
            this.selectedCategory = selectedCategoryId;
            // this.getBrands(selectedCategoryId, result.bra);
          }
        },
        error: (error) => {
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');
          let duration: number = 5000;

          let config = new MatSnackBarConfig();
          config.duration = duration;
          config.data = error.message.split('|')
          config.panelClass = ["red-snackbar"];
          config.horizontalPosition = 'center';
          config.verticalPosition = 'top';

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

          return of([])
        },
        complete: () => {
          // this.showSpinner = false;
        }
      });
  }

  manageForm(): void {
    this.f.get("categoryId")?.valueChanges.subscribe(
      value => {
        if (value != null) {
          this.getBrands(value, null);
          this.f.get('brandId')?.enable();
        }
      }
    )

    this.f.get('costValue')?.valueChanges.subscribe(
      value => {
        this.f.get('saleValue')?.setValue('');

        if (value != null && value != '' && this.f.get('profitMargin')?.value != 0) {
          const profitMarginValue = (value * this.f.get('profitMargin')?.value) / 100;
          const final = value + profitMarginValue;
          this.f.get('saleValue')?.setValue(final);
        }
      }
    )

    this.f.get('profitMargin')?.valueChanges.subscribe(
      value => {
        this.f.get('saleValue')?.setValue('');

        if (value != null && value != '' && this.f.get('costValue')?.value != 0) {
          const profitMarginValue = (this.f.get('costValue')?.value * value) / 100;
          const final = this.f.get('costValue')?.value + profitMarginValue;
          this.f.get('saleValue')?.setValue(final);
        }
      }
    )

    // this.f.get('saleValue')?.valueChanges.subscribe(
    //   value => {
    //     const curr = formatCurrency(value, this.locale, '');
    //     this.f.get('saleValue')?.setValue(curr);
    //   }
    // )
  }



  getBrands(categoryId: string, selectedBrandId: string | null) {
    this.showSpinner = true;

    this.brandService.getByCategoryId(categoryId)
      .subscribe({
        next: (result) => {
          this.brands = result;

          if (selectedBrandId != null) {
            let brandId = result.find(x => x.id == selectedBrandId)!.id;
            this.selectedBrand = result.find(x => x.id == selectedBrandId)!.id;
          }
        },
        error: (error) => {
          this.showSpinner = false;
          let errorMessages: string[] = [];
          errorMessages = error.message.split('|');
          let duration: number = 5000;

          let config = new MatSnackBarConfig();
          config.duration = duration;
          config.data = error.message.split('|')
          config.panelClass = ["red-snackbar"];
          config.horizontalPosition = 'center';
          config.verticalPosition = 'top';

          let configError: MatSnackBarConfig = {
            panelClass: 'red-snackbar',
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          };

          this.snackBar.openFromComponent(SnackBarComponent, {
            data: error.message.split('|'),
            ...configError
           });

          return of([])
        },
        complete: () => {
          this.showSpinner = false;
        }
      }
    );
  }
}
