import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Component, Inject, LOCALE_ID } from '@angular/core';
import { DialogDataComponent } from 'src/app/shared/dialog-data/dialog-data.component';
import { ListSupplier } from 'src/app/interfaces/listSupplier';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/domain/product';
import { ProductCodeEntry } from 'src/app/domain/product-code-entry';
import { ProductEntryHeader } from 'src/app/domain/product-entry-header';
import { ProductEntryService } from 'src/app/services/product-entry.service';
import { SnackBarComponent } from 'src/app/shared/snack-bar/snack-bar.component';
import { SupplierService } from 'src/app/services/supplier.service';
import { of } from 'rxjs';
import { ProductEntry } from 'src/app/domain/product-entry';

@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent {

  id: string | null = null;
  submitted = false;
  action = '';
  productEntryHeaderForm!: FormGroup;
  productEntryHeader = new ProductEntryHeader();
  product!: Product;
  showSpinner = false;
  suppliers: ListSupplier[] = [];
  selectedSupplier: string | null = null;
  selectedTransactionType: string | null = null

  displayedColumns: string[] = ['code', 'name', 'costValue', 'quantity', 'subTotal', 'actions'];

  dataSource: any;
  // dataSource!: MatTableDataSource<ProductCodeEntry>;

  timeout: any = null;
  productCodeEntry = new ProductCodeEntry();
  listProductCodeEntry: ProductCodeEntry[] = [];
  quantity = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productEntryService: ProductEntryService,
    private supplierService: SupplierService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(LOCALE_ID) public locale: string,) {}

  ngOnInit(): void {
    this.getSuppliers();

    this.id = this.route.snapshot.paramMap.get('id');
    this.createForm(this.id);

    if (this.id == null) {
      this.action = "Adicionar";
    } else {
      this.action = "Visualizar";
    }

    this.manageForm();
  }

  getSuppliers(): void {
    this.supplierService.getListSupplier()
      .subscribe({
        next: (result) => {
          this.suppliers = result;
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

  createForm(id: string | null): void {
    this.productEntryHeader = new ProductEntryHeader();
    this.productEntryHeader.employeeId = '48bc4775-a2be-4179-efc7-08db3d07e2f2';
    this.productEntryHeader.active = true;

    if (id != null) {
      this.view(id);
    }

    this.productEntryHeaderForm = this.fb.group({
      id: [this.productEntryHeader.id],
      code: [this.productEntryHeader.code, Validators.required],
      supplierId: [this.productEntryHeader.supplierId, Validators.required],
      employeeId: [this.productEntryHeader.employeeId],
      transactionType: [this.productEntryHeader.transactionType, Validators.required],
      active: [this.productEntryHeader.active],
      productId: [this.productCodeEntry.id],
      productCode: [this.productCodeEntry.code],
      productName: [this.productCodeEntry.name],
      productCategory: [this.productCodeEntry.categoryName],
      productBrand: [this.productCodeEntry.brandName],
      productCostValue: [this.productCodeEntry.costValue],
      productQuantity: [this.productCodeEntry.quantity],
      productSubTotal: [this.productCodeEntry.subTotal],
    });
  }

  get f() { return this.productEntryHeaderForm; }

  view(id: string): void {
    this.showSpinner = true;

    this.productEntryService.getProductEntryHeaderById(id)
      .subscribe({
        next: (result) => {
          this.productEntryHeaderForm.patchValue(result);
          this.selectedSupplier = result.supplierId;
          this.selectedTransactionType = result.transactionTypeId;

          this.f.get('code')?.disable();
          this.f.get('transactionType')?.disable();
          this.f.get('supplierId')?.disable();

          result.productsEntry.forEach(element => {
            let productCodeEntry = new ProductCodeEntry();

            productCodeEntry.id = element.id;
            productCodeEntry.code = element.code;
            productCodeEntry.name = element.name;
            productCodeEntry.costValue = Number(element.costValue);
            productCodeEntry.quantity = Number(element.quantity);
            productCodeEntry.subTotal = Number(element.subTotal);

            this.listProductCodeEntry.push(productCodeEntry);
          });

          this.displayedColumns.pop();

          this.dataSource = new MatTableDataSource(this.listProductCodeEntry);
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

  onSubmit(): void {
    if (this.productEntryHeaderForm.invalid) {
      return;
    }

    this.showSpinner = true;
    let productEntryHeader = new ProductEntryHeader();

    productEntryHeader.code = this.f.get('code')?.value;
    productEntryHeader.employeeId = this.f.get('employeeId')?.value;
    productEntryHeader.supplierId = this.f.get('supplierId')?.value;
    productEntryHeader.transactionType = this.f.get('transactionType')?.value;
    productEntryHeader.active = true;

    this.listProductCodeEntry.forEach(item => {
      let productEntry = new ProductEntry();

      productEntry.productId = item.id;
      productEntry.quantity = item.quantity;
      productEntry.costValue = item.costValue;

      productEntryHeader.productsEntry.push(productEntry);
    });

    this.productEntryService.addProductEntry(productEntryHeader)
      .subscribe({
        next: (result) => {
          this.snackBar.open(
            "Entrada de Produtos cadastrado com sucesso!", "OK",
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
  }

  onReset(): void {
    this.submitted = false;
    this.productEntryHeaderForm.reset();

    this.f.get('code')?.clearValidators();
    this.f.get('code')?.updateValueAndValidity();

    this.f.get('transactionType')?.clearValidators();
    this.f.get('transactionType')?.updateValueAndValidity();

    this.f.get('supplierId')?.clearValidators();
    this.f.get('supplierId')?.updateValueAndValidity();

    this.listProductCodeEntry = [] = [];
  }

  cancelForm(): void {
    this.router.navigateByUrl('list-stock-receipts');
  }

  manageForm(): void {
    this.f.get('productName')?.disable();
    this.f.get('productCategory')?.disable();
    this.f.get('productBrand')?.disable();
    this.f.get('productSubTotal')?.disable();

    this.f.get('productCostValue')?.valueChanges.subscribe(
      value => {
        this.f.get('productSubTotal')?.setValue('');

        if (value != null && value != '' && this.f.get('productQuantity')?.value != 0) {
          const subTotal = value * this.f.get('productQuantity')?.value;
          this.f.get('productSubTotal')?.setValue(subTotal);

          this.productCodeEntry.quantity = this.f.get('productQuantity')?.value;
          this.productCodeEntry.costValue = this.f.get('productCostValue')?.value;
        }
      }
    )
  }

  disabledAddButton(): boolean {
    return (this.f.get('productCode')?.value == null || this.f.get('productCode')?.value == '') ||
    (this.f.get('productCostValue')?.value == null || this.f.get('productCostValue')?.value == null || this.f.get('productCostValue')?.value == 0) ||
    (this.f.get('productQuantity')?.value == null || this.f.get('productQuantity')?.value == '' || this.f.get('productQuantity')?.value == 0) ||
    (this.f.get('code')?.value == null || this.f.get('code')?.value == '' || this.f.get('supplierId')?.value == null
      || this.f.get('transactionType')?.value == null);

    // inserir e escluir os produtos na lista de produtos.
    // gravar a entrada de produto no database.
  }

  searchProductByCode(event: any): void {
    clearTimeout(this.timeout);
    var $this = this;

    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.getProductByCode(event.target.value);
      }
    }, 1000);
  }

  calculateSubValueByQuantity(event: any): void {
    clearTimeout(this.timeout);
    var $this = this;

    this.timeout = setTimeout(function () {
      if (event.keyCode != 13 || event.target.value != '' || event.target.value != null) {
        const subTotal = $this.f.get('productCostValue')?.value * event.target.value;
        $this.f.get('productSubTotal')?.setValue(subTotal);
      }
    }, 1000);
  }

  getProductByCode(code: string): void  {
    if (code == '') {
      this.productCodeEntry = new ProductCodeEntry();
      return;
    }

    this.showSpinner = true;

    this.productEntryService.getProductEntryByCode(code)
      .subscribe({
        next: (result) => {
          this.productCodeEntry = result;
          this.f.get('productId')?.setValue(this.productCodeEntry.id);
          this.f.get('productCode')?.setValue(this.productCodeEntry.code);
          this.f.get('productName')?.setValue(this.productCodeEntry.name);
          this.f.get('productCategory')?.setValue(this.productCodeEntry.categoryName);
          this.f.get('productBrand')?.setValue(this.productCodeEntry.brandName);
          this.f.get('productCostValue')?.setValue(this.productCodeEntry.costValue);
          this.f.get('productQuantity')?.setValue(this.productCodeEntry.quantity);
        },
        error: (error) => {
          this.showSpinner = false;
          this.productCodeEntry = new ProductCodeEntry();

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

  addProduct(): void {
    let productCodeEntry = new ProductCodeEntry();

    productCodeEntry.id = this.f.get('productId')?.value;
    productCodeEntry.code = this.f.get('productCode')?.value;
    productCodeEntry.name = this.f.get('productName')?.value;
    productCodeEntry.categoryName = this.f.get('productCategory')?.value;
    productCodeEntry.brandName = this.f.get('productBrand')?.value;
    productCodeEntry.costValue = this.f.get('productCostValue')?.value;
    productCodeEntry.quantity = this.f.get('productQuantity')?.value;
    productCodeEntry.subTotal = this.f.get('productSubTotal')?.value;

    this.listProductCodeEntry.push(productCodeEntry);
    this.dataSource = new MatTableDataSource(this.listProductCodeEntry);

    this.f.get('productId')?.setValue(undefined);
    this.f.get('productCode')?.setValue(undefined);
    this.f.get('productName')?.setValue('');
    this.f.get('productCategory')?.setValue('');
    this.f.get('productBrand')?.setValue('');
    this.f.get('productCostValue')?.setValue('');
    this.f.get('productQuantity')?.setValue('');
    this.f.get('productSubTotal')?.setValue('');
  }

  getTotal(): number {
    // const foo = this.listProductCodeEntry.map(x => x.subTotal).reduce((acc, value) => acc + value, 0);
    return this.listProductCodeEntry.map(x => x.subTotal).reduce((acc, value) => acc + value, 0);
    // return 0;
  }

  removeProduct(productCodeEntry: ProductCodeEntry): void {
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: {
        message: `Confirma a exclusão do produto ${productCodeEntry.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.dataSource = this.listProductCodeEntry.filter((value, key) => {
          return value.id != productCodeEntry.id;
        });

        this.listProductCodeEntry = this.listProductCodeEntry.filter((value, key) => {
          return value.id != productCodeEntry.id;
        });

        this.dataSource = new MatTableDataSource(this.listProductCodeEntry)
        this.productCodeEntry = new ProductCodeEntry();
      }
    });
  }
}
