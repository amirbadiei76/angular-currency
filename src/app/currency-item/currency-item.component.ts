import { Component, Input } from '@angular/core';
import { CurrencyItem } from '../interface/Currencies';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'currency-item',
  imports: [CommonModule],
  templateUrl: './currency-item.component.html',
  styleUrl: './currency-item.component.css'
})
export class CurrencyItemComponent {
    
  @Input() currencyItem?: CurrencyItem;


}
