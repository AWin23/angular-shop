import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] }); // take in Cart Interface with items array

  constructor(private _snackBar: MatSnackBar) { } // this service displays information to user

  // adds items to the cart 
  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id); // scans thru and finds item with a matching ID

    // if the item is in the cart(existing), we increment it by 1
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      // otherwise, we push a new item into a cart
      items.push(item);
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart', 'OK', { duration: 3000 });
    console.log(this.cart.value);
  }

  // gets the total cost of the item 
  // gets the total amount and returns it as a NUMBER
  getTotal(items: Array<CartItem>): number {
    return items.map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  // clears the cart of the item
  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared', 'Ok', {
      duration: 3000
    });
  }

  // removes the item from the cart
  // updates cart object and emits that 
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    // looop thru and use filter to filter item 
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart', 'Ok', {
        duration: 3000
      });
    }

    return filteredItems;
  }

  // removes the item from the cart decrementally 
  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      // loop thru, IF the item ID is matching what user wants to remove
      // decrement it
      if (_item.id === item.id) {
        _item.quantity--;
      }

      // if the quantity of the item is zero, we remove the item completly from section(cart)
      if (_item.quantity === 0) {
        itemForRemoval = _item;
      }

      return _item; // at the end of it all, we remove the item
    });

    // check if there are any items makred for removal
    if (itemForRemoval) {
      // call the remove from cart service to wipe it off the UI
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item remvoed from cart', 'Ok', {
      duration: 3000
    });

  }
}