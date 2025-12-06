import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb.component';
import { CurrencyItem } from '../../interface/Currencies';
import { RequestArrayService } from '../../services/request-array.service';
import { ItemInfoComponent } from '../../components/not-shared/currency-item-details/item-info/item-info.component';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { BASE_METALS_PREFIX, COIN_PREFIX, COMMODITY_PREFIX, CRYPTO_PREFIX, dollar_unit, GOLD_PREFIX, MAIN_CURRENCY_PREFIX, PRECIOUS_METALS_PREFIX, toman_unit, WORLD_MARKET_PREFIX } from '../../constants/Values';
import { SearchItemComponent } from '../../components/not-shared/currency-item-details/search-item/search-item.component';
import { filter, from, fromEvent, throttleTime } from 'rxjs';
import { CurrencyOverviewComponent } from '../../components/not-shared/currency-item-details/currency-overview/currency-overview.component';
import { dollarToToman, dollarToTomanString, poundToDollar, poundToDollarString, poundToToman, poundToTomanString, rialToDollar, rialToDollarString, rialToToman, rialToTomanString } from '../../utils/CurrencyConverter';

@Component({
  selector: 'app-currency-item-details',
  imports: [BreadcrumbComponent, ItemInfoComponent, SearchItemComponent, CurrencyOverviewComponent],
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
  
  currentMaxPrice = signal('');
  currentMinPrice = signal('');
  currentPercentMinMax = signal('0%')
  
  currentSupportCurrencyId = signal(0)
  currentChartType = signal(0)

  @ViewChild('itemList') itemList?: ElementRef<HTMLDivElement>;
  @ViewChild('inputContainer') inputContainer?: ElementRef;


  constructor(private route: ActivatedRoute, private requestArray: RequestArrayService, private notificationService: NotificationService, private themeService: ThemeService, private router: Router) {
    this.themeServiceInstance = themeService;
  }
  

  inputFocus () {
    this.itemList?.nativeElement.classList.remove('hidden')
    this.itemList?.nativeElement.classList.add('flex')
  }

  
  inputBlur () {
    this.itemList?.nativeElement.classList.remove('flex')
    this.itemList?.nativeElement.classList.add('hidden')
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clicked = event.target as Node;
    if (!this.inputContainer?.nativeElement.contains(clicked)) {
      this.inputBlur()
    }
  }

  onItemSelect(slug: string) {
    this.inputBlur()
    this.router.navigate([`/${slug}`])
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
      navigator.clipboard.writeText(url);
      this.notificationService.show('آدرس صفحه در کلیپ بورد ذخیره شد')
      return;
    }

    navigator.share({ url })
      .catch(() => console.warn("Share dialog dismissed"));
  }

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

  initializeCurrencyInfo (type: number) {
    if (this.currencyItem?.faGroupName === 'بازارهای ارزی') {
      this.currentMaxPrice.set(this.currencyItem.lastPriceInfo.h);
      this.currentMinPrice.set(this.currencyItem.lastPriceInfo.l);
     
      const percent = +(this.currencyItem.lastPriceInfo.p) / +(this.currencyItem.lastPriceInfo.h);
      this.currentPercentMinMax.set(`${(percent * 100).toFixed(2)}%`)
    }
    else {
      if (type === 0) {
        if (this.currencyItem?.unit === toman_unit) {
          const tomanMaxValue = rialToTomanString(this.currencyItem?.lastPriceInfo?.h!);
          const tomanMinValue = rialToTomanString(this.currencyItem?.lastPriceInfo?.l!);
  
          const tomanPercent = rialToToman(this.currencyItem?.lastPriceInfo?.p!) / rialToToman(this.currencyItem?.lastPriceInfo?.h!);
          this.currentPercentMinMax.set(`${(tomanPercent * 100).toFixed(2)}%`)
          this.currentMaxPrice.set(tomanMaxValue);
          this.currentMinPrice.set(tomanMinValue);
        }
        else if (this.currencyItem?.unit === dollar_unit) {
          const dollarMaxValue = dollarToTomanString(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          const dollarMinValue = dollarToTomanString(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!);
  
          const dollarPercent = dollarToToman(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!) / dollarToToman(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          this.currentPercentMinMax.set(`${(dollarPercent * 100).toFixed(2)}%`)
          this.currentMaxPrice.set(dollarMaxValue);
          this.currentMinPrice.set(dollarMinValue);
        }
        else {
          const poundMaxValue = poundToTomanString(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          const poundMinValue = poundToTomanString(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!);
          
          const poundPercent = poundToToman(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!) / poundToToman(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          this.currentPercentMinMax.set(`${(poundPercent * 100).toFixed(2)}%`)
          this.currentMaxPrice.set(poundMaxValue)
          this.currentMinPrice.set(poundMinValue);
        }
      }
      else {
        if (this.currencyItem?.unit === toman_unit) {
          const tommanDollarMaxValue = rialToDollarString(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!)
          const tommanDollarMinValue = rialToDollarString(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!)
          
          const tommanDollarPercent = rialToDollar(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!) / rialToDollar(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          this.currentPercentMinMax.set(`${(tommanDollarPercent * 100).toFixed(2)}%`)
          this.currentMaxPrice.set(tommanDollarMaxValue)
          this.currentMinPrice.set(tommanDollarMinValue);
        }
        else if (this.currencyItem?.unit === dollar_unit) {
          this.currentMaxPrice.set(this.currencyItem.lastPriceInfo.h);
          this.currentMinPrice.set(this.currencyItem.lastPriceInfo.l);
        
          const percent = +(this.currencyItem.lastPriceInfo.p) / +(this.currencyItem.lastPriceInfo.h);
          this.currentPercentMinMax.set(`${(percent * 100).toFixed(2)}%`)
        }
        else {
          const poundDollarMaxValue = poundToDollarString(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!)
          const poundDollarMinValue = poundToDollarString(this.currencyItem?.lastPriceInfo?.l!, this.requestArray.mainData?.current!)
          
          console.log(this.currencyItem?.lastPriceInfo.p, this.currencyItem?.lastPriceInfo.h, this.currencyItem?.lastPriceInfo.l)
          const poundDollarPercent = poundToDollar(this.currencyItem?.lastPriceInfo?.p!, this.requestArray.mainData?.current!) / poundToDollar(this.currencyItem?.lastPriceInfo?.h!, this.requestArray.mainData?.current!);
          this.currentPercentMinMax.set(`${(poundDollarPercent * 100).toFixed(2)}%`)
          this.currentMaxPrice.set(poundDollarMaxValue)
          this.currentMinPrice.set(poundDollarMinValue);
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

      this.breadCrumbItems = [
        {
          title: 'صفحه اصلی', link: '/'
        },
        {
          title: this.currencyItem.title,
        }
      ];
      this.initializeCurrentCategoryItems();
      this.initializeCurrencyInfo(0);
    })

    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
      .pipe(
        throttleTime(100),
        filter(() => window.innerWidth >= 640)
      )
      .subscribe(() => this.inputBlur())
    }
  }
}
