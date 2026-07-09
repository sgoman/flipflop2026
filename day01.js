'use strict'

const parseInput = input => input.split('\n').map(Number)

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    input = parseInput(input)

    solutions["part 1"] = input.reduce((acc, cur) => acc + (cur < 60 ? 60 - cur : 0), 0)
    solutions["part 2"] = input.reduce((acc, cur) => acc + (cur < 60 ? 60 - cur : (cur > 60 ? (cur - 60) * 5 : 0)), 0)

    solutions["part 3"] = 0
    for (let i = 0, h = Math.floor(input.length / 2); i < h; i++) {
        const current = input[i]
        const target = input[i + h]
        solutions["part 3"] += current < target ? target - current : (current > target ? (current - target) * 5 : 0)
    }

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
