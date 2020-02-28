var age = 20;
var number = 1;
while (number <= 0.5 * age) {
    console.log(number++);
    if (number > 0.5 * age) {
        console.log("I'm old!");
        break;
    }
} 