var age = 20;
var number = 0;
while (number++ < 20) {
    if ((number > 0.5 * age) && (number < 0.75 * age)) {
        console.log("No age zone!");
        continue;
    }
    console.log(number);
} 