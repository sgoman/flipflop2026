'use strict'

const parseInput = input => input.split('\n').map(l => l.split(''))

const posHash = (row, col) => `${row},${col}`
const dirs = '>v<^'
const move = [[0,1], [1,0], [0,-1], [-1,0]]

const walk = (grid, row, col, visited, rightTurns) => {
    const pos = posHash(row, col)
    if (visited.has(pos)) {
        if (rightTurns < 3) {
            if (row == 0 || row == grid.length - 1 || col == 0 || col == grid[row].length - 1) return visited
            const [r, c] = move[(dirs.indexOf(grid[row][col]) + 1) % dirs.length]
            return walk(grid, row + r, col + c, visited, rightTurns + 1)
        }
        return visited
    }
    visited.add(pos)
    const [dr, dc] = move[dirs.indexOf(grid[row][col])]
    return walk(grid, row + dr, col + dc, visited, rightTurns)
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const grid = parseInput(input)

    solutions["part 1"] = walk(grid, 0, 0, new Set(), 3).size

    for (let row = 1; row < grid.length - 2; row++) {
        for (let col = 1; col < grid[row].length - 2; col++) {
            for (const d of dirs.split('').filter(t => t != grid[row][col])) {
                const map = parseInput(input)
                map[row][col] = d
                solutions["part 2"] = Math.max(solutions["part 2"], walk(map, 0, 0, new Set(), 3).size)
                solutions["part 3"] = Math.max(solutions["part 3"], walk(map, 0, 0, new Set(), 0).size)
            }
        }
    }

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
