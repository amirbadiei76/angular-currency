import { Component, inject, signal, TemplateRef } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { CurrencyItem } from '../../interfaces/data.types';
import { filter_main_currencies, MAIN_CURRENCY_PREFIX } from '../../constants/Values';
import { SearchItemComponent } from '../../components/shared/search-item/search-item.component';
import { FormsModule } from '@angular/forms';
import { CommafyNumberDirective } from '../../directives/commafy-number.directive';
import { ConverterItemComponent } from '../../components/not-shared/converter/converter-item/converter-item.component';

export interface ICurrencySelect {
  id: number,
  title: string,
  image: TemplateRef<SVGAElement> | null
}

@Component({
  selector: 'app-converter',
  imports: [SearchItemComponent, CommafyNumberDirective, ConverterItemComponent, FormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  requestArray = inject(RequestArrayService);

  inputValue = signal(1);
  convertedValue = signal(1);

  mainFromList = signal<CurrencyItem[]>([])
  mainToList = signal<CurrencyItem[]>([])

  
  currentFromList = signal<CurrencyItem[]>([])
  currentToList = signal<CurrencyItem[]>([])

  currencyType = signal(0);
  currencyDropdownOpen = signal(false)

  irItem: CurrencyItem = {
    title: 'تومان ایران',
    shortedName: 'IRT',
    groupName: MAIN_CURRENCY_PREFIX,
    filterName: filter_main_currencies,
    historyCallInfo: undefined,
    id: "200",
    slugText: 'irt',
    img: 'assets/images/country-flags/ir.svg',
    lastPriceInfo: undefined
  }

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

  fromItem = signal<CurrencyItem>(this.irItem);
  fromDropdownOpen = signal(false);
  
  toItem= signal(this.irItem);
  toDropdownOpen = signal(false);
  
  constructor() {
    if (typeof window !== 'undefined') {      
      window.scrollTo(0, 0)
    }
  }

  ngOnInit () {
    if (this.requestArray.mainData) {
      this.initLists(0)
      this.initFirstValues()
    }
  }

  initFirstValues () {
    this.fromItem.set(this.mainFromList()[this.currencyType() !== 2 ? 1 : 1])
    this.toItem.set(this.mainToList()[this.currencyType() !== 2 ? 0 : 1])
  }

  selectCurrencyTypeDropdown (item: ICurrencySelect) {
    this.currencyType.set(item.id)
    this.initLists(item.id)
    this.toggleCurrencyTypeDropdown()
  }

  initLists (currentId: number) {
    switch (currentId) {
      case 0:
        const newCurrencyList = [this.irItem, ...this.requestArray.mainCurrencyList];
        this.mainFromList.set(newCurrencyList)
        this.mainToList.set(newCurrencyList)
        this.currentFromList.set(newCurrencyList)
        this.currentToList.set(newCurrencyList)
        break;
      case 1:
        const cryptoList = [...this.requestArray.cryptoList]
        this.mainFromList.set(cryptoList)
        this.mainToList.set(cryptoList)
        this.currentFromList.set(cryptoList)
        this.currentToList.set(cryptoList)
        break;
      case 2:
        const newCurrencies = [this.irItem, ...this.requestArray.mainCurrencyList];
        const cryptoItems = [...this.requestArray.cryptoList]
        this.mainFromList.set(cryptoItems)
        this.currentFromList.set(cryptoItems)
        this.mainToList.set(newCurrencies)
        this.currentToList.set(newCurrencies)
        break;
    }
    this.initFirstValues();
  }

  onInputChange (event: Event) {
    console.log((event.target as HTMLInputElement).value)
  }

  toggleCurrencyTypeDropdown () {
    this.currencyDropdownOpen.update((opend) => !opend)
  }

  toggleFromeDropdown () {
    this.fromDropdownOpen.update((opened) => !opened)
  }
  
  toggleToDropdown () {
    this.toDropdownOpen.update((opened) => !opened)
  }

  swipeCurrencies () {
    const currentFromItem = this.fromItem()
    const currentToItem = this.toItem()

    this.fromItem.set(currentToItem)
    this.toItem.set(currentFromItem)
  }

  onSelectFromItem (slug: string) {
    this.fromItem.set(this.currentFromList().find((item) => item.slugText == slug)!)
    this.toggleFromeDropdown();
  }

  
  onSelectToItem (slug: string) {
    this.toItem.set(this.currentToList().find((item) => item.slugText == slug)!)
    this.toggleToDropdown();
  }

  filterFromList(event: Event) {
    const listToFilter = [...this.mainFromList()]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase();
    if (textToFilter !== null) {
      const filteredFromItems = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
      this.currentFromList.set(filteredFromItems)
    }
  }
  
  filterToList(event: Event) {
    const listToFilter = [...this.mainToList()]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase();
    if (textToFilter !== null) {
      const filteredFromItems = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
      this.currentToList.set(filteredFromItems)
    }
  }
}
