import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CurrenciesService } from '../services/currencies.service';
import { Currencies, CurrencyItem } from '../interface/Currencies';
import { RequestArray } from '../components/RequestArrays';
import { CurrencyItemComponent } from '../currency-item/currency-item.component';
import { base_metal_title, coin_title, commodity_title, crypto_title, currency_title, favories_title, filter_agricultural_products, filter_animal_products, filter_coin_blubber, filter_coin_cash, filter_coin_exchange, filter_coin_retail, filter_crop_yields, filter_cryptocurrency, filter_etf, filter_global_base_metals, filter_global_ounces, filter_gold, filter_gold_vs_other, filter_main_currencies, filter_melted, filter_mesghal, filter_other_coins, filter_other_currencies, filter_overview, filter_silver, filter_us_base_metals, gold_title, precious_metal_title, world_title } from '../constants/Values';
import { StarIconComponent } from '../star-icon/star-icon.component';
import { NgIf } from '@angular/common';

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


  titleSorting: SortingType = SortingType.None;
  priceSorting: SortingType = SortingType.None;
  change24hSorting: SortingType = SortingType.None;

  change24hText: WritableSignal<string> = signal("تغییر 24 ساعت")

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
  currentCategory: WritableSignal<string> = signal(this.categories[0].title)


  constructor(private currencyService: CurrenciesService) {
    this.reqestClass = RequestArray.requestArrayInstance(currencyService)

    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 624) {
        this.change24hText.set('24h')
      }
      else {
        this.change24hText.set('تغییر 24 ساعت')
      }
    }
  }

  setCurrentCategory (title: string) {
    this.currentCategory.set(title)

    switch(title) {
      case favories_title:
        this.currentList = this.reqestClass?.favList;
        break;

      case currency_title:
        this.currentList = this.reqestClass?.mainCurrencyList;
        break;
      
      case gold_title:
        this.currentList = this.reqestClass?.goldList;
        break;

      case coin_title:
        this.currentList = this.reqestClass?.coinList;
        break;

      case crypto_title:
        this.currentList = this.reqestClass?.cryptoList;
        break;

      case world_title:
        this.currentList = this.reqestClass?.worldMarketList;
        break;

      case precious_metal_title:
        this.currentList = this.reqestClass?.preciousMetalList;
        break;

      case base_metal_title:
        this.currentList = this.reqestClass?.baseMetalList;
        break;

      case commodity_title:
        this.currentList = this.reqestClass?.commodityList;
        break;
    }
  }

  changeTitleSortingType() {
    this.change24hSorting = SortingType.None;
    this.priceSorting = SortingType.None;

    this.titleSorting++;
    if (this.titleSorting.toString() === '3') this.titleSorting = 0;

    // switch(this.titleSorting) {
    //   case SortingType.None:
    //     this.titleSorting = SortingType.Ascending;

    //     break;
    //   case SortingType.Ascending:
    //     this.titleSorting = SortingType.Descending;

    //     break;
    //   case SortingType.Descending:
    //     this.titleSorting = SortingType.None;

    //     break;
    // }
  }

  
  changePriceSortingType() {
    this.titleSorting = SortingType.None;
    this.change24hSorting = SortingType.None;

    switch(this.priceSorting) {
      case SortingType.None:
        this.priceSorting = SortingType.Ascending;

        break;
      case SortingType.Ascending:
        this.priceSorting = SortingType.Descending;

        break;
      case SortingType.Descending:
        this.priceSorting = SortingType.None;
        
        break;
    }

    console.log(this.priceSorting)
  }

  
  changeChange24hSortingType() {
    this.titleSorting = SortingType.None;
    this.priceSorting = SortingType.None;

    switch(this.change24hSorting) {
      case SortingType.None:
        this.change24hSorting = SortingType.Ascending;

        break;
      case SortingType.Ascending:
        this.change24hSorting = SortingType.Descending;

        break;
      case SortingType.Descending:
        this.change24hSorting = SortingType.None;
        
        break;
    }
  }


  ngOnInit () {
    this.reqestClass?.setupMainData();
    this.currentList = this.reqestClass?.favList;

    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
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
}
