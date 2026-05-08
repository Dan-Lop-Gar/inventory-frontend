import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stockStatus', standalone: true })
export class StockStatusPipe implements PipeTransform {
  transform(belowMinimum: boolean): string {
    return belowMinimum ? 'Stock bajo' : 'Normal';
  }
}