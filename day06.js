'use strict'

const { fourWayDeltas, getSurrounding, gridCells, gridToString } = require('./utils.js')

const parseInput = input => input.split('\n').map(l => l.split(''))
const posHash = (row, col) => `${row}:${col}`
const dirs = '()'

const isPrime = n => {
    if (n < 1) return false
    if (n <= 3) return true
    if (n % 2 == 0 || n % 3 == 0) return false
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false
    }
    return true
}

const getGroup = (grid, q) => {
    const s = new Set()
    while (q.length) {
        const [row, col] = q.pop()
        const h = posHash(row, col)
        if (!s.has(h)) {
            if (grid[row][col] == '3') s.add(h)
            for (const n of getSurrounding(grid, row, col, fourWayDeltas).filter(f => f.tile == '3')) {
                q.push([n.row, n.col])
            }
        }
    }
    return s
}

const skipGroup = (grid, row, col) => isPrime(getGroup(grid, [[row, col]]).size)

const work = (grid, gears, hasBluetooth, checkPrimes) => {
    let q = []
    let v = new Set()
    let {row, col} = gridCells(grid).filter(t => t.value == 'S')[0]
    q.push([row, col, dirs[0]])

    while(q.length) {
        let [r, c, d] = q.pop()
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
                        if (checkPrimes && skipGroup(grid, bto.row, bto.col)) continue
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

const solve = (input, gears, hasBluetooth, checkPrimes) => {
    let grid = work(parseInput(input), gears, hasBluetooth, checkPrimes)
    if (gears.length > 1) {
        console.log('###')
        console.log(gridToString(grid))
    }
    let lights = gridCells(grid).filter(c => c.value == '*')
    let bin = lights.reduce((b, l) => {
        const n = getSurrounding(grid, l.row, l.col, fourWayDeltas).filter(c => dirs.indexOf(c.tile) != -1)
        if (n.length) b += dirs.indexOf(n[0].tile)
        return b
    }, '')
    console.log(bin)
    return BigInt('0b'+bin)
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}

    solutions["part 1"] = solve(input, '#', false, false)
    solutions["part 2"] = solve(input, '#3', true, false)
    solutions["part 3"] = solve(input, '#3', true, true)

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
