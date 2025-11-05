import { Component, ElementRef, HostListener, inject, QueryList, signal, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { Currencies, CurrencyItem } from '../interface/Currencies';
import { CurrencyItemComponent } from '../currency-item/currency-item.component';
import { base_metal_title, BASE_METALS_PREFIX, COIN_PREFIX, coin_title, COMMODITY_PREFIX, commodity_title, CRYPTO_PREFIX, crypto_title, currency_title, dollar_unit, favories_title, filter_agricultural_products, filter_animal_products, filter_coin_blubber, filter_coin_cash, filter_coin_exchange, filter_coin_retail, filter_crop_yields, filter_cryptocurrency, filter_etf, filter_global_base_metals, filter_global_ounces, filter_gold, filter_gold_vs_other, filter_main_currencies, filter_melted, filter_mesghal, filter_other_coins, filter_other_currencies, filter_overview, filter_pair_currencies, filter_silver, filter_us_base_metals, GOLD_PREFIX, gold_title, MAIN_CURRENCY_PREFIX, precious_metal_title, PRECIOUS_METALS_PREFIX, toman_unit, WORLD_MARKET_PREFIX, world_title } from '../constants/Values';
import { StarIconComponent } from '../star-icon/star-icon.component';
import { NgIf } from '@angular/common';
import { fromEvent } from 'rxjs';
import { RequestArrayService } from '../services/request-array.service';
import { EmptyItemComponent } from '../empty-item/empty-item.component';

enum SortingType {
  Ascending, Descending, None
}

@Component({
  selector: 'app-home',
  imports: [CurrencyItemComponent, NgIf, StarIconComponent, EmptyItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  reqestClass?: RequestArrayService;

  categories = [
    {
      title: favories_title,
      enTitle: favories_title,
      subtitles: [

      ]
    },
    {
      title: currency_title,
      enTitle: MAIN_CURRENCY_PREFIX,
      subtitles: [
        filter_overview,
        filter_main_currencies,
        filter_other_currencies
      ]
    },
    {
      title: gold_title,
      enTitle: GOLD_PREFIX,
      subtitles: [
        filter_overview,
        filter_gold,
        filter_silver,
        filter_mesghal,
        filter_melted,
        filter_etf
      ]
    },
    {
      title: coin_title,
      enTitle: COIN_PREFIX,
      subtitles: [
        filter_overview,
        filter_coin_cash,
        filter_coin_retail,
        filter_coin_blubber,
        filter_coin_exchange,
        filter_other_coins
      ]
    },
    {
      title: crypto_title,
      enTitle: CRYPTO_PREFIX,
      subtitles: [
        filter_overview,
      ]
    },
    {
      title: world_title,
      enTitle: WORLD_MARKET_PREFIX,
      subtitles: [
        filter_overview,
      ]
    },
    {
      title: precious_metal_title,
      enTitle: PRECIOUS_METALS_PREFIX,
      subtitles: [
        filter_overview,
        filter_global_ounces,
        filter_gold_vs_other
      ]
    },
    {
      title: base_metal_title,
      enTitle: BASE_METALS_PREFIX,
      subtitles: [
        filter_overview,
        filter_global_base_metals,
        filter_us_base_metals
      ]
    },
    {
      title: commodity_title,
      enTitle: COMMODITY_PREFIX,
      subtitles: [
        filter_overview,
        filter_agricultural_products,
        filter_crop_yields,
        filter_animal_products
      ]
    }

  ];

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

  currentList?: CurrencyItem[] = [];
  currentSubCategoryList?: string[] = [];
  currenTemptList?: CurrencyItem[] = [];
  currenTemptList2?: CurrencyItem[] = [];
  currentCategory: WritableSignal<string> = signal(this.categories[0].title)
  currentSubCategory: WritableSignal<string> = signal(filter_overview);

  lastCategory: WritableSignal<string> = signal(this.categories[0].title)
  
  notificationQueue: string[] = [];
  isNotifying: boolean = false;
  currentNotification: string | null = null;
  notificationState: 'visible' | 'hidden' = 'hidden';
  

  titleSorting: SortingType = SortingType.None;
  priceSorting: SortingType = SortingType.None;
  change24hSorting: SortingType = SortingType.None;

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>; 
  @ViewChild('scrollViewSubCategory') scrollViewSubCategory?: ElementRef<HTMLDivElement>;
  @ViewChild('scrollViewCategory') scrollViewCategory?: ElementRef<HTMLDivElement>;
  @ViewChild('successMsg') successMsg?: ElementRef<HTMLDivElement>;

  showRightSubCategoryArrow: WritableSignal<Boolean> = signal(true);
  showLeftSubCategoryArrow: WritableSignal<Boolean> = signal(true);

  showRightCategoryArrow: WritableSignal<Boolean> = signal(true);
  showLeftCategoryArrow: WritableSignal<Boolean> = signal(true);
  selectedCategory: WritableSignal<String> = signal('');
  currentSupportCurrencyId: number = 0;

  private scrollAmount: number = 70;
  

  change24hText: WritableSignal<string> = signal("تغییر 24 ساعت")
  priceSortingText: WritableSignal<string> = signal("قیمت")

  static mainData: Currencies;


  constructor(private requestArray: RequestArrayService) {
    this.reqestClass = requestArray;
    this.setCurrentCategory(currency_title)
    // this.selectedCategory().length == 0 ? this.setCurrentCategory(currency_title) : this.selectedCategory.set(this.currentCategory())

    if (typeof window !== 'undefined') {    
      
      window.onbeforeunload = () => {
        window.scrollTo(0, 0)  
      }

      if (window.innerWidth <= 624) {
        this.change24hText.set('24h')
      }
      else {
        this.change24hText.set('تغییر 24 ساعت')
      }
    }
  }

  categoryLeft () {
    const element = this.scrollViewCategory?.nativeElement;
    element?.scrollBy({ behavior: 'smooth', left: -this.scrollAmount })
  }
  
  
  subCategoryLeft () {
    const element = this.scrollViewSubCategory?.nativeElement;
    element?.scrollBy({ behavior: 'smooth', left: -this.scrollAmount })
  }
  
  categoryRight () {
    const element = this.scrollViewCategory?.nativeElement;
    element?.scrollBy({ behavior: 'smooth', left: this.scrollAmount })
  }
  
  subCategoryRight () {
    const element = this.scrollViewSubCategory?.nativeElement;
    element?.scrollBy({ behavior: 'smooth', left: this.scrollAmount })
  }

  scrollToStart () {
    const element = this.scrollViewSubCategory?.nativeElement;
    element?.scrollTo({ left: 0, behavior: 'smooth' })
  }





  inputMouseLeave(event: Event) {
    (event.target as HTMLInputElement).classList.remove('border-light-text2');
    (event.target as HTMLInputElement).classList.remove('dark:border-dark-text2');
    (event.target as HTMLInputElement).classList.add('border-green-btn');
  }
  
  inputMouseEnter(event: Event) {
    (event.target as HTMLInputElement).classList.remove('border-green-btn');
    (event.target as HTMLInputElement).classList.add('border-light-text2');
    (event.target as HTMLInputElement).classList.add('dark:border-dark-text2');
  }

  setCurrentCategory (title: string) {
    this.currentCategory.set(title)

    switch(title) {
      case favories_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.favList;
        this.initializeFavFilters();
        this.currentSupportCurrencyId = 0;
        this.currentSubCategoryList = this.categories[0].subtitles
        break;

      case currency_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.mainCurrencyList;
        this.currentSupportCurrencyId = 0;
        this.currentSubCategoryList = this.categories[1].subtitles
        break;
      
      case gold_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.goldList;
        this.currentSupportCurrencyId = 0;
        this.currentSubCategoryList = this.categories[2].subtitles
        break;

      case coin_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.coinList;
        this.currentSupportCurrencyId = 0;
        this.currentSubCategoryList = this.categories[3].subtitles
        break;

      case crypto_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.cryptoList;
        this.currentSupportCurrencyId = 1;
        this.currentSubCategoryList = this.categories[4].subtitles
        break;

      case world_title:
        this.priceSortingText.set('نسبت');
        this.currentList = this.reqestClass?.worldMarketList;
        this.currentSubCategoryList = this.categories[5].subtitles
        break;

      case precious_metal_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.preciousMetalList;
        this.currentSupportCurrencyId = 1;
        this.currentSubCategoryList = this.categories[6].subtitles
        break;

      case base_metal_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.baseMetalList;
        this.currentSupportCurrencyId = 1;
        this.currentSubCategoryList = this.categories[7].subtitles
        break;

      case commodity_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.commodityList;
        this.currentSupportCurrencyId = 1;
        this.currentSubCategoryList = this.categories[8].subtitles
        break;
    }
    this.currentSubCategory.set(filter_overview)
    this.currenTemptList = this.currentList;
    this.currenTemptList2 = this.currentList;
    this.autoSortList()
    this.scrollToStart();
    this.checkSubCategoryScrollPosition();
    this.checkCategoryScrollPosition();
  }

  onFavAddItem = (id: string) => {
    this.showAnimation('با موفقیت به دیده بان اضافه شد')
    this.processQueue();
  }

  showAnimation (type: string) {
    this.notificationQueue.push(type)
    this.processQueue()
  }

  processQueue () {
    if (this.isNotifying || this.notificationQueue.length === 0) return;

    this.isNotifying = true;

    this.currentNotification = this.notificationQueue.shift()!;
    this.notificationState = 'visible';

    this.successMsg?.nativeElement.classList.remove('translate-y-[-15rem]')
    this.successMsg?.nativeElement.classList.add('enter-animation')
    

    setTimeout(() => {
      this.successMsg?.nativeElement.classList.remove('enter-animation')
      this.successMsg?.nativeElement.classList.add('leave-animation')

      setTimeout(() => {
        this.successMsg?.nativeElement.classList.remove('leave-animation')
        this.successMsg?.nativeElement.classList.add('translate-x-0')
        this.successMsg?.nativeElement.classList.add('translate-y-[-15rem]')

        if (this.notificationState === 'hidden') {
          this.currentNotification = null;
          this.isNotifying = false;
          this.processQueue()
        }
      }, 1000);
    }, 4000);

    setTimeout(() => {
        this.notificationState = 'hidden'
    }, 5000);

  }

  removeNotification () {
    this.successMsg?.nativeElement.classList.remove('enter-animation')
    this.successMsg?.nativeElement.classList.add('leave-animation')

    setTimeout(() => {
      this.successMsg?.nativeElement.classList.remove('leave-animation')
      this.successMsg?.nativeElement.classList.add('translate-x-0')
      this.successMsg?.nativeElement.classList.add('translate-y-[-15rem]')

      if (this.notificationState === 'hidden') {
        this.currentNotification = null;
        this.isNotifying = false;
        this.processQueue()
      }
    }, 1000);
  }

  onItemSelect = (id: string) => {
    console.log(id)
    // this.lastCategory.set()
  }
  
  onFavRemoveItem = (id: string) =>  {
      this.showAnimation('با موفقیت از دیده بان حذف شد')
      this.processQueue()

      if (this.currentCategory() == favories_title) {
        this.currentList = this.currentList?.filter((item) => item.id !== id)
        this.currenTemptList = this.currenTemptList?.filter((item) => item.id !== id)
        this.currenTemptList2 = this.currenTemptList2?.filter((item) => item.id !== id) 
      }
  }

  canShowSupportedCurrencyToggle () {
    return this.currentCategory() !== world_title && (this.currentCategory() !== favories_title || (this.currentSubCategory() !== filter_overview && this.currentSubCategory() !== filter_pair_currencies))
  }


  initializeFavFilters() {
    let favSubCategoryList: string[] = [filter_overview]
    this.reqestClass?.favList.forEach((item: CurrencyItem) => {
      if (!favSubCategoryList.includes(item.filterName)) favSubCategoryList.push(item.filterName)
    })
    this.categories[0].subtitles = favSubCategoryList;
  }

  filterByCategory (name: string) {
    this.currentSubCategory.set(name);
    if (this.currentSubCategory() === filter_overview) {
      this.currenTemptList = this.currentList;
      this.currenTemptList2 = this.currentList;
    }
    else {
      let filteredList: CurrencyItem[] = [...this.currentList!!]
      this.currenTemptList = filteredList.filter((item: CurrencyItem) => item.filterName === name)
      this.currenTemptList2 = filteredList.filter((item: CurrencyItem) => item.filterName === name)
    }
    this.autoSortList()
  }

  filterList(event: Event) {
    const listToFilter = [...this.currenTemptList!!]
    const textToFilter = (event.target as HTMLInputElement).value.toLowerCase()
    if (textToFilter !== null) {
      this.currenTemptList2 = listToFilter.filter(item => item.title.toLowerCase().includes(textToFilter) || item.shortedName?.toLowerCase().includes(textToFilter))
    }
  }

  convertToRial () {
      if (this.currentList?.at(0)?.unit === dollar_unit) {
          let convertedList: CurrencyItem[] = [...this.currenTemptList!!]
          convertedList.forEach((item: CurrencyItem) => {
            item.unit = toman_unit;
          })
      }
      else {
        this.currenTemptList = this.currentList;
        this.currenTemptList2 = this.currentList;
      }
  }

  changeTitleSortingType() {
    this.change24hSorting = SortingType.None;
    this.priceSorting = SortingType.None;

    this.titleSorting++;
    if (this.titleSorting.toString() === '3') this.titleSorting = 0;

    if (this.titleSorting === SortingType.Ascending) this.setTitleListAscending()
    else if (this.titleSorting === SortingType.Descending) this.setTitleListDescending()
    else {
      this.currenTemptList2 = this.currenTemptList;
    }

  }

  autoSortList () {
    if (this.titleSorting === SortingType.Ascending || this.titleSorting === SortingType.Descending) {
      if (this.titleSorting === SortingType.Ascending) this.setTitleListAscending();
      else this.setTitleListDescending()
    }
    else if (this.priceSorting === SortingType.Ascending || this.priceSorting === SortingType.Descending) {
      if (this.priceSorting === SortingType.Ascending) this.setPriceListAscending();
      else this.setPriceListDescending();
    }
    else if (this.change24hSorting === SortingType.Ascending || this.change24hSorting === SortingType.Descending) {
      if (this.change24hSorting === SortingType.Ascending) this.setChange24hListAscending();
      else this.setChange24hListDescending();
    }
  }

  
  changePriceSortingType() {
    this.titleSorting = SortingType.None;
    this.change24hSorting = SortingType.None;

    this.priceSorting++;
    if (this.priceSorting.toString() === '3') this.priceSorting = 0;

    if (this.priceSorting === SortingType.Ascending) this.setPriceListAscending()
    else if (this.priceSorting === SortingType.Descending) this.setPriceListDescending()
    else {
      this.currenTemptList2 = this.currenTemptList;
    }
  }

  
  changeChange24hSortingType() {
    this.titleSorting = SortingType.None;
    this.priceSorting = SortingType.None;

    this.change24hSorting++;
    if (this.change24hSorting.toString() === '3') this.change24hSorting = 0;
    
    if (this.change24hSorting === SortingType.Ascending) this.setChange24hListAscending()
    else if (this.change24hSorting === SortingType.Descending) this.setChange24hListDescending()
    else {
      this.currenTemptList2 = this.currenTemptList;
    }
  }

  
  setChange24hListDescending () {
    let descendingPriceList: CurrencyItem[] = [...this.currenTemptList!!]
    this.currenTemptList2 = descendingPriceList.sort((a: CurrencyItem, b: CurrencyItem) => {
      const aValue = (a.lastPriceInfo.dt === 'high' ? '+' : '-') + a.lastPriceInfo.dp;
      const bValue = (b.lastPriceInfo.dt === 'high' ? '+' : '-') + b.lastPriceInfo.dp;

      const realAValue = aValue.startsWith('-') ? Number(aValue) : a.lastPriceInfo.dp;
      const realBValue = bValue.startsWith('-') ? Number(bValue) : b.lastPriceInfo.dp;
      
      if (realAValue > realBValue) return 1
      else return -1
    })
  }

  
  setChange24hListAscending () {
    let ascendingPriceList: CurrencyItem[] = [...this.currenTemptList!!]
    this.currenTemptList2 = ascendingPriceList.sort((a: CurrencyItem, b: CurrencyItem) => {
      const aValue = (a.lastPriceInfo.dt === 'high' ? '+' : '-') + a.lastPriceInfo.dp;
      const bValue = (b.lastPriceInfo.dt === 'high' ? '+' : '-') + b.lastPriceInfo.dp;

      const realAValue = aValue.startsWith('-') ? Number(aValue) : a.lastPriceInfo.dp;
      const realBValue = bValue.startsWith('-') ? Number(bValue) : b.lastPriceInfo.dp;
      
      if (realAValue > realBValue) return -1
      else return 1
    })
  }




  
  setPriceListDescending () {
    let descendingPriceList: CurrencyItem[] = [...this.currenTemptList!!]
    this.currenTemptList2 = descendingPriceList.sort((a: CurrencyItem, b: CurrencyItem) => a.realPrice!! > b.realPrice!! ? 1 : -1)
  }


  setPriceListAscending () {
    let ascendingPriceList: CurrencyItem[] = [...this.currenTemptList!!]
    this.currenTemptList2 = ascendingPriceList.sort((a: CurrencyItem, b: CurrencyItem) => a.realPrice!! > b.realPrice!! ? -1 : 1)
  }





  setTitleListDescending () {
    let descendingTitleList: CurrencyItem[] = [...this.currenTemptList!!]
    this.currenTemptList2 = descendingTitleList.sort((a: CurrencyItem, b: CurrencyItem) => a.title > b.title ? -1 : 1)
  }

  setTitleListAscending () {
    let ascendingTitleList: CurrencyItem[] = [...this.currenTemptList!!]
    this.currenTemptList2 = ascendingTitleList.sort((a: CurrencyItem, b: CurrencyItem) => a.title > b.title ? 1 : -1)
  }

  resetSortingLists () {
    this.titleSorting = SortingType.None;
    this.priceSorting = SortingType.None;
    this.change24hSorting = SortingType.None;
  }

  ngOnInit () {
    
    if (typeof window !== 'undefined') {
      
      // window.scrollTo({ top: 0, behavior: 'instant' })
      
      fromEvent(window, 'resize')
      .subscribe((event: Event) => {
        const width = document.body.clientWidth;
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

  ngAfterViewInit () {
    
    if (typeof window !== 'undefined') {

      fromEvent(window, 'click').subscribe((event: Event) => {
        if ((event.target as HTMLElement).id !== 'searchInput') {
          this.searchInput?.nativeElement.classList.remove('border-green-btn');
          this.searchInput?.nativeElement.classList.add('border-light-text2');
          this.searchInput?.nativeElement.classList.add('dark:border-dark-text2');
        }
      })
      
    }
    this.checkSubCategoryScrollPosition()
    this.checkCategoryScrollPosition()
  }

  onScrollEventHandler () {
    this.checkSubCategoryScrollPosition()
  }

  onScrollCategoryEventHandler() {
    this.checkCategoryScrollPosition()
  }

  checkSubCategoryScrollPosition () {
    const element = this.scrollViewSubCategory?.nativeElement;
    if (!element) return;
    const scrollLeft = element.scrollLeft;
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;

    const maxScroll = scrollWidth - clientWidth;
    const currentScroll = Math.abs(scrollLeft)

    this.showRightSubCategoryArrow.set(currentScroll > 5)
    this.showLeftSubCategoryArrow.set(currentScroll < (maxScroll - 5))
  }

  
  checkCategoryScrollPosition () {
    const element = this.scrollViewCategory?.nativeElement;
    if (!element) return;
    const scrollLeft = element.scrollLeft;
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;

    const maxScroll = scrollWidth - clientWidth;
    const currentScroll = Math.abs(scrollLeft)

    this.showRightCategoryArrow.set(currentScroll > 5)
    this.showLeftCategoryArrow.set(currentScroll < (maxScroll - 5))
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkSubCategoryScrollPosition()
    this.checkCategoryScrollPosition()
  }
}
