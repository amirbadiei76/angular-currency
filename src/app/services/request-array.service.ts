import { Injectable } from '@angular/core';
import { CurrenciesService } from './currencies.service';
import { Currencies, CurrencyItem, Current } from '../interface/Currencies';
import { BASE_METALS_PREFIX, COIN_PREFIX, COMMODITY_PREFIX, CRYPTO_PREFIX, dollar_unit, filter_agricultural_products, filter_animal_products, filter_coin_blubber, filter_coin_cash, filter_coin_exchange, filter_coin_retail, filter_crop_yields, filter_cryptocurrency, filter_etf, filter_global_base_metals, filter_global_ounces, filter_gold, filter_gold_vs_other, filter_main_currencies, filter_melted, filter_mesghal, filter_other_coins, filter_other_currencies, filter_pair_currencies, filter_silver, filter_us_base_metals, GOLD_PREFIX, MAIN_CURRENCY_PREFIX, pound_unit, PRECIOUS_METALS_PREFIX, toman_unit, WORLD_MARKET_PREFIX } from '../constants/Values';

@Injectable({
  providedIn: 'root'
})
export class RequestArrayService {
  
    mainData?: Currencies;
    allItemsList: CurrencyItem[] = [];
    mainCurrencyList: CurrencyItem[] = [];
    cryptoList: CurrencyItem[] = [];
    worldMarketList: CurrencyItem[] = [];
    coinList: CurrencyItem[] = [];
    goldList: CurrencyItem[] = [];
    preciousMetalList: CurrencyItem[] = [];
    baseMetalList: CurrencyItem[] = [];
    commodityList: CurrencyItem[] = [];


    favIds: string[] = []
    favList: CurrencyItem[] = [];

    currentState = '+';
    currentItem = '';

  constructor(private currencyService: CurrenciesService) {
    this.setupMainData();
  }

  addToFavorite(item: CurrencyItem) {
    if (window.navigator.onLine) {
        this.currentState = '+';
        this.currentItem = item.title;
        if (typeof window !== 'undefined' && localStorage.getItem('fav')) {
            item.isFav = true;
            this.favList.push(item)
            this.favIds.push(item.id)
            
            let items: string[] = JSON.parse(localStorage.getItem('fav') as string)
            items.push(item.id)
            localStorage.setItem('fav', JSON.stringify(items))
        } else {
            item.isFav = true;
            this.favIds.push(item.id)
            this.favList.push(item)
            localStorage.setItem('fav', JSON.stringify(this.favIds))
        }
    }
  }

  convertUnitChanges (item: CurrencyItem, current: Current) {
    let dollarChanges = (current.price_dollar_rl.dt === 'low' ? -1 : 1) * (current.price_dollar_rl.dp);
    let itemChanges = (item.lastPriceInfo.dt === 'low' ? -1 : 1) * (item.lastPriceInfo.dp)
    if (item.unit === toman_unit) {
        item.rialChangeState = item.lastPriceInfo.dt
        item.rialChanges = item.lastPriceInfo.dp + '';
        let itemDollarChanges = (((1 + itemChanges) / (1 + dollarChanges)) - 1);
        item.dollarChangeState = itemDollarChanges >= 0 ? 'high' : 'low';
        itemDollarChanges = Math.floor(itemDollarChanges * 100) / 100
        item.dollarChanges = Math.abs(itemDollarChanges) + '';
    }
    else if (item.unit === dollar_unit) {
        item.dollarChangeState = item.lastPriceInfo.dt
        item.dollarChanges = item.lastPriceInfo.dp + '';
        let itemRialChanges = (((1 + itemChanges) * (1 + dollarChanges)) + 1);
        item.rialChangeState = itemRialChanges >= 0 ? 'high' : 'low';
        itemRialChanges = Math.floor(itemRialChanges * 100) / 100
        item.rialChanges = Math.abs(itemRialChanges) + '';
    } else if (item.unit === pound_unit) {
        let poundChanges = (current.price_gbp.dt === 'low' ? -1 : 1) * (current.price_gbp.dp)
        let poundAskChanges = (current['gbp-usd-ask'].dt === 'low' ? -1 : 1) * (current['gbp-usd-ask'].dp)
        
        let itemDollarChanges = (((1 + itemChanges) / (1 + poundAskChanges)) - 1);
        let itemRialChanges = (((1 + itemChanges) * (1 + poundChanges)) + 1);

        item.dollarChangeState = itemDollarChanges >= 0 ? 'high' : 'low';
        item.rialChangeState = itemRialChanges >= 0 ? 'high' : 'low'
        
        itemDollarChanges = Math.floor(itemDollarChanges * 100) / 100;
        itemRialChanges = Math.floor(itemRialChanges * 100) / 100;
        item.dollarChanges = Math.abs(itemDollarChanges) + '';
        item.rialChanges = Math.abs(itemRialChanges) + '';
    }
  }

  getFavorites() {
    if (typeof window !== 'undefined') {
        let items: string[] = JSON.parse(localStorage.getItem('fav') as string)
        let favItems: CurrencyItem[] | undefined = []
        for (const item of this.allItemsList) {
            for (const favId of items) {
                if (item.id === favId) favItems.push(item)
            }
        }
        this.favList = favItems;
    }
  }

  removeFromFavorite(id: string) {
    if (window.navigator.onLine) {
        let itemToRemove: CurrencyItem | undefined = this.allItemsList.find(item => item.id === id)
        this.currentState = '-';
        this.currentItem = itemToRemove!.title;

        if (typeof window !== 'undefined' && itemToRemove !== undefined) {
            let items: string[] = JSON.parse(localStorage.getItem('fav') as string)
            this.favIds = items;

            itemToRemove.isFav = false;
            this.favList = this.favList.filter(item => item.id !== id)
            this.favIds = this.favIds.filter(itemId => itemId !== id)
            localStorage.setItem('fav', JSON.stringify(this.favIds))
        }
    }
  }
  
  calculateOtherCurrenccyPrices(list: CurrencyItem[], current: Current) {

    list.forEach(item => {
        let priceValue = +(item.lastPriceInfo.p.replaceAll(',', ''))
        // convert all to rial for real price
        if (item.unit === dollar_unit) {
            let dollarValue = +(current.price_dollar_rl.p.replaceAll(',', ''))
            item.realPrice = Math.round((priceValue * dollarValue) * 100) / 100;

            item.dollarPrice = priceValue;
            item.dollarStringPrice = this.commafy(priceValue)
        }
        else if (item.unit === pound_unit) {
            let poundValue = +(current.price_gbp.p.replaceAll(',', ''))
            item.realPrice = Math.round((priceValue * poundValue) * 100) / 100;

            item.poundAsk = current['gbp-usd-ask'].p;

            let priceDollarValue = priceValue * (+current['gbp-usd-ask'].p)
            let roundedDollarPrice = Math.round(priceDollarValue * 100) / 100;
            item.dollarPrice = roundedDollarPrice;
            item.dollarStringPrice = this.commafy(roundedDollarPrice)
            
        }
        else {
            item.realPrice = priceValue;

            let dollarMainValue = item.realPrice / (+(current.price_dollar_rl.p.replaceAll(',', '')));
            item.dollarPrice = Math.round(dollarMainValue * 100) / 100
            item.dollarStringPrice = this.commafy(item.dollarPrice)
        }
        item.rialStringRealPrice = this.commafy(item.realPrice)

        // convert to toman
        item.tomanPrice = Math.round((item.realPrice / 10) * 100) / 100
        item.tomanStringPrice = this.commafy(item.tomanPrice);

        this.convertUnitChanges(item, current)

        // add slug text
        item.slugText = item.shortedName?.replace(/[\d()\-\s]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '').toLocaleLowerCase();

        // fix 24h changes problem
        if (item.lastPriceInfo.dt === 'low' && item.lastPriceInfo.dp === 0) item.lastPriceInfo.dt = 'high'
    })
  }

  setupMainData() {
    this.currencyService.getAllCurrencies().subscribe((data: Currencies) => {
      this.mainData = data;
      
      this.setupMainCurrenciesList(data.current)
      this.calculateOtherCurrenccyPrices(this.mainCurrencyList, data.current)

      this.setupCryptoList(data.current)
      this.calculateOtherCurrenccyPrices(this.cryptoList, data.current)

      this.setupWorldMarketList(data.current)
      this.calculateOtherCurrenccyPrices(this.worldMarketList, data.current)

      this.setupCoinList(data.current)
      this.calculateOtherCurrenccyPrices(this.coinList, data.current)

      this.setupGoldList(data.current)
      this.calculateOtherCurrenccyPrices(this.goldList, data.current)

      this.setupPreciousMetals(data.current)
      this.calculateOtherCurrenccyPrices(this.preciousMetalList, data.current)

      this.setupBaseMetals(data.current)
      this.calculateOtherCurrenccyPrices(this.baseMetalList, data.current)

      this.setupCommodityMarket(data.current)
      this.calculateOtherCurrenccyPrices(this.commodityList, data.current)

      this.setupAllItemsList()
      this.getFavorites()
    })
  }


  private setupMainCurrenciesList(current: Current) {
    this.mainCurrencyList = []
    
    // Main
    this.mainCurrencyList.push({
        id: "1000000",
        historyCallInfo: this.currencyService.getDollarRlHistoryInfo(),
        lastPriceInfo: current.price_dollar_rl,
        title: "دلار آمریکا",
        shortedName: "USD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/us.svg',
    });
    this.mainCurrencyList.push({
        id: "1000001",
        historyCallInfo: this.currencyService.getEuroRlHistoryInfo(),
        lastPriceInfo: current.price_eur,
        title: "یورو",
        shortedName: "EUR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/eu.svg'
    });
    this.mainCurrencyList.push({
        id: "1000002",
        historyCallInfo: this.currencyService.getAedRlHistoryInfo(),
        lastPriceInfo: current.price_aed,
        title: "درهم امارات",
        shortedName: "AED",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ae.svg'
    });
    this.mainCurrencyList.push({
        id: "1000003",
        historyCallInfo: this.currencyService.getGbpRlHistoryInfo(),
        lastPriceInfo: current.price_gbp,
        title: "پوند انگلیس",
        shortedName: "GBP",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/gb.svg'
    });
    this.mainCurrencyList.push({
        id: "1000004",
        historyCallInfo: this.currencyService.getTryRlHistoryInfo(),
        lastPriceInfo: current.price_try,
        title: "لیر ترکیه",
        shortedName: "TRY",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tr.svg'
    });
    this.mainCurrencyList.push({
        id: "1000005",
        historyCallInfo: this.currencyService.getChfRlHistoryInfo(),
        lastPriceInfo: current.price_chf,
        title: "فرانک سوییس",
        shortedName: "CHF",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ch.svg'
    });
    this.mainCurrencyList.push({
        id: "1000006",
        historyCallInfo: this.currencyService.getCnyRlHistoryInfo(),
        lastPriceInfo: current.price_cny,
        title: "یوان چین",
        shortedName: "CNY",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cn.svg'
    });
    this.mainCurrencyList.push({
        id: "1000007",
        historyCallInfo: this.currencyService.getJpyRlHistoryInfo(),
        lastPriceInfo: current.price_jpy,
        title: "ین ژاپن (100 ین)",
        shortedName: "JPY",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/jp.svg'
    });
    this.mainCurrencyList.push({
        id: "1000008",
        historyCallInfo: this.currencyService.getKrwRlHistoryInfo(),
        lastPriceInfo: current.price_krw,
        title: "وون کره جنوبی",
        shortedName: "KRW",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/kr.svg'
    });
    this.mainCurrencyList.push({
        id: "1000009",
        historyCallInfo: this.currencyService.getCadRlHistoryInfo(),
        lastPriceInfo: current.price_cad,
        title: "دلار کانادا",
        shortedName: "CAD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ca.svg'
    });
    this.mainCurrencyList.push({
        id: "1000010",
        historyCallInfo: this.currencyService.getAudRlHistoryInfo(),
        lastPriceInfo: current.price_aud,
        title: "دلار استرالیا",
        shortedName: "AUD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/au.svg'
    });
    this.mainCurrencyList.push({
        id: "1000011",
        historyCallInfo: this.currencyService.getNzdRlHistoryInfo(),
        lastPriceInfo: current.price_nzd,
        title: "دلار نیوزلند",
        shortedName: "NZD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/nz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000012",
        historyCallInfo: this.currencyService.getSgdRlHistoryInfo(),
        lastPriceInfo: current.price_sgd,
        title: "دلار سنگاپور",
        shortedName: "SGD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sg.svg'
    });
    this.mainCurrencyList.push({
        id: "1000013",
        historyCallInfo: this.currencyService.getInrRlHistoryInfo(),
        lastPriceInfo: current.price_inr,
        title: "روپیه هند",
        shortedName: "INR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/in.svg'
    });
    this.mainCurrencyList.push({
        id: "1000014",
        historyCallInfo: this.currencyService.getPkrRlHistoryInfo(),
        lastPriceInfo: current.price_pkr,
        title: "روپیه پاکستان",
        shortedName: "PKR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/pk.svg'
    });
    this.mainCurrencyList.push({
        id: "1000015",
        historyCallInfo: this.currencyService.getIqdRlHistoryInfo(),
        lastPriceInfo: current.price_iqd,
        title: "دینار عراق",
        shortedName: "IQD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/iq.svg'
    });
    this.mainCurrencyList.push({
        id: "1000016",
        historyCallInfo: this.currencyService.getSypRlHistoryInfo(),
        lastPriceInfo: current.price_syp,
        title: "پوند سوریه",
        shortedName: "SYP",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sy.svg'
    });
    this.mainCurrencyList.push({
        id: "1000017",
        historyCallInfo: this.currencyService.getAfnRlHistoryInfo(),
        lastPriceInfo: current.price_afn,
        title: "افغانی افغانستان",
        shortedName: "AFN",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/af.svg'
    });
    this.mainCurrencyList.push({
        id: "1000018",
        historyCallInfo: this.currencyService.getDkkRlHistoryInfo(),
        lastPriceInfo: current.price_dkk,
        title: "کرون دانمارک",
        shortedName: "DKK",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/dk.svg'
    });
    this.mainCurrencyList.push({
        id: "1000019",
        historyCallInfo: this.currencyService.getSekRlHistoryInfo(),
        lastPriceInfo: current.price_sek,
        title: "کرون سوئد",
        shortedName: "SEK",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/se.svg'
    });
    this.mainCurrencyList.push({
        id: "1000020",
        historyCallInfo: this.currencyService.getNokRlHistoryInfo(),
        lastPriceInfo: current.price_nok,
        title: "کرون نروژ",
        shortedName: "NOK",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/no.svg'
    });
    this.mainCurrencyList.push({
        id: "1000021",
        historyCallInfo: this.currencyService.getSarRlHistoryInfo(),
        lastPriceInfo: current.price_sar,
        title: "ريال عربستان",
        shortedName: "SAR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sa.svg'
    });
    this.mainCurrencyList.push({
        id: "1000022",
        historyCallInfo: this.currencyService.getQarRlHistoryInfo(),
        lastPriceInfo: current.price_qar,
        title: "ريال قطر",
        shortedName: "QAR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/qa.svg'
    });
    this.mainCurrencyList.push({
        id: "1000023",
        historyCallInfo: this.currencyService.getOmrRlHistoryInfo(),
        lastPriceInfo: current.price_omr,
        title: "ريال عمان",
        shortedName: "OMR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/om.svg'
    });
    this.mainCurrencyList.push({
        id: "1000024",
        historyCallInfo: this.currencyService.getKwdRlHistoryInfo(),
        lastPriceInfo: current.price_kwd,
        title: "دینار کویت",
        shortedName: "KWD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/kw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000025",
        historyCallInfo: this.currencyService.getBhdRlHistoryInfo(),
        lastPriceInfo: current.price_bhd,
        title: "دینار بحرین",
        shortedName: "BHD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bh.svg'
    });
    this.mainCurrencyList.push({
        id: "1000026",
        historyCallInfo: this.currencyService.getMyrRlHistoryInfo(),
        lastPriceInfo: current.price_myr,
        title: "رینگیت مالزی",
        shortedName: "MYR",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/my.svg'
    });
    this.mainCurrencyList.push({
        id: "1000027",
        historyCallInfo: this.currencyService.getThbRlHistoryInfo(),
        lastPriceInfo: current.price_thb,
        title: "بات تایلند",
        shortedName: "THB",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/th.svg'
    });
    this.mainCurrencyList.push({
        id: "1000028",
        historyCallInfo: this.currencyService.getHkdRlHistoryInfo(),
        lastPriceInfo: current.price_hkd,
        title: "دلار هنگ کنگ",
        shortedName: "HKD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/hk.svg'
    });
    this.mainCurrencyList.push({
        id: "1000029",
        historyCallInfo: this.currencyService.getRubRlHistoryInfo(),
        lastPriceInfo: current.price_rub,
        title: "روبل روسیه",
        shortedName: "RUB",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ru.svg'
    });
    this.mainCurrencyList.push({
        id: "1000030",
        historyCallInfo: this.currencyService.getAznRlHistoryInfo(),
        lastPriceInfo: current.price_azn,
        title: "منات آذربایجان",
        shortedName: "AZN",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/az.svg'
    });
    this.mainCurrencyList.push({
        id: "1000031",
        historyCallInfo: this.currencyService.getAmdRlHistoryInfo(),
        lastPriceInfo: current.price_amd,
        title: "درام ارمنستان",
        shortedName: "AMD",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/am.svg'
    });
    this.mainCurrencyList.push({
        id: "1000032",
        historyCallInfo: this.currencyService.getGelRlHistoryInfo(),
        lastPriceInfo: current.price_gel,
        title: "لاری گرجستان",
        shortedName: "GEL",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ge.svg'
    });
    this.mainCurrencyList.push({
        id: "1000033",
        historyCallInfo: this.currencyService.getKgsRlHistoryInfo(),
        lastPriceInfo: current.price_kgs,
        title: "سوم قرقیزستان",
        shortedName: "KGS",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/kg.svg'
    });
    this.mainCurrencyList.push({
        id: "1000034",
        historyCallInfo: this.currencyService.getTjsRlHistoryInfo(),
        lastPriceInfo: current.price_tjs,
        title: "سامانی تاجیکستان",
        shortedName: "TJS",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tj.svg'
    });
    this.mainCurrencyList.push({
        id: "1000035",
        historyCallInfo: this.currencyService.getTmtRlHistoryInfo(),
        lastPriceInfo: current.price_tmt,
        title: "منات ترکمنستان",
        shortedName: "TMT",
        filterName: filter_main_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tm.svg'
    });


    // Other

    this.mainCurrencyList.push({
        id: "1000036",
        historyCallInfo: this.currencyService.getAllRlHistoryInfo(),
        lastPriceInfo: current.price_all,
        title: "لک آلبانی",
        shortedName: "ALL",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/al.svg'
    });
    this.mainCurrencyList.push({
        id: "1000037",
        historyCallInfo: this.currencyService.getBbdRlHistoryInfo(),
        lastPriceInfo: current.price_bbd,
        title: "دلار باربادوس",
        shortedName: "BBD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bb.svg'
    });
    this.mainCurrencyList.push({
        id: "1000038",
        historyCallInfo: this.currencyService.getBdtRlHistoryInfo(),
        lastPriceInfo: current.price_bdt,
        title: "تاکا بنگلادش",
        shortedName: "BDT",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bd.svg'
    });
    this.mainCurrencyList.push({
        id: "1000039",
        historyCallInfo: this.currencyService.getBgnRlHistoryInfo(),
        lastPriceInfo: current.price_bgn,
        title: "لو بلغارستان",
        shortedName: "BGN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bg.svg'
    });
    this.mainCurrencyList.push({
        id: "1000040",
        historyCallInfo: this.currencyService.getBifRlHistoryInfo(),
        lastPriceInfo: current.price_bif,
        title: "فرانک بوروندی",
        shortedName: "BIF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bi.svg'
    });
    this.mainCurrencyList.push({
        id: "1000041",
        historyCallInfo: this.currencyService.getBndRlHistoryInfo(),
        lastPriceInfo: current.price_bnd,
        title: "دلار بورونئی",
        shortedName: "BHD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bn.svg'
    });
    this.mainCurrencyList.push({
        id: "1000042",
        historyCallInfo: this.currencyService.getBsdRlHistoryInfo(),
        lastPriceInfo: current.price_bsd,
        title: "دلار باهاماس",
        shortedName: "BSD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bs.svg'
    });
    this.mainCurrencyList.push({
        id: "1000043",
        historyCallInfo: this.currencyService.getBwpRlHistoryInfo(),
        lastPriceInfo: current.price_bwp,
        title: "پوله بوتسوانا",
        shortedName: "BWP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000044",
        historyCallInfo: this.currencyService.getBynRlHistoryInfo(),
        lastPriceInfo: current.price_byn,
        title: "روبل بلاروس",
        shortedName: "BYN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/by.svg'
    });
    this.mainCurrencyList.push({
        id: "1000045",
        historyCallInfo: this.currencyService.getBzdRlHistoryInfo(),
        lastPriceInfo: current.price_bzd,
        title: "دلار بلیز",
        shortedName: "BZD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000046",
        historyCallInfo: this.currencyService.getCupRlHistoryInfo(),
        lastPriceInfo: current.price_cup,
        title: "پزوی کوبا",
        shortedName: "CUP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cu.svg'
    });
    this.mainCurrencyList.push({
        id: "1000047",
        historyCallInfo: this.currencyService.getCzkRlHistoryInfo(),
        lastPriceInfo: current.price_czk,
        title: "کرون چک",
        shortedName: "CZK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000048",
        historyCallInfo: this.currencyService.getDjfRlHistoryInfo(),
        lastPriceInfo: current.price_djf,
        title: "فرانک جیبوتی",
        shortedName: "DJF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/dj.svg'
    });
    this.mainCurrencyList.push({
        id: "1000049",
        historyCallInfo: this.currencyService.getDopRlHistoryInfo(),
        lastPriceInfo: current.price_dop,
        title: "پزوی دومینیکن",
        shortedName: "DOP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/do.svg'
    });
    this.mainCurrencyList.push({
        id: "1000050",
        historyCallInfo: this.currencyService.getDzdRlHistoryInfo(),
        lastPriceInfo: current.price_dzd,
        title: "دینار الجزایر",
        shortedName: "DZD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/dz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000051",
        historyCallInfo: this.currencyService.getEtbRlHistoryInfo(),
        lastPriceInfo: current.price_etb,
        title: "بیر اتیوپی",
        shortedName: "ETB",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/et.svg'
    });
    this.mainCurrencyList.push({
        id: "1000052",
        historyCallInfo: this.currencyService.getGnfRlHistoryInfo(),
        lastPriceInfo: current.price_gnf,
        title: "فرانک گینه",
        shortedName: "GNF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/gn.svg'
    });
    this.mainCurrencyList.push({
        id: "1000053",
        historyCallInfo: this.currencyService.getGtqRlHistoryInfo(),
        lastPriceInfo: current.price_gtq,
        title: "گواتزال گواتمالا",
        shortedName: "GTQ",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/gt.svg'
    });
    this.mainCurrencyList.push({
        id: "1000054",
        historyCallInfo: this.currencyService.getGydRlHistoryInfo(),
        lastPriceInfo: current.price_gyd,
        title: "دلار گویان",
        shortedName: "GYD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/gy.svg'
    });
    this.mainCurrencyList.push({
        id: "1000055",
        historyCallInfo: this.currencyService.getHnlRlHistoryInfo(),
        lastPriceInfo: current.price_hnl,
        title: "لمپیرا هندوراس",
        shortedName: "HNL",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/hn.svg'
    });
    this.mainCurrencyList.push({
        id: "1000056",
        historyCallInfo: this.currencyService.getHrkRlHistoryInfo(),
        lastPriceInfo: current.price_hrk,
        title: "کونا (یورو) کرواسی",
        shortedName: "HRK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/hr.svg'
    });
    this.mainCurrencyList.push({
        id: "1000057",
        historyCallInfo: this.currencyService.getHtgRlHistoryInfo(),
        lastPriceInfo: current.price_htg,
        title: "گورده هائیتی",
        shortedName: "HTG",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ht.svg'
    });
    this.mainCurrencyList.push({
        id: "1000058",
        historyCallInfo: this.currencyService.getIskRlHistoryInfo(),
        lastPriceInfo: current.price_isk,
        title: "کرونا ایسلند",
        shortedName: "ISK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/is.svg'
    });
    this.mainCurrencyList.push({
        id: "1000059",
        historyCallInfo: this.currencyService.getJmdRlHistoryInfo(),
        lastPriceInfo: current.price_jmd,
        title: "دلار جامائیکا",
        shortedName: "JMD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/jm.svg'
    });
    this.mainCurrencyList.push({
        id: "1000060",
        historyCallInfo: this.currencyService.getKesRlHistoryInfo(),
        lastPriceInfo: current.price_kes,
        title: "شیلینگ کنیا",
        shortedName: "KES",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ke.svg'
    });
    this.mainCurrencyList.push({
        id: "1000061",
        historyCallInfo: this.currencyService.getKhrRlHistoryInfo(),
        lastPriceInfo: current.price_khr,
        title: "ریل کامبوج",
        shortedName: "KHR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/kh.svg'
    });
    this.mainCurrencyList.push({
        id: "1000062",
        historyCallInfo: this.currencyService.getKmfRlHistoryInfo(),
        lastPriceInfo: current.price_kmf,
        title: "فرانک کومور",
        shortedName: "KMF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/km.svg'
    });
    this.mainCurrencyList.push({
        id: "1000063",
        historyCallInfo: this.currencyService.getKztRlHistoryInfo(),
        lastPriceInfo: current.price_kzt,
        title: "تنگه قزاقستان",
        shortedName: "KZT",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/kz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000064",
        historyCallInfo: this.currencyService.getLakRlHistoryInfo(),
        lastPriceInfo: current.price_lak,
        title: "کیپ لائوس",
        shortedName: "LAK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/la.svg'
    });
    this.mainCurrencyList.push({
        id: "1000065",
        historyCallInfo: this.currencyService.getLbpRlHistoryInfo(),
        lastPriceInfo: current.price_lbp,
        title: "پوند لبنان",
        shortedName: "LBP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/lb.svg'
    });
    this.mainCurrencyList.push({
        id: "1000066",
        historyCallInfo: this.currencyService.getLkrRlHistoryInfo(),
        lastPriceInfo: current.price_lkr,
        title: "روپیه سریلانکا",
        shortedName: "LKR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/lk.svg'
    });
    this.mainCurrencyList.push({
        id: "1000067",
        historyCallInfo: this.currencyService.getLrdRlHistoryInfo(),
        lastPriceInfo: current.price_lrd,
        title: "دلار لیبریا",
        shortedName: "LRD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/lr.svg'
    });
    this.mainCurrencyList.push({
        id: "1000068",
        historyCallInfo: this.currencyService.getLslRlHistoryInfo(),
        lastPriceInfo: current.price_lsl,
        title: "لوتی لسوتو",
        shortedName: "LSL",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ls.svg'
    });
    this.mainCurrencyList.push({
        id: "1000069",
        historyCallInfo: this.currencyService.getLydRlHistoryInfo(),
        lastPriceInfo: current.price_lyd,
        title: "دینار لیبی",
        shortedName: "LYD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ly.svg'
    });
    this.mainCurrencyList.push({
        id: "1000070",
        historyCallInfo: this.currencyService.getMadRlHistoryInfo(),
        lastPriceInfo: current.price_mad,
        title: "درهم مراکش",
        shortedName: "MAD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ma.svg'
    });
    this.mainCurrencyList.push({
        id: "1000071",
        historyCallInfo: this.currencyService.getMgaRlHistoryInfo(),
        lastPriceInfo: current.price_mga,
        title: "آریاری ماداگاسکار",
        shortedName: "MGA",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mg.svg'
    });
    this.mainCurrencyList.push({
        id: "1000072",
        historyCallInfo: this.currencyService.getMkdRlHistoryInfo(),
        lastPriceInfo: current.price_mkd,
        title: "دینار مقدونیه",
        shortedName: "MKD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mk.svg'
    });
    this.mainCurrencyList.push({
        id: "1000073",
        historyCallInfo: this.currencyService.getMmkRlHistoryInfo(),
        lastPriceInfo: current.price_mmk,
        title: "کیات میانمار",
        shortedName: "MMK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mm.svg'
    });
    this.mainCurrencyList.push({
        id: "1000074",
        historyCallInfo: this.currencyService.getMopRlHistoryInfo(),
        lastPriceInfo: current.price_mop,
        title: "پاتاکا ماکائو",
        shortedName: "MOP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mo.svg'
    });
    this.mainCurrencyList.push({
        id: "1000075",
        historyCallInfo: this.currencyService.getMurRlHistoryInfo(),
        lastPriceInfo: current.price_mur,
        title: "روپیه موریس",
        shortedName: "MUR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mu.svg'
    });
    this.mainCurrencyList.push({
        id: "1000076",
        historyCallInfo: this.currencyService.getMvrRlHistoryInfo(),
        lastPriceInfo: current.price_mvr,
        title: "روفیا مالدیو",
        shortedName: "MVR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mv.svg'
    });
    this.mainCurrencyList.push({
        id: "1000077",
        historyCallInfo: this.currencyService.getMwkRlHistoryInfo(),
        lastPriceInfo: current.price_mwk,
        title: "کواچا مالاوی",
        shortedName: "MWK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000078",
        historyCallInfo: this.currencyService.getMznRlHistoryInfo(),
        lastPriceInfo: current.price_mzn,
        title: "متیکال موزامبیک",
        shortedName: "MZN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000079",
        historyCallInfo: this.currencyService.getNadRlHistoryInfo(),
        lastPriceInfo: current.price_nad,
        title: "دلار نامیبیا",
        shortedName: "NAD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/na.svg'
    });
    this.mainCurrencyList.push({
        id: "1000080",
        historyCallInfo: this.currencyService.getNgnRlHistoryInfo(),
        lastPriceInfo: current.price_ngn,
        title: "نیرا نیجریه",
        shortedName: "NGN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ng.svg'
    });
    this.mainCurrencyList.push({
        id: "1000081",
        historyCallInfo: this.currencyService.getNprRlHistoryInfo(),
        lastPriceInfo: current.price_npr,
        title: "روپیه نپال",
        shortedName: "NPR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/np.svg'
    });
    this.mainCurrencyList.push({
        id: "1000082",
        historyCallInfo: this.currencyService.getPabRlHistoryInfo(),
        lastPriceInfo: current.price_pab,
        title: "بالبوآ پاناما",
        shortedName: "PAB",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/pa.svg'
    });
    this.mainCurrencyList.push({
        id: "1000083",
        historyCallInfo: this.currencyService.getPgkRlHistoryInfo(),
        lastPriceInfo: current.price_pgk,
        title: "کینا پاپوا گینه نو",
        shortedName: "PGK",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/pg.svg'
    });
    this.mainCurrencyList.push({
        id: "1000084",
        historyCallInfo: this.currencyService.getPhpRlHistoryInfo(),
        lastPriceInfo: current.price_php,
        title: "پزوی فیلیپین",
        shortedName: "PHP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ph.svg'
    });
    this.mainCurrencyList.push({
        id: "1000085",
        historyCallInfo: this.currencyService.getRonRlHistoryInfo(),
        lastPriceInfo: current.price_ron,
        title: "لئو رومانی",
        shortedName: "RON",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ro.svg'
    });
    this.mainCurrencyList.push({
        id: "1000086",
        historyCallInfo: this.currencyService.getRsdRlHistoryInfo(),
        lastPriceInfo: current.price_rsd,
        title: "دینار صربستان",
        shortedName: "RSD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/rs.svg'
    });
    this.mainCurrencyList.push({
        id: "1000087",
        historyCallInfo: this.currencyService.getRwfRlHistoryInfo(),
        lastPriceInfo: current.price_rwf,
        title: "فرانک رواندا",
        shortedName: "RWF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/rw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000088",
        historyCallInfo: this.currencyService.getScrRlHistoryInfo(),
        lastPriceInfo: current.price_scr,
        title: "روپیه سیشل",
        shortedName: "SCR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sc.svg'
    });
    this.mainCurrencyList.push({
        id: "1000089",
        historyCallInfo: this.currencyService.getSdgRlHistoryInfo(),
        lastPriceInfo: current.price_sdg,
        title: "پوند سودان",
        shortedName: "SDG",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sd.svg'
    });
    this.mainCurrencyList.push({
        id: "1000090",
        historyCallInfo: this.currencyService.getShpRlHistoryInfo(),
        lastPriceInfo: current.price_shp,
        title: "پوند سینت هلینا",
        shortedName: "SHP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sh.svg'
    });
    this.mainCurrencyList.push({
        id: "1000091",
        historyCallInfo: this.currencyService.getSosRlHistoryInfo(),
        lastPriceInfo: current.price_sos,
        title: "شیلینگ سومالی",
        shortedName: "SOS",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/so.svg'
    });
    this.mainCurrencyList.push({
        id: "1000092",
        historyCallInfo: this.currencyService.getSvcRlHistoryInfo(),
        lastPriceInfo: current.price_svc,
        title: "کولون (دلار) السالوادور",
        shortedName: "SVC",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sv.svg'
    });
    this.mainCurrencyList.push({
        id: "1000093",
        historyCallInfo: this.currencyService.getSzlRlHistoryInfo(),
        lastPriceInfo: current.price_szl,
        title: "لیلانگی سوازیلند",
        shortedName: "SZL",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000094",
        historyCallInfo: this.currencyService.getTndRlHistoryInfo(),
        lastPriceInfo: current.price_tnd,
        title: "دینار تونس",
        shortedName: "TND",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tn.svg'
    });
    this.mainCurrencyList.push({
        id: "1000095",
        historyCallInfo: this.currencyService.getTtdRlHistoryInfo(),
        lastPriceInfo: current.price_ttd,
        title: "دلار ترینیداد و توباگو",
        shortedName: "TTD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tt.svg'
    });
    this.mainCurrencyList.push({
        id: "1000096",
        historyCallInfo: this.currencyService.getTzsRlHistoryInfo(),
        lastPriceInfo: current.price_tzs,
        title: "شیلینگ تانزانیا",
        shortedName: "TZS",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000097",
        historyCallInfo: this.currencyService.getUgxRlHistoryInfo(),
        lastPriceInfo: current.price_ugx,
        title: "شیلینگ اوگاندا",
        shortedName: "UGX",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ug.svg'
    });
    this.mainCurrencyList.push({
        id: "1000098",
        historyCallInfo: this.currencyService.getYerRlHistoryInfo(),
        lastPriceInfo: current.price_yer,
        title: "ريال یمن",
        shortedName: "YER",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ye.svg'
    });
    this.mainCurrencyList.push({
        id: "1000099",
        historyCallInfo: this.currencyService.getZmwRlHistoryInfo(),
        lastPriceInfo: current.price_zmw,
        title: "کواچا زامبیا",
        shortedName: "ZMW",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/zm.svg'
    });
    this.mainCurrencyList.push({
        id: "1000100",
        historyCallInfo: this.currencyService.getGhsRlHistoryInfo(),
        lastPriceInfo: current.price_ghs,
        title: "سدی غنا",
        shortedName: "GHS",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/gh.svg'
    });
    this.mainCurrencyList.push({
        id: "1000101",
        historyCallInfo: this.currencyService.getPenRlHistoryInfo(),
        lastPriceInfo: current.price_pen,
        title: "سول پرو",
        shortedName: "PEN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/pe.svg'
    });
    this.mainCurrencyList.push({
        id: "1000102",
        historyCallInfo: this.currencyService.getClpRlHistoryInfo(),
        lastPriceInfo: current.price_clp,
        title: "پزوی شیلی",
        shortedName: "CLP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cl.svg'
    });
    this.mainCurrencyList.push({
        id: "1000103",
        historyCallInfo: this.currencyService.getEgpRlHistoryInfo(),
        lastPriceInfo: current.price_egp,
        title: "پوند مصر",
        shortedName: "EGP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/eg.svg'
    });
    this.mainCurrencyList.push({
        id: "1000104",
        historyCallInfo: this.currencyService.getMxnRlHistoryInfo(),
        lastPriceInfo: current.price_mxn,
        title: "پزوی مکزیک",
        shortedName: "MXN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mx.svg'
    });
    this.mainCurrencyList.push({
        id: "1000105",
        historyCallInfo: this.currencyService.getJodRlHistoryInfo(),
        lastPriceInfo: current.price_jod,
        title: "دینار اردن",
        shortedName: "JOD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/jo.svg'
    });
    this.mainCurrencyList.push({
        id: "1000106",
        historyCallInfo: this.currencyService.getBrlRlHistoryInfo(),
        lastPriceInfo: current.price_brl,
        title: "رئال برزیل",
        shortedName: "BRL",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/br.svg'
    });
    this.mainCurrencyList.push({
        id: "1000107",
        historyCallInfo: this.currencyService.getUyuRlHistoryInfo(),
        lastPriceInfo: current.price_uyu,
        title: "پزوی اوروگوئه",
        shortedName: "UYU",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/uy.svg'
    });
    this.mainCurrencyList.push({
        id: "1000108",
        historyCallInfo: this.currencyService.getCopRlHistoryInfo(),
        lastPriceInfo: current.price_cop,
        title: "پزوی کلمبیا",
        shortedName: "COP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/co.svg'
    });
    this.mainCurrencyList.push({
        id: "1000109",
        historyCallInfo: this.currencyService.getPlnRlHistoryInfo(),
        lastPriceInfo: current.price_pln,
        title: "زلوتی لهستان",
        shortedName: "PLN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/pl.svg'
    });
    this.mainCurrencyList.push({
        id: "1000110",
        historyCallInfo: this.currencyService.getArsRlHistoryInfo(),
        lastPriceInfo: current.price_ars,
        title: "پزوی آرژانتین",
        shortedName: "ARS",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ar.svg'
    });
    this.mainCurrencyList.push({
        id: "1000111",
        historyCallInfo: this.currencyService.getKydRlHistoryInfo(),
        lastPriceInfo: current.price_kyd,
        title: "دلار جزایر کیمن",
        shortedName: "KYD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ky.svg'
    });
    this.mainCurrencyList.push({
        id: "1000112",
        historyCallInfo: this.currencyService.getHufRlHistoryInfo(),
        lastPriceInfo: current.price_huf,
        title: "فورینت مجارستان",
        shortedName: "HUF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/hu.svg'
    });
    this.mainCurrencyList.push({
        id: "1000113",
        historyCallInfo: this.currencyService.getPygRlHistoryInfo(),
        lastPriceInfo: current.price_pyg,
        title: "گورانی پاراکوئه",
        shortedName: "PYG",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/py.svg'
    });
    this.mainCurrencyList.push({
        id: "1000114",
        historyCallInfo: this.currencyService.getUahRlHistoryInfo(),
        lastPriceInfo: current.price_uah,
        title: "هریونیا اوکراین",
        shortedName: "UAH",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ua.svg'
    });
    this.mainCurrencyList.push({
        id: "1000115",
        historyCallInfo: this.currencyService.getZarRlHistoryInfo(),
        lastPriceInfo: current.price_zar,
        title: "رند آفریقای جنوبی",
        shortedName: "ZAR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/za.svg'
    });
    this.mainCurrencyList.push({
        id: "1000116",
        historyCallInfo: this.currencyService.getNioRlHistoryInfo(),
        lastPriceInfo: current.price_nio,
        title: "کوردوبا نیکاراگوئه",
        shortedName: "NIO",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ni.svg'
    });
    this.mainCurrencyList.push({
        id: "1000117",
        historyCallInfo: this.currencyService.getFjdRlHistoryInfo(),
        lastPriceInfo: current.price_fjd,
        title: "دلار فیجی",
        shortedName: "FJD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/fj.svg'
    });
    this.mainCurrencyList.push({
        id: "1000118",
        historyCallInfo: this.currencyService.getTwdRlHistoryInfo(),
        lastPriceInfo: current.price_twd,
        title: "دلار تایوان",
        shortedName: "TWD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/tw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000119",
        historyCallInfo: this.currencyService.getUzsRlHistoryInfo(),
        lastPriceInfo: current.price_uzs,
        title: "سوم ازبکستان (10000)",
        shortedName: "UZS",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/uz.svg'
    });
    this.mainCurrencyList.push({
        id: "1000120",
        historyCallInfo: this.currencyService.getIdrRlHistoryInfo(),
        lastPriceInfo: current.price_idr,
        title: "روپیه اندونزی",
        shortedName: "IDR",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/id.svg'
    });
    this.mainCurrencyList.push({
        id: "1000121",
        historyCallInfo: this.currencyService.getXofRlHistoryInfo(),
        lastPriceInfo: current.price_xof,
        title: "فرانک آفریقای غربی",
        shortedName: "XOF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/za.svg'
    });
    this.mainCurrencyList.push({
        id: "1000122",
        historyCallInfo: this.currencyService.getXpfRlHistoryInfo(),
        lastPriceInfo: current.price_xpf,
        title: "فرانک اقیانوسیه",
        shortedName: "XPF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/pf.svg'
    });
    this.mainCurrencyList.push({
        id: "1000123",
        historyCallInfo: this.currencyService.getVndRlHistoryInfo(),
        lastPriceInfo: current.price_vnd,
        title: "دونگ ویتنام",
        shortedName: "VND",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/vn.svg'
    });
    this.mainCurrencyList.push({
        id: "1000124",
        historyCallInfo: this.currencyService.getGmdRlHistoryInfo(),
        lastPriceInfo: current.price_gmd,
        title: "دلاسی گامبیا",
        shortedName: "GMD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/gm.svg'
    });
    this.mainCurrencyList.push({
        id: "1000125",
        historyCallInfo: this.currencyService.getXafRlHistoryInfo(),
        lastPriceInfo: current.price_xaf,
        title: "فرانک آفریقای مرکزی",
        shortedName: "XAF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cf.svg'
    });
    this.mainCurrencyList.push({
        id: "1000126",
        historyCallInfo: this.currencyService.getVuvRlHistoryInfo(),
        lastPriceInfo: current.price_vuv,
        title: "وانواتو واتو",
        shortedName: "VUV",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/vu.svg'
    });
    this.mainCurrencyList.push({
        id: "1000127",
        historyCallInfo: this.currencyService.getMroRlHistoryInfo(),
        lastPriceInfo: current.price_mro,
        title: "اوگویا موریتانا",
        shortedName: "MRO",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/mr.svg'
    });
    this.mainCurrencyList.push({
        id: "1000128",
        historyCallInfo: this.currencyService.getAngRlHistoryInfo(),
        lastPriceInfo: current.price_ang,
        title: "آنتیل گیلدر هلند",
        shortedName: "ANG",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ang.svg'
    });
    this.mainCurrencyList.push({
        id: "1000129",
        historyCallInfo: this.currencyService.getStdRlHistoryInfo(),
        lastPriceInfo: current.price_std,
        title: "دوبرا سائوتومه و پرنسیپ",
        shortedName: "STD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/st.svg'
    });
    this.mainCurrencyList.push({
        id: "1000130",
        historyCallInfo: this.currencyService.getXcdRlHistoryInfo(),
        lastPriceInfo: current.price_xcd,
        title: "دلار کارائیب شرقی",
        shortedName: "XCD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/zw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000131",
        historyCallInfo: this.currencyService.getBamRlHistoryInfo(),
        lastPriceInfo: current.price_bam,
        title: "مارک بوسنی و هرزگوین",
        shortedName: "BAM",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ba.svg'
    });
    this.mainCurrencyList.push({
        id: "1000132",
        historyCallInfo: this.currencyService.getBtnRlHistoryInfo(),
        lastPriceInfo: current.price_btn,
        title: "نگولتروم بوتان",
        shortedName: "BTN",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bt.svg'
    });
    this.mainCurrencyList.push({
        id: "1000133",
        historyCallInfo: this.currencyService.getCdfRlHistoryInfo(),
        lastPriceInfo: current.price_cdf,
        title: "فرانک کنگو",
        shortedName: "CDF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cd.svg'
    });
    this.mainCurrencyList.push({
        id: "1000134",
        historyCallInfo: this.currencyService.getCrcRlHistoryInfo(),
        lastPriceInfo: current.price_crc,
        title: "کولون کاستاریکا",
        shortedName: "CRC",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cr.svg'
    });
    this.mainCurrencyList.push({
        id: "1000135",
        historyCallInfo: this.currencyService.getCveRlHistoryInfo(),
        lastPriceInfo: current.price_cve,
        title: "اسکودوی کیپ ورد",
        shortedName: "CVE",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cv.svg'
    });
    this.mainCurrencyList.push({
        id: "1000136",
        historyCallInfo: this.currencyService.getBmdRlHistoryInfo(),
        lastPriceInfo: current.price_bmd,
        title: "دلار برمودا",
        shortedName: "BMD",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/bm.svg'
    });
    this.mainCurrencyList.push({
        id: "1000137",
        historyCallInfo: this.currencyService.getAwgRlHistoryInfo(),
        lastPriceInfo: current.price_awg,
        title: "فلورین آروبا",
        shortedName: "AWG",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/aw.svg'
    });
    this.mainCurrencyList.push({
        id: "1000138",
        historyCallInfo: this.currencyService.getSllRlHistoryInfo(),
        lastPriceInfo: current.price_sll,
        title: "لئون سیرالئون",
        shortedName: "SLL",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/sl.svg'
    });
    this.mainCurrencyList.push({
        id: "1000139",
        historyCallInfo: this.currencyService.getVefRlHistoryInfo(),
        lastPriceInfo: current.price_vef,
        title: "بولیوار ونزوئلا",
        shortedName: "VEF",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/ve.svg'
    });
    this.mainCurrencyList.push({
        id: "1000140",
        historyCallInfo: this.currencyService.getCypRlHistoryInfo(),
        lastPriceInfo: current.price_cyp,
        title: "پوند (یورو) قبرس",
        shortedName: "CYP",
        filterName: filter_other_currencies,
        groupName: MAIN_CURRENCY_PREFIX,
        unit: toman_unit,
        img: '/assets/images/country-flags/cy.svg'
    });

  }

  private setupCryptoList(current: Current) {
    this.cryptoList = []
    
    this.cryptoList.push({
        id: "1000141",
        historyCallInfo: this.currencyService.getCryptoBtcHistoryInfo(),
        lastPriceInfo: current["crypto-bitcoin"],
        title: "بیت کوین",
        shortedName: "BTC",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/btc.svg'
    });
    this.cryptoList.push({
        id: "1000142",
        historyCallInfo: this.currencyService.getCryptoEthHistoryInfo(),
        lastPriceInfo: current["crypto-ethereum"],
        title: "اتریوم",
        shortedName: "ETH",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/eth.svg'
    });
    this.cryptoList.push({
        id: "1000143",
        historyCallInfo: this.currencyService.getCryptoTetherHistoryInfo(),
        lastPriceInfo: current["crypto-tether"],
        title: "تتر",
        shortedName: "USDT",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/usdt.svg'
    });
    this.cryptoList.push({
        id: "1000144",
        historyCallInfo: this.currencyService.getCryptoBinanceCoinHistoryInfo(),
        lastPriceInfo: current["crypto-binance-coin"],
        title: "بایننس کوین",
        shortedName: "BNB",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/bnb.svg'
    });
    this.cryptoList.push({
        id: "1000145",
        historyCallInfo: this.currencyService.getCryptoSolanaHistoryInfo(),
        lastPriceInfo: current["crypto-solana"],
        title: "سولانا",
        shortedName: "SOL",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/sol.svg'
    });
    this.cryptoList.push({
        id: "1000146",
        historyCallInfo: this.currencyService.getCryptoUSDCoinHistoryInfo(),
        lastPriceInfo: current["crypto-usd-coin"],
        title: "یو اس دی کوین",
        shortedName: "USDC",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/usdc.svg'
    });
    this.cryptoList.push({
        id: "1000147",
        historyCallInfo: this.currencyService.getCryptoRippleHistoryInfo(),
        lastPriceInfo: current["crypto-ripple"],
        title: "ریپل",
        shortedName: "XRP",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/xrp.svg'
    });
    this.cryptoList.push({
        id: "1000148",
        historyCallInfo: this.currencyService.getCryptoCardanoHistoryInfo(),
        lastPriceInfo: current["crypto-cardano"],
        title: "کاردانو",
        shortedName: "ADA",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/ada.svg'
    });
    this.cryptoList.push({
        id: "1000149",
        historyCallInfo: this.currencyService.getCryptoDogecoinHistoryInfo(),
        lastPriceInfo: current["crypto-dogecoin"],
        title: "دوج کوین",
        shortedName: "DOGE",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/doge.svg'
    });
    this.cryptoList.push({
        id: "1000150",
        historyCallInfo: this.currencyService.getCryptoAvalancheHistoryInfo(),
        lastPriceInfo: current["crypto-avalanche"],
        title: "آوالانچ",
        shortedName: "AVAX",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/avax.svg'
    });
    this.cryptoList.push({
        id: "1000151",
        historyCallInfo: this.currencyService.getCryptoShibaInuHistoryInfo(),
        lastPriceInfo: current["crypto-shiba-inu"],
        title: "شیبا اینو",
        shortedName: "SHIB",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/shiba_inu2.webp'
    });
    this.cryptoList.push({
        id: "1000152",
        historyCallInfo: this.currencyService.getCryptoPolkadotHistoryInfo(),
        lastPriceInfo: current["crypto-polkadot"],
        title: "پولکا دات",
        shortedName: "DOT",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/dot.svg'
    });
    this.cryptoList.push({
        id: "1000153",
        historyCallInfo: this.currencyService.getCryptoTronHistoryInfo(),
        lastPriceInfo: current["crypto-tron"],
        title: "ترون",
        shortedName: "TRX",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/trx.svg'
    });
    this.cryptoList.push({
        id: "1000154",
        historyCallInfo: this.currencyService.getCryptoBchHistoryInfo(),
        lastPriceInfo: current["crypto-bitcoin-cash"],
        title: "بیت کوین کش",
        shortedName: "BCH",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/bch.svg'
    });
    this.cryptoList.push({
        id: "1000155",
        historyCallInfo: this.currencyService.getCryptoUniHistoryInfo(),
        lastPriceInfo: current["crypto-uniswap"],
        title: "یونی سواپ",
        shortedName: "UNI",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/uni.svg'
    });
    this.cryptoList.push({
        id: "1000156",
        historyCallInfo: this.currencyService.getCryptoLtcHistoryInfo(),
        lastPriceInfo: current["crypto-litecoin"],
        title: "لایت کوین",
        shortedName: "LTC",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/ltc.svg'
    });
    this.cryptoList.push({
        id: "1000157",
        historyCallInfo: this.currencyService.getCryptoFilHistoryInfo(),
        lastPriceInfo: current["crypto-filecoin"],
        title: "فایل کوین",
        shortedName: "FIL",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/fil.svg'
    });
    this.cryptoList.push({
        id: "1000158",
        historyCallInfo: this.currencyService.getCryptoAtomHistoryInfo(),
        lastPriceInfo: current["crypto-cosmos"],
        title: "اتم (کازماز)",
        shortedName: "ATOM",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/atom.svg'
    });
    this.cryptoList.push({
        id: "1000159",
        historyCallInfo: this.currencyService.getCryptoClassicEthHistoryInfo(),
        lastPriceInfo: current["crypto-ethereum-classic"],
        title: "اتریوم کلاسیک",
        shortedName: "ETC",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/etc.svg'
    });
    this.cryptoList.push({
        id: "1000160",
        historyCallInfo: this.currencyService.getCryptoStellarHistoryInfo(),
        lastPriceInfo: current["crypto-stellar"],
        title: "استلار",
        shortedName: "XLM",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/xlm.svg'
    });
    this.cryptoList.push({
        id: "1000161",
        historyCallInfo: this.currencyService.getCryptoFantomHistoryInfo(),
        lastPriceInfo: current["crypto-fantom"],
        title: "فانتوم",
        shortedName: "FTM",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/ftm.webp'
    });
    this.cryptoList.push({
        id: "1000162",
        historyCallInfo: this.currencyService.getCryptoElrondHistoryInfo(),
        lastPriceInfo: current["crypto-elrond"],
        title: "الروند",
        shortedName: "EGLD",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/egld.webp'
    });
    this.cryptoList.push({
        id: "1000163",
        historyCallInfo: this.currencyService.getCryptoMakerHistoryInfo(),
        lastPriceInfo: current["crypto-maker"],
        title: "میکر",
        shortedName: "MKR",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/mkr.svg'
    });
    this.cryptoList.push({
        id: "1000164",
        historyCallInfo: this.currencyService.getCryptoEOSHistoryInfo(),
        lastPriceInfo: current["crypto-eos"],
        title: "ایوس",
        shortedName: "EOS",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/eos.svg'
    });
    this.cryptoList.push({
        id: "1000165",
        historyCallInfo: this.currencyService.getCryptoBittorrentHistoryInfo(),
        lastPriceInfo: current["crypto-bittorrent"],
        title: "بیت تورنت",
        shortedName: "BTT",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/btt.svg'
    });
    this.cryptoList.push({
        id: "1000166",
        historyCallInfo: this.currencyService.getCryptoFlowHistoryInfo(),
        lastPriceInfo: current["crypto-flow"],
        title: "فلو",
        shortedName: "FLOW",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/flow.webp'
    });
    this.cryptoList.push({
        id: "1000167",
        historyCallInfo: this.currencyService.getCryptoGalaHistoryInfo(),
        lastPriceInfo: current["crypto-gala"],
        title: "گالا",
        shortedName: "GALA",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/gala.webp'
    });
    this.cryptoList.push({
        id: "1000168",
        historyCallInfo: this.currencyService.getCryptoSandboxHistoryInfo(),
        lastPriceInfo: current["crypto-sandbox"],
        title: "د سندباکس",
        shortedName: "SAND",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/sand.svg'
    });
    this.cryptoList.push({
        id: "1000169",
        historyCallInfo: this.currencyService.getCryptoPancakeSwapHistoryInfo(),
        lastPriceInfo: current["crypto-pancakeswap"],
        title: "پنکیک سواپ",
        shortedName: "CAKE",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/cakeswap.webp'
    });
    this.cryptoList.push({
        id: "1000170",
        historyCallInfo: this.currencyService.getCryptoDashHistoryInfo(),
        lastPriceInfo: current["crypto-dash"],
        title: "دش",
        shortedName: "DASH",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/dash.svg'
    });
    this.cryptoList.push({
        id: "1000171",
        historyCallInfo: this.currencyService.getCryptoMoneroHistoryInfo(),
        lastPriceInfo: current["crypto-monero"],
        title: "مونرو",
        shortedName: "XMR",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/xmr.svg'
    });
    this.cryptoList.push({
        id: "1000172",
        historyCallInfo: this.currencyService.getCryptoChainlinkHistoryInfo(),
        lastPriceInfo: current["crypto-chainlink"],
        title: "چین لینک (بلاک چین)",
        shortedName: "LINK",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/link.svg'
    });
    this.cryptoList.push({
        id: "1000173",
        historyCallInfo: this.currencyService.getCryptoCashaaHistoryInfo(),
        lastPriceInfo: current["crypto-cashaa"],
        title: "کاشا",
        shortedName: "CAS",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/cashaa.webp'
    });
    this.cryptoList.push({
        id: "1000174",
        historyCallInfo: this.currencyService.getCryptoTezosHistoryInfo(),
        lastPriceInfo: current["crypto-tezos"],
        title: "تزوس",
        shortedName: "XTZ",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/xtz.svg'
    });
    this.cryptoList.push({
        id: "1000175",
        historyCallInfo: this.currencyService.getCryptoLoopringHistoryInfo(),
        lastPriceInfo: current["crypto-loopring-irc"],
        title: "لوپرینگ",
        shortedName: "LRC",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/lrc.svg'
    });
    this.cryptoList.push({
        id: "1000176",
        historyCallInfo: this.currencyService.getCryptoDecredHistoryInfo(),
        lastPriceInfo: current["crypto-decred"],
        title: "دیکرید",
        shortedName: "DCR",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/dcr.svg'
    });
    this.cryptoList.push({
        id: "1000177",
        historyCallInfo: this.currencyService.getCryptoWavesHistoryInfo(),
        lastPriceInfo: current["crypto-waves"],
        title: "ویوز",
        shortedName: "WAVES",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/waves.svg'
    });
    this.cryptoList.push({
        id: "1000178",
        historyCallInfo: this.currencyService.getCryptoZcashHistoryInfo(),
        lastPriceInfo: current["crypto-zcash"],
        title: "زد کش",
        shortedName: "ZEC",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/zec.svg'
    });
    this.cryptoList.push({
        id: "1000179",
        historyCallInfo: this.currencyService.getCryptoNEMHistoryInfo(),
        lastPriceInfo: current["crypto-nem"],
        title: "نیو اکونومی",
        shortedName: "XEM",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/link.svg'
    });
    this.cryptoList.push({
        id: "1000180",
        historyCallInfo: this.currencyService.getCryptoNeoHistoryInfo(),
        lastPriceInfo: current["crypto-neo"],
        title: "نئو",
        shortedName: "NEO",
        filterName: filter_cryptocurrency,
        groupName: CRYPTO_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/crypto-icons/neo.svg'
    });

  }

  private setupWorldMarketList(current: Current) {

    this.worldMarketList = []

    this.worldMarketList.push({
        id: "1000181",
        historyCallInfo: this.currencyService.getEurUsdAskHistoryInfo(),
        lastPriceInfo: current["eur-usd-ask"],
        title: "یورو / دلار آمریکا",
        shortedName: "EUR/USD Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/eu-usd.webp'
    });
    this.worldMarketList.push({
        id: "1000182",
        historyCallInfo: this.currencyService.getGbpUsdAskHistoryInfo(),
        lastPriceInfo: current["gbp-usd-ask"],
        title: "پوند انگلیس / دلار آمریکا",
        shortedName: "GBP/USD Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/gb-us.webp'
    });
    this.worldMarketList.push({
        id: "1000183",
        historyCallInfo: this.currencyService.getUsdJpyAskHistoryInfo(),
        lastPriceInfo: current["gbp-usd-ask"],
        title: "دلار آمریکا / ین ژاپن",
        shortedName: "USD/JPY Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-jp.webp'
    });
    this.worldMarketList.push({
        id: "1000184",
        historyCallInfo: this.currencyService.getUsdChfAskHistoryInfo(),
        lastPriceInfo: current["usd-chf-ask"],
        title: "دلار آمریکا / فرانک سوییس",
        shortedName: "USD/CHF Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-ch.webp'
    });
    this.worldMarketList.push({
        id: "1000185",
        historyCallInfo: this.currencyService.getAudUsdAskHistoryInfo(),
        lastPriceInfo: current["aud-usd-ask"],
        title: "دلار استرالیا / دلار آمریکا",
        shortedName: "AUD/USD Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/au-us.webp'
    });
    this.worldMarketList.push({
        id: "1000186",
        historyCallInfo: this.currencyService.getUsdCadAskHistoryInfo(),
        lastPriceInfo: current["usd-cad-ask"],
        title: "دلار آمریکا / دلار کانادا",
        shortedName: "USD/CAD Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-ca.webp'
    });
    this.worldMarketList.push({
        id: "1000187",
        historyCallInfo: this.currencyService.getUsdNzdAskHistoryInfo(),
        lastPriceInfo: current["usd-nzd-ask"],
        title: "دلار آمریکا / دلار نیوزلند",
        shortedName: "USD/NZD Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-nz.webp'
    });
    this.worldMarketList.push({
        id: "1000188",
        historyCallInfo: this.currencyService.getUsdTryAskHistoryInfo(),
        lastPriceInfo: current["usd-try-ask"],
        title: "دلار آمریکا / لیر ترکیه",
        shortedName: "USD/TRY Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-tr.webp'
    });
    this.worldMarketList.push({
        id: "1000189",
        historyCallInfo: this.currencyService.getUsdSekAskHistoryInfo(),
        lastPriceInfo: current["usd-sek-ask"],
        title: "دلار آمریکا / کرون سوئد",
        shortedName: "USD/SEK Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-se.webp'
    });
    this.worldMarketList.push({
        id: "1000190",
        historyCallInfo: this.currencyService.getUsdSarAskHistoryInfo(),
        lastPriceInfo: current["usd-sar-ask"],
        title: "دلار آمریکا / ريال عربستان",
        shortedName: "USD/SAR Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-sa.webp'
    });
    this.worldMarketList.push({
        id: "1000191",
        historyCallInfo: this.currencyService.getUsdKrwAskHistoryInfo(),
        lastPriceInfo: current["usd-krw-ask"],
        title: "دلار آمریکا / وون کره جنوبی",
        shortedName: "USD/KRW Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-kr.webp'
    });
    this.worldMarketList.push({
        id: "1000192",
        historyCallInfo: this.currencyService.getUsdCnyAskHistoryInfo(),
        lastPriceInfo: current["usd-cny-ask"],
        title: "دلار آمریکا / یوان چین",
        shortedName: "USD/CNY Ask",
        filterName: filter_pair_currencies,
        groupName: WORLD_MARKET_PREFIX,
        img: '/assets/images/ask-flags/us-cn.webp'
    });

  }

  private setupCoinList(current: Current) {
    this.coinList = []

    // coins
    this.coinList.push({
        id: "1000193",
        historyCallInfo: this.currencyService.getImamiCoinHistoryInfo(),
        lastPriceInfo: current.sekee,
        title: "سکه امامی",
        shortedName: "Imami Coin",
        filterName: filter_coin_cash,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000194",
        historyCallInfo: this.currencyService.getBaharCoinHistoryInfo(),
        lastPriceInfo: current.sekeb,
        title: "سکه بهار آزادی",
        shortedName: "Bahar Coin",
        filterName: filter_coin_cash,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000195",
        historyCallInfo: this.currencyService.getHalfCoinHistoryInfo(),
        lastPriceInfo: current.nim,
        title: "نیم سکه",
        shortedName: "Half Coin",
        filterName: filter_coin_cash,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000196",
        historyCallInfo: this.currencyService.getQuarterCoinHistoryInfo(),
        lastPriceInfo: current.rob,
        title: "ربع سکه",
        shortedName: "Quarter Coin",
        filterName: filter_coin_cash,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000197",
        historyCallInfo: this.currencyService.getGramCoinHistoryInfo(),
        lastPriceInfo: current.gerami,
        title: "سکه گرمی",
        shortedName: "Gram Coin",
        filterName: filter_coin_cash,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });

    
    // retail
    this.coinList.push({
        id: "1000198",
        historyCallInfo: this.currencyService.getRetailImamiCoinHistoryInfo(),
        lastPriceInfo: current.retail_sekee,
        title: "سکه امامی تک فروشی",
        shortedName: "Retail Imami Coin",
        filterName: filter_coin_retail,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000199",
        historyCallInfo: this.currencyService.getRetailBaharCoinHistoryInfo(),
        lastPriceInfo: current.retail_sekeb,
        title: "سکه بهار آزادی تک فروشی",
        shortedName: "Retail Bahar Coin",
        filterName: filter_coin_retail,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000200",
        historyCallInfo: this.currencyService.getRetailHalfCoinHistoryInfo(),
        lastPriceInfo: current.retail_nim,
        title: "نیم سکه تک فروشی",
        shortedName: "Retail Half Coin",
        filterName: filter_coin_retail,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000201",
        historyCallInfo: this.currencyService.getRetailQuarterCoinHistoryInfo(),
        lastPriceInfo: current.retail_rob,
        title: "ربع سکه تک فروشی",
        shortedName: "Retail Quarter Coin",
        filterName: filter_coin_retail,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000202",
        historyCallInfo: this.currencyService.getRetailGramCoinHistoryInfo(),
        lastPriceInfo: current.retail_gerami,
        title: "سکه گرمی تک فروشی",
        shortedName: "Retail Gram Coin",
        filterName: filter_coin_retail,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });


    // blubber
    this.coinList.push({
        id: "1000203",
        historyCallInfo: this.currencyService.getCoinBlubberHistoryInfo(),
        lastPriceInfo: current.coin_blubber,
        title: "حباب سکه امامی",
        shortedName: "Coin Blubber",
        filterName: filter_coin_blubber,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000204",
        historyCallInfo: this.currencyService.getBaharCoinBlubberHistoryInfo(),
        lastPriceInfo: current.sekeb_blubber,
        title: "حباب سکه بهار آزادی",
        shortedName: "Imami Coin Blubber",
        filterName: filter_coin_blubber,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000205",
        historyCallInfo: this.currencyService.getHalfCoinBlubberHistoryInfo(),
        lastPriceInfo: current.nim_blubber,
        title: "حباب نیم سکه",
        shortedName: "Half Coin Blubber",
        filterName: filter_coin_blubber,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000206",
        historyCallInfo: this.currencyService.getQuarterCoinBlubberHistoryInfo(),
        lastPriceInfo: current.rob_blubber,
        title: "حباب ربع سکه",
        shortedName: "Quarter Coin Blubber",
        filterName: filter_coin_blubber,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000207",
        historyCallInfo: this.currencyService.getTrueValueOfCoinHistoryInfo(),
        lastPriceInfo: current.sekee_real,
        title: "ارزش واقعی سکه",
        shortedName: "Quarter Coin Blubber",
        filterName: filter_coin_blubber,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });


    // exchange
    this.coinList.push({
        id: "1000208",
        historyCallInfo: this.currencyService.getGc19CoinHistoryInfo(),
        lastPriceInfo: current.gc19,
        title: "تمام سکه بانک صادرات",
        shortedName: "تمام سکه طرح جدید 0310 صادرات",
        filterName: filter_coin_exchange,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000209",
        historyCallInfo: this.currencyService.getGc14CoinHistoryInfo(),
        lastPriceInfo: current.gc14,
        title: "تمام سکه بانک ملت",
        shortedName: "تمام سکه طرح جدید 0211 ملت",
        filterName: filter_coin_exchange,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000210",
        historyCallInfo: this.currencyService.getGc15CoinHistoryInfo(),
        lastPriceInfo: current.gc15,
        title: "تمام سکه بانک رفاه",
        shortedName: "تمام سکه طرح جدید 0312 رفاه",
        filterName: filter_coin_exchange,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000211",
        historyCallInfo: this.currencyService.getGc18CoinHistoryInfo(),
        lastPriceInfo: current.gc18,
        title: "تمام سکه بانک آینده",
        shortedName: "تمام سکه طرح جدید 0411 آینده",
        filterName: filter_coin_exchange,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000212",
        historyCallInfo: this.currencyService.getGc17CoinHistoryInfo(),
        lastPriceInfo: current.gc17,
        title: "تمام سکه بانک سامان",
        shortedName: "تمام سکه طرح جدید 0412 سامان",
        filterName: filter_coin_exchange,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000213",
        historyCallInfo: this.currencyService.getGc16CoinHistoryInfo(),
        lastPriceInfo: current.gc16,
        title: "تمام سکه بانک مرکزی",
        shortedName: "تمام سکه طرح جدید 001 مرکزی",
        filterName: filter_coin_exchange,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });


    // other
    this.coinList.push({
        id: "1000214",
        historyCallInfo: this.currencyService.getSekeeDownCoinHistoryInfo(),
        lastPriceInfo: current.sekee_down,
        title: "تمام سکه (قبل 86)",
        shortedName: "Bahar Coin Down",
        filterName: filter_other_coins,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000215",
        historyCallInfo: this.currencyService.getNimDownCoinHistoryInfo(),
        lastPriceInfo: current.nim_down,
        title: "نیم سکه (قبل 86)",
        shortedName: "Half Coin Down",
        filterName: filter_other_coins,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });
    this.coinList.push({
        id: "1000216",
        historyCallInfo: this.currencyService.getRobDownCoinHistoryInfo(),
        lastPriceInfo: current.rob_down,
        title: "ربع سکه (قبل 86)",
        shortedName: "Quarter Coin Down",
        filterName: filter_other_coins,
        groupName: COIN_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/sekee.webp'
    });

  }

  private setupGoldList(current: Current) {
    this.goldList = []

    //  gold
    this.goldList.push({
        id: "1000217",
        historyCallInfo: this.currencyService.getGeram18HistoryInfo(),
        lastPriceInfo: current.geram18,
        title: "طلای 18 عیار / 750",
        shortedName: "Gram Gold 18",
        filterName: filter_gold,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/ingots2.webp'
    });
    this.goldList.push({
        id: "1000218",
        historyCallInfo: this.currencyService.getGold740kHistoryInfo(),
        lastPriceInfo: current.gold_740k,
        title: "طلای 18 عیار / 740",
        shortedName: "Gold 740k",
        filterName: filter_gold,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/ingots2.webp'
    });
    this.goldList.push({
        id: "1000219",
        historyCallInfo: this.currencyService.getGeram24HistoryInfo(),
        lastPriceInfo: current.geram24,
        title: "طلای 24 عیار",
        shortedName: "Gram Gold 24",
        filterName: filter_gold,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/ingots2.webp'
    });
    this.goldList.push({
        id: "1000220",
        historyCallInfo: this.currencyService.getGoldMiniSizeHistoryInfo(),
        lastPriceInfo: current.gold_mini_size,
        title: "طلای دست دوم",
        shortedName: "Gold Mini Size",
        filterName: filter_gold,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/ingots2.webp'
    });


    //  silver
    this.goldList.push({
        id: "1000221",
        historyCallInfo: this.currencyService.getSilver925HistoryInfo(),
        lastPriceInfo: current.silver_925,
        title: "گرم نقره 925",
        shortedName: "Silver 925",
        filterName: filter_silver,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/silver2.webp'
    });
    this.goldList.push({
        id: "1000222",
        historyCallInfo: this.currencyService.getSilver999HistoryInfo(),
        lastPriceInfo: current.silver_999,
        title: "گرم نقره 999",
        shortedName: "Silver 999",
        filterName: filter_silver,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/silver2.webp'
    });


    //  mesghal
    this.goldList.push({
        id: "1000223",
        historyCallInfo: this.currencyService.getMesghalHistoryInfo(),
        lastPriceInfo: current.mesghal,
        title: "مثقال طلا",
        shortedName: "Mesghal",
        filterName: filter_mesghal,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });
    this.goldList.push({
        id: "1000224",
        historyCallInfo: this.currencyService.getGold17HistoryInfo(),
        lastPriceInfo: current.gold_17,
        title: "مثقال / بدون حباب",
        shortedName: "Mesghal / Global Gold",
        filterName: filter_mesghal,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });
    this.goldList.push({
        id: "1000225",
        historyCallInfo: this.currencyService.getGold17TransferHistoryInfo(),
        lastPriceInfo: current.gold_17_transfer,
        title: "حباب آبشده",
        shortedName: "Mesghal / Transfer",
        filterName: filter_mesghal,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });
    this.goldList.push({
        id: "1000226",
        historyCallInfo: this.currencyService.getGold17CoinHistoryInfo(),
        lastPriceInfo: current.gold_17_coin,
        title: "مثقال / بر مبنای سکه",
        shortedName: "Mesghal / Coin base",
        filterName: filter_mesghal,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });


    //  melted
    this.goldList.push({
        id: "1000227",
        historyCallInfo: this.currencyService.getGoldFuturesHistoryInfo(),
        lastPriceInfo: current.gold_futures,
        title: "آبشده نقدی",
        shortedName: "Gold Futures",
        filterName: filter_melted,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });
    this.goldList.push({
        id: "1000228",
        historyCallInfo: this.currencyService.getGoldMeltedWholesaleHistoryInfo(),
        lastPriceInfo: current.gold_melted_wholesale,
        title: "آبشده بنکداری",
        shortedName: "Gold melted wholesale",
        filterName: filter_melted,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });
    this.goldList.push({
        id: "1000229",
        historyCallInfo: this.currencyService.getGoldMeltedUnderKiloHistoryInfo(),
        lastPriceInfo: current.gold_world_futures,
        title: "آبشده کمتر از کیلو",
        shortedName: "Gold melted under kilo",
        filterName: filter_melted,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/bar2.webp'
    });



    //  etf
    this.goldList.push({
        id: "1000230",
        historyCallInfo: this.currencyService.getGoldGc3HistoryInfo(),
        lastPriceInfo: current.gc3,
        title: "صندوق طلای عیار",
        shortedName: "Ayar Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000231",
        historyCallInfo: this.currencyService.getGoldGc1HistoryInfo(),
        lastPriceInfo: current.gc1,
        title: "صندوق طلای لوتوس",
        shortedName: "Lotus Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000232",
        historyCallInfo: this.currencyService.getGoldGc11HistoryInfo(),
        lastPriceInfo: current.gc11,
        title: "صندوق طلای زر",
        shortedName: "Zar Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000233",
        historyCallInfo: this.currencyService.getGoldGc10HistoryInfo(),
        lastPriceInfo: current.gc10,
        title: "صندوق طلای گوهر",
        shortedName: "Gohar Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000234",
        historyCallInfo: this.currencyService.getGoldGc22HistoryInfo(),
        lastPriceInfo: current.gc22,
        title: "صندوق طلای گنج",
        shortedName: "Ganj Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000235",
        historyCallInfo: this.currencyService.getGoldGc21HistoryInfo(),
        lastPriceInfo: current.gc21,
        title: "صندوق طلای نفیس",
        shortedName: "Nafis Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000236",
        historyCallInfo: this.currencyService.getGoldGc20HistoryInfo(),
        lastPriceInfo: current.gc20,
        title: "صندوق طلای نهال",
        shortedName: "Nahal Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000237",
        historyCallInfo: this.currencyService.getGoldGc12HistoryInfo(),
        lastPriceInfo: current.gc12,
        title: "صندوق طلای کهربا",
        shortedName: "Kahroba Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000238",
        historyCallInfo: this.currencyService.getGoldGc34HistoryInfo(),
        lastPriceInfo: current.gc34,
        title: "صندوق طلای زرفام",
        shortedName: "Zarfam Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000239",
        historyCallInfo: this.currencyService.getGoldGc35HistoryInfo(),
        lastPriceInfo: current.gc35,
        title: "صندوق طلای مثقال",
        shortedName: "Mesghal Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000240",
        historyCallInfo: this.currencyService.getGoldGc36HistoryInfo(),
        lastPriceInfo: current.gc36,
        title: "صندوق طلای آلتون",
        shortedName: "Alton Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000241",
        historyCallInfo: this.currencyService.getGoldGc37HistoryInfo(),
        lastPriceInfo: current.gc37,
        title: "صندوق طلای تابش",
        shortedName: "Tabesh Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000242",
        historyCallInfo: this.currencyService.getGoldGc38HistoryInfo(),
        lastPriceInfo: current.gc38,
        title: "صندوق طلای جواهر",
        shortedName: "Javaher Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });
    this.goldList.push({
        id: "1000243",
        historyCallInfo: this.currencyService.getGoldGc39HistoryInfo(),
        lastPriceInfo: current.gc39,
        title: "صندوق طلای ناب",
        shortedName: "Naab Gold ETF",
        filterName: filter_etf,
        groupName: GOLD_PREFIX,
        unit: toman_unit,
        img: '/assets/images/coins/treasure-chest2.webp'
    });

  }

  private setupPreciousMetals(current: Current) {
    this.preciousMetalList = []

    //  global ounces
    this.preciousMetalList.push({
        id: "1000244",
        historyCallInfo: this.currencyService.getGlobalGoldOnsHistoryInfo(),
        lastPriceInfo: current.ons,
        title: "انس طلا",
        shortedName: "Gold Ounce",
        filterName: filter_global_ounces,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/gold.webp'
    });
    this.preciousMetalList.push({
        id: "1000245",
        historyCallInfo: this.currencyService.getGlobalSilverOnsHistoryInfo(),
        lastPriceInfo: current.silver,
        title: "انس نقره",
        shortedName: "Silver Ounce",
        filterName: filter_global_ounces,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/silver.webp'
    });
    this.preciousMetalList.push({
        id: "1000246",
        historyCallInfo: this.currencyService.getGlobalPlatinumOnsHistoryInfo(),
        lastPriceInfo: current.platinum,
        title: "انس پلاتین",
        shortedName: "Platinum Ounce",
        filterName: filter_global_ounces,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/platinum.webp'
    });
    this.preciousMetalList.push({
        id: "1000247",
        historyCallInfo: this.currencyService.getGlobalPalladiumOnsHistoryInfo(),
        lastPriceInfo: current.palladium,
        title: "انس پالادیوم",
        shortedName: "Palladium Ounce",
        filterName: filter_global_ounces,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/palladium.webp'
    });


    // gold vs other
    this.preciousMetalList.push({
        id: "1000248",
        historyCallInfo: this.currencyService.getGlobalRatioSilverHistoryInfo(),
        lastPriceInfo: current.ratio_silver,
        title: "برابری طلا / نقره",
        shortedName: "Gold / Silver Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });
    this.preciousMetalList.push({
        id: "1000249",
        historyCallInfo: this.currencyService.getGlobalRatioPlatinumHistoryInfo(),
        lastPriceInfo: current.ratio_platinum,
        title: "برابری طلا / پلاتین",
        shortedName: "Gold / Platinum Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });
    this.preciousMetalList.push({
        id: "1000250",
        historyCallInfo: this.currencyService.getGlobalRatioPalladiumHistoryInfo(),
        lastPriceInfo: current.ratio_palladium,
        title: "برابری طلا / پالادیوم",
        shortedName: "Gold / Palladium Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });
    this.preciousMetalList.push({
        id: "1000251",
        historyCallInfo: this.currencyService.getGlobalRatioCrudeoilHistoryInfo(),
        lastPriceInfo: current.ratio_crudeoil,
        title: "برابری طلا / نفت خام",
        shortedName: "Gold / Crude Oil Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });
    this.preciousMetalList.push({
        id: "1000252",
        historyCallInfo: this.currencyService.getGlobalRatioDowJonesHistoryInfo(),
        lastPriceInfo: current.ratio_dija,
        title: "برابری طلا / داوجونز",
        shortedName: "Gold / Dow Jones Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });
    this.preciousMetalList.push({
        id: "1000253",
        historyCallInfo: this.currencyService.getGlobalRatioSP500HistoryInfo(),
        lastPriceInfo: current.ratio_sp500,
        title: "برابری طلا / شاخص استاندارد و پورز 500",
        shortedName: "Gold / SP 500 Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });
    this.preciousMetalList.push({
        id: "1000254",
        historyCallInfo: this.currencyService.getGlobalRatioHUIHistoryInfo(),
        lastPriceInfo: current.ratio_hui,
        title: "برابری طلا / شاخص بازارهای مالی (HUI)",
        shortedName: "Gold / HUI Index Ratio",
        filterName: filter_gold_vs_other,
        groupName: PRECIOUS_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/coins/coin-vs2.webp'
    });

  }

  private setupBaseMetals(current: Current) {
    this.baseMetalList = []

    // global base
    this.baseMetalList.push({
        id: "1000255",
        historyCallInfo: this.currencyService.getBaseGlobalUSCopperHistoryInfo(),
        lastPriceInfo: current.base_global_copper2,
        title: "مس (آمریکا)",
        shortedName: "Copper (US)",
        filterName: filter_global_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/copper2.webp'
    });
    this.baseMetalList.push({
        id: "1000256",
        historyCallInfo: this.currencyService.getBaseGlobalGBCopperHistoryInfo(),
        lastPriceInfo: current.base_global_copper,
        title: "مس (لندن)",
        shortedName: "Copper (London)",
        filterName: filter_global_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/copper2.webp'
    });
    this.baseMetalList.push({
        id: "1000257",
        historyCallInfo: this.currencyService.getBaseGlobalTinHistoryInfo(),
        lastPriceInfo: current.base_global_tin,
        title: "قلع",
        shortedName: "Tin",
        filterName: filter_global_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/tin2.webp'
    });
    this.baseMetalList.push({
        id: "1000258",
        historyCallInfo: this.currencyService.getBaseGlobalNickelHistoryInfo(),
        lastPriceInfo: current.base_global_nickel,
        title: "نیکل",
        shortedName: "Nickel",
        filterName: filter_global_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/nickel2.webp'
    });
    this.baseMetalList.push({
        id: "1000259",
        historyCallInfo: this.currencyService.getBaseGlobalLeadHistoryInfo(),
        lastPriceInfo: current.base_global_lead,
        title: "سرب",
        shortedName: "Lead",
        filterName: filter_global_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/lead2.webp'
    });
    this.baseMetalList.push({
        id: "1000260",
        historyCallInfo: this.currencyService.getBaseGlobalZincHistoryInfo(),
        lastPriceInfo: current.base_global_zinc,
        title: "روی",
        shortedName: "Zinc",
        filterName: filter_global_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/zinc2.webp'
    });



    // us base
    this.baseMetalList.push({
        id: "1000261",
        historyCallInfo: this.currencyService.getBaseAluminumHistoryInfo(),
        lastPriceInfo: current["base-us-aluminum"],
        title: "آلومینیوم",
        shortedName: "Aluminum",
        filterName: filter_us_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/aluminium2.webp'
    });
    this.baseMetalList.push({
        id: "1000262",
        historyCallInfo: this.currencyService.getBaseUraniumHistoryInfo(),
        lastPriceInfo: current["base-us-uranium"],
        title: "اورانیوم",
        shortedName: "Uranium",
        filterName: filter_us_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/uranium2.webp'
    });
    this.baseMetalList.push({
        id: "1000263",
        historyCallInfo: this.currencyService.getBaseSteelCoilHistoryInfo(),
        lastPriceInfo: current["base-us-steel-coil"],
        title: "فولاد",
        shortedName: "Steel",
        filterName: filter_us_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/iron2.webp'
    });
    this.baseMetalList.push({
        id: "1000264",
        historyCallInfo: this.currencyService.getBaseIronOreHistoryInfo(),
        lastPriceInfo: current["base-us-iron-ore"],
        title: "سنگ آهن 62%",
        shortedName: "Iron ore 62%",
        filterName: filter_us_base_metals,
        groupName: BASE_METALS_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/metals/iron2.webp'
    });
  }

  private setupCommodityMarket(current: Current) {
    this.commodityList = []

    // agricultural
    this.commodityList.push({
        id: "1000265",
        historyCallInfo: this.currencyService.getCommodityUSWheatHistoryInfo(),
        lastPriceInfo: current.commodity_us_wheat,
        title: "گندم (آمریکا)",
        shortedName: "Wheat (US)",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/wheat2.webp'
    });
    this.commodityList.push({
        id: "1000266",
        historyCallInfo: this.currencyService.getCommodityLondonWheatHistoryInfo(),
        lastPriceInfo: current.commodity_london_wheat,
        title: "گندم (لندن)",
        shortedName: "Wheat (London)",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: pound_unit,
        img: '/assets/images/commodity/wheat2.webp'
    });
    this.commodityList.push({
        id: "1000267",
        historyCallInfo: this.currencyService.getCommodityCornHistoryInfo(),
        lastPriceInfo: current.commodity_us_corn,
        title: "ذرت",
        shortedName: "Corn",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/corn.webp'
    });
    this.commodityList.push({
        id: "1000268",
        historyCallInfo: this.currencyService.getCommodityOatsHistoryInfo(),
        lastPriceInfo: current.commodity_oats,
        title: "جو",
        shortedName: "Oats",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/oat.webp'
    });
    this.commodityList.push({
        id: "1000269",
        historyCallInfo: this.currencyService.getCommodityRoughRiceHistoryInfo(),
        lastPriceInfo: current.commodity_rough_rice,
        title: "برنج",
        shortedName: "Rough Rice",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/rice-bowl.webp'
    });
    this.commodityList.push({
        id: "1000270",
        historyCallInfo: this.currencyService.getCommoditySoybeansHistoryInfo(),
        lastPriceInfo: current.commodity_us_soybeans,
        title: "سویا",
        shortedName: "Soybean",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/soybean.webp'
    });
    this.commodityList.push({
        id: "1000271",
        historyCallInfo: this.currencyService.getCommoditySoybeanMealHistoryInfo(),
        lastPriceInfo: current.commodity_us_soybean_meal,
        title: "کنجاله سویا",
        shortedName: "Soybean Meal",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/soybean-meal.webp'
    });
    this.commodityList.push({
        id: "1000272",
        historyCallInfo: this.currencyService.getCommoditySoybeanOilHistoryInfo(),
        lastPriceInfo: current.commodity_us_soybean_oil,
        title: "روغن سویا",
        shortedName: "Soybean Oil",
        filterName: filter_agricultural_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/olives.webp'
    });



    // crop yields
    this.commodityList.push({
        id: "1000273",
        historyCallInfo: this.currencyService.getCommodityUSSugarHistoryInfo(),
        lastPriceInfo: current.commodity_us_sugar_no11,
        title: "شکر (آمریکا)",
        shortedName: "Sugar (US)",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/sugar.webp'
    });
    this.commodityList.push({
        id: "1000274",
        historyCallInfo: this.currencyService.getCommodityLondonSugarHistoryInfo(),
        lastPriceInfo: current.commodity_london_sugar,
        title: "شکر (لندن)",
        shortedName: "Sugar (London)",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/sugar.webp'
    });
    this.commodityList.push({
        id: "1000275",
        historyCallInfo: this.currencyService.getCommodityUSCoffeeHistoryInfo(),
        lastPriceInfo: current.commodity_us_coffee_c,
        title: "قهوه (آمریکا)",
        shortedName: "Coffee (US)",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/coffee-seed.webp'
    });
    this.commodityList.push({
        id: "1000276",
        historyCallInfo: this.currencyService.getCommodityLondonCoffeeHistoryInfo(),
        lastPriceInfo: current.commodity_london_coffee,
        title: "قهوه (لندن)",
        shortedName: "Coffee (London)",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/coffee-seed.webp'
    });
    this.commodityList.push({
        id: "1000277",
        historyCallInfo: this.currencyService.getCommodityUSCocoaHistoryInfo(),
        lastPriceInfo: current.commodity_us_cocoa,
        title: "کاکائو (آمریکا)",
        shortedName: "Cocoa (US)",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/cocoa.webp'
    });
    this.commodityList.push({
        id: "1000278",
        historyCallInfo: this.currencyService.getCommodityLondonCocoaHistoryInfo(),
        lastPriceInfo: current.commodity_london_cocoa,
        title: "کاکائو (لندن)",
        shortedName: "Cocoa (London)",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: pound_unit,
        img: '/assets/images/commodity/cocoa.webp'
    });
    this.commodityList.push({
        id: "1000279",
        historyCallInfo: this.currencyService.getCommodityLumberHistoryInfo(),
        lastPriceInfo: current.commodity_lumber,
        title: "الوار",
        shortedName: "Lumber",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/wood.webp'
    });
    this.commodityList.push({
        id: "1000280",
        historyCallInfo: this.currencyService.getCommodityCottonHistoryInfo(),
        lastPriceInfo: current.commodity_us_cotton_no_2,
        title: "پنبه",
        shortedName: "Cotton",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/cotton.webp'
    });
    this.commodityList.push({
        id: "1000281",
        historyCallInfo: this.currencyService.getCommodityOrangeJuiceHistoryInfo(),
        lastPriceInfo: current['parsermarket@e02e1367cd06401c3d77b114847cca05'],
        title: "آب پرتقال",
        shortedName: "Orange Juice",
        filterName: filter_crop_yields,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/juice.webp'
    });


    // animal
    this.commodityList.push({
        id: "1000282",
        historyCallInfo: this.currencyService.getCommodityLiveCattleHistoryInfo(),
        lastPriceInfo: current.commodity_live_cattle,
        title: "گوشت گاو (1 کیلوگرم)",
        shortedName: "Beef (1 Kilogram)",
        filterName: filter_animal_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/meat.webp'
    });
    this.commodityList.push({
        id: "1000283",
        historyCallInfo: this.currencyService.getCommodityFeedCattleHistoryInfo(),
        lastPriceInfo: current.commodity_feed_cattle,
        title: "فیدر گاو",
        shortedName: "Cattle feeder",
        filterName: filter_animal_products,
        groupName: COMMODITY_PREFIX,
        unit: dollar_unit,
        img: '/assets/images/commodity/cattle.webp'
    });

  }

  private setupAllItemsList () {
    this.allItemsList = this.allItemsList
    .concat(this.mainCurrencyList).concat(this.cryptoList)
    .concat(this.worldMarketList).concat(this.coinList)
    .concat(this.goldList).concat(this.preciousMetalList)
    .concat(this.baseMetalList).concat(this.commodityList)

    if (typeof window !== 'undefined' && localStorage.getItem('fav')) {
        let favItems = JSON.parse(localStorage.getItem('fav') as string) as string[]
        this.allItemsList.forEach(item => {
            if (favItems.indexOf(item.id, 0) >= 0) item.isFav = true;
            else item.isFav = false
        })
    } else {
        this.allItemsList.forEach(item => {
            item.isFav = false
        })
    }
  }


  private commafy(num: number) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1');
    }
    return str.join('.');
  }




}
