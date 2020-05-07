/* 
Copied from info_server_Ex4.js from Lab13

Copied from Lexy Dennis' Assignment 1: Server

Lexy Dennis' Assignment 2 Server
*/

var data = require('./public/services_data.js'); //load services_data.js file and set to variable 'data'
var services_array = data.services_array; //set variable 'services_array' to the services_array in the services_data.js file
const queryString = require('query-string'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module
var fs = require('fs'); // load and cache fs module
var user_info_file = './user_data.json'; // set the .json file to the variable 'user_info_file'
var userdata_file = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assign it (in a string) to var userdata
userdata = JSON.parse(userdata_file); //json parse will convert string into json object

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
    errs = {}; //assume no errors at first
    var login_username = request.body["username"]; //set var login_username to the username field in login page
    var user_info = userdata[login_username]; //set variable
    var login_password = request.body["password"]; //set variable

    if (typeof userdata[login_username] == 'undefined' || userdata[login_username] ==  '') { // If the username is not undefined...
        errs.username = '<font color="red">Incorrect Username</font>'; //If the username does not match, it will return this message 
        errs.password = '<font color="red">Incorrect Password</font>'; //If username does not match anything in json file, password cannot match username
    } else if (user_info['password'] != login_password) {
        errs.username = ''; //remove error
        errs.password = '<font color="red">Incorrect Password</font>'; //wrong password still
    } else {
        delete errs.username; //remove error
        delete errs.password; //rremove error
    }
    
    if (Object.keys(errs).length == 0) { //If no errors...
        request.query.username = login_username;// add username on file to query string
        request.query.name = user_info.name; // add name on file to query string 
        const userdata_stringified = queryString.stringify(request.query); //converts the data to a string, adds it to the previous query string, and sets it to variable 'stringified'
        //response.redirect('./invoice.html?' + userdata_stringified); // redirect the page to the invoice page with the stringified path in the query string //commented out because invoice is requested from browser
        response.json({}); //give response parsed as json object
    } else {
        response.json(errs); //otherwise, show error message
    };
    //response.redirect(`./login.html?username=${login_username}&error=%{errs.push} + ${queryString.stringify(request.query)}`); //redirect the user to the login page to re-enter his/her login info with the error message in the query string, but keeping the data from quantity_form

});

//The below function was taken from w3resource.com
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // states that email addresses can only contain letters, numbers, and the characters “_” and “.” in the first part, the host machine can only contain letters and numbers and “.” characters, and the domain name can only be 2 or 3 letters
    if (inputText.match(mailformat)) { //if the input text matches the above email requirements...
        return true; //the function is true (it is a valid email)
    }
    else {
        return false; //otherwise function is false
    }
}

//The following function was copied from w3resource.com
function isAlphaNumeric(input) {
    var letterNumber = /^[0-9a-zA-Z]+$/; //set variable to only numbers and letters
    if (input.match(letterNumber)) { //input must only be letters or numbers to return true
        return true;
    }
    else { //non-numbers or letters will return false
        return false; //otherwise function is false
    }
}

//The following code was taken from Lab 14 exercise 4
app.post("/register_user", function (request, response) {
    // process a simple register form
    errs = {}; //assume no errors at first
    var registered_username = request.body["username"]; //set var registered_username to the username entered in registration page
    var registered_name = request.body["name"]; //set var 'registered_name' to the entered name in register page

    //username 
    if (registered_username == '') { //must have a username
        errs.username = '<font color="red">Please Enter A Username</font>';
    } else if (registered_username.length < 4 || registered_username.length > 10) { // if username is not between 4 and 10 characters...
        errs.username = '<font color="red">Username Must Be Between 4 & 10 Characters</font>'; //error message
    } else if (isAlphaNumeric(registered_username) == false) { //if username is not only letters and numbers...
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>'; //give error message
    } else if (typeof userdata[registered_username] != "undefined") { //check if username already exists
        errs.username = '<font color="red">Username Taken</font>'; //return error message if username is taken
    } else {
        errs.username = null;
    }

    //name 
    if (registered_name.length > 30) { //name must be less than 30 characters
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>';
    } else {
        errs.name = null;
    }

    //password
    if (request.body.password.length == 0) { //must have a password
        errs.password = '<font color="red">Please Enter A Password</font>';
    } else if (request.body.password.length <= 5) { //must have a password at least 6 characters long
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {//Check if password is same as the repeat password field
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; // let user know if passwords do not match
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    //email
    if (request.body.email == '') { //must have an email
        errs.email = '<font color="red">Please Enter An Email Address</font>';
    } else if (ValidateEmail(request.body.email) == false) { //if does not follow proper email format, give error
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email =null;
    }

    let result = !Object.values(errs).every(o => o === null); //'result' will return false when each key in 'errs' is null
    console.log(result); //logs 'true' or 'false' for null keys to the console

    if (result == false){ //If no errors...
        //set the below variables to what was input by the user on the page
        userdata[registered_username] = {}; //entered username replaces 'username' in json file
        userdata[registered_username].name = request.body.name; //supplies name to be set to 'name' in json file
        userdata[registered_username].password = request.body.password; //supplies password to be set to 'password' in json file
        userdata[registered_username].email = request.body.email; //supplies email to be set to 'email' in json file
        //set the values to be displayed in query string
        request.query.username = registered_username; //fill username in query as the registered username
        request.query.name = registered_name; //fill name in query string as the registered name
        fs.writeFileSync(user_info_file, JSON.stringify(userdata, null, 2));//input the fields filled out by user into the user_data.json file, using 'null, 2' to format the json file with 2 spaces as an indent between objects
        const registration_stringified = queryString.stringify(request.query); //converts the data to a string to add to the previous query string, and sets it to variable 'registration_stringified'
        //response.redirect("./invoice.html?" + registration_stringified); //redirect user to invoice with newly created account info in query string //This is commented out because I decided to redirect to the invoice on the browser, not the server
        response.json({}); //give response parsed as json object
    } else {
        response.json(errs); //otherwise, show error message
    }

});

app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and write it in the console