import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../interface/Currencies';

@Component({
  selector: 'currency-item',
  imports: [],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;


}
