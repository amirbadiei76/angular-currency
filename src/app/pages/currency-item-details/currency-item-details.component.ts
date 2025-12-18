import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb.component';
import { CurrencyItem } from '../../interfaces/data.types';
import { RequestArrayService } from '../../services/request-array.service';
import { ItemInfoComponent } from '../../components/not-shared/currency-item-details/item-info/item-info.component';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { BASE_METALS_PREFIX, COIN_PREFIX, COMMODITY_PREFIX, CRYPTO_PREFIX, dollar_unit, GOLD_PREFIX, MAIN_CURRENCY_PREFIX, PRECIOUS_METALS_PREFIX, toman_unit, WORLD_MARKET_PREFIX } from '../../constants/Values';
import { SearchItemComponent } from '../../components/shared/search-item/search-item.component';
import { filter, fromEvent, retry, throttleTime } from 'rxjs';
import { CurrencyOverviewComponent } from '../../components/not-shared/currency-item-details/currency-overview/currency-overview.component';
import { commafy, dollarToToman, poundToDollar, poundToToman, rialToDollar, rialToToman, trimDecimal } from '../../utils/CurrencyConverter';
import { RawData } from '../../interfaces/chart.types';
import { ChartComponent } from '../../components/not-shared/currency-item-details/chart/chart.component';
import { ChangesTableComponent } from '../../components/not-shared/currency-item-details/changes-table/changes-table.component';
import { FormsModule } from '@angular/forms';
import { ItemInfoSkeletonComponent } from '../../components/not-shared/currency-item-details/item-info-skeleton/item-info-skeleton.component';
import { PercentProgressComponent } from '../../components/not-shared/currency-item-details/percent-progress/percent-progress.component';
import { PercentProgressSkeletonComponent } from '../../components/not-shared/currency-item-details/percent-progress-skeleton/percent-progress-skeleton.component';

@Component({
  selector: 'app-currency-item-details',
  imports: [BreadcrumbComponent, FormsModule, ItemInfoComponent, ItemInfoSkeletonComponent, PercentProgressComponent, PercentProgressSkeletonComponent, SearchItemComponent, ChangesTableComponent, CurrencyOverviewComponent, ChartComponent],
  templateUrl: './currency-item-details.component.html',
  styleUrl: './currency-item-details.component.css'
})
export class CurrencyItemDetailsComponent {
  title?: string = "";
  currencyItem?: CurrencyItem;
  currentCategoryItems?: CurrencyItem[];
  currentFilteredList?: CurrencyItem[];
  themeServiceInstance?: ThemeService;
  breadCrumbItems: BreadcrumbItem[] = [];
  historyData?: RawData[];
  
  currentMaxPrice = signal('');
  currentMinPrice = signal('');
  currentPercentMinMax = signal('0%')
  
  currentSupportCurrencyId = signal(0)
  currentChartType = signal(0)

  inputValue = '';

  @ViewChild('itemList') itemList?: ElementRef<HTMLDivElement>;
  @ViewChild('inputContainer') inputContainer?: ElementRef;


  constructor(private route: ActivatedRoute, private requestArray: RequestArrayService, private notificationService: NotificationService, private themeService: ThemeService, private router: Router) {
    this.themeServiceInstance = themeService;
    if (!requestArray.mainData) {
      requestArray.setupMainData();
    }
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
    this.router.navigate([`/${slug}`])
    window.scrollTo(0, 0)
  }

  onChartTypeChange (type: number) {
    this.currentChartType.set(type)
  }

  
  filterList(event: Event) {
    const listToFilter = [...this.currentCategoryItems!!]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase();
    if (textToFilter !== null) {
      this.currentFilteredList = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
    }
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
    this.inputValue = '';
    this.inputBlur()
    this.initializeCurrentCategoryItems();
  }

  // ngOnChanges () {
  //   if (this.requestArray.mainData) {
  //     console.log(this.requestArray.mainData)
  //     this.route.params.subscribe((params) => {
  //       this.title = params['title'];
  
  //       this.currencyItem = this.requestArray.allItemsList.find((item) => item.slugText == this.title)!;
        
  //       if (this.currencyItem) {
  //         this.breadCrumbItems = [
  //           {
  //             title: 'صفحه اصلی', link: '/'
  //           },
  //           {
  //             title: this.currencyItem!.title,
  //           }
  //         ];
  //         this.initializeCurrentCategoryItems();
  //         this.initializeCurrencyInfo(0);
  //         this.initializeChartHistory();
  //       }
  //     })
  //   }
  // }

  initializeCurrentCategoryItems () {
    switch (this.currencyItem?.groupName) {
      case MAIN_CURRENCY_PREFIX:
        this.currentCategoryItems = this.requestArray.mainCurrencyList;
        break;
      case CRYPTO_PREFIX:
        this.currentCategoryItems = this.requestArray.cryptoList;
        break;
      case GOLD_PREFIX:
        this.currentCategoryItems = this.requestArray.goldList;
        break;
      case COIN_PREFIX:
        this.currentCategoryItems = this.requestArray.coinList;
        break;
      case WORLD_MARKET_PREFIX:
        this.currentCategoryItems = this.requestArray.worldMarketList;
        break;
      case PRECIOUS_METALS_PREFIX:
        this.currentCategoryItems = this.requestArray.preciousMetalList;
        break;
      case BASE_METALS_PREFIX:
        this.currentCategoryItems = this.requestArray.baseMetalList;
        break;
      case COMMODITY_PREFIX:
        this.currentCategoryItems = this.requestArray.commodityList;
        break;
      default:
        this.currentCategoryItems = this.requestArray.mainCurrencyList;
        break;
    }
    this.currentFilteredList = this.currentCategoryItems;
  }

  initializeChartHistory () {
    this.currencyItem?.historyCallInfo!
    .pipe(
      retry({count: Infinity})
    )
    .subscribe((data: RawData[]) => {
      this.historyData = data;
    })
  }

  initializeCurrencyInfo (type: number) {
    if (this.currencyItem?.faGroupName === 'بازارهای ارزی') {
      const maxValue = +(this.currencyItem.lastPriceInfo!.h.replaceAll(',', ''));
      const minValue = +(this.currencyItem.lastPriceInfo!.l.replaceAll(',', ''));
      const currentValue = +(this.currencyItem.lastPriceInfo!.p.replaceAll(',', ''));
      const percent = (maxValue === minValue) ? 1 : ((currentValue - minValue) / (maxValue - minValue));

      this.currentMaxPrice.set(maxValue.toString());
      this.currentMinPrice.set(minValue.toString());
      
      this.currentPercentMinMax.set(`${trimDecimal(percent * 100)}%`)
    }
    else {
      if (type === 0) {
        if (this.currencyItem?.unit === toman_unit) {
          const tomanMaxValue = rialToToman(this.currencyItem?.lastPriceInfo?.h!);
          const tomanMinValue = rialToToman(this.currencyItem?.lastPriceInfo?.l!);
          const currentValue = rialToToman(this.currencyItem?.lastPriceInfo?.p!);
  
          const tomanPercent = (tomanMaxValue === tomanMinValue) ? 1 : ((currentValue - tomanMinValue) / (tomanMaxValue - tomanMinValue));
          this.currentPercentMinMax.set(`${trimDecimal(tomanPercent * 100)}%`)
          this.currentMaxPrice.set(commafy(tomanMaxValue));
          this.currentMinPrice.set(commafy(tomanMinValue));
        }
        else if (this.currencyItem?.unit === dollar_unit) {
          const dollarMaxValue = dollarToToman(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          const dollarMinValue = dollarToToman(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!);
          const currentValue = dollarToToman(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!)

          const dollarPercent = (dollarMaxValue === dollarMinValue) ? 1 : ((currentValue - dollarMinValue) / (dollarMaxValue - dollarMinValue));
          this.currentPercentMinMax.set(`${trimDecimal(dollarPercent * 100)}%`)
          this.currentMaxPrice.set(commafy(dollarMaxValue));
          this.currentMinPrice.set(commafy(dollarMinValue));
        }
        else {
          const poundMaxValue = poundToToman(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          const poundMinValue = poundToToman(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!);
          const currentValue = poundToToman(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!);
          
          const poundPercent = (poundMaxValue === poundMinValue) ? 1 : ((currentValue - poundMinValue) / (poundMaxValue - poundMinValue));
          this.currentPercentMinMax.set(`${trimDecimal(poundPercent * 100)}%`)
          this.currentMaxPrice.set(commafy(poundMaxValue))
          this.currentMinPrice.set(commafy(poundMinValue));
        }
      }
      else {
        if (this.currencyItem?.unit === toman_unit) {
          const tommanDollarMaxValue = rialToDollar(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          const tommanDollarMinValue = rialToDollar(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!);
          const currentValue = rialToDollar(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!);
          
          const tommanDollarPercent = (tommanDollarMaxValue === tommanDollarMinValue) ? 1 : ((currentValue - tommanDollarMinValue) / (tommanDollarMaxValue - tommanDollarMinValue));
          this.currentPercentMinMax.set(`${trimDecimal(tommanDollarPercent * 100)}%`)
          this.currentMaxPrice.set(commafy(tommanDollarMaxValue))
          this.currentMinPrice.set(commafy(tommanDollarMinValue));
        }
        else if (this.currencyItem?.unit === dollar_unit) {
          const dollarMaxValue = +(this.currencyItem.lastPriceInfo!.h.replaceAll(',', ''));
          const dollarMinValue = +(this.currencyItem.lastPriceInfo!.l.replaceAll(',', ''));
          const currentValue = +(this.currencyItem.lastPriceInfo!.p.replaceAll(',', ''));
          
          const percent = (dollarMaxValue === dollarMinValue) ? 1 : ((currentValue - dollarMinValue) / (dollarMaxValue - dollarMinValue));
          this.currentPercentMinMax.set(`${trimDecimal(percent * 100)}%`)
          this.currentMaxPrice.set(commafy(dollarMaxValue));
          this.currentMinPrice.set(commafy(dollarMinValue));
        }
        else {
          const poundDollarMaxValue = poundToDollar(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          const poundDollarMinValue = poundToDollar(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!);
          const currentValue = poundToDollar(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!);

          const poundDollarPercent = (poundDollarMaxValue === poundDollarMinValue) ? 1 : ((currentValue - poundDollarMinValue) / (poundDollarMaxValue - poundDollarMinValue));
          this.currentPercentMinMax.set(`${(poundDollarPercent * 100).toFixed(2)}%`)
          this.currentMaxPrice.set(commafy(poundDollarMaxValue))
          this.currentMinPrice.set(commafy(poundDollarMinValue));
        }
      }
    }
  }

  onCurrencyUnitChange (value: number) {
    this.currentSupportCurrencyId.set(value);
    this.initializeCurrencyInfo(value)
  }


  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.title = params['title'];

      this.currencyItem = this.requestArray.allItemsList.find((item) => item.slugText == this.title)!;

      if (this.currencyItem) {
        if (this.currencyItem.faGroupName === 'بازارهای ارزی') {
          document.title = 'نسبت ' + this.currencyItem.title;
        }
        else {
          document.title = 'قیمت ' + this.currencyItem.title;
        }
        
  
        this.breadCrumbItems = [
          {
            title: 'صفحه اصلی', link: '/'
          },
          {
            title: this.currencyItem!.title,
          }
        ];
        this.initializeCurrentCategoryItems();
        this.initializeCurrencyInfo(0);
        this.initializeChartHistory();
      }
    })

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
