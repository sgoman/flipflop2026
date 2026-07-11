'use strict'

const { fourWayDeltas, getSurrounding, gridCells } = require('./utils.js')

const parseInput = input => input.split('\n').map(l => l.split(''))
const posHash = (row, col) => `${row}:${col}`

const work = (grid, gears, hasBluetooth) => {
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
            const nd = dirs[(dirs.indexOf(d) + 1) % dirs.length]
            const neighbours = getSurrounding(grid, r, c, fourWayDeltas)
            for (const n of neighbours.filter(t => gears.indexOf(t.tile) != -1)) {
                q.push([n.row, n.col, nd])
            }
            if (hasBluetooth) {
                for (const n of neighbours.filter(t => t.tile.charCodeAt(0) >= 97 && t.tile.charCodeAt(0) <= 122)) {
                    for (const bto of gridCells(grid).filter(t => t.value == String.fromCharCode(n.tile.charCodeAt(0) - 32))) {
                        for (const gear of getSurrounding(grid, bto.row, bto.col, fourWayDeltas).filter(t => gears.indexOf(t.tile) != -1)) {
                            q.push([gear.row, gear.col, nd])
                        }
                    }
                }
            }
        }
    }
    return grid
}

const solve = (input, gears, hasBluetooth) => {
    let grid = work(parseInput(input), gears, hasBluetooth)
    let lights = gridCells(grid).filter(c => c.value == '*')
    let bin = lights.reduce((b, l) => {
        const n = getSurrounding(grid, l.row, l.col, fourWayDeltas).filter(c => c.tile == 'L' || c.tile == 'R')
        if (n.length) b += 'LR'.indexOf(n[0].tile)
        return b
    }, '')
    return parseInt(bin, 2)
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}

    solutions["part 1"] = solve(input, '#', false)
    solutions["part 2"] = solve(input, '#3', true)

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
