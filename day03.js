'use strict'

const parseInput = input => input.split('\n')

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}

    const grade = (pad, extendedRules) => input.trim().split('\n').reduce(([pw, best, total], cur) => {
        cur += pad
        let strength = ~~(/[a-z]/g.test(cur))
        strength += ~~(/[A-Z]/g.test(cur))
        strength += ~~(/[0-9]/g.test(cur))
        if (extendedRules) {
            strength += (/[7]/g.test(cur) * !(/[0-689]/g.test(cur))) ? 7 : 0
            const seqs = cur.match(/(.)\1\1+/g)
            const l = seqs == null ? 0 : seqs.sort((a, b) => a.length < b.length)[0].length
            strength += l * l
            strength *= (/(red|green|blue)/g.test(cur)) ? 3 : 1
        }
        strength *= cur.length
        if (strength > best) {
            pw = cur
            best = strength
        }
        return [pw, best, total + strength]
    }, ['', 0, 0])

    solutions["part 1"] = grade('', false)[0]
    solutions["part 2"] = grade('', true)[0]

    solutions["part 3"] = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        .split('')
        .reduce((acc, cur) => Math.max(acc, grade(cur, true)[2]), 0)

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
