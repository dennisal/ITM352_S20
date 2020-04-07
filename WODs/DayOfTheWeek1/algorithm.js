
day = 19;
month = "July";
year = 1999;

step1 = year % 100;
step2 = parseInt(step1 / 4);
step3 = step2 + step1;
if (month == "January") {
    step5 = day + step3;
} else {
    switch (month) {
        case "February":
            step4 = 3; break;
        case "March":
            step4 = 3; break;
        case "April":
            step4 = 6; break;
        case "May":
            step4 = 1; break;
        case "June":
            step4 = 4; break;
        case "July":
            step4 = 6; break;
        case "August":
            step4 = 2; break;
        case "September":
            step4 = 5; break;
        case "October":
            step4 = 0; break;
        case "November":
            step4 = 3; break;
        case "December":
            step4 = 5; break;
    }
    step6 = step4 + step3;
    step7 = day + step6;
}
step8 = (typeof step5 !== 'undefined') ? step5 : step7;
//Leap Year?
isLeapYear =( (year % 4 == 0) && (year % 100 != 0) && (year % 400 == 0));
if (parseInt(year/100) == 19)  {
    //1900s Path
    if(isLeapYear) {
        if(month == "January" || month == "February") {
            step9 = step8 - 1;
        }
    }
} else {
    //2000s Path
    if(isLeapYear) {
        if(month == "January" || month == "February") {
            step9 = step8 - 2;
        } else {
            step9 = step8 - 1;
        }
    } else {
        step9 = step8 - 1;
    }
}


console.log(step9);