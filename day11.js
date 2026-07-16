'use strict'

const { gridInit, gridCells, gridToString } = require('./utils.js')

const parseInput = input => {
	const lines = input.split('\n')
	const trees = []
	for (let l = 1; l < lines.length; l +=3) {
		const sprouts = {}
		for (let c = 0; c < lines[l].length; c += 12) {
			const up = lines[l - 1].substring(c, c + 10).trim()
			const [left, id, right] = lines[l].substring(c, c + 10).match(/[X0-9]+/g)
			sprouts[id] = {left, up, right}
		}
		trees.push(sprouts)
	}
	return trees
}

const harnessedEnergy = stems => stems.reduce((energy, stem) => {
	const above = stems .filter(c => c.row < stem.row && c.col == stem.col) .length
	return energy + Math.max(0, 3 - above) * Math.max(0, Math.min(10, 100 - stem.row))
}, 0)

const hash = (row, col) => [row, col].join(':')

const grow = (tree, num) => {
	console.log({num, tree})
	const delta = {left: [0, -1], up: [-1, 0], right: [0, 1]}
	const world = gridInit(100, 201, '.')
	const stems = []
	world[99][100] = '@'
	let q = new Map()
	q.set(hash(99, 100), [99, 100, '00'])
	for (let y = 0; y < 100; y++) {
		const t = new Map() 
		for (const [row, col, id] of q.values()) {
			world[row][col] = '#'
			stems.push({row, col, value: '#'})
			const sprout = tree[id]
			for (const s of ["left", "right", "up"]) {
				if (sprout[s] == 'XX') continue
				const [dr, dc] = delta[s]
				const [nr, nc] = [row + dr, col + dc]
				const h = hash(nr, nc)
				if (world[nr][nc] == '#') continue
				world[nr][nc] = '@'
				if (t.has(h)) {
					if (Number(s) > Number(t.get(h)))
						t.set(h, [nr, nc, sprout[s]])
				} else {
					t.set(h, [nr, nc, sprout[s]])
				}
			}
		}
		q = t
		const required = (stems.length + q.size) * 3
		const harnessed = harnessedEnergy(stems)
		// console.log({y, q, required, harnessed})
		// console.log(gridToString(world))
		if (y >= 4 && required > harnessed) {
			console.log({y, q, required, harnessed})
			console.log(gridToString(world))
			return required / 3
		}
	}
	console.log("fully grown!", stems.length + q.size)
	return stems.length + q.size
}

const part1 = input => {
	const solutions = { "part 1": null, "part 2": null, "part 3": null}
	const trees = parseInput(input)
	solutions["part 1"] = trees.reduce((acc, tree, i) => acc + grow(tree, i), 0)
	return solutions
}

const part2 = input => {
	return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
