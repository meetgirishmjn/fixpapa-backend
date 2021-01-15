import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBankList'
})
export class FilterBankListPipe implements PipeTransform {

	transform(items: any[], searchText: any): any[] {  
		//console.log("items : ", items);
		//console.log("searchText : ", searchText);
		if(!items) return [];
		if(!searchText) return items;
		
		searchText = searchText.toLowerCase();
		
		return items.filter( item => { return item.toLowerCase().includes(searchText); } );
	}

}
