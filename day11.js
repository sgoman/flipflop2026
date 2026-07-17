'use strict'

const { gridInit } = require('./utils.js')

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

const hash = (row, col) => [row, col].join(':')

const delta = {left: [0, -1], up: [-1, 0], right: [0, 1]}
const WORLD_ROWS = 100
const WORLD_COLS = 1000
const WORLD_OFFSET = 300
const SINGLE_COLS = 201
const SINGLE_OFFSET = 100

const stemEnergy = (row, above) => Math.max(0, 3 - above) * Math.max(0, Math.min(10, WORLD_ROWS - row))

const buildAboveLookup = columns => {
    const aboveLookup = new Map()
    for (const [col, rows] of columns) {
        const sorted = [...rows].sort((a, b) => a - b)
        for (let i = 0; i < sorted.length; i++) {
            aboveLookup.set(hash(sorted[i], col), i)
        }
    }
    return aboveLookup
}

const getEnergy = (stems, aboveLookup) => stems.reduce((energy, stem) => {
    const above = aboveLookup.get(hash(stem.row, stem.col)) || 0
	return energy + stemEnergy(stem.row, above)
}, 0)

const inBounds = (row, col) => row >= 0 && row < WORLD_ROWS && col >= 0 && col < WORLD_COLS
const inBoundsSingle = (row, col) => row >= 0 && row < WORLD_ROWS && col >= 0 && col < SINGLE_COLS

const growTogether = (trees, seeds = null) => {
	const world = gridInit(WORLD_ROWS, WORLD_COLS, '.')
    const allStems = new Map()
    const dead = new Set()
    const masses = new Map()
    const states = new Map()
    const roots = seeds || trees.map((tree, i) => ({col: WORLD_OFFSET + (10 * i), dnaIndex: i}))
    roots.forEach((root, i) => {
        const id = String(i)
        const row = WORLD_ROWS - 1
        const col = root.col
        world[row][col] = '@'
        states.set(id, {
            tree: trees[root.dnaIndex],
            dnaIndex: root.dnaIndex,
            q: new Map([[hash(row, col), [row, col, '00']]]),
            stems: []
        })
    })
    for (let y = 0; y < WORLD_ROWS; y++) {
        for (const [t, state] of states) {
            if (dead.has(t)) continue
            const queue = new Map()
            for (const [row, col, id] of state.q.values()) {
                const sprout = state.tree[id]
                for (const s of ["left", "right", "up"]) {
                    if (sprout[s] == 'XX') continue
                    const [dr, dc] = delta[s]
                    const [nr, nc] = [row + dr, col + dc]
                    if (!inBounds(nr, nc)) continue
                    const h = hash(nr, nc)
                    if (queue.has(h)) {
                        const [tr, tc, ts] = queue.get(h)
                        if (Number(ts) < Number(sprout[s]))
                            queue.set(h, [nr, nc, sprout[s]])
                    } else {
                        if (world[nr][nc] != '.') continue
                        queue.set(h, [nr, nc, sprout[s]])
                    }
                }
                world[row][col] = '#'
                state.stems.push({row, col, value: '#'})
                const stack = allStems.get(col) || new Set()
                stack.add(row)
                allStems.set(col, stack)
            }
            for (const [nr, nc] of queue.values()) {
                world[nr][nc] = '@'
            }
            state.q = queue
        }

        const aboveLookup = buildAboveLookup(allStems)
        for (const [t, state] of states) {
            if (dead.has(t)) continue
            const mass = state.q.size + state.stems.length
            const required = mass * 3
            const harnessed = getEnergy(state.stems, aboveLookup)
            if (y == WORLD_ROWS - 1 || (y >= 4 && required > harnessed)) {
                masses.set(t, mass)
                dead.add(t)
            }
        }
    }
    return {
        mass: [...masses.values()].reduce((acc, cur) => acc + cur, 0),
        states,
        world
    }
}

const createOffspringSeeds = states => {
    const topByCol = new Map()
    for (const state of states.values()) {
        for (const [row, col] of state.q.values()) {
            const current = topByCol.get(col)
            if (!current || row < current.row)
                topByCol.set(col, {row, col, dnaIndex: state.dnaIndex})
        }
    }
    return [...topByCol.values()]
        .sort((a, b) => a.col - b.col)
        .map(sprout => ({col: sprout.col, dnaIndex: sprout.dnaIndex}))
}

const grow = (tree, num) => {
    const world = gridInit(WORLD_ROWS, SINGLE_COLS, '.')
	const stems = []
    const stemsByCol = new Map()
    world[WORLD_ROWS - 1][SINGLE_OFFSET] = '@'
	let q = new Map()
    q.set(hash(WORLD_ROWS - 1, SINGLE_OFFSET), [WORLD_ROWS - 1, SINGLE_OFFSET, '00'])
    for (let y = 0; y < WORLD_ROWS; y++) {
		const t = new Map() 
		for (const [row, col, id] of q.values()) {
			const sprout = tree[id]
			for (const s of ["left", "right", "up"]) {
				if (sprout[s] == 'XX') continue
				const [dr, dc] = delta[s]
				const [nr, nc] = [row + dr, col + dc]
                if (!inBoundsSingle(nr, nc)) continue
				const h = hash(nr, nc)
				if (t.has(h)) {
                    const [tr, tc, ts] = t.get(h)
                    if (Number(ts) < Number(sprout[s]))
                        t.set(h, [nr, nc, sprout[s]])
				} else {
                    if (world[nr][nc] != '.') continue
                    t.set(h, [nr, nc, sprout[s]])
                }
            }
			world[row][col] = '#'
			stems.push({row, col, value: '#'})
            const rows = stemsByCol.get(col) || new Set()
            rows.add(row)
            stemsByCol.set(col, rows)
		}
        for (const [nr, nc] of t.values()) {
            world[nr][nc] = '@'
        }
		q = t
        const mass = stems.length + q.size
		const required = mass * 3
        const aboveLookup = buildAboveLookup(stemsByCol)
        const harnessed = getEnergy(stems, aboveLookup)
        if (y == WORLD_ROWS - 1 || (y >= 4 && required > harnessed)) {
			return mass
		}
    }
	return stems.length + q.size
}

const part1 = input => {
	const solutions = { "part 1": null, "part 2": null, "part 3": null}
	const trees = parseInput(input)
	solutions["part 1"] = trees.reduce((acc, tree, i) => acc + grow(tree, i), 0)

    const generation0 = growTogether(trees)
    solutions["part 2"] = generation0.mass

    const generation1Seeds = createOffspringSeeds(generation0.states)
    const generation1 = growTogether(trees, generation1Seeds)
    const generation2Seeds = createOffspringSeeds(generation1.states)
    const generation2 = growTogether(trees, generation2Seeds)
    solutions["part 3"] = generation2.mass
	
    return solutions
}

const part2 = input => {
	return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
