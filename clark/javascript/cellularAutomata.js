const buffer = {
	alpha: new Array(64),
	beta: new Array(64),
	compareArrays: function compareBufferArrays() {
		return this.alpha.length === this.beta.length && 
				this.alpha.every((value, index) => value === this.beta[index])
	},
	get next() {
		if (this.nextBuffer == 'alpha') {return this.alpha;}
		else {return this.beta}
	},
	nextBuffer: 'alpha',
	toggle: function toggleBuffer() {
		if (this.nextBuffer === 'alpha') {
			this.nextBuffer = 'beta';
		} else {
			this.nextBuffer = 'alpha';
		}
	}
};

// Grid Variables
const grid = document.getElementById('cellular-automata-grid');
const cellCount = 2500;
const height = 50;
const width = 50;

let counter = 0;
let universeInterval;
let universeRunning = false;

// Create Grid
for (let i = 0; i < cellCount; i++) {
	let cell = document.createElement('div');
	cell.id = `cell-${i}`;
	cell.classList.add('cell');
	cell.addEventListener('click', event => {
		if (!universeRunning) {
			cells[i].classList.toggle('cell-alive');			
		}
	})
	grid.appendChild(cell);
}

let cells = document.getElementsByClassName('cell');


function clearUniverse() {
	for (let cell of cells) {
		cell.classList.remove('cell-alive');
	}
}

function randomizeUniverse() {
	for (let cell of cells) {
		let random = Math.floor(Math.random() * 2);
		if (random) {
			cell.classList.toggle('cell-alive');
		}
	}
}

function startUniverse() {
	universeRunning = true;
	universeInterval = setInterval(universe, 500);
	// manage buttons
	document.getElementById('clearUniverse').disabled = true;
	document.getElementById('randomizeUniverse').disabled = true;
	document.getElementById('startUniverse').disabled = true;
	document.getElementById('stopUniverse').disabled = false;
}

function stopUniverse() {
	universeRunning = false;
	clearInterval(universeInterval);
	// manage buttons
	document.getElementById('clearUniverse').disabled = false;
	document.getElementById('randomizeUniverse').disabled = false;
	document.getElementById('startUniverse').disabled = false;
	document.getElementById('stopUniverse').disabled = true;
}

function universe() {
	// let t0 = performance.now();

	for (let i = 0; i < cellCount; i++) {
		let alive = cells[i].classList.contains('cell-alive');
		
		// get `x` and `y` coordinates from one-dimensional array
		let x = i % width; // = i % width
		let y = Math.floor(i / width); // = i / width

		/* –– Count Neighbors –– */
		let neighbors = 0;

	    for (let j = -1; j <= 1; j++) {
	      for (let k = -1; k <= 1; k++) {
	      	neighborIndex = (x + j) + width * (y + k);

	      	// if `neighborIndex` is a valid index
	      	// and the corresponding cell is alive,
	      	// add to tally
	        if (0 <= neighborIndex && neighborIndex < cellCount &&
	        	cells[neighborIndex].classList.contains('cell-alive')
	        	) {
	        	neighbors += 1
	        }
	      }
	    }

		// subtract 1 for self, if alive
		if (alive) {
			neighbors -= 1;
		}

		/* –– Compare Tally Against Rules */
		if (alive && (neighbors <  2 || neighbors > 3)) {
		    buffer.next[i] = false;
		    // console.log('index', i, 'neighbors', neighbors);
		} else if (!alive && neighbors === 3) {
			buffer.next[i] = true;
		} else {
			buffer.next[i] = alive;
		}
	}

	/* –– Apply Results to `cells` –– */
	for (let index = 0; index < cellCount; index++) {
		if (buffer.next[index]) {
			cells[index].classList.add('cell-alive');
		} else {
			cells[index].classList.remove('cell-alive');
		}
	}

	buffer.toggle();
	counter += 1;
	document.getElementById('generation-counter')
		.innerHTML = `Generation: ${counter}`
	// let t1 = performance.now();
	// console.log('count:', counter, 'time:', (t1 - t0));
};


// array1.length === array2.length && array1.every((value, index) => value === array2[index])

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
// https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
// i = x + width*y;
// x = i % width;    // % is the "modulo operator", the remainder of i / width;
// y = i / width;    // where "/" is an integer division
