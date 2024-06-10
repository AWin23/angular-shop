import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html',
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();  // Output so it sends data outside of your component
  categoriesSubscription: Subscription | undefined;
  categories: Array<string> | undefined;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService.getAllCategories()
      .subscribe((response) => {
        this.categories = response;
      });
  }

  // method that emits the category(toggles it to open)
  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
      if(this.categoriesSubscription) {
        this.categoriesSubscription.unsubscribe();
      }
  }

}
