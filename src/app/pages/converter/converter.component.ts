import { Component, inject, signal, TemplateRef } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { CurrencyItem } from '../../interfaces/data.types';
import { filter_main_currencies, MAIN_CURRENCY_PREFIX } from '../../constants/Values';
import { Observable } from 'rxjs';

export interface ICurrencySelect {
  id: number,
  title: string,
  image: TemplateRef<SVGAElement> | null
}

@Component({
  selector: 'app-converter',
  imports: [],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  requestArray = inject(RequestArrayService);

  currentFromList = signal<CurrencyItem[]>([])
  currentToList = signal<CurrencyItem[]>([])

  currencyType = signal(0);
  currencyDropdownOpen = signal(false)

  currencyTypes: ICurrencySelect[] = [
    {
      id: 0,
      title: 'ارز به ارز',
      image: null,
    },
    {
      id: 1,
      title: 'ارز دیجیتال به ارز دیجیتال',
      image: null,
    },
    {
      id: 2,
      title: 'ارز دیجیتال به ارز',
      image: null,
    },
  ]

  fromIndex = signal(0);
  fromDropdownOpen = signal(false);
  
  toIndex = signal(1);
  toDropdownOpen = signal(false);
  
  constructor() {
    console.log(this.requestArray)
    if (typeof window !== 'undefined') {      
      window.scrollTo(0, 0)
    }
  }

  ngOnInit () {
  }

  selectCurrencyTypeDropdown (item: ICurrencySelect) {
    this.currencyType.set(item.id)
    this.initLists(item.id)
    this.toggleCurrencyTypeDropdown()
  }

  initLists (currentId: number) {
    const irItem: CurrencyItem = {
      title: 'تومان ایران',
      groupName: MAIN_CURRENCY_PREFIX,
      filterName: filter_main_currencies,
      historyCallInfo: undefined,
      id: "200",
      img: 'assets/images/country-flags/ir.svg',
      lastPriceInfo: undefined
    }
    switch (currentId) {
      case 0:
        const newCurrencyList = [irItem, ...this.requestArray.mainCurrencyList];
        this.currentFromList.set(newCurrencyList)
        this.currentToList.set(newCurrencyList)
        break;
      case 1:
        const cryptoList = [...this.requestArray.cryptoList]
        this.currentFromList.set(cryptoList)
        this.currentToList.set(cryptoList)
        break;
      case 2:
        const newCurrencies = [irItem, ...this.requestArray.mainCurrencyList];
        const cryptoItems = [...this.requestArray.cryptoList]
        this.currentFromList.set(cryptoItems)
        this.currentToList.set(newCurrencies)
        break;
    }
  }

  toggleCurrencyTypeDropdown () {
    this.currencyDropdownOpen.update((opend) => !opend)
  }
}
