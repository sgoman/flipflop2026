//////////////////// GRIDS
// directions are: 0 for up, 1 for right, 2 for down and 3 for left
const fourWayDeltas = [[-1, 0], [0, 1], [1, 0], [0, -1]]

// all 8 neighbours, but not the center piece
const eightWayDeltas = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

// returns a new 2D grid of the desired dimensions and initialized with a predefined value
const gridInit = (rows, cols, value) => Array.from({length: rows}, () => Array(cols).fill(value))

// returns a copy of a 2D grid
const gridClone = grid => grid.map(r => r.map(c => c))

// checks whether a row and colum exist in a grid
const validCoordForGrid = (row, col, grid) => row >= 0 && row < grid.length && col >= 0 && col < grid[row].length

// get grid coords from a position and list of deltas
const getSurroundingGridCoords = (grid, row, col, deltas) =>
	deltas.flatMap(([r, c]) => Array(+(validCoordForGrid(row + r, col + c, grid))).fill([row + r, col + c]));

// get grid elements for a position and a list of offset coords
const getSurroundingGridTiles = (grid, row, col, deltas) =>
    getSurroundingGridCoords(grid, row, col, deltas).reduce((tiles, [r, c]) => [...tiles, grid[r][c]], [])

// get grid elements and coords for a position and a list of offset coords
const getSurrounding = (grid, row, col, deltas) =>
    getSurroundingGridCoords(grid, row, col, deltas).reduce((tiles, [r, c]) => [...tiles, { tile: grid[r][c], row: r, col: c }], [])

// returns a flat map of {row, col, value}
const gridCells = grid => grid.reduce((cells, line, row) => [...cells, ...line.map((value, col) => { return {row, col, value} })], [])

// "rotates" a two dimenstional array 90° clockwise
const transpose = grid => grid.reduce((cols, row, r, arr) => 
    [ cols, row.map((_, c) => arr.map(l => l[c])) ][+(r == 0)] , [])

// classic rough distance on grids
const manhattan = (a, b) => Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])

/**
 * Creates combinations of the input elements and checks acceptCombo to keep or discard a combination
 * and diveDeeper to decide if there could be acceptable combinations by continuing a depth search.
 *
 * Taken from my aoc2015 day 17
 *
 * Examples:
 *      const pairs = tmp => tmp.length == 2
 *   	const tooShort = tmp => tmp.length < 2
 *   	const onlyEven = tmp => tmp.every(val => val % 2 == 0)
 *   	const everything = tmp => true
 *
 *   	console.log(combineConditionally(['a', 'b', 'c'], pairs, tooShort))
 *      // prints [ [ 'a', 'b' ], [ 'a', 'c' ], [ 'b', 'c' ] ]
 *
 *   	console.log(combineConditionally([1, 2, 3, 4, 5, 6], onlyEven, everything))
 *      // prints [ [ 2 ], [ 2, 4 ], [ 2, 4, 6 ], [ 2, 6 ], [ 4 ], [ 4, 6 ], [ 6 ] ]
 *
 *   	console.log(combineConditionally(['a', 'b', 'c'], everything, everything))
 *   	// prints [ [ 'a' ], [ 'a', 'b' ], [ 'a', 'b', 'c' ], [ 'a', 'c' ], [ 'b' ], [ 'b', 'c' ], [ 'c' ] ]
 *
 * @param array arr the array to source combinations from
 * @param function acceptCombo takes the current combination, returns boolean to keep or discard
 * @param function diveDeeper takes the current combination, returns boolean to keep adding or stopping
 * @returns array of arrays of possible combinations
 */ 
const combineConditionally = (arr, acceptCombo, diveDeeper) => {
	const l = arr.length
	const combiner = (part, start) => {
		let result = [], p
		for (let i = start; i < l; i++) {
			p = part.slice(0)
			p.push(arr[i])
			if (acceptCombo(p)) result.push(p)
			if (diveDeeper(p)) result = result.concat(combiner(p, i + 1))
		}
		return result
	}
	return combiner([], 0)
}

const permutator = (inputArr) => {
    const result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                const curr = arr.slice();
                const next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(inputArr)

    return result;
}

const arraySum = arr => arr.reduce((acc, cur) => acc + cur, 0)

const arrayProduct = arr => arr.reduce((acc, cur) => acc * cur, 1)

const arrayHasIndex = (array, index) => Array.isArray(array) && array.hasOwnProperty(index)

/**
 * returns a copy of an array with elements in a radomized order
 *
 * Taken from my aoc2015 day 19.
 *
 * @param array arr The array to shuffle
 * @returns array
 */
const shuffledArray = arr => {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
    }
    return newArr
}

/**
 * Takes an array and returns an object with each element as a property that contains the number of occurencies
 *
 * Example:
 *   arrayFrequency([1, 2, 1, 1]) returns {1: 3, 2: 1}
 *   arrayFrequency('hello'.split('')) returns {'h': 1, 'e': 1, 'l': 2, 'o': 1}
 *
 * Based on my aoc2016 day 4 code.
 *
 * @param array arr the list of elements to count on
 * @returns object
 */
const arrayFrequency = elements => elements.reduce((acc, cur) => {
    if (acc[cur]) {
      acc[cur]++
    } else {
      acc[cur] = 1
    }
    return acc
}, {})

// Helper function for flowless code, numbers from 0 up to count
const steps = count => [...(new Array(count)).keys()]

//////////////////// MATH
// Thanks, SO 47047682
// lcm usage: [2, 3, 4].reduce(lcm)
const gcd = (a, b) => a ? gcd(b % a, a) : b
const lcm = (a, b) => a * b / gcd(a, b)

// Solve linear algebraic formulas with 2 unknowns, taken from my day 13 of 2024
// returns [a, b] Be aware that [0, 0] is also used for "no solution"
const cramer2 = (ax, ay, bx, by, tx, ty) => {
    const d = ax * by - ay * bx
    if (d == 0) return [0, 0]
    return [(tx * by - ty * bx) / d, (ty * ax - tx * ay) / d]
}

// builds all possible pairs of all entries of a list (without mirrors, simpler and faster for this edge-case than combineConditionally)
const pairs = (arr) => arr.map( (v, i) => arr.slice(i + 1).map(w => [v, w]) ).flat()

// a generator that yields numbers of a range (
// a range can be defined as range(maxValue), range(startValue, maxValue) or range(startValue, maxValue, stepSize)
// usage: for (let num of range(42, 70)) console.log(num)
const range = function* () {
    let start = 0, stop = 0, step = 1
    if (arguments.length == 3) {
        start = arguments[0]
        stop = arguments[1]
        step = arguments[2]
    } else if (arguments.length == 2) {
        start = arguments[0]
        stop = arguments[1]
    } else if (arguments.length) {
        stop = arguments[1]
    }

    if (stop < start) {
        const tmp = start
        start = stop
        stop = tmp
    }

    if (step == 0) step = 1

    if (step < 0) {
        for (let i = stop; i > start; i += step) yield i
    } else {
        for (let i = start; i < stop; i += step) yield i
    }
}

// taken from https://www.sahinarslan.tech/posts/deep-dive-into-data-structures-using-javascript-heap-binary-heap
// methods and attributes starting with an underscore are considered private and should not be called from the outside
// Min-Heap example: new Heap((a, b) => a[0] - b[0])
// Max-Heap example: new Heap((a, b) => b[0] - a[0])
class Heap {
    constructor(comparator) {
        this._heap = []
        this._comparator = comparator || ((a, b) => a - b)
    }

    size() { return this._heap.length }

    isEmpty() { return this.size() == 0 }

    peek() { return this._heap[0] }

    insert(value) { this._heap.push(value); this._heapifyUp() }

    extract() {
        if (this.isEmpty()) return null
        const poppedValue = this.peek()
        const bottom = this.size() - 1
        if (bottom > 0) this._swap(0, bottom)
        this._heap.pop()
        this._heapifyDown()
        return poppedValue
    }

    _parentIndex(i) { return Math.floor((i - 1) / 2) }

    _parentValue(i) { return i < this.size() && this._parentIndex(i) >= 0 ? this._heap[this._parentIndex(i)] : undefined }

    _leftChildIndex(i) { return 2 * i + 1 }

    _leftChildValue(i) { return this._hasLeftChild(i) ? this._heap[this._leftChildIndex(i)] : undefined }

    _hasLeftChild(i) { return this._leftChildIndex(i) < this.size() }

    _rightChildIndex(i) { return 2 * i + 2 }

    _rightChildValue(i) { return this._hasRightChild(i) ? this._heap[this._rightChildIndex(i)] : undefined }

    _hasRightChild(i) { return this._rightChildIndex(i) < this.size() }

    _swap(i, j) { [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]] }

    _heapifyUp() {
        let nodeIndex = this.size() - 1
        while ( nodeIndex > 0 && this._comparator(this._parentValue(nodeIndex), this._heap[nodeIndex]) > 0) {
            this._swap(nodeIndex, this._parentIndex(nodeIndex))
            nodeIndex = this._parentIndex(nodeIndex)
        }
    }

    _heapifyDown() {
        let currNodeIndex = 0
        while (this._hasLeftChild(currNodeIndex)) {
            let smallerChildIndex = this._leftChildIndex(currNodeIndex)
            if (
                this._hasRightChild(currNodeIndex) &&
                this._comparator(
                    this._rightChildValue(currNodeIndex),
                    this._leftChildValue(currNodeIndex)
                ) < 0
            ) {
                smallerChildIndex = this._rightChildIndex(currNodeIndex)
            }
            if ( this._comparator( this._heap[currNodeIndex], this._heap[smallerChildIndex]) <= 0) break
            this._swap(currNodeIndex, smallerChildIndex)
            currNodeIndex = smallerChildIndex
        }
    }
}

//////////////////// STRINGS
// a simple algo for similarity, only comparing every nth element of a and b
const levenstein = (a, b) => a.reduce((acc, c, i) => acc + (1* (c != b[i])), 0)

// returns a printable string where all columns of a row are glued together and the rows are joined by new line characters
const gridToString = grid => grid.map(l => l.join('')).join('\n')

module.exports = { fourWayDeltas, eightWayDeltas, gridInit, gridClone, validCoordForGrid, getSurroundingGridCoords, getSurroundingGridTiles, getSurrounding, gridCells,
    transpose, manhattan, combineConditionally, permutator, arraySum, arrayProduct, arrayHasIndex, shuffledArray,
    arrayFrequency, gcd, lcm, cramer2, pairs, range, Heap, levenstein, gridToString, steps
}
