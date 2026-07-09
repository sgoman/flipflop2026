'use strict'

const parseInput = input => input.split('\n')

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}

    const score = (movePanels, firstOnly) => {
        let panels = new Array(100).fill(0)
        const move = [1, -1, 0, 0]
        let pos = 1000000
        for (let i = 0, l = input.length; i < l; i++) {
            pos += move['><'.indexOf(input[i])]
            pos += move[movePanels.indexOf(input[l - i - 1])]
            panels[pos % 100]++
        }
        if (firstOnly) return panels[0]
        let max = Math.max(...panels)
        return max * (panels.indexOf(max) + 1)
    }

    solutions["part 1"] = score('  <>', false)
    solutions["part 2"] = score('<>', true)
    solutions["part 3"] = score('<>', false)

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
