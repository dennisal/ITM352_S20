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
var userdata = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assign it (in a string) to var userdata
userdata = JSON.parse(userdata); //json parse will convert string into json object


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
            response.redirect("./login.html?" + stringified); // redirect the page to the login page with the stringified path in the query string
            return; //stops function
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
app.post("/check_login", function (request, response) {// Process login form POST and redirect to checkout if information in login page matches that in the login JSON file, back to login page if not
    var err_str = ""; //assume there are no errors at first
    var login_username = request.body["username"]; //set var login_username to the username field in login page
    
    if (typeof userdata[login_username] != 'undefined') { // If the username is not undefined...
        var user_info = userdata[login_username]; //set variable 
        
        if (user_info.password != request.body["password"]) { //check if username exists in json data already. If so, check if password matches
            err_str = `bad_password`; //If they do not match, let user know the password is wrong
        } else { //If the password matches...
            //const successful_login_stringified = queryString.stringify(request.query); //converts the data to a string, adds it to the previous query string, and sets it to variable 'stringified'
            response.redirect('./invoice.html?'+ "window.location.search"); // redirect the page to the login page with the stringified path in the query string
            //response.redirect(`./invoice.html? + ${JSON.stringify(request.query)}`); //Redirect user to a checkout that informs them that *username* has logged in successfully
            return; //stops function
        }

    } else {
        err_str = `bad_username`; //If the username does not match, it is will return this message 
    }

    response.redirect('./login.html?${username}=${login_username}&error=%{err_str}'); //redirect the user to the login page to re-enter his/her login info with the error message in the query string

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
    userdata[username] = {}; //entered username replaces 'username' in json file
    userdata[username].name = request.body.name; //supplies name to be set to 'name' in json file
    userdata[username].password = request.body.password; //supplies password to be set to 'password' in json file
    userdata[username].email = request.body.email; //supplies email to be set to 'email' in json file

    if (errs.length == 0) { //if there are no errors...
        fs.writeFileSync(user_info_file, JSON.stringify(userdata, null, 2));//input the above fields filled out by user into the user_data.json file
        const successful_register_stringified = queryString.stringify(request.query); //stringify query
        response.redirect("./invoice.html?" + successful_register_stringified); //redirect user to invoice with newly created account
    } else {
        response.end(JSON.stringify(errs)); //otherwise, show error message in query string
    }

});

app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and write it in the console