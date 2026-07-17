'use strict'

// const { fourWayDeltas } = require('./utils.js')

const parseInput = input => {
    const [one, two] = input.split('\n\n')
    return [one.split(/\s/).map(Number), two.split('\n').map(l => l.split(' ').map(Number)).map(c => {return {fields: c, hits: []}})]
}

const bingos = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [20, 16, 12, 8, 4]
]

const score = hits => bingos.reduce((acc, bingo) => acc + bingo.every(v => hits.includes(v)), 0)

const cloneCards = cards => cards.map(card => ({ fields: card.fields, hits: [] }))

const buildGridLines = (dimensions, size) => {
    const dirs = []
    const dir = new Array(dimensions).fill(0)

    const buildDirs = idx => {
        if (idx === dimensions) {
            const firstNonZero = dir.find(v => v !== 0)
            if (firstNonZero === undefined || firstNonZero < 0) return
            dirs.push(dir.slice())
            return
        }

        for (const v of [-1, 0, 1]) {
            dir[idx] = v
            buildDirs(idx + 1)
        }
    }

    buildDirs(0)

    const inBounds = point => point.every(v => v >= 0 && v < size)
    const lines = []
    const point = new Array(dimensions).fill(0)

    const processPoint = direction => {
        const prev = point.map((v, i) => v - direction[i])
        if (inBounds(prev)) return

        const end = point.map((v, i) => v + (size - 1) * direction[i])
        if (!inBounds(end)) return

        const line = []
        for (let step = 0; step < size; step++) {
            line.push(point.map((v, i) => v + step * direction[i]))
        }
        lines.push(line)
    }

    const walkPoints = (idx, direction) => {
        if (idx === dimensions) {
            processPoint(direction)
            return
        }

        for (let v = 0; v < size; v++) {
            point[idx] = v
            walkPoints(idx + 1, direction)
        }
    }

    for (const direction of dirs) {
        walkPoints(0, direction)
    }

    return lines
}

const hypercubeLines = buildGridLines(4, 5).map(line => line.map(([cube, layer, row, col]) => [cube * 5 + layer, row * 5 + col]))

const scoreFourD = cards => {
    if (cards.length < 25) return 0
    const hitSets = cards.map(card => new Set(card.hits))
    return hypercubeLines.reduce((acc, line) => acc + line.every(([cardIdx, fieldIdx]) => hitSets[cardIdx].has(fieldIdx)), 0)
}

const scoreThreeD = cards => {
    const size = 5
    let total = 0

    const hasHit = (layer, row, col) => cards[layer].hits.includes(row * size + col)
    const addIfComplete = cells => {
        if (cells.every(([layer, row, col]) => hasHit(layer, row, col))) total += 1
    }

    // cards are stacked on top of each other, check the same cell on each layer
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            addIfComplete([...Array(size).keys()].map(layer => [layer, row, col]))
        }
    }

    // check the 3D diagonals as seen on the slices of each row of each card
    for (let row = 0; row < size; row++) {
        addIfComplete([...Array(size).keys()].map(d => [d, row, d]))
        addIfComplete([...Array(size).keys()].map(d => [d, row, size - 1 - d]))
    }

    // check the 3D diagonals as seen on the slices of each col of each card
    for (let col = 0; col < size; col++) {
        addIfComplete([...Array(size).keys()].map(d => [d, d, col]))
        addIfComplete([...Array(size).keys()].map(d => [d, size - 1 - d, col]))
    }

    // check the 3D diagonals that go across different rows and cols on each card
    addIfComplete([...Array(size).keys()].map(d => [d, d, d]))
    addIfComplete([...Array(size).keys()].map(d => [d, d, size - 1 - d]))
    addIfComplete([...Array(size).keys()].map(d => [d, size - 1 - d, d]))
    addIfComplete([...Array(size).keys()].map(d => [d, size - 1 - d, size - 1 - d]))

    return total
}

const play = (nums, cards, part) => {
    for (const [i, num] of nums.entries()) {
        let total = 0
        for (const card of cards) {
            const hit = card.fields.indexOf(num)
            if (hit != -1) card.hits.push(hit)
            if (part != 3) total += score(card.hits)
        }
        if (part == 2) {
            for (let cubeStart = 0; cubeStart <= cards.length - 5; cubeStart += 5) {
                total += scoreThreeD(cards.slice(cubeStart, cubeStart + 5))
            }
        } else if (part == 3) {
            total = scoreFourD(cards)
        }
        if (total >= 5) return [num, i]
    }
    return null
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const [nums, cards] = parseInput(input)
    solutions["part 1"] = play(nums, cloneCards(cards), 1)[0]
    solutions["part 2"] = play(nums, cloneCards(cards), 2)[0]
    if (cards.length >= 25) solutions["part 3"] = play(nums, cloneCards(cards), 3)[0]
    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
