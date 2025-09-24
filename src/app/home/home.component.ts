import { Component } from '@angular/core';
import { CurrenciesService } from '../services/currencies.service';
import { Currencies } from '../interface/Currencies';
import { RequestArray } from '../components/RequestArrays';
import { CurrencyItemComponent } from '../currency-item/currency-item.component';

@Component({
  selector: 'app-home',
  imports: [CurrencyItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  fetchedData?: Currencies;
  reqestClass?: RequestArray;

  constructor(private currencyService: CurrenciesService) {
    this.reqestClass = RequestArray.requestArrayInstance(currencyService)
  }

  ngOnInit () {
    this.reqestClass?.setupMainData();
  }
}
