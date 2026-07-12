'use strict'

const parseInput = input => input.split('\n').reduce(([moves, sushi], line, i) => {
    if (i == 0) return [line.split(''), []]
    if (i == 1) return [moves, sushi]
    return [moves, [...sushi, line.split(',').map(Number)]]
}, [])

const deltas = [[1, 0], [0, -1], [-1, 0], [0, 1]]
const posHash = (x, y) => `${x}:${y}`

const step = (moves, sushi, part) => {
    let x = 0, y = 0, chomps = 0, eaten = [], body = []
    body.push(posHash(x, y))
    if (part == 1) moves = moves.slice(0, moves.length / 2)
    for (const m of moves) {
        const [dx, dy] = deltas['>v<^'.indexOf(m)]
        x += dx
        y += dy
        const [sx, sy] = sushi[0] || [1000, 1000], h = posHash(x, y)
        if (x == sx && y == sy) {
            eaten.push(sushi.shift())
        } else {
            body.shift()
            if (body.includes(h)) {
                if (part == 2) return body.length + 1
                chomps++
                body = body.slice(body.indexOf(h) + 2)
            }
        }
        body.push(h)
    }
    return part == 1 ? eaten.length : body.length * chomps
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const [moves, sushi] = parseInput(input)

    for (let p = 1; p <= 3; p++)
        solutions[`part ${p}`] = step(moves.slice(0), sushi.slice(0), p)

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
