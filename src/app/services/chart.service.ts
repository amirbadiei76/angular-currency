import { Injectable } from '@angular/core';
import { CandleData, RawData, VolumeData } from '../interfaces/chart.types';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  parseData(rawData: RawData[], type: number): { candles: CandleData[], volumes: VolumeData[] } {
    const sortedData = rawData?.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
   
    const uniqueMap = new Map();
    sortedData?.forEach(item => {
      const dateKey = item.ts.split(' ')[0];
      uniqueMap.set(dateKey, item);
    });
    const uniqueData = Array.from(uniqueMap.values()) as RawData[];

    const candles: CandleData[] = [];
    const volumes: VolumeData[] = [];

    for (let i = 0; i < uniqueData.length; i++) {
      const current = uniqueData[i];
      const prev = i > 0 ? candles[i - 1] : null;

      const close = parseFloat(current.p.replace(/,/g, ''));
      const high = parseFloat(current.h.replace(/,/g, ''));
      const low = parseFloat(current.l.replace(/,/g, ''));
     
      const open = prev ? prev.close : low;

      const time = new Date(current.ts).getTime() / 1000;

      candles.push({ time, open, high, low, close });

      const isUp = close >= open;
      const volumeValue = Number(current.p.replaceAll(',', ''));
     
      volumes.push({
        time,
        value: volumeValue,
        color: (type === 0) ? (isUp ? 'rgba(0, 150, 136, 0.5)' : 'rgba(255, 82, 82, 0.5)') : '#00d890',
      });
    }

    return { candles, volumes };
  }
}
