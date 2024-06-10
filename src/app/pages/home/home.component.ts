import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '12';
  productsSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private storeService: StoreService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  // calls the getAllProducts service and subscribes to it to get data from tehre? 
  getProducts(): void {
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category)
      .subscribe((_products) => {
        this.products = _products;
      });
  }

  // method that sets a brand new cateogry that user selects and shows it on the UI
  onColumnsCountChange(colsNum: number): void {
    console.log('clicked')
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  // method that emits the category(toggles it to open)
  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  // add the product to the cart 
  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();

  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  ngOnDestroy(): void {
    // if the product subscription is subscriped, then we unsibscribe
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

}
