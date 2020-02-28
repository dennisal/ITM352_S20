age = 20;
var squarerootage = Math.sqrt(age);
var number = 1;
while (number <= age) {
    if (number > Math.round(squarerootage)) {
        process.exit(1);
        continue;
    }
    console.log(number++);
}