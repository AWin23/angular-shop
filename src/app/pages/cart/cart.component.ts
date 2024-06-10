import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.models';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [{
      product: 'https://via.placeholder.com/150',
      name: 'snickers',
      price: 150,
      quantity: 1,
      id: 1,
    },
    {
      product: 'https://via.placeholder.com/150',
      name: 'snickers',
      price: 150,
      quantity: 3,
      id: 1,
    }]
  }; // takes in Model of Cart Interfaces and holds an array of Items


  dataSource: Array<CartItem> = []; // takes in the Cart Item interface data

  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];

  constructor(private cartService: CartService, private http: HttpClient) { }

  // gets the total amount and returns it as a NUMBER by calling the Cart Service
  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  // on init it will fetch and feed the data
  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  // clears the entire cart in the cart component
  // calls cartService to get data from there and use it to call "clearCart"
  onClearCart(): void {
    this.cartService.clearCart();
  }

  // removes the specific item in the cart(takes in CartItem interface to remove specific item)
  // by calling cartService to get data of item from there and then delete it
  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  // adds the quantity(increments) the specific ID-based item
  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  // removes the quantity(decrements) the specifci ID-based item
  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  // makes post request to local severs to handle checkout data
  onCheckout(): void {
    this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    }).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51LYP3uLcjWZBc9IddMeQHOSUpZz5Ra2gGRZyOKLQTj9HKTnOt5TfHEB033EBfePLXKvsEju7f1pEm26btfcTOTH300io5Nvzzg');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    });
  }

}
