"use strict";

let patternsArr = []; // patterns that are being searched for
let buffer = []; //counter array for each frequency
let freqTable = {}; //frequency table
let counter = 0;
let maxLen = 0;

let possiblesTable = {
	"A": ["A"],
	"T": ["T"],
	"C": ["C"],
	"G": ["G"],
	"R": ["R", "G", "A"],
	"Y": ["Y", "T", "C"],
	"K": ["K", "G", "T"],
	"M": ["M", "A", "C"],
	"S": ["S", "G", "C"],
	"W": ["W", "A", "T"],
	"B": ["B", "G", "T", "C"],
	"D": ["D", "G", "A", "T"],
	"H": ["H", "A", "C", "T"],
	"V": ["V", "G", "C", "A"],
	"N": ["N", "A", "G", "C", "T"]
}

const testlib = require('./testlib.js');

const generateCombinations = (sequence, pos = 0, current = "", combinations = []) => {
	if (pos === sequence.length) {
		combinations.push(current);
		return combinations;
	}

	const currentLetter = sequence[pos];
	const possibleLetters = possiblesTable[currentLetter];

	possibleLetters.forEach(letter => {
		const newCurrent = current + letter;
		generateCombinations(sequence, pos + 1, newCurrent, combinations);
	});

	return combinations;
};

//end of file handler
testlib.on('end', () => {
	testlib.frequencyTable(freqTable);
});


//end of line handler (print freq table) (reset freq table)
testlib.on('reset', () => {
	testlib.frequencyTable(freqTable);
	buffer.length = 0;
	Object.keys(freqTable).forEach((key) => {
		freqTable[key] = 0;
	})
	counter = 0;
});

//invoker (assign patterns and init object(freq table))
testlib.on('ready', (patterns) => {

	patternsArr = patterns;
	const len = (patternsArr) => {
		let len = 0;
		patternsArr.forEach((pattern) => {
			if (pattern.length > len) {
				len = pattern.length;
			}
		})
		return len;
	};
	maxLen = len(patternsArr);

	patterns.forEach((pattern) => {
		freqTable[pattern] = 0;
	});

	console.log("Patterns:",patterns);

	testlib.runTests();
});

//data handler (call matchfound function) <- (anon func should be matcher function)
testlib.on('data', (data) => {
	counter++;
	//console.log(`Current Amino Acid: ${data}`);
	buffer.push(data);
	//console.log(buffer);
	if (buffer.length > 1) {
		let combinations = generateCombinations(buffer.toString().replace(/,/g, ""));
		//console.log(combinations);
		patternsArr.forEach((pattern) => {
			if (combinations.includes(pattern)) {
				freqTable[pattern]++;
				testlib.foundMatch(pattern, counter - buffer.length);
			}
		});
		if (!(buffer.length < maxLen)) {
			buffer = buffer.slice(-1);
		}
	}
});



//runner
testlib.setup(3);


