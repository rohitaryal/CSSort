const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");


// Checks only for valid parenthesis nothing more.
function isValidCSS(css) {
    if (!css) {
        return false;
    }

    // Stack to store parenthesis
    let stack = [];

    for (let i = 0; i < css.length; i++) {
        let char = css[i];

        if (char == "{") {
            stack.push("{");
        } else if (char == "}" && stack[stack.length - 1] == "{") {
            stack.pop();
        }

        // If stack remained empty the parenthesis are valid.
        if (stack.length == 0) {
            return true;
        }

        return false;
    }
}

// Removes new lines
function removeNewlines(css){

    if(!css){
        return "";
    }

    let string = "";

    let j = 0;

    for(let i = 0; i < css.length; i++){
        let char = css[i];

        if(char == "\n" && css[i+1] == "\n"){
            j = 1;
        }

        if(j-- <= 0) {
            string += char;
        }
    }

    return string;
}