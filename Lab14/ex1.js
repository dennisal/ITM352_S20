var fs = require('fs');
var user_info_file = 'user_data.json';

var data = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assigns it (in a string) to variable data
/*
console.log(typeof data); //completely done on the server, not involving the browser
*/
data = JSON.parse(data);
//json parse will convert string into json object
console.log(data["kazman"]["password"], data.kazman.email); //now it is a JSON object
