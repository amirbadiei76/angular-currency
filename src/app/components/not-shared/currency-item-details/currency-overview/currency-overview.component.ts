import { Component, Input, signal } from '@angular/core';
import { CurrencyItem } from '../../../../interface/Currencies';
import { RelatedItemComponent } from '../related-item/related-item.component';

@Component({
  selector: 'app-currency-overview',
  imports: [RelatedItemComponent],
  templateUrl: './currency-overview.component.html',
  styleUrl: './currency-overview.component.css'
})
export class CurrencyOverviewComponent {
  @Input() relatedItems?: CurrencyItem[];

  currentType = signal(0);
  currentSupportCurrencyId = signal(0)
  currentList = signal(this.relatedItems?.slice(0, 5));

  supportedCurrencies = [
    {
      id: 0,
      title: 'تومان IRT'
    },
    {
      id: 1,
      title: 'دلار USD'
    }
  ]

  constructor () {
    
  }

  ngOnInit () {
    this.changeCurrentType(0)
  }

  changeCurrentType (value: number) {
    this.currentType.set(value)
    const ascList = this.getRelatedhListAscending();
    switch (value) {
      case 0:
        this.currentList.set(ascList.slice(0, 5))
        break;
      case 1:
        this.currentList.set(ascList.reverse().slice(0, 5))
        break;
    }
  }

  getRelatedListDescending () {
    const descendingPriceList: CurrencyItem[] = [...this.relatedItems!!]
    const mainDescList = descendingPriceList.sort((a: CurrencyItem, b: CurrencyItem) => {
      const aValue = (a.lastPriceInfo.dt === 'high' ? '+' : '-') + a.lastPriceInfo.dp;
      const bValue = (b.lastPriceInfo.dt === 'high' ? '+' : '-') + b.lastPriceInfo.dp;

      const realAValue = aValue.startsWith('-') ? Number(aValue) : a.lastPriceInfo.dp;
      const realBValue = bValue.startsWith('-') ? Number(bValue) : b.lastPriceInfo.dp;
      
      if (realAValue > realBValue) return 1
      else return -1
    })
    return mainDescList;
  }

  
  getRelatedhListAscending () {
    const ascendingPriceList: CurrencyItem[] = [...this.relatedItems!!]
    const mainAscList = ascendingPriceList.sort((a: CurrencyItem, b: CurrencyItem) => {
      const aValue = (a.lastPriceInfo.dt === 'high' ? '+' : '-') + a.lastPriceInfo.dp;
      const bValue = (b.lastPriceInfo.dt === 'high' ? '+' : '-') + b.lastPriceInfo.dp;

      const realAValue = aValue.startsWith('-') ? Number(aValue) : a.lastPriceInfo.dp;
      const realBValue = bValue.startsWith('-') ? Number(bValue) : b.lastPriceInfo.dp;
      
      if (realAValue > realBValue) return -1
      else return 1
    })
    return mainAscList;
  }

}
