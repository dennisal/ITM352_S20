/* 
Copied from info_server_Ex4.js from Lab13

Lexy Dennis' Assignment 1: Server
*/

var data = require('./public/services_data.js'); //load services_data.js file and set to variable 'data'
var services_array = data.services_array; //set variable 'services_array' to the services_array in the services_data.js file
const queryString = require('query-string'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module
var fs = require('fs'); // load and cache fs module
var user_info_file = './public/user_data.json'; // set the .json file to the variable 'user_info_file'

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

app.use(myParser.urlencoded({ extended: true })); //get data in the body

app.post("/process_form", function (request, response) { //process the quantity_form when the POST request is initiated to form a response from the values in the form
    let POST = request.body; // data would be packaged in the body

    if (typeof POST['purchase_submit_button'] != 'undefined') { //if the POST request is not undefined...
        var validAmount = true; // creating a variable 'validAmount' and assuming it will be true
        var amount = false; // creating a variable 'amount' and assuming it will be false

        for (i = 0; i < services_array.length; i++) { //for any given tour...
            qty = POST[`quantity_textbox${i}`]; //set variable 'qty' to the value in quantity_textbox

            if (qty > 0) {
                amount = true; // If it has a value greater than 0 then it is ok
            }

            if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is an invalid input, so...
                validAmount = false; // it is not a valid amount
            }

        }

        const stringified = queryString.stringify(POST); //converts the data in POST to a JSON string and sets it to variable 'stringified'

        if (validAmount && amount) { //if it is both a quantity over 0 and is valid...
            response.redirect("./invoice.html?" + stringified); // redirect the page to the invoice page with the stringified path in the query string
        }

        else { response.redirect("./index.html?" + stringified) } //if there is invalid input, it re-routes back to the index page with the stringified path in the query string

    }

});

//repeats the isNonNegInt function from the index.html file because there is no relation between the index.html page and server, so it needs to be redefined here for the server to process the form and know what to do if there is invalid data inputs in the quantity_textbox fields
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not a full tour</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

//The following code is taken from Lab 14 Exercise 3
if (fs.existsSync(user_info_file)) { //existsSync means it waits until this path is verified before executing other code (Sync implies waiting). This verifies user_data.json file is set to var 'user_info_file'
    var file_stats = fs.statSync(user_info_file); //returns the data in the json file and puts that data set to var file_stats

    var userdata = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assigns it (in a string) to var userdata
    userdata = JSON.parse(userdata); //json parse will convert string into json object
    userdata[username] = {};
    userdata[username].password = {};
    userdata[username].email = {};
    userdata[username].name = {};

    fs.writeFileSync(user_info_file, JSON.stringify(userdata));//now it is a JSON object in user_data.json file
} else {
    console.log(user_info_file + " doesn't exist!"); //notifies me if var user_info_file is not set to the user_data.json file
}

app.get("/login", function (request, response) { //get to login page
    // Give a simple login form
    str = `
<body>
<form action="/check_login?quantity=999" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str); //puts this string into the page as html, not js
});

app.post("/check_login", function (request, response) {// Process login form POST and redirect to logged in page if information in login page matches that in the login JSON file, back to login page if not
    var err_str = ""; //assume there are no errors at first
    var login_username = request.body["username"]; //set var login_username to the username key in the json file
    if (typeof userdata[login_username] != 'undefined') { // If the username is not undefined...
        var user_info = userdata[login_username]; //check if username exists in data. If so, check if password matches
        if (user_info.password != request.body["password"]) {//check if passowrd stored for username matches what user entered
            err_str = `bad_password`; //If they do not match, let user know the password is wrong
        } else { //If the password matches...
            response.redirect(`${login_username} is logged in with data ${JSON.stringify(request.query)}`); //Redirect user to a new page that informs them that *username* has logged in successfully
            return; //stops function
        }
    } else {
        err_str = `bad_username`; //If the username does not match, it is will return this message 
    }
    response.redirect('./login?username}=${login_username}&error=%{err_str}'); //redirect the user to the login page to re-enter his/her login info with the error message in the query string
});

app.get("/register", function (request, response) { //get a registration page
    // Give a simple register form
    str = `
<body>
<form action="/register_user" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>`;
    response.send(str); //puts string into page to be displayed as html
});

//The following code was taken from Lab 14 exercise 4
app.post("/register_user", function (request, response) {
    // process a simple register form
    username = request.body.username; //set var username to the username inputted by user
    errs = []; //assume no errors at first
    if (typeof userdata[username] != 'undefined') { //check if username is taken
        errs.push("username taken"); //return error message if username is taken
    } else {
        userdata[username] = {}; // Otherwise, input username into the json file for storage
    }
    if (request["body"]["password"] != request["body"]["repeat_password"]) {//Check if password is same as the repeat password field
        errs.push("passwords don't match"); // let user know if passwords do not match
    } else {
        userdata[username].password = request["body"]["password"]; //otherwise, set password in json file to the inputted one
    }

    //set the below variables to what was input by the user on the page
    userdata[username] = {}; 
    userdata[username].password = request.body.password;
    userdata[username].email = request.body.email

    if (errs.length == 0) { //if there are no errors...
        fs.writeFileSync(user_info_file, JSON.stringify(userdata));//input the above fields filled out by user into the user_data.json file
        response.end(`New user ${username} registered`); //let user know he/she is registered
    } else {
        response.end(JSON.stringify(errs)); //otherwise, show error message in query string
    }
});

app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and write it in the console