'use strict'

const parseInput = input => input.split('\n').reduce(([moves, sushi], line, i) => {
    if (i == 0) return [[line.split('')], []]
    if (i == 1) return [moves, sushi]
    return [moves, [...sushi, line.split(',').map(Number)]]
}, [])

const deltas = [[1, 0], [0, -1], [-1, 0], [0, 1]]
const dirs = '>v<^'
const posHash = (x, y) => `${x}:${y}`

const play = (w, h, x, y, moves, sushi, eaten, grow, body, positions, autophage, chomps) => {
    if (moves.length == 0) return [eaten.length, (body.length + 1) * chomps]
    const [sx, sy] = sushi[0]
    const m = moves.shift()
    const [dx, dy] = deltas[dirs.indexOf(m)]
    const [nx, ny] = [x + dx, y + dy]
    positions.push(posHash(x, y))
    if (positions.length > body.length + 1) positions.shift()
    if (body.length > 0) {
        body.push(posHash(x, y))
        body.shift()
    }
    if (grow && body.includes(posHash(nx, ny))) {
        if (autophage) {
            body = body.slice(body.indexOf(posHash(nx, ny)) + 2)
            chomps++
            while (positions.length > body.length + 1) positions.shift()
        } else {
            return [eaten.length, 0]
        }
    }
    if (nx == sx && ny == sy) {
        eaten.push(sushi.shift())
        body.unshift(positions[0])
    }
    return play(w, h, nx, ny, moves, sushi, eaten, grow, body, positions, autophage, chomps)
}

const step = (moves, sushi) => {
    let x = 0, y = 0, chomps = 0, eaten = [], body = []
    body.push(posHash(x, y))
    for (const m of moves) {
        const [sx, sy] = sushi[0] || [1000, 1000]
        const [dx, dy] = deltas[dirs.indexOf(m)]
        x += dx
        y += dy
        if (x == sx && y == sy) {
            eaten.push(sushi.shift())
        } else {
            body.shift()
            if (body.includes(posHash(x, y))) {
                chomps++
                body = body.slice(body.indexOf(posHash(x, y)) + 2)
            }
        }
        body.push(posHash(x, y))
    }
    return body.length * chomps
}

const part1 = input => {
    const solutions = { "part 1": null, "part 2": null, "part 3": null}
    const [moves, sushi] = parseInput(input)
    const w = moves.length > 1000 ? 30 : 10
    const h = moves.length > 1000 ? 30 : 10

    solutions["part 1"] = play(w, h, 0, 0, moves[0].slice(0, moves[0].length / 2), sushi.slice(0), [], false, [], [], false, 0)[0]
    solutions["part 2"] = play(w, h, 0, 0, moves[0].slice(0), sushi.slice(0), [], true, [], [], false, 0)[0] + 1
    solutions["part 3"] = step(moves[0].slice(0), sushi.slice(0))

    return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
