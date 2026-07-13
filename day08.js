'use strict'

const parseInput = input => input.trim().split('\n').map(l => l.split(' '))

const keyForPair = (a, b) => [a, b].sort().join(':')
const keyForOrientedPair = (a, b) => `${a}:${b}`

const buildRuleMaps = rules => {
    const unary = new Map()
    const pair = new Map()

    for (const rule of rules) {
        const [a, b, ...rest] = rule
        if (!unary.has(a)) unary.set(a, [b, ...rest])

        const key = keyForPair(a, b)
        if (!pair.has(key)) pair.set(key, rest)
    }

    return { unary, pair }
}

const evolvePairsLengthOnly = (pairRules, steps) => {
    let pairCounts = new Map([[keyForOrientedPair('A', 'B'), 1n]])

    for (let i = 0; i < steps; i++) {
        const nextCounts = new Map()

        for (const [key, count] of pairCounts.entries()) {
            const [a, b] = key.split(':')
            const middle = pairRules.get(keyForPair(a, b))
            const sequence = [a, ...middle, b]

            for (let j = 0; j < sequence.length - 1; j++) {
                const nextKey = keyForOrientedPair(sequence[j], sequence[j + 1])
                nextCounts.set(nextKey, (nextCounts.get(nextKey) || 0n) + count)
            }
        }

        pairCounts = nextCounts
    }

    return Array.from(pairCounts.values()).reduce((acc, count) => acc + count, 0n) + 1n
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const { unary, pair } = buildRuleMaps(parseInput(input))

    let pop = ['A', 'B']
    for (let i = 0; i < 7; i++) {
        const desc = []
        for (const s of pop.slice(0)) {
            const r = unary.get(s)
            desc.push(...r)
        }
        pop = desc.slice(0)
    }
    solutions["part 1"] = pop.length
    solutions["part 2"] = evolvePairsLengthOnly(pair, 7).toString()
    solutions["part 3"] = evolvePairsLengthOnly(pair, 21).toString()

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
