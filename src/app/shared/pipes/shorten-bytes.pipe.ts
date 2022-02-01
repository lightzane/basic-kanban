import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenBytes'
})
export class ShortenBytes implements PipeTransform {

  transform(valueInBytes: number, decimal: number = 2): string {
    // bytes  = 1024
    // KB     ==> 1         ln 1 kb / 1024 = 1
    // MB     ==> 1         ln 1 mb / 1024 = 2
    const bytes = 1024; // 1024 bytes = 1 kb
    const suffixes = [' KB', ' MB'];

    if (valueInBytes < 1024) return (valueInBytes / 1024).toFixed(decimal) + suffixes[0]; // default to KB

    const quoOfExp = Math.floor(Math.log(valueInBytes) / Math.log(bytes));
    const result = (valueInBytes / Math.pow(bytes, quoOfExp)).toFixed(decimal) + suffixes[quoOfExp - 1];

    return result;
  }

}
