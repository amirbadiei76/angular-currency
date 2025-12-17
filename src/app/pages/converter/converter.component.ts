import { Component, effect, ElementRef, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { CurrencyItem } from '../../interfaces/data.types';
import { filter_main_currencies, MAIN_CURRENCY_PREFIX } from '../../constants/Values';
import { SearchItemComponent } from '../../components/shared/search-item/search-item.component';
import { FormsModule } from '@angular/forms';
import { CommafyNumberDirective } from '../../directives/commafy-number.directive';
import { ConverterItemComponent } from '../../components/not-shared/converter/converter-item/converter-item.component';
import { fromEvent } from 'rxjs';
import { commafy, trimDecimal, valueToDollarChanges } from '../../utils/CurrencyConverter';

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

  @ViewChild('typesBtn') typesBtn?: ElementRef<HTMLDivElement>
  @ViewChild('fromBtn') fromBtn?: ElementRef<HTMLDivElement>
  @ViewChild('toBtn') toBtn?: ElementRef<HTMLDivElement>

  inputValue = signal(1);
  convertedValue = signal('');

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
    lastPriceInfo: undefined,
    realPrice: 1
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
    
    effect(() => {
      if (this.fromDropdownOpen() || this.toDropdownOpen()) this.initLists(this.currencyType())
      
      this.calculateOutput()
    })
  }

  ngOnInit () {
    if (this.requestArray.mainData) {
      this.initLists(0)
      this.initFirstValues();
      this.initRialChanges()
      this.calculateOutput()
    }
  }

  initRialChanges () {
    const dollarChanges = (this.requestArray.mainData?.current.price_dollar_rl?.dt === 'low' ? -1 : 1) * (this.requestArray?.mainData?.current.price_dollar_rl?.dp!);
    const dollarValue = +(this.requestArray.mainData?.current?.price_dollar_rl?.p!.replaceAll(',', '')!);
    const mainDollarValue = (1/dollarValue).toFixed(8)
    const dollarChangeState = valueToDollarChanges(0, dollarChanges);
    
    this.irItem.dollarChangeState = dollarChangeState >= 0 ? 'high' : 'low';
    this.irItem.dollarChanges = trimDecimal(Math.abs(dollarChangeState)) + '';
    this.irItem.dollarStringPrice = mainDollarValue;
  }

  ngAfterViewInit () {
    if (typeof document !== 'undefined') {
      fromEvent<MouseEvent>(document, 'click')
      .subscribe((event) => {
        if (!this.typesBtn?.nativeElement.contains(event.target as Node)) {
          this.currencyDropdownOpen.set(false)
        }
        if (!this.fromBtn?.nativeElement.contains(event.target as Node)) {
          this.fromDropdownOpen.set(false)
        }
        if (!this.toBtn?.nativeElement.contains(event.target as Node)) {
          this.toDropdownOpen.set(false)
        }
      })
    }
  }

  initFirstValues () {
    this.fromItem.set(this.mainFromList()[this.currencyType() !== 2 ? 1 : 1])
    this.toItem.set(this.mainToList()[this.currencyType() !== 2 ? 0 : 1])
  }

  selectCurrencyTypeDropdown (item: ICurrencySelect) {
    this.currencyType.set(item.id)
    this.initLists(item.id)
    this.initFirstValues()
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
  }



  onInputChange (event: Event) {
    this.calculateOutput()
  }

  calculateOutput () {
    const currentValue = Number(this.inputValue().toString().replace(/,/g, '') || 1);
    const fromRealValue = this.fromItem().realPrice;
    const toRealValue = this.toItem().realPrice;
    if (this.currencyType() === 0) {
      const outputValue = currentValue * (fromRealValue! / toRealValue!);
      if (this.toItem().shortedName === 'IRT') {
        this.convertedValue.set(commafy(outputValue / 10))
      }
      else if (this.fromItem().shortedName === 'IRT') {
        this.convertedValue.set((outputValue / 10).toFixed(9))
      }
      else {
        this.convertedValue.set(commafy(trimDecimal(outputValue, 4)))
      }
    }
    else if (this.currencyType() === 1) {
      const outputValue = currentValue * (fromRealValue! / toRealValue!);
      this.convertedValue.set(commafy(trimDecimal(outputValue, 4)))
    }
    else if (this.currencyType() === 2) {
      const outputValue = currentValue * (fromRealValue! / toRealValue!);
      if (this.toItem().shortedName === 'IRT') {
        this.convertedValue.set(commafy(outputValue / 10))
      }
      else {
        this.convertedValue.set(commafy(trimDecimal(outputValue, 4)))
      }
    }
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
    this.initLists(this.currencyType())
  }

  
  onSelectToItem (slug: string) {
    this.toItem.set(this.currentToList().find((item) => item.slugText == slug)!)
    this.toggleToDropdown();
    this.initLists(this.currencyType())
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
