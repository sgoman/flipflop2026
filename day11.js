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

const delta = {left: [0, -1], up: [-1, 0], right: [0, 1]}

const getEnergy = (stems, allStems) => stems.reduce((energy, stem) => {
    const above = allStems.has(stem.col) ? [...allStems.get(stem.col).values()].filter(f => f < stem.row).length : 0
	return energy + Math.max(0, 3 - above) * Math.max(0, Math.min(10, 100 - stem.row))
}, 0)

const growTogether = trees => {
	const world = gridInit(100, 500, '.')
    const allStems = new Map()
    const dead = new Set()
    const masses = new Map()
    const states = new Map()
    for (const [t, tree] of Object.entries(trees))
        states.set(t, {tree, q: new Map([[hash(99, 100 + (10 * t)), [99, 100 + (10 * t), '00']]]), stems: []})
    for (let y = 0; y < 100; y++) {
        for (const [t, state] of states) {
            if (dead.has(t)) continue
            const queue = new Map()
            for (const [row, col, id] of state.q.values()) {
                const sprout = state.tree[id]
                for (const s of ["left", "right", "up"]) {
                    if (sprout[s] == 'XX') continue
                    const [dr, dc] = delta[s]
                    const [nr, nc] = [row + dr, col + dc]
                    const h = hash(nr, nc)
                    const stems = [...allStems.values()].reduce((acc, cur) => [...acc, ...cur], [])
                    if (stems.filter(f => f.row == nr && f.col == nc).length) continue
                    if (world[nr][nc] == '#') continue
                    let skip = false
                    for (const [k, v] of states) {
                        if (k < t && v.q.has(h)) {
                            skip = true
                            break
                        }
                    }
                    if (skip) continue
                    world[nr][nc] = '@'
                    if (queue.has(h)) {
                        const [tr, tc, ts] = queue.get(h)
                        if (Number(ts) < Number(sprout[s]))
                            queue.set(h, [nr, nc, sprout[s]])
                    } else {
                        queue.set(h, [nr, nc, sprout[s]])
                    }
                }
                world[row][col] = '#'
                state.stems.push({row, col, value: '#'})
                const stack = allStems.get(col) || new Set()
                stack.add(row)
                allStems.set(col, stack)
            }
            state.q = queue
        }

        for (const [t, state] of states) {
            if (dead.has(t)) continue
            const mass = state.q.size + state.stems.length
            const required = mass * 3
            const harnessed = getEnergy(state.stems, allStems)
            if (y == 99 || (y >= 4 && required > harnessed)) {
                console.log("Tree " + t + " died at year " + (y + 1) + ". Requires " + required + " energy and produces " + harnessed + ". Biological " + mass)
                masses.set(t, mass)
                dead.add(t)
            }
        }
    }
    console.log(gridToString(world))
    return [...masses.values()].reduce((acc, cur) => acc + cur, 0)
}

const grow = (tree, num) => {
	//console.log({num, tree})
	const world = gridInit(100, 201, '.')
	const stems = []
	world[99][100] = '@'
	let q = new Map()
	q.set(hash(99, 100), [99, 100, '00'])
	for (let y = 0; y < 100; y++) {
		const t = new Map() 
		for (const [row, col, id] of q.values()) {
			const sprout = tree[id]
			for (const s of ["left", "right", "up"]) {
				if (sprout[s] == 'XX') continue
				const [dr, dc] = delta[s]
				const [nr, nc] = [row + dr, col + dc]
				const h = hash(nr, nc)
                if (stems.filter(f => f.row == nr && f.col == nc).length) continue
				if (world[nr][nc] == '#') continue
				world[nr][nc] = '@'
				if (t.has(h)) {
                    const [tr, tc, ts] = t.get(h)
                    if (Number(ts) < Number(sprout[s]))
                        t.set(h, [nr, nc, sprout[s]])
				} else {
                    t.set(h, [nr, nc, sprout[s]])
                }
            }
			world[row][col] = '#'
			stems.push({row, col, value: '#'})
		}
		q = t
        const mass = stems.length + q.size
		const required = mass * 3
		const harnessed = harnessedEnergy(stems)
		// console.log({y, q, required, harnessed})
		// console.log(gridToString(world))
		if (y == 99 || (y >= 4 && required > harnessed)) {
			//console.log(gridToString(world))
            console.log("Tree died at year " + (y + 1) + ". Requires " + required + " energy and produces " + harnessed + ". Biological " + mass)
			return mass
		}
    }
    console.log("Erm???")
	return stems.length + q.size
}

const part1 = input => {
	const solutions = { "part 1": null, "part 2": null, "part 3": null}
	const trees = parseInput(input)
	solutions["part 1"] = trees.reduce((acc, tree, i) => acc + grow(tree, i), 0)
    console.log("################## part 2 ###################")
    solutions["part 2"] = growTogether(trees)
	return solutions
}

const part2 = input => {
	return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
