import { PriceItem } from "../components/not-shared/currency-item-details/changes-table/changes-table.component";
import { dollar_unit, toman_unit } from "../constants/Values";
import { CandleData, VolumeData } from "../interfaces/chart.types";
import { CurrencyItem, Current } from "../interfaces/data.types";
import { commafy, dollarToToman, poundToDollar, poundToToman, rialToDollar, rialToToman, trimDecimal } from "./CurrencyConverter";

export function filterByDays(data: PriceItem[], days: number) {
    const now = new Date().getTime();
    const limit = now - days * 24 * 60 * 60 * 1000;
    return data.filter((i) => i.date.getTime() >= limit);
}

function aggregateNDays(
    data: CandleData[],
    window: number
  ) {
    const result = []
  
    for (let i = 0; i < data.length; i += window) {
      const slice = data.slice(i, i + window)
      if (slice.length === 0) continue
  
      const open = slice[0].close
      const close = slice[slice.length - 1].close
  
      let high = -Infinity
      let low = Infinity
  
      for (const d of slice) {
        if (d.high > high) high = d.high
        if (d.low < low) low = d.low
      }
  
      result.push({
        time: slice[slice.length - 1].time,
        open,
        high,
        low,
        close,
      })
    }
  
    return result
}

function aggregateLineNDays(
    data: { time: number; close: number }[],
    window: number
  ): VolumeData[] {
  
    const result: VolumeData[] = []
  
    for (let i = 0; i < data.length; i += window) {
      const slice = data.slice(i, i + window)
      if (!slice.length) continue
  
      const first = slice[0].close
      const last = slice[slice.length - 1].close
  
      result.push({
        time: slice[slice.length - 1].time,
        value: last,
        color: '#00d890'
      })
    }
  
    return result
}
  

export function analyzeRange(data: PriceItem[], item: CurrencyItem, current: Current, unit: number) {
    if (data.length < 2) return null;

    if (item.faGroupName !== 'بازارهای ارزی') {
        const dollarChanges = (current.price_dollar_rl?.dt === 'low' ? -1 : 1) * (current.price_dollar_rl?.dp);
        if (unit === 0) {
            if (item.unit === toman_unit) {
                const firstValue = rialToToman(data[0].p);
                const lastValue = rialToToman(data[data.length - 1].p);

                const change = lastValue - firstValue;
                const percent = trimDecimal(Math.abs(change / firstValue)) + ''

                const avg = data.reduce((sum, item) => sum + rialToToman(item.p), 0) / data.length;

                const first = commafy(firstValue)
                const last = commafy(lastValue)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(trimDecimal(avg)),
                    direction: change >= 0 ? 'high' : 'low',
                };
            }
            else if (item.unit === dollar_unit) {
                const firstValue = +data[0].p.replaceAll(',', '');
                const lastValue = +data[data.length - 1].p.replaceAll(',', '');

                const firstDollarValue = dollarToToman(data[0].p, current);
                const lastDollarValue = dollarToToman(data[data.length - 1].p, current);
                
                const change = lastValue - firstValue;
                const percentDollar = ((change / firstValue) * 100);
                
                let itemRialChanges = (((1 + percentDollar) * (1 + dollarChanges)) + 1);
                itemRialChanges = trimDecimal(itemRialChanges)
                const percent = Math.abs(itemRialChanges) + '';

                const avg = data.reduce((sum, item) => sum + dollarToToman(item.p, current), 0) / data.length;

                const first = commafy(firstDollarValue)
                const last = commafy(lastDollarValue)

                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(trimDecimal(avg)),
                    direction: itemRialChanges >= 0 ? 'high' : 'low',
                };
            }
            else {
                const poundChanges = (current.price_gbp?.dt === 'low' ? -1 : 1) * (current.price_gbp?.dp)

                const firstValue = +data[0].p;
                const lastValue = +data[data.length - 1].p;

                const change = lastValue - firstValue;
                const percentPound = ((change / firstValue) * 100);

                let itemRialChanges = (((1 + percentPound) * (1 + poundChanges)) + 1);
                itemRialChanges = trimDecimal(itemRialChanges);
                const percent = Math.abs(itemRialChanges) + ''
                const avg = data.reduce((sum, item) => sum + poundToToman(item.p, current), 0) / data.length;

                const firstValueToman = poundToToman(data[0].p, current);
                const lastValueToman = poundToToman(data[data.length - 1].p, current);

                const first = commafy(firstValueToman)
                const last = commafy(lastValueToman)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(trimDecimal(avg)),
                    direction: itemRialChanges >= 0 ? 'high' : 'low',
                };
            }
        }
        else {
            if (item.unit === toman_unit) {
                const firstValue = rialToToman(data[0].p);
                const lastValue = rialToToman(data[data.length - 1].p);
                const change = lastValue - firstValue;
                const percentToman = ((change / firstValue) * 100);

                let itemDollarChanges = (((1 + percentToman) / (1 + dollarChanges)) - 1);
                itemDollarChanges = trimDecimal(itemDollarChanges)
                const percent = Math.abs(itemDollarChanges) + '';

                const avg = data.reduce((sum, item) => sum + rialToDollar(item.p, current), 0) / data.length;
                const first = commafy(firstValue)
                const last = commafy(lastValue)

                return {
                    first,
                    last,
                    itemDollarChanges,
                    percent,
                    avg: commafy(trimDecimal(avg)),
                    direction: itemDollarChanges >= 0 ? 'high' : 'low',
                };
            }
            else if (item.unit === dollar_unit) {
                const first = data[0].p;
                const last = data[data.length - 1].p;
              
                const change = Number(last.replaceAll(',', '')) - Number(first.replaceAll(',', ''));
                const percent = trimDecimal(Math.abs(change / Number(first.replaceAll(',', ''))) * 100) + '';
              
                const avg =
                  data.reduce((sum, item) => sum + Number(item.p.replaceAll(',', '')), 0) / data.length;
              
                
                return {
                  first,
                  last,
                  change,
                  percent,
                  avg: commafy(trimDecimal(avg)),
                  direction: change >= 0 ? 'high' : 'low',
                };
            }
            else {
                const poundAskChanges = (current['gbp-usd-ask'].dt === 'low' ? -1 : 1) * (current['gbp-usd-ask'].dp)

                const firstValue = +data[0].p.replaceAll(',', '');
                const lastValue = +data[data.length - 1].p.replaceAll(',', '');

                const change = lastValue - firstValue;
                const percentPound = ((change / firstValue) * 100);

                let itemDollarChanges = (((1 + percentPound) / (1 + poundAskChanges)) - 1);
                itemDollarChanges = trimDecimal(itemDollarChanges);
                const percent = Math.abs(itemDollarChanges) + ''

                const avg = data.reduce((sum, item) => sum + poundToDollar(item.p, current), 0) / data.length;

                const firstValueDollar = poundToDollar(data[0].p, current);
                const lastValueDollar = poundToDollar(data[data.length - 1].p, current);

                const first = commafy(firstValueDollar)
                const last = commafy(lastValueDollar)
                return {
                    first,
                    last,
                    change,
                    percent,
                    avg: commafy(trimDecimal(avg)),
                    direction: itemDollarChanges >= 0 ? 'high' : 'low',
                };
            }
        }
    }
    const first = data[0].p;
    const last = data[data.length - 1].p;
  
    const change = +(last.replaceAll(',', '')) - +(first.replaceAll(',', ''));
    const percent = trimDecimal(Math.abs(change / +(first.replaceAll(',', ''))) * 100) + '';
    const avg =
      data.reduce((sum, item) => sum + +(item.p.replaceAll(',', '')), 0) / data.length;
  
    return {
      first,
      last,
      change,
      percent,
      avg: commafy(trimDecimal(avg)),
      direction: change >= 0 ? 'high' : 'low',
    };
}
  