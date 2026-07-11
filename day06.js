'use strict'

const { fourWayDeltas, getSurrounding, gridCells } = require('./utils.js')

const parseInput = input => input.split('\n').map(l => l.split(''))
const posHash = (row, col) => `${row}:${col}`

const work = (grid) => {
    const dirs = 'LR'
    let q = []
    let v = new Set()
    let {row, col} = gridCells(grid).filter(t => t.value == 'S')[0]
    q.push([row, col, 'L'])

    while(q.length) {
        let [r, c, d] = q.shift()
        let h = posHash(r, c)
        if (!v.has(h)) {
            v.add(h)
            grid[r][c] = d
            for (const n of getSurrounding(grid, r, c, fourWayDeltas).filter(t => t.tile == '#')) {
                let nd = dirs[(dirs.indexOf(d) + 1) % dirs.length]
                q.push([n.row, n.col, nd])
            }
        }
    }
    return grid
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}

    let p1 = work(parseInput(input))
    let lights = gridCells(p1).filter(c => c.value == '*')
    let bin = lights.reduce((b, l) => {
        const n = getSurrounding(p1, l.row, l.col, fourWayDeltas).filter(c => c.tile == 'L' || c.tile == 'R')
        if (n.length) b += 'LR'.indexOf(n[0].tile)
        return b
    }, '')
    solutions["part 1"] = parseInt(bin, 2)

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
