const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");

// Reads the CSS file
function getCSS(path) {
    if (!path) {
        return "";
    }

    let string = "";

    try {
        string = readFileSync(path);
        string = string.toString();
    } catch (e) {
        console.log("[!] File not found. Put it in current directory.");
        process.exit(1);
    }

    return string;
}

// Checks only for valid parenthesis nothing more
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
function removeNewlines(css) {

    if (!css) {
        return "";
    }

    let string = "";

    let j = 0;

    for (let i = 0; i < css.length; i++) {
        let char = css[i];

        if (char == "\n" && css[i + 1] == "\n") {
            j = 1;
        }

        if (j-- <= 0) {
            string += char;
        }
    }

    return string;
}

// Removes comment in this form /* */
function removeComments(css) {
    if (!css) {
        return "";
    }

    let string = "";
    let j = 0;
    let appendChar = true;

    for (let i = 0; i < css.length; i++) {
        let char = css[i];

        if (char == "/" && css[i + 1] == "*") {
            appendChar = false;
        } else if (char == "*" && css[i + 1] == "/") {
            j = 2;
            appendChar = true;
        }

        if (j-- <= 0 && appendChar == true) {
            string += char;
        }
    }

    return string;
}

// Main sorter function
function sortLines(css) {
    if (!css) {
        return "";
    }

    if (!isValidCSS(css)) {
        console.log("Can't sort invalid CSS.");
        return;
    }

    css = removeComments(css);

    let string = "";

    let currentElement = "";
    let currentBody = "";

    let recordElement = true;
    let recordBody = false;

    let j = 0;

    for (let i = 0; i < css.length; i++) {
        let char = css[i];

        if (char == "{") {
            recordBody = true;
            recordElement = false;
        } else if (char == "}") {
            recordBody = false;
            recordElement = true;

            currentBody = currentBody.split("\n");

            currentBody.sort((a, b) => a.length - b.length);
            currentBody.unshift(currentElement + "{");
            currentBody.push("}");

            currentBody = currentBody.join("\n");
            currentBody = removeNewlines(currentBody);

            string += currentBody + "\n";

            currentBody = "";
            currentElement = "";
        } else if (recordElement == true) {
            currentElement += char;
        } else if (recordBody == true) {
            currentBody += char;
        }
    }

    return string;
}

let inFile = process.argv[2];
let outFile = process.argv[3];

if(!inFile){
    console.log("[!] No input file given.");
    console.log("    Try: bun unuglify.js samples/sample1.css out.css");
    process.exit(1);
}

outFile = outFile ?? "out.css";

let css = getCSS(inFile);
let sorted = sortLines(css);

console.log(process.argv);

try {
    writeFileSync(join(__dirname, outFile), sorted);
    console.log("[+] Written formatted CSS to " + outFile);
} catch(e){
    console.log("Failed to write into file.");
}