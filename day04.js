'use strict'

const parseInput = input => input.trim().split('\n')

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}

    input = parseInput(input)
    const cut = input.length > 100 ? 400 : 8

    solutions["part 1"] = input.slice(0, input.length - 1 - cut).join('').match(/o/g).length

    solutions["part 2"] = input.reverse().reduce(([swapAt, swaps], line) => {
        if (line.includes(swapAt)) {
            swaps++
            swapAt = swapAt.split('').reverse().join('')
        }
        return [swapAt, swaps]
    }, ['o-', 0])[1]

    input = input.filter(l => l.includes('o')).map(l => l.trim())

    let climbers = 0
    while (input.length) {
        climbers++
        let side = input[input.length - 1]
        let swapAt = side.split('').reverse().join('')
        for (let i = input.length - 2; i >= 0; i--) {
            if (input[i].includes(swapAt)) {
                input.splice(input.indexOf(side, i), 1)
                side = swapAt
                swapAt = side.split('').reverse().join('')
            }
        }
        input = input.slice(1)
    }

    solutions["part 3"] = climbers

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
