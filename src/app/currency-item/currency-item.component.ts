import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../interface/Currencies';
import { CommonModule, NgIf } from '@angular/common';
import { RequestArray } from '../components/RequestArrays';
import { CurrenciesService } from '../services/currencies.service';
import { StarIconComponent } from '../star-icon/star-icon.component';


@Component({
  selector: 'currency-item',
  imports: [CommonModule, NgIf, StarIconComponent],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;

  requestArray?: RequestArray
  
  constructor(private service: CurrenciesService) {
    this.requestArray = RequestArray.requestArrayInstance(service)
  }

  addToFav() {
    this.requestArray?.addToFavorite(this.currencyItem!!)
  }

  removeFromFav() {
    this.requestArray?.removeFromFavorite(this.currencyItem?.id!!)
  }

}
