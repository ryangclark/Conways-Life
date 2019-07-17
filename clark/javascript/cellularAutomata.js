// document.getElementById("universe").style.background = "blue";

const buffer = {
	alpha: new Array(64),
	beta: new Array(64),
	// current: cells // think of the actual `<div>`s as the current array
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
		// console.log('buffer toggled. next:', this.nextBuffer)
	}
};

let cells = document.getElementsByClassName('cell');

let counter = 0;

var universeInterval;
let universeRunning = false;

// set up
for (let i = 0; i < 64; i++) {
	cells[i].addEventListener('click', event => {
		if (!universeRunning) {
			cells[i].classList.toggle('cell-alive');			
		}
	})
	// cells[i].innerHTML = i;
}

function startUniverse() {
	universeRunning = true;
	universeInterval = setInterval(universe, 1000);
	console.log('universeInterval', universeInterval);
}

function stopUniverse() {
	universeRunning = false;
	clearInterval(universeInterval);
	console.log('stopUniverse');
}

function universe() {
	console.log('universe running!', buffer.nextBuffer);
	// while (counter < 10) { //universeRunning && counter < 10 && !buffer.compareArrays() 

	for (let i = 0; i < 64; i++) {
		let alive = cells[i].classList.contains('cell-alive');
		
		// get `x` and `y` coordinates from one-dimensional array
		let x = i % 8; // = i % width
		let y = Math.floor(i / 8); // = i / width

		// count neighbors
		let neighbors = 0;

	    for (let j = -1; j <= 1; j++) {
	      for (let k = -1; k <= 1; k++) {
	      	neighborIndex = (x + j) + 8 * (y + k); // i = x + width * y
	      	if (i === 21) {
	      		// console.log('index', i, x, y, 'neighborIndex', neighborIndex);
	      	}
	        if (0 <= neighborIndex && neighborIndex < 64 &&
	        	cells[neighborIndex].classList.contains('cell-alive')
	        	) {
	        	// console.group('neighbor up');
	        	// console.log('index', i);
	        	// console.log('neighborIndex', neighborIndex)
	        	// console.groupEnd();
	        	neighbors += 1
	        }
	      }
	    }

		// subtract 1 for self if alive
		if (alive) {
			neighbors -= 1;
		}

		// compare against rules
		if (alive && (neighbors <  2 || neighbors > 3)) {
		    buffer.next[i] = false;
		    // console.log('index', i, 'neighbors', neighbors);
		} else if (!alive && neighbors === 3) {
			buffer.next[i] = true;
		} else {
			buffer.next[i] = alive;
		}
	}

	// apply new styles to `cells`
	for (let index = 0; index < 64; index++) {
		if (buffer.next[index]) {
			cells[index].classList.add('cell-alive');
		} else {
			cells[index].classList.remove('cell-alive');
		}
	}

	// cells[0].classList.add('cell-alive');

	buffer.toggle();
	counter += 1;
	console.log('count:', counter);
	return;
};

// startUniverse();

// array1.length === array2.length && array1.every((value, index) => value === array2[index])

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
// https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
// i = x + width*y;
// x = i % width;    // % is the "modulo operator", the remainder of i / width;
// y = i / width;    // where "/" is an integer division
