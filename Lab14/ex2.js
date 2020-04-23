var fs = require('fs');
var user_info_file = './user_data.json';

if (fs.existsSync(user_info_file)) { //use existsSync means it waits until this path is verified before executing other code (Sync implies waiting)
    var file_stats = fs.statSync(user_info_file);

    var data = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assigns it (in a string) to variable data
    data = JSON.parse(data); //json parse will convert string into json object

    console.log(data["kazman"]["password"], data.kazman.email); //now it is a JSON object

    console.log(`${user_info_file} has ${file_stats.size} characters`);
} else {
    console.log("hey! " + user_info_file + " doesn't exist!");
}

/*
console.log(typeof data); //completely done on the server, not involving the browser
*/


// fs.existsSync(filename) //give string to a path, and if it exists it outputs "true"