/* 
Copied from info_server_Ex4.js from Lab13
*/
var data = require('./public/services_data.js');
var services_array = data.services_array;
const queryString = require('query-string');

var express = require('express');
var app = express();
var myParser = require("body-parser");

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); //get data in the body
//to process the response from what is typed in the form
app.post("/process_form", function (request, response) {
    let POST = request.body; // data would be packaged in the body

    if (typeof POST['purchase_submit_button'] != 'undefined') {
        var validAmount=true; // creating a variable assuming that it'll be true
        var amount=true;
        for (i = 0; i < services_array.length; i++) {
            qty=POST[`quantity${i}`];
            amount = amount || qty>0; // If it has a value greater than 0 then it is good
            validAmount = validAmount && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid
        } 
        // if all quantities are valid, generate the invoice
        const stringified = queryString.stringify(POST);
        if (validAmount && amount) {
            response.redirect("./invoice.html?"+stringified); // using the invoice.html and all the data that is input
        }  
        else {response.send('Enter a valid amount')} 
    }
});

function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not a full tour</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));