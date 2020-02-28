var age = 20;
var number = 0;
while (number++ < 20) {
    if (number > 0.5 * age) {
        console.log("Don't ask how old I am!");
        process.exit(1);
        continue;
    }
    console.log(number);
}