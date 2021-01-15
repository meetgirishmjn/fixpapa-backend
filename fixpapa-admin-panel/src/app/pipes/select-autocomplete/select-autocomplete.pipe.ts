import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectAutocomplete'
})
export class SelectAutocompletePipe implements PipeTransform {

  transform(items: any,textField:string='name', notInArray: any = []): any {
    items.map((obj)=>{
    	obj.text = obj[textField];
    })

    return items.filter((item)=>notInArray.indexOf(item.id) == -1);
  }

}
