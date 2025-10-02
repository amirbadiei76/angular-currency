import { Component, ElementRef, inject, QueryList, signal, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { CurrenciesService } from '../services/currencies.service';
import { Currencies, CurrencyItem } from '../interface/Currencies';
import { RequestArray } from '../components/RequestArrays';
import { CurrencyItemComponent } from '../currency-item/currency-item.component';
import { base_metal_title, coin_title, commodity_title, crypto_title, currency_title, dollar_unit, favories_title, filter_agricultural_products, filter_animal_products, filter_coin_blubber, filter_coin_cash, filter_coin_exchange, filter_coin_retail, filter_crop_yields, filter_cryptocurrency, filter_etf, filter_global_base_metals, filter_global_ounces, filter_gold, filter_gold_vs_other, filter_main_currencies, filter_melted, filter_mesghal, filter_other_coins, filter_other_currencies, filter_overview, filter_silver, filter_us_base_metals, gold_title, precious_metal_title, rial_unit, world_title } from '../constants/Values';
import { StarIconComponent } from '../star-icon/star-icon.component';
import { NgIf } from '@angular/common';
import { fromEvent } from 'rxjs';

enum SortingType {
  Ascending, Descending, None
}

@Component({
  selector: 'app-home',
  imports: [CurrencyItemComponent, NgIf, StarIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  fetchedData?: Currencies;
  reqestClass?: RequestArray;

  categories = [
    {
      title: favories_title,
      subtitles: [

      ]
    },
    {
      title: currency_title,
      subtitles: [
        filter_overview,
        filter_main_currencies,
        filter_other_currencies
      ]
    },
    {
      title: gold_title,
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
      subtitles: [
        filter_overview,
      ]
    },
    {
      title: world_title,
      subtitles: [
        filter_overview,
      ]
    },
    {
      title: precious_metal_title,
      subtitles: [
        filter_overview,
        filter_global_ounces,
        filter_gold_vs_other
      ]
    },
    {
      title: base_metal_title,
      subtitles: [
        filter_overview,
        filter_global_base_metals,
        filter_us_base_metals
      ]
    },
    {
      title: commodity_title,
      subtitles: [
        filter_overview,
        filter_agricultural_products,
        filter_crop_yields,
        filter_animal_products
      ]
    }

  ]

  currentList?: CurrencyItem[] = [];
  currentSubCategoryList?: string[] = [];
  currenTemptList?: CurrencyItem[] = [];
  currenTemptList2?: CurrencyItem[] = [];
  currentCategory: WritableSignal<string> = signal(this.categories[0].title)
  currentSubCategory: WritableSignal<string> = signal(filter_overview)

  titleSorting: SortingType = SortingType.None;
  priceSorting: SortingType = SortingType.None;
  change24hSorting: SortingType = SortingType.None;

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>; 
  @ViewChild('scrollViewSubCategory') scrollViewSubCategory?: ElementRef<HTMLDivElement>; 
  @ViewChild('rightSubCategoryArrow') rightSubCategoryArrow?: ElementRef<HTMLDivElement>; 
  @ViewChild('leftSubCategoryArrow') leftSubCategoryArrow?: ElementRef<HTMLDivElement>;

  showRightSubCategoryArrow: WritableSignal<Boolean> = signal(true);
  showLeftSubCategoryArrow: WritableSignal<Boolean> = signal(true);

  private scrollAmount: number = 70;
  

  change24hText: WritableSignal<string> = signal("تغییر 24 ساعت")
  priceSortingText: WritableSignal<string> = signal("قیمت")

  static mainData: Currencies;


  constructor(private currencyService: CurrenciesService) {
    this.reqestClass = RequestArray.requestArrayInstance(currencyService)
    // this.reqestClass.setupMainData()
    
    this.reqestClass?.setupMainData();
    this.setCurrentCategory(currency_title);

    console.log('req? constructor: ' + this.reqestClass)

    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 624) {
        this.change24hText.set('24h')
      }
      else {
        this.change24hText.set('تغییر 24 ساعت')
      }
    }
  }
  
  // checkSubCategoryArrows (element: HTMLDivElement) {
    
  //   if (Math.floor(element.scrollLeft) + element.scrollWidth ===  element.clientWidth) {
    //     this.rightSubCategoryArrow?.nativeElement.classList.remove('hidden')
    //     this.leftSubCategoryArrow?.nativeElement.classList.add('hidden')
    //   }
    //   else if (Math.round(element.scrollLeft)  <= 1) {
      //     // divElement.scrollTo({ left: 0 })
      //     this.leftSubCategoryArrow?.nativeElement.classList.remove('hidden')
      //     this.rightSubCategoryArrow?.nativeElement.classList.add('hidden')
      //   }
      //   // else if (Math.floor(element.scrollLeft) + element.scrollWidth !==  element.clientWidth) {
        //   // }
        
        //   else {
          //     console.log('else')
          //     this.leftSubCategoryArrow?.nativeElement.classList.remove('hidden')
  //     this.rightSubCategoryArrow?.nativeElement.classList.remove('hidden')
  //   }


    
  // }
  
  // resetSubCategoryArrows () {
  //   let divElement = (this.scrollViewSubCategory?.nativeElement as HTMLDivElement)
  //   divElement?.scrollTo({ left: divElement.clientWidth - divElement.scrollWidth })
  //   this.leftSubCategoryArrow?.nativeElement.classList.remove('hidden')
  //   this.rightSubCategoryArrow?.nativeElement.classList.add('hidden')
  // }
  
  
  subCategoryLeft () {
    const element = this.scrollViewSubCategory?.nativeElement;
    this.showRightSubCategoryArrow.set(true)
    element?.scrollBy({ behavior: 'smooth', left: -this.scrollAmount })
    this.updateSubCategoryArrowVisibility()
  }
  
  subCategoryRight () {
    const element = this.scrollViewSubCategory?.nativeElement;
    this.showLeftSubCategoryArrow.set(true)
    element?.scrollBy({ behavior: 'smooth', left: this.scrollAmount })
    this.updateSubCategoryArrowVisibility()
  }

  scrollToStart () {
    const element = this.scrollViewSubCategory?.nativeElement;
    element?.scrollTo({ left: 0, behavior: 'smooth' })
  }

  onSubCategoryScroll () {
    this.updateSubCategoryArrowVisibility()
  }

  getMaxScrollLeft () {
    const element = this.scrollViewSubCategory?.nativeElement;
    return Math.max(0, element?.scrollWidth!! - element?.clientWidth!!)
  }

  
  
  updateSubCategoryArrowVisibility() {
    const scrollElement = this.scrollViewSubCategory?.nativeElement;
    const scrollLeft = scrollElement?.scrollLeft;
    const scrollWidth = scrollElement?.scrollWidth;
    const clientWidth = scrollElement?.clientWidth;

    const maxScroll = this.getMaxScrollLeft()

    const EPS = 1

    // this.showLeftSubCategoryArrow = scrollLeft! > EPS;
    // this.showRightSubCategoryArrow = scrollLeft! <= clientWidth! - scrollLeft!

    // console.log('sc left: ' + scrollLeft!!)
    // console.log('floor sc left: ' + Math.floor(scrollLeft!!))
    // console.log('sc width: ' + scrollWidth!!)
    // console.log('cl width: ' + clientWidth!!)
    // console.log('left side: ' + (scrollLeft!! + scrollWidth!!))
    // console.log('right side: ' + (clientWidth!!))
    // console.log('show right arrow: ' + ((Math.floor(scrollLeft!!) + clientWidth!!) >= (scrollWidth!! - 1)))
    // console.log('________________')

    // if (scrollWidth!! + scrollLeft!! < clientWidth!!)
    // {
    //   this.showLeftSubCategoryArrow = false
    //   this.showRightSubCategoryArrow = true
    //   return;
    // }
    
    if (scrollLeft! === 0) {
      console.log('scroll: 0')
      this.showRightSubCategoryArrow.set(false)
    }
    else if ((Math.floor(scrollLeft!) + scrollWidth!) === clientWidth) {
      this.showLeftSubCategoryArrow.set(false)
      console.log('(scrollLeft! + scrollWidth!) === clientWidth')
    }


    // this.showLeftSubCategoryArrow = scrollLeft! <= 1;
    // this.showRightSubCategoryArrow = ((Math.floor(scrollLeft!) + clientWidth!) < (scrollWidth!));
      
    
    console.log('show left? ' + this.showLeftSubCategoryArrow())
    console.log('show right? ' + this.showRightSubCategoryArrow())
    console.log('__________________________________')
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
        this.currentSubCategoryList = this.categories[0].subtitles
        break;

      case currency_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.mainCurrencyList;
        this.currentSubCategoryList = this.categories[1].subtitles
        break;
      
      case gold_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.goldList;
        this.currentSubCategoryList = this.categories[2].subtitles
        break;

      case coin_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.coinList;
        this.currentSubCategoryList = this.categories[3].subtitles
        break;

      case crypto_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.cryptoList;
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
        this.currentSubCategoryList = this.categories[6].subtitles
        break;

      case base_metal_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.baseMetalList;
        this.currentSubCategoryList = this.categories[7].subtitles
        break;

      case commodity_title:
        this.priceSortingText.set('قیمت');
        this.currentList = this.reqestClass?.commodityList;
        this.currentSubCategoryList = this.categories[8].subtitles
        break;
    }
    this.currentSubCategory.set(filter_overview)
    this.currenTemptList = this.currentList;
    this.currenTemptList2 = this.currentList;
    this.autoSortList()
    // this.scrollToStart()
    // this.scrollViewSubCategory?.nativeElement?.scrollTo({ left: this.scrollViewSubCategory.nativeElement.scrollWidth!! + this.scrollViewSubCategory.nativeElement.clientWidth!!});
    this.updateSubCategoryArrowVisibility()
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
            item.unit = rial_unit;
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
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
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
    // if (this.reqestClass.dataFetced) {
      // console.log('fetched? ' + this.reqestClass.dataFetced)
      // console.log('req? after init: ' + this.reqestClass)
      // console.log('req? after init: ' + this.reqestClass)

    // }
    
    if (typeof window !== 'undefined') {

      fromEvent(window, 'click').subscribe((event: Event) => {
        if ((event.target as HTMLElement).id !== 'searchInput') {
          this.searchInput?.nativeElement.classList.remove('border-green-btn');
          this.searchInput?.nativeElement.classList.add('border-light-text2');
          this.searchInput?.nativeElement.classList.add('dark:border-dark-text2');
        }
      })

      
   
      // this.scrollToStart();
    }
  }
}
