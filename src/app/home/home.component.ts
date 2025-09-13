import { Component } from '@angular/core';
import { CurrenciesService } from '../services/currencies.service';
import { Currencies } from '../interface/Currencies';
import { RequestArray } from '../components/RequestArrays';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  fetchedData?: Currencies;
  reqestClass?: RequestArray;

  constructor(private currencyService: CurrenciesService) {
    this.reqestClass = new RequestArray(this.currencyService);
  }

  ngOnInit () {
    this.reqestClass?.setupMainData();
  }
}
