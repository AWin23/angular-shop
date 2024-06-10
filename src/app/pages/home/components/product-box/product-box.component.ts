import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
})
export class ProductBoxComponent implements OnInit {
  @Input() fullWidthMode = false; // handles the input
  @Input() product: Product | undefined; // input stream of Product Interface to show products/display to user
  @Output() addToCart = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // add the product to the cart 
  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

}
