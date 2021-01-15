import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arr: any, field: string='name', searchStr:string =''): any {
  	// console.log("array => ",arr);
  	// console.log("field => ",field);
  	// console.log("searchStr => ",searchStr);
    let finalArr =  arr.filter(function (obj) { return obj[field].toLowerCase().includes(searchStr.toLowerCase()) });
    return finalArr

  }

}
