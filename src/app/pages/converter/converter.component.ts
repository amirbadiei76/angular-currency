import { Component, effect, ElementRef, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { RequestArrayService } from '../../services/request-array.service';
import { CurrencyItem } from '../../interfaces/data.types';
import { Meta } from '@angular/platform-browser';
import { CRYPTO_PREFIX, crypto_title, currency_title, filter_main_currencies, MAIN_CURRENCY_PREFIX } from '../../constants/Values';
import { SearchItemComponent } from '../../components/shared/search-item/search-item.component';
import { FormsModule } from '@angular/forms';
import { CommafyNumberDirective } from '../../directives/commafy-number.directive';
import { ConverterItemComponent } from '../../components/not-shared/converter/converter-item/converter-item.component';
import { BehaviorSubject, combineLatest, filter, from, fromEvent, map, Observable, of, shareReplay, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { commafy, commafyString, priceToNumber, trimDecimal, valueToDollarChanges } from '../../utils/CurrencyConverter';
import { ConverterItemSkeletonComponent } from '../../components/not-shared/converter/converter-item-skeleton/converter-item-skeleton.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

type DualList = {
  first: CurrencyItem[];
  second: CurrencyItem[];
};


export interface ICurrencySelect {
  id: number,
  title: string
}

@Component({
  selector: 'app-converter',
  imports: [SearchItemComponent, CommonModule, CommafyNumberDirective, ConverterItemComponent, ConverterItemSkeletonComponent, FormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent {
  requestArray = inject(RequestArrayService);

  fromTextToFilter = signal('');
  fromTextToFilter$ = toObservable(this.fromTextToFilter)

  
  toTextToFilter = signal('');
  toTextToFilter$ = toObservable(this.toTextToFilter)

  irItem: CurrencyItem = {
    title: 'تومان ایران',
    shortedName: 'IRT',
    groupName: MAIN_CURRENCY_PREFIX,
    filterName: filter_main_currencies,
    faGroupName: currency_title,
    historyCallInfo: undefined,
    id: "200",
    slugText: 'irt',
    img: 'assets/images/country-flags/ir.svg',
    lastPriceInfo: undefined,
    realPrice: 1
  }
  

  currentValue = toSignal(from(this.requestArray.mainData!)
  .pipe(
    map((data) => data?.current),
    shareReplay(1)
  ))

  private initIrItem$ = this.requestArray.mainData!
    .pipe(
    take(1),
    tap(mainData => {
      if (!mainData?.current) return;

      const dollarChanges = (mainData.current.price_dollar_rl?.dt === 'low' ? -1 : 1) * (mainData.current.price_dollar_rl?.dp!);
      const dollarValue = priceToNumber(mainData.current.price_dollar_rl?.p!);
      const mainDollarValue = (1 / dollarValue).toFixed(8)
      const dollarChangeState = valueToDollarChanges(0, dollarChanges);
      
      this.irItem.dollarChangeState = dollarChangeState >= 0 ? 'high' : 'low';
      this.irItem.dollarChanges = trimDecimal(Math.abs(dollarChangeState)) + '';
      this.irItem.dollarStringPrice = mainDollarValue;
    }),
    shareReplay(1)
  );


  mainCurrencyListWithIR$ = this.requestArray.mainCurrencyList.pipe(
    map(list => {
      const hasIR = list.some(item => item.id === this.irItem.id);
  
      return hasIR
        ? list
        : [this.irItem, ...list];
    }),
    shareReplay(1)
  );

  // mainCurrencyList = toSignal(this.requestArray?.mainCurrencyList);
  // cryptoList = toSignal(this.requestArray?.cryptoList);

  private dualCategoryStreamMap: Record<
    number,
    Observable<DualList>
  > = {
    0: combineLatest([
      this.mainCurrencyListWithIR$,
      this.mainCurrencyListWithIR$
    ]).pipe(
      map(([list1, list2]) => ({
        first: list1,
        second: list2
      }))
    ),

    1: combineLatest([
      this.requestArray.cryptoList,
      this.requestArray.cryptoList
    ]).pipe(
      map(([list1, list2]) => ({
        first: list1,
        second: list2
      }))
    ),

    2: combineLatest([
      this.mainCurrencyListWithIR$,
      this.requestArray.cryptoList
    ]).pipe(
      map(([mainList, cryptoList]) => ({
        first: mainList,
        second: cryptoList
      }))
    )
  };


  @ViewChild('typesBtn') typesBtn?: ElementRef<HTMLDivElement>
  @ViewChild('fromBtn') fromBtn?: ElementRef<HTMLDivElement>
  @ViewChild('toBtn') toBtn?: ElementRef<HTMLDivElement>

  inputValueSubject = new BehaviorSubject<string>('1');
  inputValue$ = this.inputValueSubject.asObservable();
  inputValue = toSignal(this.inputValue$);
  
  convertedValueSubject = new BehaviorSubject<string>('');
  convertedValue = this.convertedValueSubject.asObservable();

  mainFromListSubject = new BehaviorSubject<CurrencyItem | undefined>(undefined);
  mainFromList$ = this.mainFromListSubject.asObservable()
  mainFromList = signal<CurrencyItem[]>([])

  
  mainToListSubject = new BehaviorSubject<CurrencyItem | undefined>(undefined);
  mainToList$ = this.mainToListSubject.asObservable();
  mainToList = signal<CurrencyItem[]>([])

  
  currentFromList = signal<CurrencyItem[]>([])
  currentToList = signal<CurrencyItem[]>([])

  currencyType = signal(0);
  currencyType$ = toObservable(this.currencyType)
  currencyDropdownOpen = signal(false)


  

  currencyTypes: ICurrencySelect[] = [
    {
      id: 0,
      title: 'ارز به ارز'
    },
    {
      id: 1,
      title: 'ارز دیجیتال به ارز دیجیتال'
    },
    {
      id: 2,
      title: 'ارز دیجیتال به ارز'
    },
  ]

  fromItemSubject = new BehaviorSubject<CurrencyItem | undefined>(undefined);
  fromDropdownOpen = signal(false);
  fromItem$ = this.fromItemSubject.asObservable()
  
  toItemSubject = new BehaviorSubject<CurrencyItem | undefined>(undefined);
  toDropdownOpen = signal(false);
  toItem$ = this.toItemSubject.asObservable()
  

  dualList$ = this.initIrItem$.pipe(
    switchMap(() =>
      this.currencyType$.pipe(
        switchMap(type =>
          this.dualCategoryStreamMap[type] ?? of({ first: [], second: [] })
        )
      )
    ),
    shareReplay(1)
  );

  filteredFromList$ = combineLatest([
    this.dualList$,
    this.fromTextToFilter$
  ]).pipe(
    map(([{ first }, filterText]) => {
      if (!filterText) return first;

      const text = filterText.trim().toLowerCase();

      return first.filter(item =>
        item.title.toLowerCase().includes(text) ||
        item.shortedName?.toLowerCase().includes(text)
      );
    }),
    shareReplay(1)
  );

  filteredToList$ = combineLatest([
    this.dualList$,
    this.toTextToFilter$
  ]).pipe(
    map(([{ second }, filterText]) => {
      if (!filterText) return second;

      const text = filterText.trim().toLowerCase();

      return second.filter(item =>
        item.title.toLowerCase().includes(text) ||
        item.shortedName?.toLowerCase().includes(text)
      );
    }),
    shareReplay(1)
  );




  syncFromTo$ = this.dualList$.pipe(
    withLatestFrom(this.currencyType$),
    map(([{ first, second }]) => {

      const from = first?.[1];
      const to = second?.[this.currencyType() === 2 ? 1 : 0];

      this.fromItemSubject.next(from);
      this.toItemSubject.next(to);
    })
  );
  

  calculateOutput$ = combineLatest([
    this.inputValue$,
    this.fromItem$,
    this.toItem$,
    this.currencyType$
  ]).pipe(
    map(([value, from, to, currencyType]) : string => {
      const currentValue = priceToNumber(value) || 1;
      const fromRealValue = from?.realPrice || 1;
      const toRealValue = to?.realPrice || 1;
      if (currencyType === 0) {
        const outputValue = currentValue * (fromRealValue! / toRealValue!);
        if (to?.shortedName === 'IRT') {
          return commafy(outputValue / 10)
        }
        else if (from?.shortedName === 'IRT') {
          return commafyString((outputValue / 10).toFixed(9))
        }
        else {
          return commafy(trimDecimal(outputValue, 4))
        }
      }
      else if (currencyType === 1) {
        const outputValue = currentValue * (fromRealValue! / toRealValue!);
        return commafy(trimDecimal(outputValue, 4))
      }
      else {
        const outputValue = currentValue * (fromRealValue! / toRealValue!);
        if (to?.shortedName === 'IRT') {
          return commafy(outputValue / 10)
        }
        else {
          return commafy(trimDecimal(outputValue, 4))
        }
      }
    })
  );

  
  constructor(private meta: Meta) {
    this.syncFromTo$.subscribe();
    // this.calculateOutput$.subscribe();

    if (typeof window !== 'undefined') {      
      window.scrollTo(0, 0)
    }

    // this.dualList$.subscribe((items) => console.log(items))
    
    // effect(() => {
      // if (this.fromDropdownOpen() || this.toDropdownOpen()) this.initLists(currencyType)
      
      // this.requestArray.mainData?.subscribe((items) => {
      //   this.initRialChanges()
      // })
      
      // this.calculateOutput(this.inputValue() || '1')
    // })

  }

  ngOnInit () {
    this.meta.updateTag({
      name: 'description',
      content: `مبدل ارز ارزیاب؛ تبدیل سریع و دقیق ارزهای معتبر با نرخ به‌روز بازار.`
    });

    // if (this.mainCurrencyList()) {
      // this.initLists(0)
      // this.initRialChanges();
      // this.initFirstValues();
      // this.calculateOutput('1');
    // }
  }

  // reconcileSelection(list: CurrencyItem[], previous?: CurrencyItem): CurrencyItem | undefined {
  //   const found = previous ? list.find(item => item.id === previous.id) : undefined;
  //   return found ?? list[0];
    //   if (!previous) {
    //     return list[0];
    //   }
  
    //   const found = list.find(item => item.id === previous.id);
    // return found ?? list[0];
  // }
  

  // initRialChanges () {
  //   const dollarChanges = (this.currentValue()?.price_dollar_rl?.dt === 'low' ? -1 : 1) * (this.currentValue()?.price_dollar_rl?.dp!);
  //   const dollarValue = priceToNumber(this.currentValue()?.price_dollar_rl?.p!);
  //   const mainDollarValue = (1/dollarValue).toFixed(8)
  //   const dollarChangeState = valueToDollarChanges(0, dollarChanges);
    
  //   this.irItem.dollarChangeState = dollarChangeState >= 0 ? 'high' : 'low';
  //   this.irItem.dollarChanges = trimDecimal(Math.abs(dollarChangeState)) + '';
  //   this.irItem.dollarStringPrice = mainDollarValue;
  // }

  ngAfterViewInit () {
    // if (this.mainCurrencyList()) {
      // this.initLists(0)
      // this.initRialChanges();
      // this.initFirstValues();
      // this.calculateOutput('1');
    // }
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

  // initFirstValues () {
  //   this.fromItemSubject.next(this.mainFromList()[this.currencyType() !== 2 ? 1 : 1])
  //   this.toItemSubject.next(this.mainToList()[this.currencyType() !== 2 ? 0 : 1])
  // }

  selectCurrencyTypeDropdown (item: ICurrencySelect) {
    this.currencyType.set(item.id)
    // this.initLists(item.id)
    // this.initFirstValues()
    // this.dualList$.subscribe();
    this.syncFromTo$.subscribe();
    this.toggleCurrencyTypeDropdown()
  }

  // initLists (currentId: number) {
  //   switch (currentId) {
  //     case 0:
  //       const newCurrencyList = [this.irItem, ...this.mainCurrencyList()!];
  //       this.mainFromList.set(newCurrencyList)
  //       this.mainToList.set(newCurrencyList)
  //       this.currentFromList.set(newCurrencyList)
  //       this.currentToList.set(newCurrencyList)
  //       break;
  //     case 1:
  //       const cryptoList = [...this.cryptoList()!]
  //       this.mainFromList.set(cryptoList)
  //       this.mainToList.set(cryptoList)
  //       this.currentFromList.set(cryptoList)
  //       this.currentToList.set(cryptoList)
  //       break;
  //     case 2:
  //       const newCurrencies = [this.irItem, ...this.mainCurrencyList()!];
  //       const cryptoItems = [...this.cryptoList()!]
  //       this.mainFromList.set(cryptoItems)
  //       this.currentFromList.set(cryptoItems)
  //       this.mainToList.set(newCurrencies)
  //       this.currentToList.set(newCurrencies)
  //       break;
  //   }
    
  // }



  onInputChange (event: Event) {
    const value = (event.target as HTMLInputElement).value || '1';
    // this.inputValue.set(commafy(priceToNumber(value) || 1))
    this.inputValueSubject.next(commafy(priceToNumber(value) || 1))
    // this.calculateOutput(value)
  }

  // calculateOutput (value: string) {
  //   const currentValue = priceToNumber(value) || 1;
  //   const fromRealValue = this.fromItem()?.realPrice || 1;
  //   const toRealValue = this.toItem()?.realPrice || 1;
  //   if (this.currencyType() === 0) {
  //     const outputValue = currentValue * (fromRealValue! / toRealValue!);
  //     if (this.toItem()?.shortedName === 'IRT') {
  //       this.convertedValue.set(commafy(outputValue / 10))
  //     }
  //     else if (this.fromItem()?.shortedName === 'IRT') {
  //       this.convertedValue.set(commafyString((outputValue / 10).toFixed(9)))
  //     }
  //     else {
  //       this.convertedValue.set(commafy(trimDecimal(outputValue, 4)))
  //     }
  //   }
  //   else if (this.currencyType() === 1) {
  //     const outputValue = currentValue * (fromRealValue! / toRealValue!);
  //     this.convertedValue.set(commafy(trimDecimal(outputValue, 4)))
  //   }
  //   else if (this.currencyType() === 2) {
  //     const outputValue = currentValue * (fromRealValue! / toRealValue!);
  //     if (this.toItem()?.shortedName === 'IRT') {
  //       this.convertedValue.set(commafy(outputValue / 10))
  //     }
  //     else {
  //       this.convertedValue.set(commafy(trimDecimal(outputValue, 4)))
  //     }
  //   }
  // }

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
    combineLatest([this.fromItem$, this.toItem$])
    .pipe(take(1))
    .subscribe(([from, to]) => {
      this.fromItemSubject.next(to);
      this.toItemSubject.next(from);
    });
  }

  onSelectFromItem (slug: string) {
    this.dualList$.subscribe((items) => {
      this.fromItemSubject.next(items.first.find((item) => item.slugText == slug))
    })
    this.resetSearchInputs();
    // this.fromItemSubject.next(this.currentFromList().find((item) => item.slugText == slug)!)
    this.toggleFromeDropdown();
    // this.initLists(this.currencyType())
  }

  
  onSelectToItem (slug: string) {
    this.dualList$.subscribe((items) => {
      this.toItemSubject.next(items.second.find((item) => item.slugText == slug))
    })
    this.resetSearchInputs();
    // this.toItemSubject.next(this.currentToList().find((item) => item.slugText == slug)!)
    this.toggleToDropdown();
    // this.initLists(this.currencyType())
  }

  resetSearchInputs () { 
    this.fromTextToFilter.set('')
    this.toTextToFilter.set('')
  }

  filterFromList(event: Event) {
    // const listToFilter = [...this.mainFromList()]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase();
    this.fromTextToFilter.set(textToFilter)
    // if (textToFilter !== null) {
    //   const filteredFromItems = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
    //   this.currentFromList.set(filteredFromItems)
    // }
  }
  
  filterToList(event: Event) {
    // const listToFilter = [...this.mainToList()]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase();
    this.toTextToFilter.set(textToFilter)
    // if (textToFilter !== null) {
    //   const filteredFromItems = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
    //   this.currentToList.set(filteredFromItems)
    // }
  }
}
