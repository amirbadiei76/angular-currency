import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../interface/Currencies';
import { NgIf } from '@angular/common';

@Component({
  selector: 'currency-item',
  imports: [NgIf],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;


}
