'use strict'

const { fourWayDeltas, getSurrounding, gridCells, gridToString, manhattan } = require('./utils.js')

const parseInput = input => input.split('\n').map(l => l.split(''))

const posHash = (row, col) => `${row}:${col}`
const actionHash = (row, col, action) => `${row}:${col}:${action}`

const teleport = (grid, row, col) => {
	const t = []
	const h = posHash(row, col)
	for (const [dr, dc] of fourWayDeltas) {
		let tr = row + dr, tc = col + dc
		if (grid[tr][tc] == '#') continue
		while (grid[tr][tc] != '#') {
			tr += dr
			tc += dc
		}
		tr -= dr
		tc -= dc
		if (posHash(tr, tc) != h) t.push({row: tr, col: tc})
	}
	return t
}

const floodFill = (grid, row, col, part) => {
	const q = [[row, col, 0, 2, [{action: "move to start", or: 0, oc: 0, tr: row, tc: col, cost: 0, total: 0}], "init"]]
	const s = new Map()
	let best = [1e6, []]
	while (q.length) {
		const [r, c, v, d, m, a] = q.shift()
		const h = posHash(r, c)
		if (grid[r][c] == 'E' && v < best[0]) best =[v, m]
		if (!s.has(h) || v < s.get(h)) {
			s.set(h, v)
			if (part == 2) {
				for (const t of teleport(grid, r, c)) {
					q.push([t.row, t.col, v + 1, d, [...m, {action: "teleport", or: r, oc: c, tr: t.row, tc: t.col, cost: 1, total: v + 1}], "teleport"])
				}
			}
			if (part ==3) {
				for (const t of teleport(grid, r, c)) {
					const w = getSurrounding(grid, r, c, fourWayDeltas).filter(c => c.tile == '#')
					const walkOrPortal = Math.min(d, w.length == 0 ? 3 : 2) + 1
					//if (manhattan([r, c], [t.row, t.col]) > walkOrPortal)
						q.push([t.row, t.col, v + walkOrPortal, 1, [...m, {action: "portal", or: r, oc: c, tr: t.row, tc: t.col, cost: walkOrPortal, total: v + walkOrPortal}], "portal"])
				}
			}
			const neighbours = getSurrounding(grid, r, c, fourWayDeltas).filter(c => c.tile == '.' || c.tile == 'E')
			for (const n of neighbours) {
				q.push([n.row, n.col, v + 1, d + 1, [...m, {action: "walk", or: r, oc: c, tr: n.row, tc: n.col, cost: 1, total: v + 1}], "walk"])
			}
		}
	}
	return best
}

const printMoves = (grid, moves) => {
	grid[moves.or][moves.oc] = 'F'
	grid[moves.tr][moves.tc] = 'T'
	console.log(gridToString(grid))
	console.log(moves)
}

const part1 = input => {
	const solutions = { "part 1": null, "part 2": null, "part 3": null}
	const grid = parseInput(input)
	const start = gridCells(grid).filter(c => c.value == 'S')[0]
	for (const i of [1, 2, 3])
		solutions["part " + i] = floodFill(grid, start.row, start.col, i)[0]
	for (const m of floodFill(grid, start.row, start.col, 3)[1])
		printMoves(parseInput(input), m)
	return solutions
}

const part2 = input => {
	return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
