var fileName = process.argv[3];
var url = "http://139.59.71.150:3008/api";
if(fileName){
	require("./"+fileName)(url);	
}else{
	console.log("No file found");
}

