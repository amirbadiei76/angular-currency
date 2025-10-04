import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../interface/Currencies';
import { CommonModule, NgIf } from '@angular/common';
import { StarIconComponent } from '../star-icon/star-icon.component';
import { RequestArrayService } from '../services/request-array.service';
import { toman_unit } from '../constants/Values';


@Component({
  selector: 'currency-item',
  imports: [CommonModule, NgIf, StarIconComponent],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;
  @Input() showCurrencyId?: number;

  requestArray?: RequestArrayService;

  currentCurrencyItem?: CurrencyItem;
  priceValue?: string | number;
  
  constructor(private requestService: RequestArrayService) {
    this.requestArray = requestService
    this.currentCurrencyItem = this.currencyItem;
  }
  
  ngOnInit () {
    this.priceValue = (this.currencyItem?.unit === toman_unit) ? this.currencyItem.tomanStringPrice : this.currencyItem?.lastPriceInfo.p
  }

  addToFav() {
    this.requestArray?.addToFavorite(this.currencyItem!)
  }

  removeFromFav() {
    this.requestArray?.removeFromFavorite(this.currencyItem?.id!)
  }

}
