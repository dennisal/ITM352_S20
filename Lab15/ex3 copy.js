var fs = require('fs');
var user_info_file = './user_data.json';
var express = require('express');
var app = express();
var myParser = require("body-parser");
var cookieParser = require('cookie-parser');
app.use(cookieParser());


var session = require('express-session');
app.use(session({
    secret: "ITM352 rocks!",
    resave: false,
    saveUninitialized: true
}));

if (fs.existsSync(user_info_file)) { //use existsSync means it waits until this path is verified before executing other code (Sync implies waiting)
    var file_stats = fs.statSync(user_info_file);

    var userdata = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assigns it (in a string) to variable userdata
    userdata = JSON.parse(userdata); //json parse will convert string into json object
    username = 'newuser';
    userdata[username] = {};
    userdata[username].password = 'newpass';
    userdata[username].email = 'newuser@user.com';
    userdata[username].name = 'The New Guy'; 

    console.log(userdata["newuser"]["password"]); 
    fs.writeFileSync(user_info_file, JSON.stringify(userdata));//now it is a JSON object

    console.log(`${user_info_file} has ${file_stats.size} characters`);
} else {
    console.log("hey! " + user_info_file + " doesn't exist!");
}

app.use(myParser.urlencoded({ extended: true }));

//add a route to get a cookie that may have been set here
app.get("/set_cookie", function (request, response) {
    console.log('in GET /set_cookie');
    var my_name = "Lexy";
    response.cookie("your_name", my_name, { maxAge: 5 * 1000 }).send('cookie set'); //sets name = my_name
});

app.get('/use_cookie', function (request, response) {
    console.log('In GET /use_cookie', request.cookies);
    var the_name = request.cookies["your_name"];
    response.send('Welcome to the Use Cookie page ' + the_name);
});

app.get('/use_session', function (request, response) {
    console.log('In GET /use_session', request.cookies);
    var the_sess_id = request.session.id;
    request.session.destroy(); //kills session
    response.send('Welcome, your session ID is ' + the_sess_id);
});

app.get("/login", function (request, response) { //get to login page
    console.log(request.cookies); //print out q-str
    if(typeof request.cookies['username'] != 'undefined') {
        str = `Welcome ${request.cookies['username']}!`;
    } else {
    quantity_str = request.query;
    // Give a simple login form
    str = `
<body>
<h1>Hello ${session.username}!  You last logged in on ${session.last_login_time}<h1>
<h1>${request.query["error"]}</h1>
<form action="/check_login?quantity=999" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
<a href ="./register">New user register</a>
</body>
    `;
    response.send(str);
}});

app.post("/check_login", function (request, response) {
    // Process login form POST and redirect to logged in page if information in login page matches that in the login JSON file, back to login page if not
    console.log(request.query);
    var err_str = "";
    var login_username = request.body["username"];
    //check if username exists in reg data. if so, check if password matches
    if (typeof userdata[login_username] != 'undefined') {
        var user_info = userdata[login_username];
        if (user_info.password != request.body["password"]) {//check if passowrd stored for username matches what user entered
            err_str = `bad_password`;
        } else {
            session.username = login_username;
            var theDate = Date.now();
            session.last_login_time = theDate;

            response.cookie('username', login_username).end(`$login_username} is logged in`)
        response.end(`${login_username} is logged in with data ${JSON.stringify(request.query)}`); //change this to response.redirect for assignment 2
        return; 
    } 
} else {
        err_str = `bad_username`;
}
response.redirect('./login?username}=${login_username}&error=%{err_str}');
});
 
app.listen(8080, () => console.log(`listening on port 8080`));
