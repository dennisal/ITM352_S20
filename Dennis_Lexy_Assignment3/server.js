/* 
Copied from info_server_Ex4.js from Lab13

Copied from Lexy Dennis' Assignment 2: Server

Lexy Dennis' Assignment 3 Server
*/

var data = require('./public/services_data.js'); //load services_data.js file and set to variable 'data'
var allServices = data.allServices; //set variable 'services_array' to the services_array in the services_data.js file
const queryString = require('query-string'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module
var fs = require('fs'); // load and cache fs module
var user_info_file = './user_data.json'; // set the .json file to the variable 'user_info_file'
var userdata_file = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assign it (in a string) to var userdata
userdata = JSON.parse(userdata_file); //json parse will convert string into json object
var cookieParser = require('cookie-parser'); //set var cookieParser as the cookie-parser module
var session = require('express-session'); //session variable is set for session module
app.use(myParser.urlencoded({ extended: true })); //get data in the body
const nodemailer = require("nodemailer"); //nodemailer module

app.use(cookieParser()); //use cookie-parser middleware

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

app.post("/generateInvoice", function (request, response) {
    console.log(request.body);
    //create a string with the invoice then email it to user and send back to cart for displaying
    //the following code was taken from nodemailer.com
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Spanish Day Tours" <SpanishDayTours@example.com>', // sender address
            to: "bar@example.com, cookie.email", // list of receivers
            subject: "Invoice", // Subject line
            text: "Thank you for your purchase! Travel with us again soon", // plain text body
            // html body
            html: str =`
            <table>

            <tbody>

            <tr>
                <!-- This row contains the column headers-->
                <th style="text-align: center;" width="43%">
                    <h3>Tour</h3>
                </th>

                <th style="text-align: center;" width="11%">
                    <h3>quantity</h3>
                </th>

                <th style="text-align: center;" width="54%">
                    <h3>price per unit</h3>
                </th>

                <th style="text-align: center;" width="13%">
                    <h3>extended price</h3>
                </th>

            </tr>
            `,
                //get the information entered on the home page to input into the table
                subtotal: 0, //subtotal starts off as 0
                for (service, allServices) {
                    for (i = 0; i < allServices[service].length; i++) {

                        qty = cart.getItem(`${service}${i}`);
                        if (qty > 0) { //if there is a quantity entered in the textbox ...
                            extended_price = qty * allServices[service][i].price //equation for extended price
                            subtotal += extended_price; //adding extended price for each tour to the subtotal

                            str +=`

                                <tr>
                                    <td align="center" width="43%"><font color="#000000">${allServices[service][i].tour}</font></td>
                                    <td align="center" width="11%"><font color="#000000">${qty}</font></td>
                                    <td align="center" width="13%"><font color="#000000">\$${allServices[service][i].price}</font></td>
                                    <td align="center" width="54%"><font color="#000000">\$${extended_price}</font></td>
                                </tr>

                            `;

                        }

                    }
            
                

                // Compute tax
                var tax_rate = 0.0575;
                var tax = tax_rate * subtotal;

                // Compute grand total
                var total = subtotal + tax;

        str += `

            <tr>
                <!-- Creates row of space -->
                <td colspan="4" width="100%">&nbsp;</td>

            </tr>

            <tr>
                <!-- Sub-total row -->
                <td style="text-align: center;" colspan="3" width="67%"><b>SUB-TOTAL</b></td>

                <td align="center" width="54%"><b>$
                        ${subtotal}</b> <!-- input calculated subtotal amount -->
                </td>

            </tr>

            <tr>
                <!-- Tax row -->
                <td style="text-align: center;" colspan="3" width="67%"><b><span>TAX @
                            ${100 * tax_rate}%</span></b>
                </td>

                <td align="center" width="54%"><b>$
                        ${tax.toFixed(2)}</b>
                    <!-- Input calculated amount for tax, to two decimal places-->
                </td>

            </tr>

            <tr>
                <!-- Total row -->
                <td style="text-align: center;" colspan="3" width="67%">
                    <h3 style=color:tomato>Total</h3>
                </td>

                <td style="text-align: center;" width="54%"><strong style=color:tomato>$
                        ${total.toFixed(2)}</strong>
                    <!-- Input calculated total, to two decimal places -->
                </td>

            </tr>

        </tbody>

    </table>`,

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
},
});
};
request.send(str);
main().catch(console.error);
});



//The following was taken from stormpath.com and Lab15 ex4.js
app.use(session({ //
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8', //random string to encrypt session ID
    resave: true, //save session
    saveUninitialized: false, //forget session after user is done
    httpOnly: false, //allows browser js from accessing cookies
    secure: true, //ensures cookies are only used over HTTPS
    ephemeral: true // deletes cookie when browser is closed
}));



app.post("/process_form", function (request, response) { //process the quantity_form when the POST request is initiated to form a response from the values in the form
    let POST = request.body; // data would be packaged in the body

    if (typeof POST['addTourtoCart${i}'] != 'undefined') { //if the POST request is not undefined...
        var validAmount = true; // creating a variable 'validAmount' and assuming it will be true
        var amount = false; // creating a variable 'amount' and assuming it will be false

        for (i = 0; i < `${(services_array[`community`][i]) + _tours}`.length; i++) { //for any given tour in any community array...
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

    if (typeof userdata[login_username] == 'undefined' || userdata[login_username] == '') { // If the username is not undefined...
        errs.username = '<font color="red">Incorrect Username</font>'; //If the username does not match, it will return this message 
        errs.password = '<font color="red">Incorrect Password</font>'; //If username does not match anything in json file, password cannot match username
    } else if (user_info['password'] != login_password) {
        errs.username = ''; //remove error
        errs.password = '<font color="red">Incorrect Password</font>'; //wrong password still
    } else {
        delete errs.username; //remove error
        delete errs.password; //rremove error
    };

    if (Object.keys(errs).length == 0) { //If no errors...
        //the following was taken from Lab15 ex4.js
        session.username = login_username; //add username to user's session
        var theDate = Date.now(); //sets the time of login
        session.last_login_time = theDate; //remember this login time in session
        var login_name = user_info['name']; //set login_name to the name saved for user
        response.cookie('username', login_username, 'name', login_name); //gives a cookie to user
        response.json({}); //give response parsed as json object
    } else {
        response.json(errs); //otherwise, show error message
    };

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
        errs.email = null;
    }
    //Taken from stackoverflow.com
    let result = !Object.values(errs).every(o => o === null); //'result' will return false when each key in 'errs' is null
    console.log(result); //logs 'true' or 'false' for null keys to the console

    if (result == false) { //If no errors...
        //set the below variables to what was input by the user on the page
        userdata[registered_username] = {}; //entered username replaces 'username' in json file
        userdata[registered_username].name = request.body.name; //supplies name to be set to 'name' in json file
        userdata[registered_username].password = request.body.password; //supplies password to be set to 'password' in json file
        userdata[registered_username].email = request.body.email; //supplies email to be set to 'email' in json file
        fs.writeFileSync(user_info_file, JSON.stringify(userdata, null, 2));//input the fields filled out by user into the user_data.json file, using 'null, 2' to format the json file with 2 spaces as an indent between objects
        //Set cookie for new user
        response.cookie("username", registered_username); //sets username = registered_username in cookie
        response.cookie("name", registered_name); //remembers name in cookie
        response.cookie("email", request.body.email); //remembers email in cookie
        response.json({}); //give response parsed as json object
    } else {
        response.json(errs); //otherwise, show error message
    }

});

//The below code was taken from stormpath.com
app.post('/logout', function (request, response) { //on logout...
    request.session.reset(); //reset session (clear it)
    response.redirect('/index.html'); //and redirect user to index page
});

app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and write it in the console