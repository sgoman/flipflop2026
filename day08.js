'use strict'

// const { fourWayDeltas } = require('./utils.js')

const parseInput = input => input.split('\n').map(l => l.split(' '))

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const rules = parseInput(input)

    let pop = ['A', 'B']
    for (let i = 0; i < 7; i++) {
        const desc = []
        for (const s of pop.slice(0)) {
            const r = rules.filter(f => f[0] == s)[0]
            desc.push(...r.slice(1))
        }
        pop = desc.slice(0)
    }
    solutions["part 1"] = pop.length

    pop = ['A', 'B']
    for (let i = 0; i < 7; i++) {
        const desc = []
        for (let s = 0, l = pop.length - 2; s <= l; s++) {
            const [a, b] = [pop[s], pop[s + 1]]
            const r = rules.filter(f => (f[0] == a && f[1] == b) || (f[0] == b && f[1] == a))[0]
            if (s == 0) {
                desc.push(a, ...r.slice(2), b)
            } else {
                desc.push(...r.slice(2), b)
            }
        }
        pop = desc.slice(0)
    }
    solutions["part 2"] = pop.length

    pop = ['A', 'B']
    for (let i = 0; i < 21; i++) {
        const desc = []
        for (let s = 0, l = pop.length - 2; s <= l; s++) {
            const [a, b] = [pop[s], pop[s + 1]]
            const r = rules.filter(f => (f[0] == a && f[1] == b) || (f[0] == b && f[1] == a))[0]
            if (s == 0) {
                desc.push(a, ...r.slice(2), b)
            } else {
                desc.push(...r.slice(2), b)
            }
        }
        pop = desc.slice(0)
    }
    solutions["part 3"] = pop.length


    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
