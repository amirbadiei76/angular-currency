import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../interface/Currencies';
import { CommonModule, NgIf } from '@angular/common';
import { StarIconComponent } from '../star-icon/star-icon.component';
import { RequestArrayService } from '../services/request-array.service';


@Component({
  selector: 'currency-item',
  imports: [CommonModule, NgIf, StarIconComponent],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;
  requestArray?: RequestArrayService;

  currentCurrencyItem?: CurrencyItem;
  
  constructor(private requestService: RequestArrayService) {
    this.requestArray = requestService
    this.currentCurrencyItem = this.currencyItem;
  }

  addToFav() {
    this.requestArray?.addToFavorite(this.currencyItem!)
  }

  removeFromFav() {
    this.requestArray?.removeFromFavorite(this.currencyItem?.id!)
  }

}
