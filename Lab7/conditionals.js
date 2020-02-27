age = 14;
military = false;

if (age == 100) {
    document.write("<P>You get in free!");
} else if (age <= 16) {
    document.write("<P>Student discount");
} else if (military == true) {
    document.write("<P>Military Discount");
} else {
    document.write("<P>Full price ticket");
}

score = 90;

if (score >= 90) { grade = 'A' }
else if (score >= 80) { grade = 'B' }
else if (score >= 70) { grade = 'C' }
else if (score >= 60) { grade = 'D' }
else if (score >= 50) { grade = 'F' }

switch(profRel) {
    case "colleague" :
        greeting = "Thomas";
        break;
        case "friend" :
            greeting = "Tom";
            break;
}