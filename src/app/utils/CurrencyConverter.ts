import { RawData, VolumeData } from "../interfaces/chart.types";
import { Current } from "../interfaces/data.types";

const MAX_SAFE_VOLUME = 9_007_199_254_740_99;
const SCALE = 1_000_000;

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
    return trimDecimal(priceValue / 10)
}

export function dollarToToman (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))
    const dollarValue = +(current.price_dollar_rl.p.replaceAll(',', ''))
    return trimDecimal((priceValue * dollarValue) / 10);
}


export function poundToToman (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))
    const poundValue = +(current.price_gbp.p.replaceAll(',', ''))
    return trimDecimal((priceValue * poundValue) / 10);
}


export function rialToDollar (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))
    const dollarValue = +(current.price_dollar_rl.p.replaceAll(',', ''))

    const dollarMainValue = priceValue / dollarValue;
    return trimDecimal(dollarMainValue)
}

export function poundToDollar (value: string, current: Current) {
    const priceValue = +(value.replaceAll(',', ''))

    const priceDollarValue = priceValue * (+current['gbp-usd-ask'].p)
    return trimDecimal(priceDollarValue);
}

export function trimDecimal(input: number, decimals: number = 2): number {
    const s = input.toString();
    if (!s.includes(".")) return input;
  
    const [intPart, decPart] = s.split(".");
  
    const firstNonZeroIndex = decPart.search(/[1-9]/);
  
    if (firstNonZeroIndex === -1) return Number(intPart);
  
    const end = firstNonZeroIndex + decimals;
  
    const trimmed = decPart.slice(0, Math.min(end, decPart.length));
  
    return Number(`${intPart}.${trimmed}`);
}

export function normalizeValue (high: number, low: number, open: number, close: number): number {
    const range = Math.abs(high - low);
    const delta = Math.abs(close - open);
  
    const raw = range * delta;
  
    if (raw <= 0 || !Number.isFinite(raw)) {
      return 0;
    }
  
    const normalized = Math.log10(raw + 1) * SCALE;
  
    return Math.min(normalized, MAX_SAFE_VOLUME);
}

export function valueToDollarChanges (itemChanges: number, dollarChanges: number) {
    return (((1 + itemChanges) / (1 + dollarChanges)) - 1)
}

export function valueToRialChanges (itemChanges: number, dollarChanges: number) {
    return (((1 + itemChanges) * (1 + dollarChanges)) + 1)
}