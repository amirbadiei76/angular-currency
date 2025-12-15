import { Component, inject, signal, TemplateRef } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { CurrencyItem } from '../../interfaces/data.types';

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

  currentFromList = signal([])
  currentToList = signal([])

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

    this.toggleCurrencyTypeDropdown()
  }

  initLists (currentId: number) {
    switch (currentId) {
      case 0:
        // this.currentFromList.set(this.requestArray.mainCurrencyList)
        break;

      case 1:

        break;

      case 2:

        break;
    }
  }

  toggleCurrencyTypeDropdown () {
    this.currencyDropdownOpen.update((opend) => !opend)
  }
}
