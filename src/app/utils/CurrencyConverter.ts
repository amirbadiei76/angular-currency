import { CurrencyItem, Current } from "../interface/Currencies";


export function commafy (num: number) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1');
    }
    return str.join('.');
}

export function rialToToman (value: string) {
    const priceValue = +(value.replaceAll(',', ''))
    return Math.round((priceValue / 10) * 100) / 100
}

export function rialToTomanString (value: string) {
    return commafy(rialToToman(value))
}

export function dollarToToman (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))
    const dollarValue = +(current.price_dollar_rl.p.replaceAll(',', ''))
    return Math.round((priceValue * dollarValue) * 100) / 1000;
}


export function dollarToTomanString (value: string, current: Current) {
    return commafy(dollarToToman(value, current))
}

export function poundToToman (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))
    const poundValue = +(current.price_gbp.p.replaceAll(',', ''))
    return Math.round((priceValue * poundValue) * 100) / 1000;
}


export function poundToTomanString (value: string, current: Current) {
    return commafy(poundToToman(value, current))
}


export function rialToDollar (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))
    const dollarValue = +(current.price_dollar_rl.p.replaceAll(',', ''))

    const dollarMainValue = priceValue / dollarValue;
    return Math.round(dollarMainValue * 100) / 100
}

export function rialToDollarString (value: string, current: Current) {
    return commafy(rialToDollar(value, current))
}


export function poundToDollar (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))

    const priceDollarValue = priceValue * (+current['gbp-usd-ask'].p)
    return Math.round(priceDollarValue * 100) / 100;
}

export function poundToDollarString (value: string, current: Current) {
    return commafy(poundToDollar(value, current))
}