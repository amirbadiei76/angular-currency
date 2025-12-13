import { Component, Input, input } from '@angular/core';
import { CurrencyItem } from '../../../../interfaces/data.types';

@Component({
  selector: 'app-percent-progress',
  imports: [],
  templateUrl: './percent-progress.component.html',
  styleUrl: './percent-progress.component.css'
})
export class PercentProgressComponent {

  @Input() currencyItem?: CurrencyItem;
  currentSupportCurrencyId = input<number>(0)
  currentMinPrice = input('')
  currentMaxPrice = input('')
  currentPercentMinMax = input('0%')

}
