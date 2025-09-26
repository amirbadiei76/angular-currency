import { Component, inject, signal, WritableSignal } from '@angular/core';
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

  change24hText: WritableSignal<string> = signal("تغییر 24 ساعت")

  categories = [
    
  ]


  constructor(private currencyService: CurrenciesService) {
    this.reqestClass = RequestArray.requestArrayInstance(currencyService)

    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 624) {
        this.change24hText.set('24h')
      }
      else {
        this.change24hText.set('تغییر 24 ساعت')
      }
    }
  }


  ngOnInit () {
    this.reqestClass?.setupMainData();

    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        const width = document.body.clientWidth;
        console.log(width)
        if (width <= 624) {
          this.change24hText.set('24h')
        }
        else {
          this.change24hText.set('تغییر 24 ساعت')
        }
      })

      if (window.innerWidth <= 624) {
        this.change24hText.set('24h')
      }
      else {
        this.change24hText.set('تغییر 24 ساعت')
      }
    }
  }
}
