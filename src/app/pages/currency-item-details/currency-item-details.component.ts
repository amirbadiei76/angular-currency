import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb.component';
import { CurrencyItem, Current } from '../../interfaces/data.types';
import { RequestArrayService } from '../../services/request-array.service';
import { ItemInfoComponent } from '../../components/not-shared/currency-item-details/item-info/item-info.component';
import { NotificationService } from '../../services/notification.service';
import { Meta, Title } from '@angular/platform-browser';
import { base_metal_title, BASE_METALS_PREFIX, COIN_PREFIX, coin_title, COMMODITY_PREFIX, commodity_title, CRYPTO_PREFIX, crypto_title, currency_title, dollar_unit, GOLD_PREFIX, gold_title, MAIN_CURRENCY_PREFIX, precious_metal_title, PRECIOUS_METALS_PREFIX, toman_unit, WORLD_MARKET_PREFIX, world_title } from '../../constants/Values';
import { SearchItemComponent } from '../../components/shared/search-item/search-item.component';
import { combineLatest, distinctUntilChanged, filter, from, fromEvent, map, Observable, of, retry, shareReplay, switchMap, take, tap, throttleTime } from 'rxjs';
import { CurrencyOverviewComponent } from '../../components/not-shared/currency-item-details/currency-overview/currency-overview.component';
import { commafy, dollarToToman, poundToDollar, poundToToman, priceToNumber, rialToDollar, rialToToman, trimDecimal } from '../../utils/CurrencyConverter';
import { RawData } from '../../interfaces/chart.types';
import { ChartComponent } from '../../components/not-shared/currency-item-details/chart/chart.component';
import { ChangesTableComponent } from '../../components/not-shared/currency-item-details/changes-table/changes-table.component';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { ItemInfoSkeletonComponent } from '../../components/not-shared/currency-item-details/item-info-skeleton/item-info-skeleton.component';
import { PercentProgressComponent } from '../../components/not-shared/currency-item-details/percent-progress/percent-progress.component';
import { PercentProgressSkeletonComponent } from '../../components/not-shared/currency-item-details/percent-progress-skeleton/percent-progress-skeleton.component';
import { NotFoundBoxComponent } from '../../components/shared/not-found-box/not-found-box.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currency-item-details',
  imports: [BreadcrumbComponent, FormsModule, CommonModule, ItemInfoComponent, PercentProgressComponent, SearchItemComponent, ChangesTableComponent, CurrencyOverviewComponent, ChartComponent],
  templateUrl: './currency-item-details.component.html',
  styleUrl: './currency-item-details.component.css'
})
export class CurrencyItemDetailsComponent {
  route = inject(ActivatedRoute)
  requestArray = inject(RequestArrayService)
  meta = inject(Meta)
  pageTitle = inject(Title)

  textToFilter = signal('');
  textToFilter$ = toObservable(this.textToFilter)

  currentSupportCurrencyId = signal(0)
  currentSupportCurrencyId$ = toObservable(this.currentSupportCurrencyId)

  title$ = this.route.params.pipe(
    map(params => params['title'] as string),
    filter(Boolean),
    distinctUntilChanged(),
    shareReplay(1)
  );

  currencyItem$ = this.title$.pipe(
    switchMap(title =>
      this.requestArray.allItemsList.pipe(
        map(items => items.find(item => item.slugText === title) ?? null)
      )
    ),
    filter(Boolean),
    shareReplay(1)
  );

  currentValue = this.requestArray.mainData!
  .pipe(
    map((data) => data?.current),
    shareReplay(1)
  )

  private categoryStreamMap: Record<
      string,
      Observable<CurrencyItem[]>
  > = {
    [currency_title]: this.requestArray?.mainCurrencyList!,
    [gold_title]: this.requestArray?.goldList!,
    [coin_title]: this.requestArray?.coinList!,
    [crypto_title]: this.requestArray?.cryptoList!,
    [world_title]: this.requestArray?.worldMarketList!,
    [precious_metal_title]: this.requestArray?.preciousMetalList!,
    [base_metal_title]: this.requestArray?.baseMetalList!,
    [commodity_title]: this.requestArray?.commodityList!,
  };


  itemFaGroupName$ = this.currencyItem$.pipe(
    map((item) => item.faGroupName)
  )

  
  currentCategoryItems$ = this.itemFaGroupName$.pipe(
    switchMap((group) => this.categoryStreamMap[group!] ?? of([]))
  );

  currentFilteredList$ = combineLatest([
    this.currentCategoryItems$,
    this.textToFilter$
  ]).pipe(
    map(([categoryItems, textToFilter]) => {
      if (!textToFilter) return categoryItems;

      const text = textToFilter.trim().toLowerCase();

      return categoryItems.filter(item =>
        item.title.toLowerCase().includes(text) ||
        item.shortedName?.toLowerCase().includes(text)
      );
    }),
    shareReplay(1)
  );

  breadCrumbItems$ = this.currencyItem$.pipe(
    map((item) => {
      return [
          {
            title: 'صفحه اصلی', link: '/'
          },
          {
            title: item.title,
          }
      ];
    })
  );

  chartHistory$ = this.currencyItem$.pipe(
    switchMap(item => {
      if (!item.historyCallInfo) {
        return of<RawData[]>([]);
      }

      return item.historyCallInfo.pipe(
        retry({ count: Infinity }),
        map((data) => [...data])
      );
    }),
    shareReplay(1)
  );




  priceInfo$ = combineLatest([
    this.currencyItem$,
    this.currentValue,
    this.currentSupportCurrencyId$
  ]).pipe(
    map(([item, currentValue, type]) => {

      const last = item.lastPriceInfo;
      if (!last) {
        return null;
      }

      if (item.faGroupName === 'بازارهای ارزی') {
        const max = priceToNumber(last.h);
        const min = priceToNumber(last.l);
        const cur = priceToNumber(last.p);

        const percent = max === min ? 1 : (cur - min) / (max - min);

        return {
          max: max.toString(),
          min: min.toString(),
          percent: `${trimDecimal(percent * 100)}%`
        };
      }

      if (type === 0) {
        if (item.unit === toman_unit) {
          const max = rialToToman(last.h);
          const min = rialToToman(last.l);
          const cur = rialToToman(last.p);

          const percent = max === min ? 1 : (cur - min) / (max - min);

          return {
            max: commafy(max),
            min: commafy(min),
            percent: `${trimDecimal(percent * 100)}%`
          };
        }

        if (item.unit === dollar_unit) {
          const max = dollarToToman(last.h, currentValue!);
          const min = dollarToToman(last.l, currentValue!);
          const cur = dollarToToman(last.p, currentValue!);

          const percent = max === min ? 1 : (cur - min) / (max - min);

          return {
            max: commafy(max),
            min: commafy(min),
            percent: `${trimDecimal(percent * 100)}%`
          };
        }

        const max = poundToToman(last.h, currentValue!);
        const min = poundToToman(last.l, currentValue!);
        const cur = poundToToman(last.p, currentValue!);

        const percent = max === min ? 1 : (cur - min) / (max - min);

        return {
          max: commafy(max),
          min: commafy(min),
          percent: `${trimDecimal(percent * 100)}%`
        };
      }

      if (item.unit === toman_unit) {
        const max = rialToDollar(last.h, currentValue!);
        const min = rialToDollar(last.l, currentValue!);
        const cur = rialToDollar(last.p, currentValue!);

        const percent = max === min ? 1 : (cur - min) / (max - min);

        return {
          max: commafy(max),
          min: commafy(min),
          percent: `${trimDecimal(percent * 100)}%`
        };
      }

      if (item.unit === dollar_unit) {
        const max = priceToNumber(last.h);
        const min = priceToNumber(last.l);
        const cur = priceToNumber(last.p);

        const percent = max === min ? 1 : (cur - min) / (max - min);

        return {
          max: commafy(max),
          min: commafy(min),
          percent: `${trimDecimal(percent * 100)}%`
        };
      }

      // پوند به دلار
      const max = poundToDollar(last.h, currentValue!);
      const min = poundToDollar(last.l, currentValue!);
      const cur = poundToDollar(last.p, currentValue!);

      const percent = max === min ? 1 : (cur - min) / (max - min);

      return {
        max: commafy(max),
        min: commafy(min),
        percent: `${(percent * 100).toFixed(2)}%`
      };
    }),
    filter(Boolean),
    shareReplay(1)
  );


  
  // currentMaxPrice = signal('');
  // currentMinPrice = signal('');
  // currentPercentMinMax = signal('0%')
  
  historyData?: RawData[];
  currentChartType = signal(0);

  canShowItem = signal(true);

  @ViewChild('itemList') itemList?: ElementRef<HTMLDivElement>;
  @ViewChild('inputContainer') inputContainer?: ElementRef;

  constructor(private notificationService: NotificationService, private router: Router) {
    // this.themeServiceInstance = themeService;
    // if (!this.requestArray.mainData) {
    //   this.requestArray.setupMainData();
    // }

    // effect(() => {
    //   this.initializeCurrencyInfo(this.currentSupportCurrencyId())
    // })
  }
  

  inputFocus () {
    this.itemList?.nativeElement.classList.remove('hidden')
    this.itemList?.nativeElement.classList.add('flex')
  }

  
  inputBlur () {
    this.itemList?.nativeElement.classList.remove('flex')
    this.itemList?.nativeElement.classList.add('hidden')
  }

  ngAfterViewInit () {
    if (typeof document !== 'undefined') {
      fromEvent(document, 'click')
      .subscribe((event) => {
        const clicked = event.target as Node;
        if (!this.inputContainer?.nativeElement.contains(clicked)) {
          this.inputBlur()
        }
      })
    }
  }

  onItemSelect(slug: string) {
    this.inputBlur()
    this.textToFilter.set('')
    this.router.navigate([`/${slug}`])
    window.scrollTo(0, 0)
  }

  onChartTypeChange (type: number) {
    this.currentChartType.set(type)
  }

  
  filterList(event: Event) {
    // const listToFilter = [...this.currentCategoryItems!!]
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.textToFilter.set(inputValue)
    // if (this.inputValue !== null) {
    //   this.currentFilteredList = listToFilter.filter(item => item.title.toLowerCase().includes(this.inputValue) || item.shortedName?.toLowerCase().includes(this.inputValue))
    // }
  }

  sharePage () {
    const url = window.location.href;

    if (!navigator.share) {
      navigator.clipboard.writeText(document.title + '\n' + url);
      this.notificationService.show('آدرس صفحه در کلیپ بورد ذخیره شد')
      return;
    }

    navigator.share({ title: document.title, url: url })
      .catch(() => console.warn("Share dialog dismissed"));
  }

  removeInput () {
    // this.inputValue = '';
    this.textToFilter.set('');
    this.inputBlur();
    // this.initializeCurrentCategoryItems();
  }

  // initializeCurrentCategoryItems () {
    // let currentList: CurrencyItem[];
    // switch (this.currencyItem!()?.groupName) {
    //   case MAIN_CURRENCY_PREFIX:
    //     this.requestArray.mainCurrencyList.subscribe((items) => {
    //       currentList = items;
    //     });
    //     break;
    //   case CRYPTO_PREFIX:
    //     this.requestArray.cryptoList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   case GOLD_PREFIX:
    //     this.requestArray.goldList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   case COIN_PREFIX:
    //     this.requestArray.coinList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   case WORLD_MARKET_PREFIX:
    //     this.requestArray.worldMarketList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   case PRECIOUS_METALS_PREFIX:
    //     this.requestArray.preciousMetalList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   case BASE_METALS_PREFIX:
    //     this.requestArray.baseMetalList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   case COMMODITY_PREFIX:
    //     this.requestArray.commodityList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    //   default:
    //     this.requestArray.mainCurrencyList.subscribe((items) => {
    //       currentList = items;
    //     });;
    //     break;
    // }
    // this.currentCategoryItems = currentList!;
    // this.currentFilteredList = currentList!;
  // }

  // initializeChartHistory () {
  //   this.currencyItem!()?.historyCallInfo!
  //   .pipe(
  //     retry({count: Infinity})
  //   )
  //   .subscribe((data: RawData[]) => {
  //     this.historyData = data;
  //   })
  // }

  // initializeCurrencyInfo (type: number) {
  //   if (this.currencyItem!()) {
  //     if (this.currencyItem!()?.faGroupName === 'بازارهای ارزی') {
  //       const maxValue = priceToNumber(this.currencyItem!()!.lastPriceInfo!.h)
  //       const minValue = priceToNumber(this.currencyItem!()!.lastPriceInfo!.l)
  //       const currentValue = priceToNumber(this.currencyItem!()!.lastPriceInfo!.p)
  //       const percent = (maxValue === minValue) ? 1 : ((currentValue - minValue) / (maxValue - minValue));
  
  //       this.currentMaxPrice.set(maxValue.toString());
  //       this.currentMinPrice.set(minValue.toString());
        
  //       this.currentPercentMinMax.set(`${trimDecimal(percent * 100)}%`)
  //     }
  //     else {
  //       if (type === 0) {
  //         if (this.currencyItem!()?.unit === toman_unit) {
  //           const tomanMaxValue = rialToToman(this.currencyItem!()?.lastPriceInfo?.h!);
  //           const tomanMinValue = rialToToman(this.currencyItem!()?.lastPriceInfo?.l!);
  //           const currentValue = rialToToman(this.currencyItem!()?.lastPriceInfo?.p!);
    
  //           const tomanPercent = (tomanMaxValue === tomanMinValue) ? 1 : ((currentValue - tomanMinValue) / (tomanMaxValue - tomanMinValue));
  //           this.currentPercentMinMax.set(`${trimDecimal(tomanPercent * 100)}%`)
  //           this.currentMaxPrice.set(commafy(tomanMaxValue));
  //           this.currentMinPrice.set(commafy(tomanMinValue));
  //         }
  //         else if (this.currencyItem!()?.unit === dollar_unit) {
  //           const dollarMaxValue = dollarToToman(this.currencyItem!()?.lastPriceInfo?.h!, this.currentValue()!);
  //           const dollarMinValue = dollarToToman(this.currencyItem!()?.lastPriceInfo?.l!, this.currentValue()!);
  //           const currentValue = dollarToToman(this.currencyItem!()?.lastPriceInfo?.p!, this.currentValue()!)
  
  //           const dollarPercent = (dollarMaxValue === dollarMinValue) ? 1 : ((currentValue - dollarMinValue) / (dollarMaxValue - dollarMinValue));
  //           this.currentPercentMinMax.set(`${trimDecimal(dollarPercent * 100)}%`)
  //           this.currentMaxPrice.set(commafy(dollarMaxValue));
  //           this.currentMinPrice.set(commafy(dollarMinValue));
  //         }
  //         else {
  //           const poundMaxValue = poundToToman(this.currencyItem!()?.lastPriceInfo?.h!, this.currentValue()!);
  //           const poundMinValue = poundToToman(this.currencyItem!()?.lastPriceInfo?.l!, this.currentValue()!);
  //           const currentValue = poundToToman(this.currencyItem!()?.lastPriceInfo?.p!, this.currentValue()!);
            
  //           const poundPercent = (poundMaxValue === poundMinValue) ? 1 : ((currentValue - poundMinValue) / (poundMaxValue - poundMinValue));
  //           this.currentPercentMinMax.set(`${trimDecimal(poundPercent * 100)}%`)
  //           this.currentMaxPrice.set(commafy(poundMaxValue))
  //           this.currentMinPrice.set(commafy(poundMinValue));
  //         }
  //       }
  //       else {
  //         if (this.currencyItem!()?.unit === toman_unit) {
  //           const tommanDollarMaxValue = rialToDollar(this.currencyItem!()?.lastPriceInfo?.h!, this.currentValue()!);
  //           const tommanDollarMinValue = rialToDollar(this.currencyItem!()?.lastPriceInfo?.l!, this.currentValue()!);
  //           const currentValue = rialToDollar(this.currencyItem!()?.lastPriceInfo?.p!, this.currentValue()!);
            
  //           const tommanDollarPercent = (tommanDollarMaxValue === tommanDollarMinValue) ? 1 : ((currentValue - tommanDollarMinValue) / (tommanDollarMaxValue - tommanDollarMinValue));
  //           this.currentPercentMinMax.set(`${trimDecimal(tommanDollarPercent * 100)}%`)
  //           this.currentMaxPrice.set(commafy(tommanDollarMaxValue))
  //           this.currentMinPrice.set(commafy(tommanDollarMinValue));
  //         }
  //         else if (this.currencyItem!()?.unit === dollar_unit) {
  //           const dollarMaxValue = priceToNumber(this.currencyItem!()!.lastPriceInfo!.h)
  //           const dollarMinValue = priceToNumber(this.currencyItem!()!.lastPriceInfo!.l)
  //           const currentValue = priceToNumber(this.currencyItem!()!.lastPriceInfo!.p)
            
  //           const percent = (dollarMaxValue === dollarMinValue) ? 1 : ((currentValue - dollarMinValue) / (dollarMaxValue - dollarMinValue));
  //           this.currentPercentMinMax.set(`${trimDecimal(percent * 100)}%`)
  //           this.currentMaxPrice.set(commafy(dollarMaxValue));
  //           this.currentMinPrice.set(commafy(dollarMinValue));
  //         }
  //         else {
  //           const poundDollarMaxValue = poundToDollar(this.currencyItem!()?.lastPriceInfo?.h!, this.currentValue()!);
  //           const poundDollarMinValue = poundToDollar(this.currencyItem!()?.lastPriceInfo?.l!, this.currentValue()!);
  //           const currentValue = poundToDollar(this.currencyItem!()?.lastPriceInfo?.p!, this.currentValue()!);
  
  //           const poundDollarPercent = (poundDollarMaxValue === poundDollarMinValue) ? 1 : ((currentValue - poundDollarMinValue) / (poundDollarMaxValue - poundDollarMinValue));
  //           this.currentPercentMinMax.set(`${(poundDollarPercent * 100).toFixed(2)}%`)
  //           this.currentMaxPrice.set(commafy(poundDollarMaxValue))
  //           this.currentMinPrice.set(commafy(poundDollarMinValue));
  //         }
  //       }
  //     }
  //   }
  // }

  onCurrencyUnitChange (value: number) {
    this.currentSupportCurrencyId.set(value);
    // this.initializeCurrencyInfo(value)
  }

  ngOnChange () {
    // console.log(this.currencyItem)
  }


  ngOnInit() {
    // if (this.currencyItem!()) {
      // if (this.currencyItem!()?.faGroupName === 'بازارهای ارزی') {
      //   this.pageTitle.setTitle(`ارزیاب | قیمت ${this.currencyItem!()?.title}`);
      // }
      // else {
      //   this.pageTitle.setTitle(`ارزیاب | قیمت ${this.currencyItem!()?.title}`);
      // }
      // this.meta.updateTag({
      //   name: 'description',
      //   content: `قیمت لحظه‌ای ${this.currencyItem!()?.title} همراه با نمودار، تغییرات و اطلاعات بازار در ارزیاب.`
      // });
    this.currencyItem$
      .pipe(take(1))
      .subscribe(item => {
        // this.pageTitle.setTitle(`ارزیاب | قیمت ${item.title}`);
        if (item.faGroupName === 'بازارهای ارزی') {
          this.pageTitle.setTitle(`ارزیاب | نسبت ${item.title}`);
        }
        else {
          this.pageTitle.setTitle(`ارزیاب | قیمت ${item.title}`);
        }

        this.meta.updateTag({
          name: 'description',
          content: `قیمت لحظه‌ای ${item.title} همراه با نمودار، تغییرات و اطلاعات بازار در ارزیاب.`
        });
    });
      
      

      
      // this.initializeCurrentCategoryItems();
      // this.initializeCurrencyInfo(0);
      // this.initializeChartHistory();
    // }
    // else {
    //   if (typeof window !== 'undefined') this.canShowItem.set(false)
    // }

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);

      fromEvent(window, 'resize')
      .pipe(
        throttleTime(100),
        filter(() => window.innerWidth >= 640)
      )
      .subscribe(() => this.inputBlur())
    }
  }
}
