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

const scoreThreeD = cards => {
    // cards are stacked on top of each other, check the same cell on each layer
    let total = [...(new Array(25).fill(0)].reduce((acc, cur, i) => acc + cards.every(c => c.hits.includes(i)), 0)
    // check the 3D diagonals as seen on the slices of each row of each card
    // check the 3D diagonals as seen on the slices of each col of each card
    // check the 3D diagonals that go across different rows and cols on each card
}

const play = (nums, cards, part) => {
    for (const [i, num] of nums.entries()) {
        let total = 0
        for (const card of cards) {
            const hit = card.fields.indexOf(num)
            if (hit != -1) card.hits.push(hit)
            total += score(card.hits)
        }
        if (part == 2) {
            total += scoreThreeD(cards)
        }
        if (total >= 5) return [num, i]
    }
    return null
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const [nums, cards] = parseInput(input)
    solutions["part 1"] = play(nums, cards.slice(0), 1)[0]
    p2 = []
    for (let i = 0; i <= cards.length - 5; i += 5) {
        p2.push(play(nums, cards.slice(i, i + 5), 2)
    }
    p2.sort((a, b) => b[1] - a[1])
    solutions["part 2"] = p2[0][0]
    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
