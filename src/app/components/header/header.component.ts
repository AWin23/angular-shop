import { Component, Input } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.models';
import { CartComponent } from 'src/app/pages/cart/cart.component';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  // user input stream to pass data from parent component into child
  // getting the number of items in cart ? 
  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  constructor(private cartService: CartService) { }

  // gets the total cost of the item 
  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  // clears the cart of the item
  onClearCart() {
    this.cartService.clearCart();
  }

}
