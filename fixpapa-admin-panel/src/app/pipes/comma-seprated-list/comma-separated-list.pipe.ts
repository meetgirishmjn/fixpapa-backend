import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparatedList'
})
export class CommaSeparatedListPipe implements PipeTransform {

	transform(list: any, field?: any): any {
	  	if(list instanceof Array){
	  		if(list.length==0){
	  			return ""
	  		}else{
	  			let arr =[];
	  			list.forEach(function(value){
	  				arr.push(value[field])
	  			})
	  			return arr;
	  		}
	  	}else{
	  		return "";
	  	}
	}

}
