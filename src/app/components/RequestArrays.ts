import { inject } from "@angular/core";
import { dollar_unit, filter_coin_blubber, filter_coin_cash, filter_coin_retail, filter_cryptocurrency, filter_main_currencies, filter_other_currencies, filter_pair_currencies, rial_unit } from "../constants/Values";
import { Currencies, CurrencyItem, Current } from "../interface/Currencies";
import { CurrenciesService } from "../services/currencies.service";

export class RequestArray {
    
    mainData?: Currencies;
    mainCurrencyList: CurrencyItem[] = [];
    cryptoList: CurrencyItem[] = [];
    worldMarketList: CurrencyItem[] = [];
    coinList: CurrencyItem[] = [];
    
    constructor (private currencyService: CurrenciesService) {
        // this.currencyService = injector(CurrenciesService)
    }

    setupMainData() {
        this.currencyService.getAllCurrencies().subscribe((data: Currencies) => {
            this.mainData = data;
            this.setupMainCurrenciesList(data.current)
            this.setupCryptoList(data.current)
            this.setupWorldMarketList(data.current)
        })
    }



    setupMainCurrenciesList(current: Current) {
        this.mainCurrencyList = []
        
        // Main
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getDollarRlHistoryInfo(),
            lastPriceInfo: current.price_dollar_rl,
            title: "دلار آمریکا",
            shortedName: "usd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getEuroRlHistoryInfo(),
            lastPriceInfo: current.price_eur,
            title: "یورو",
            shortedName: "eur",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAedRlHistoryInfo(),
            lastPriceInfo: current.price_aed,
            title: "درهم امارات",
            shortedName: "aed",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGbpRlHistoryInfo(),
            lastPriceInfo: current.price_gbp,
            title: "پوند انگلیس",
            shortedName: "gbp",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTryRlHistoryInfo(),
            lastPriceInfo: current.price_try,
            title: "لیر ترکیه",
            shortedName: "try",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getChfRlHistoryInfo(),
            lastPriceInfo: current.price_chf,
            title: "فرانک سوییس",
            shortedName: "chf",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCnyRlHistoryInfo(),
            lastPriceInfo: current.price_cny,
            title: "یوان چین",
            shortedName: "cny",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getJpyRlHistoryInfo(),
            lastPriceInfo: current.price_jpy,
            title: "ین ژاپن (100 ین)",
            shortedName: "jpy",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKrwRlHistoryInfo(),
            lastPriceInfo: current.price_krw,
            title: "وون کره جنوبی",
            shortedName: "krw",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCadRlHistoryInfo(),
            lastPriceInfo: current.price_cad,
            title: "دلار کانادا",
            shortedName: "cad",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAudRlHistoryInfo(),
            lastPriceInfo: current.price_aud,
            title: "دلار استرالیا",
            shortedName: "aud",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getNzdRlHistoryInfo(),
            lastPriceInfo: current.price_nzd,
            title: "دلار نیوزلند",
            shortedName: "nzd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSgdRlHistoryInfo(),
            lastPriceInfo: current.price_sgd,
            title: "دلار سنگاپور",
            shortedName: "sgd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getInrRlHistoryInfo(),
            lastPriceInfo: current.price_inr,
            title: "روپیه هند",
            shortedName: "inr",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPkrRlHistoryInfo(),
            lastPriceInfo: current.price_pkr,
            title: "روپیه پاکستان",
            shortedName: "pkr",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getIqdRlHistoryInfo(),
            lastPriceInfo: current.price_iqd,
            title: "دینار عراق",
            shortedName: "iqd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSypRlHistoryInfo(),
            lastPriceInfo: current.price_syp,
            title: "پوند سوریه",
            shortedName: "syp",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAfnRlHistoryInfo(),
            lastPriceInfo: current.price_afn,
            title: "افغانی افغانستان",
            shortedName: "afn",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getDkkRlHistoryInfo(),
            lastPriceInfo: current.price_dkk,
            title: "کرون دانمارک",
            shortedName: "dkk",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSekRlHistoryInfo(),
            lastPriceInfo: current.price_sek,
            title: "کرون سوئد",
            shortedName: "sek",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getNokRlHistoryInfo(),
            lastPriceInfo: current.price_nok,
            title: "کرون نروژ",
            shortedName: "nok",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSarRlHistoryInfo(),
            lastPriceInfo: current.price_sar,
            title: "ريال عربستان",
            shortedName: "sar",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getQarRlHistoryInfo(),
            lastPriceInfo: current.price_qar,
            title: "ريال قطر",
            shortedName: "qar",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getOmrRlHistoryInfo(),
            lastPriceInfo: current.price_omr,
            title: "ريال عمان",
            shortedName: "omr",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKwdRlHistoryInfo(),
            lastPriceInfo: current.price_kwd,
            title: "دینار کویت",
            shortedName: "kwd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBhdRlHistoryInfo(),
            lastPriceInfo: current.price_bhd,
            title: "دینار بحرین",
            shortedName: "bhd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMyrRlHistoryInfo(),
            lastPriceInfo: current.price_myr,
            title: "رینگیت مالزی",
            shortedName: "myr",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getThbRlHistoryInfo(),
            lastPriceInfo: current.price_thb,
            title: "بات تایلند",
            shortedName: "thb",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getHkdRlHistoryInfo(),
            lastPriceInfo: current.price_hkd,
            title: "دلار هنگ کنگ",
            shortedName: "hkd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getRubRlHistoryInfo(),
            lastPriceInfo: current.price_rub,
            title: "روبل روسیه",
            shortedName: "rub",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAznRlHistoryInfo(),
            lastPriceInfo: current.price_azn,
            title: "منات آذربایجان",
            shortedName: "azn",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAmdRlHistoryInfo(),
            lastPriceInfo: current.price_amd,
            title: "درام ارمنستان",
            shortedName: "amd",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGelRlHistoryInfo(),
            lastPriceInfo: current.price_gel,
            title: "لاری گرجستان",
            shortedName: "gel",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKgsRlHistoryInfo(),
            lastPriceInfo: current.price_kgs,
            title: "سوم قرقیزستان",
            shortedName: "kgs",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTjsRlHistoryInfo(),
            lastPriceInfo: current.price_tjs,
            title: "سامانی تاجیکستان",
            shortedName: "tjs",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTmtRlHistoryInfo(),
            lastPriceInfo: current.price_tmt,
            title: "منات ترکمنستان",
            shortedName: "tmt",
            filterName: filter_main_currencies,
            unit: rial_unit,
        });


        // Other

        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAllRlHistoryInfo(),
            lastPriceInfo: current.price_all,
            title: "لک آلبانی",
            shortedName: "all",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBbdRlHistoryInfo(),
            lastPriceInfo: current.price_bbd,
            title: "دلار باربادوس",
            shortedName: "bbd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBdtRlHistoryInfo(),
            lastPriceInfo: current.price_bdt,
            title: "تاکا بنگلادش",
            shortedName: "bdt",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBgnRlHistoryInfo(),
            lastPriceInfo: current.price_bgn,
            title: "لو بلغارستان",
            shortedName: "bgn",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBifRlHistoryInfo(),
            lastPriceInfo: current.price_bif,
            title: "فرانک بوروندی",
            shortedName: "bif",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBndRlHistoryInfo(),
            lastPriceInfo: current.price_bnd,
            title: "دلار بورونئی",
            shortedName: "bnd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBsdRlHistoryInfo(),
            lastPriceInfo: current.price_bsd,
            title: "دلار باهاماس",
            shortedName: "bsd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBwpRlHistoryInfo(),
            lastPriceInfo: current.price_bwp,
            title: "پوله بوتسوانا",
            shortedName: "bwp",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBynRlHistoryInfo(),
            lastPriceInfo: current.price_byn,
            title: "روبل بلاروس",
            shortedName: "byn",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBzdRlHistoryInfo(),
            lastPriceInfo: current.price_bzd,
            title: "دلار بلیز",
            shortedName: "bzd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCupRlHistoryInfo(),
            lastPriceInfo: current.price_cup,
            title: "پزوی کوبا",
            shortedName: "cup",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCzkRlHistoryInfo(),
            lastPriceInfo: current.price_czk,
            title: "کرون چک",
            shortedName: "czk",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getDjfRlHistoryInfo(),
            lastPriceInfo: current.price_djf,
            title: "فرانک جیبوتی",
            shortedName: "djf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getDopRlHistoryInfo(),
            lastPriceInfo: current.price_dop,
            title: "پزوی دومینیکن",
            shortedName: "dop",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getDzdRlHistoryInfo(),
            lastPriceInfo: current.price_dzd,
            title: "دینار الجزایر",
            shortedName: "dzd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getEtbRlHistoryInfo(),
            lastPriceInfo: current.price_etb,
            title: "بیر اتیوپی",
            shortedName: "etb",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGnfRlHistoryInfo(),
            lastPriceInfo: current.price_gnf,
            title: "فرانک گینه",
            shortedName: "gnf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGtqRlHistoryInfo(),
            lastPriceInfo: current.price_gtq,
            title: "گواتزال گواتمالا",
            shortedName: "gtq",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGydRlHistoryInfo(),
            lastPriceInfo: current.price_gyd,
            title: "دلار گویان",
            shortedName: "gyd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getHnlRlHistoryInfo(),
            lastPriceInfo: current.price_hnl,
            title: "لمپیرا هندوراس",
            shortedName: "hnl",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getHrkRlHistoryInfo(),
            lastPriceInfo: current.price_hrk,
            title: "کونا (یورو) کرواسی",
            shortedName: "hrk",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getHtgRlHistoryInfo(),
            lastPriceInfo: current.price_htg,
            title: "گورده هائیتی",
            shortedName: "htg",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getIskRlHistoryInfo(),
            lastPriceInfo: current.price_isk,
            title: "کرونا ایسلند",
            shortedName: "isk",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getJmdRlHistoryInfo(),
            lastPriceInfo: current.price_jmd,
            title: "دلار جامائیکا",
            shortedName: "jmd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKesRlHistoryInfo(),
            lastPriceInfo: current.price_kes,
            title: "شیلینگ کنیا",
            shortedName: "kes",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKhrRlHistoryInfo(),
            lastPriceInfo: current.price_khr,
            title: "ریل کامبوج",
            shortedName: "khr",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKmfRlHistoryInfo(),
            lastPriceInfo: current.price_kmf,
            title: "فرانک کومور",
            shortedName: "kmf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKztRlHistoryInfo(),
            lastPriceInfo: current.price_kzt,
            title: "تنگه قزاقستان",
            shortedName: "kzt",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getLakRlHistoryInfo(),
            lastPriceInfo: current.price_lak,
            title: "کیپ لائوس",
            shortedName: "lak",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getLbpRlHistoryInfo(),
            lastPriceInfo: current.price_lbp,
            title: "پوند لبنان",
            shortedName: "lbp",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getLkrRlHistoryInfo(),
            lastPriceInfo: current.price_lkr,
            title: "روپیه سریلانکا",
            shortedName: "lkr",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getLrdRlHistoryInfo(),
            lastPriceInfo: current.price_lrd,
            title: "دلار لیبریا",
            shortedName: "lrd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getLslRlHistoryInfo(),
            lastPriceInfo: current.price_lsl,
            title: "لوتی لسوتو",
            shortedName: "lsl",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getLydRlHistoryInfo(),
            lastPriceInfo: current.price_lyd,
            title: "دینار لیبی",
            shortedName: "lyd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMadRlHistoryInfo(),
            lastPriceInfo: current.price_mad,
            title: "درهم مراکش",
            shortedName: "mad",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMgaRlHistoryInfo(),
            lastPriceInfo: current.price_mga,
            title: "آریاری ماداگاسکار",
            shortedName: "mga",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMkdRlHistoryInfo(),
            lastPriceInfo: current.price_mkd,
            title: "دینار مقدونیه",
            shortedName: "mkd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMmkRlHistoryInfo(),
            lastPriceInfo: current.price_mmk,
            title: "کیات میانمار",
            shortedName: "mmk",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMopRlHistoryInfo(),
            lastPriceInfo: current.price_mop,
            title: "پاتاکا ماکائو",
            shortedName: "mop",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMurRlHistoryInfo(),
            lastPriceInfo: current.price_mur,
            title: "روپیه موریس",
            shortedName: "mur",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMvrRlHistoryInfo(),
            lastPriceInfo: current.price_mvr,
            title: "روفیا مالدیو",
            shortedName: "mvr",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMwkRlHistoryInfo(),
            lastPriceInfo: current.price_mwk,
            title: "کواچا مالاوی",
            shortedName: "mwk",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMznRlHistoryInfo(),
            lastPriceInfo: current.price_mzn,
            title: "متیکال موزامبیک",
            shortedName: "mzn",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getNadRlHistoryInfo(),
            lastPriceInfo: current.price_nad,
            title: "دلار نامیبیا",
            shortedName: "nad",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getNgnRlHistoryInfo(),
            lastPriceInfo: current.price_ngn,
            title: "نیرا نیجریه",
            shortedName: "ngn",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getNprRlHistoryInfo(),
            lastPriceInfo: current.price_npr,
            title: "روپیه نپال",
            shortedName: "npr",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPabRlHistoryInfo(),
            lastPriceInfo: current.price_pab,
            title: "بالبوآ پاناما",
            shortedName: "pab",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPgkRlHistoryInfo(),
            lastPriceInfo: current.price_pgk,
            title: "کینا پاپوا گینه نو",
            shortedName: "pgk",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPhpRlHistoryInfo(),
            lastPriceInfo: current.price_php,
            title: "پزوی فیلیپین",
            shortedName: "php",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getRonRlHistoryInfo(),
            lastPriceInfo: current.price_ron,
            title: "لئو رومانی",
            shortedName: "ron",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getRsdRlHistoryInfo(),
            lastPriceInfo: current.price_rsd,
            title: "دینار صربستان",
            shortedName: "rsd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getRwfRlHistoryInfo(),
            lastPriceInfo: current.price_rwf,
            title: "فرانک رواندا",
            shortedName: "rwf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getScrRlHistoryInfo(),
            lastPriceInfo: current.price_scr,
            title: "روپیه سیشل",
            shortedName: "scr",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSdgRlHistoryInfo(),
            lastPriceInfo: current.price_sdg,
            title: "پوند سودان",
            shortedName: "sdg",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getShpRlHistoryInfo(),
            lastPriceInfo: current.price_shp,
            title: "پوند سینت هلینا",
            shortedName: "shp",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSosRlHistoryInfo(),
            lastPriceInfo: current.price_sos,
            title: "شیلینگ سومالی",
            shortedName: "sos",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSvcRlHistoryInfo(),
            lastPriceInfo: current.price_svc,
            title: "کولون (دلار) السالوادور",
            shortedName: "svc",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSzlRlHistoryInfo(),
            lastPriceInfo: current.price_szl,
            title: "لیلانگی سوازیلند",
            shortedName: "szl",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTndRlHistoryInfo(),
            lastPriceInfo: current.price_tnd,
            title: "دینار تونس",
            shortedName: "tnd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTtdRlHistoryInfo(),
            lastPriceInfo: current.price_ttd,
            title: "دلار ترینیداد و توباگو",
            shortedName: "ttd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTzsRlHistoryInfo(),
            lastPriceInfo: current.price_tzs,
            title: "شیلینگ تانزانیا",
            shortedName: "tzs",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getUgxRlHistoryInfo(),
            lastPriceInfo: current.price_ugx,
            title: "شیلینگ اوگاندا",
            shortedName: "ugx",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getYerRlHistoryInfo(),
            lastPriceInfo: current.price_yer,
            title: "ريال یمن",
            shortedName: "yer",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getZmwRlHistoryInfo(),
            lastPriceInfo: current.price_zmw,
            title: "کواچا زامبیا",
            shortedName: "zmw",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGhsRlHistoryInfo(),
            lastPriceInfo: current.price_ghs,
            title: "سدی غنا",
            shortedName: "ghs",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPenRlHistoryInfo(),
            lastPriceInfo: current.price_pen,
            title: "سول پرو",
            shortedName: "pen",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getClpRlHistoryInfo(),
            lastPriceInfo: current.price_clp,
            title: "پزوی شیلی",
            shortedName: "clp",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getEgpRlHistoryInfo(),
            lastPriceInfo: current.price_egp,
            title: "پوند مصر",
            shortedName: "egp",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMxnRlHistoryInfo(),
            lastPriceInfo: current.price_mxn,
            title: "پزوی مکزیک",
            shortedName: "mxn",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getJodRlHistoryInfo(),
            lastPriceInfo: current.price_jod,
            title: "دینار اردن",
            shortedName: "jod",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBrlRlHistoryInfo(),
            lastPriceInfo: current.price_brl,
            title: "رئال برزیل",
            shortedName: "brl",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getUyuRlHistoryInfo(),
            lastPriceInfo: current.price_uyu,
            title: "پزوی اوروگوئه",
            shortedName: "uyu",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCopRlHistoryInfo(),
            lastPriceInfo: current.price_cop,
            title: "پزوی کلمبیا",
            shortedName: "cop",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPlnRlHistoryInfo(),
            lastPriceInfo: current.price_pln,
            title: "زلوتی لهستان",
            shortedName: "pln",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getArsRlHistoryInfo(),
            lastPriceInfo: current.price_ars,
            title: "پزوی آرژانتین",
            shortedName: "ars",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getKydRlHistoryInfo(),
            lastPriceInfo: current.price_kyd,
            title: "دلار جزایر کیمن",
            shortedName: "kyd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getHufRlHistoryInfo(),
            lastPriceInfo: current.price_huf,
            title: "فورینت مجارستان",
            shortedName: "huf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getPygRlHistoryInfo(),
            lastPriceInfo: current.price_pyg,
            title: "گورانی پاراکوئه",
            shortedName: "pyg",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getUahRlHistoryInfo(),
            lastPriceInfo: current.price_uah,
            title: "هریونیا اوکراین",
            shortedName: "uah",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getZarRlHistoryInfo(),
            lastPriceInfo: current.price_zar,
            title: "رند آفریقای جنوبی",
            shortedName: "zar",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getNioRlHistoryInfo(),
            lastPriceInfo: current.price_nio,
            title: "کوردوبا نیکاراگوئه",
            shortedName: "nio",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getFjdRlHistoryInfo(),
            lastPriceInfo: current.price_fjd,
            title: "دلار فیجی",
            shortedName: "fjd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getTwdRlHistoryInfo(),
            lastPriceInfo: current.price_twd,
            title: "دلار تایوان",
            shortedName: "twd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getUzsRlHistoryInfo(),
            lastPriceInfo: current.price_uzs,
            title: "سوم ازبکستان (10000)",
            shortedName: "uzs",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getIdrRlHistoryInfo(),
            lastPriceInfo: current.price_idr,
            title: "روپیه اندونزی",
            shortedName: "idr",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getXofRlHistoryInfo(),
            lastPriceInfo: current.price_xof,
            title: "فرانک آفریقای غربی",
            shortedName: "xof",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getXpfRlHistoryInfo(),
            lastPriceInfo: current.price_xpf,
            title: "فرانک اقیانوسیه",
            shortedName: "xpf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getVndRlHistoryInfo(),
            lastPriceInfo: current.price_vnd,
            title: "دونگ ویتنام",
            shortedName: "vnd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getGmdRlHistoryInfo(),
            lastPriceInfo: current.price_gmd,
            title: "دلاسی گامبیا",
            shortedName: "gmd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getXafRlHistoryInfo(),
            lastPriceInfo: current.price_xaf,
            title: "فرانک آفریقای مرکزی",
            shortedName: "xaf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getVuvRlHistoryInfo(),
            lastPriceInfo: current.price_vuv,
            title: "وانواتو واتو",
            shortedName: "vuv",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getMroRlHistoryInfo(),
            lastPriceInfo: current.price_mro,
            title: "اوگویا موریتانا",
            shortedName: "mro",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAngRlHistoryInfo(),
            lastPriceInfo: current.price_ang,
            title: "آنتیل گیلدر هلند",
            shortedName: "ang",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getStdRlHistoryInfo(),
            lastPriceInfo: current.price_std,
            title: "دوبرا سائوتومه و پرنسیپ",
            shortedName: "std",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getXcdRlHistoryInfo(),
            lastPriceInfo: current.price_xcd,
            title: "دلار کارائیب شرقی",
            shortedName: "xcd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBamRlHistoryInfo(),
            lastPriceInfo: current.price_bam,
            title: "مارک بوسنی و هرزگوین",
            shortedName: "bam",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBtnRlHistoryInfo(),
            lastPriceInfo: current.price_btn,
            title: "نگولتروم بوتان",
            shortedName: "btn",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCdfRlHistoryInfo(),
            lastPriceInfo: current.price_cdf,
            title: "فرانک کنگو",
            shortedName: "cdf",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCrcRlHistoryInfo(),
            lastPriceInfo: current.price_crc,
            title: "کولون کاستاریکا",
            shortedName: "crc",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCveRlHistoryInfo(),
            lastPriceInfo: current.price_cve,
            title: "اسکودوی کیپ ورد",
            shortedName: "cve",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getBmdRlHistoryInfo(),
            lastPriceInfo: current.price_bmd,
            title: "دلار برمودا",
            shortedName: "bmd",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getAwgRlHistoryInfo(),
            lastPriceInfo: current.price_awg,
            title: "فلورین آروبا",
            shortedName: "awg",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getSllRlHistoryInfo(),
            lastPriceInfo: current.price_sll,
            title: "لئون سیرالئون",
            shortedName: "sll",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getVefRlHistoryInfo(),
            lastPriceInfo: current.price_vef,
            title: "بولیوار ونزوئلا",
            shortedName: "vef",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });
        this.mainCurrencyList.push({
            historyCallInfo: this.currencyService.getCypRlHistoryInfo(),
            lastPriceInfo: current.price_cyp,
            title: "پوند (یورو) قبرس",
            shortedName: "cyp",
            filterName: filter_other_currencies,
            unit: rial_unit,
        });

    }

    setupCryptoList(current: Current) {
        this.cryptoList = []
        
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoBtcHistoryInfo(),
            lastPriceInfo: current["crypto-bitcoin"],
            title: "بیت کوین",
            shortedName: "btc",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoEthHistoryInfo(),
            lastPriceInfo: current["crypto-ethereum"],
            title: "اتریوم",
            shortedName: "eth",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoTetherHistoryInfo(),
            lastPriceInfo: current["crypto-tether"],
            title: "تتر",
            shortedName: "usdt",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoBinanceCoinHistoryInfo(),
            lastPriceInfo: current["crypto-binance-coin"],
            title: "بایننس کوین",
            shortedName: "bnb",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoSolanaHistoryInfo(),
            lastPriceInfo: current["crypto-solana"],
            title: "سولانا",
            shortedName: "sol",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoUSDCoinHistoryInfo(),
            lastPriceInfo: current["crypto-usd-coin"],
            title: "یو اس دی کوین",
            shortedName: "usdc",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoRippleHistoryInfo(),
            lastPriceInfo: current["crypto-ripple"],
            title: "ریپل",
            shortedName: "xrp",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoCardanoHistoryInfo(),
            lastPriceInfo: current["crypto-cardano"],
            title: "کاردانو",
            shortedName: "ada",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoDogecoinHistoryInfo(),
            lastPriceInfo: current["crypto-dogecoin"],
            title: "دوج کوین",
            shortedName: "doge",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoAvalancheHistoryInfo(),
            lastPriceInfo: current["crypto-avalanche"],
            title: "آوالانچ",
            shortedName: "avax",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoShibaInuHistoryInfo(),
            lastPriceInfo: current["crypto-shiba-inu"],
            title: "شیبا اینو",
            shortedName: "shib",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoPolkadotHistoryInfo(),
            lastPriceInfo: current["crypto-polkadot"],
            title: "پولکا دات",
            shortedName: "dot",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoTronHistoryInfo(),
            lastPriceInfo: current["crypto-tron"],
            title: "ترون",
            shortedName: "trx",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoBchHistoryInfo(),
            lastPriceInfo: current["crypto-bitcoin-cash"],
            title: "بیت کوین کش",
            shortedName: "bch",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoUniHistoryInfo(),
            lastPriceInfo: current["crypto-uniswap"],
            title: "یونی سواپ",
            shortedName: "uni",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoLtcHistoryInfo(),
            lastPriceInfo: current["crypto-litecoin"],
            title: "لایت کوین",
            shortedName: "ltc",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoFilHistoryInfo(),
            lastPriceInfo: current["crypto-filecoin"],
            title: "فایل کوین",
            shortedName: "fil",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoAtomHistoryInfo(),
            lastPriceInfo: current["crypto-cosmos"],
            title: "اتم (کازماز)",
            shortedName: "atom",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoClassicEthHistoryInfo(),
            lastPriceInfo: current["crypto-ethereum-classic"],
            title: "اتریوم کلاسیک",
            shortedName: "etc",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoStellarHistoryInfo(),
            lastPriceInfo: current["crypto-stellar"],
            title: "استلار",
            shortedName: "xlm",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoFantomHistoryInfo(),
            lastPriceInfo: current["crypto-fantom"],
            title: "فانتوم",
            shortedName: "ftm",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoElrondHistoryInfo(),
            lastPriceInfo: current["crypto-elrond"],
            title: "الروند",
            shortedName: "egld",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoMakerHistoryInfo(),
            lastPriceInfo: current["crypto-maker"],
            title: "میکر",
            shortedName: "mkr",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoEOSHistoryInfo(),
            lastPriceInfo: current["crypto-eos"],
            title: "ایوس",
            shortedName: "eos",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoBittorrentHistoryInfo(),
            lastPriceInfo: current["crypto-bittorrent"],
            title: "بیت تورنت",
            shortedName: "btt",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoFlowHistoryInfo(),
            lastPriceInfo: current["crypto-flow"],
            title: "فلو",
            shortedName: "flow",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoGalaHistoryInfo(),
            lastPriceInfo: current["crypto-gala"],
            title: "گالا",
            shortedName: "gala",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoSandboxHistoryInfo(),
            lastPriceInfo: current["crypto-sandbox"],
            title: "د سندباکس",
            shortedName: "sand",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoPancakeSwapHistoryInfo(),
            lastPriceInfo: current["crypto-pancakeswap"],
            title: "پنکیک سواپ",
            shortedName: "cake",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoDashHistoryInfo(),
            lastPriceInfo: current["crypto-dash"],
            title: "دش",
            shortedName: "dash",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoMoneroHistoryInfo(),
            lastPriceInfo: current["crypto-monero"],
            title: "مونرو",
            shortedName: "xmr",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoChainlinkHistoryInfo(),
            lastPriceInfo: current["crypto-chainlink"],
            title: "چین لینک (بلاک چین)",
            shortedName: "link",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoCashaaHistoryInfo(),
            lastPriceInfo: current["crypto-cashaa"],
            title: "کاشا",
            shortedName: "cas",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoTezosHistoryInfo(),
            lastPriceInfo: current["crypto-tezos"],
            title: "تزوس",
            shortedName: "xtz",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoLoopringHistoryInfo(),
            lastPriceInfo: current["crypto-loopring-irc"],
            title: "لوپرینگ",
            shortedName: "lrc",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoDecredHistoryInfo(),
            lastPriceInfo: current["crypto-decred"],
            title: "دیکرید",
            shortedName: "dcr",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoWavesHistoryInfo(),
            lastPriceInfo: current["crypto-waves"],
            title: "ویوز",
            shortedName: "waves",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoZcashHistoryInfo(),
            lastPriceInfo: current["crypto-zcash"],
            title: "زد کش",
            shortedName: "zec",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoNEMHistoryInfo(),
            lastPriceInfo: current["crypto-nem"],
            title: "نیو اکونومی",
            shortedName: "xem",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });
        this.cryptoList.push({
            historyCallInfo: this.currencyService.getCryptoNeoHistoryInfo(),
            lastPriceInfo: current["crypto-neo"],
            title: "نئو",
            shortedName: "neo",
            filterName: filter_cryptocurrency,
            unit: dollar_unit,
        });

    }

    setupWorldMarketList(current: Current) {

        this.worldMarketList = []
    
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getEurUsdAskHistoryInfo(),
            lastPriceInfo: current["eur-usd-ask"],
            title: "یورو / دلار آمریکا",
            shortedName: "eur/usd ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getGbpUsdAskHistoryInfo(),
            lastPriceInfo: current["gbp-usd-ask"],
            title: "پوند انگلیس / دلار آمریکا",
            shortedName: "gbp/usd ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdJpyAskHistoryInfo(),
            lastPriceInfo: current["gbp-usd-ask"],
            title: "دلار آمریکا / ین ژاپن",
            shortedName: "usd/jpy ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdChfAskHistoryInfo(),
            lastPriceInfo: current["usd-chf-ask"],
            title: "دلار آمریکا / فرانک سوییس",
            shortedName: "usd/chf ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getAudUsdAskHistoryInfo(),
            lastPriceInfo: current["aud-usd-ask"],
            title: "دلار استرالیا / دلار آمریکا",
            shortedName: "aud/usd ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdCadAskHistoryInfo(),
            lastPriceInfo: current["usd-cad-ask"],
            title: "دلار آمریکا / دلار کانادا",
            shortedName: "usd/cad ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdNzdAskHistoryInfo(),
            lastPriceInfo: current["usd-nzd-ask"],
            title: "دلار آمریکا / دلار نیوزلند",
            shortedName: "usd/nzd ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdTryAskHistoryInfo(),
            lastPriceInfo: current["usd-try-ask"],
            title: "دلار آمریکا / لیر ترکیه",
            shortedName: "usd/try ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdSekAskHistoryInfo(),
            lastPriceInfo: current["usd-sek-ask"],
            title: "دلار آمریکا / کرون سوئد",
            shortedName: "usd/sek ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdSarAskHistoryInfo(),
            lastPriceInfo: current["usd-sar-ask"],
            title: "دلار آمریکا / ريال عربستان",
            shortedName: "usd/sar ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdKrwAskHistoryInfo(),
            lastPriceInfo: current["usd-krw-ask"],
            title: "دلار آمریکا / وون کره جنوبی",
            shortedName: "usd/krw ask",
            filterName: filter_pair_currencies,
        });
        this.worldMarketList.push({
            historyCallInfo: this.currencyService.getUsdCnyAskHistoryInfo(),
            lastPriceInfo: current["usd-cny-ask"],
            title: "دلار آمریکا / یوان چین",
            shortedName: "usd/cny ask",
            filterName: filter_pair_currencies,
        });

    }

    setupCoinList(current: Current) {
        this.coinList = []

        // coins
        this.coinList.push({
            historyCallInfo: this.currencyService.getImamiCoinHistoryInfo(),
            lastPriceInfo: current.sekee,
            title: "سکه امامی",
            shortedName: "Imami Coin",
            filterName: filter_coin_cash,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getBaharCoinHistoryInfo(),
            lastPriceInfo: current.sekeb,
            title: "سکه بهار آزادی",
            shortedName: "Bahar Coin",
            filterName: filter_coin_cash,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getHalfCoinHistoryInfo(),
            lastPriceInfo: current.nim,
            title: "نیم سکه",
            shortedName: "Half Coin",
            filterName: filter_coin_cash,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getQuarterCoinHistoryInfo(),
            lastPriceInfo: current.rob,
            title: "ربع سکه",
            shortedName: "Quarter Coin",
            filterName: filter_coin_cash,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getGramCoinHistoryInfo(),
            lastPriceInfo: current.gerami,
            title: "سکه گرمی",
            shortedName: "Gram Coin",
            filterName: filter_coin_cash,
            unit: rial_unit,
        });

        
        // retail
        this.coinList.push({
            historyCallInfo: this.currencyService.getRetailImamiCoinHistoryInfo(),
            lastPriceInfo: current.retail_sekee,
            title: "سکه امامی تک فروشی",
            shortedName: "Retail Imami Coin",
            filterName: filter_coin_retail,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getRetailBaharCoinHistoryInfo(),
            lastPriceInfo: current.retail_sekeb,
            title: "سکه بهار آزادی تک فروشی",
            shortedName: "Retail Bahar Coin",
            filterName: filter_coin_retail,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getRetailHalfCoinHistoryInfo(),
            lastPriceInfo: current.retail_nim,
            title: "نیم سکه تک فروشی",
            shortedName: "Retail Half Coin",
            filterName: filter_coin_retail,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getRetailQuarterCoinHistoryInfo(),
            lastPriceInfo: current.retail_rob,
            title: "ربع سکه تک فروشی",
            shortedName: "Retail Quarter Coin",
            filterName: filter_coin_retail,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getRetailGramCoinHistoryInfo(),
            lastPriceInfo: current.retail_gerami,
            title: "سکه گرمی تک فروشی",
            shortedName: "Retail Gram Coin",
            filterName: filter_coin_retail,
            unit: rial_unit,
        });


        // blubber
        this.coinList.push({
            historyCallInfo: this.currencyService.getCoinBlubberHistoryInfo(),
            lastPriceInfo: current.coin_blubber,
            title: "حباب سکه امامی",
            shortedName: "Coin Blubber",
            filterName: filter_coin_blubber,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getBaharCoinBlubberHistoryInfo(),
            lastPriceInfo: current.sekeb_blubber,
            title: "حباب سکه بهار آزادی",
            shortedName: "Imami Coin Blubber",
            filterName: filter_coin_blubber,
            unit: rial_unit,
        });
        this.coinList.push({
            historyCallInfo: this.currencyService.getHalfCoinBlubberHistoryInfo(),
            lastPriceInfo: current.nim_blubber,
            title: "حباب نیم سکه",
            shortedName: "Half Coin Blubber",
            filterName: filter_coin_blubber,
            unit: rial_unit,
        });

    }
        
}