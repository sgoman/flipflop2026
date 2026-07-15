'use strict'

// const { fourWayDeltas } = require('./utils.js')

const instructionList = [ "ldi", "cpy", "add", "sub", "mul", "mod", "inc", "dec", "jmp", "jez", "jnz" ]

const parseInput = input => {
    return input.trim().split('\n').reduce(([cmds, labels], src) => {
	    switch(src.substring(0, 2)) {
		    case 'ba':
			    const args = src.substring(2).split('ne').map(a => a.length == 0 ? 0 : a.match(/na/g).length)
			    cmds.push({ins: instructionList[args[0]], args: args.slice(1)})
			    break
		    case 'be':
			    const l = src.length == 2 ? 0 : src.match(/na/g).length
			    labels.set(l, cmds.length)
			    break
		    default: console.log("unknown instruction or label:", src)
	    }
	    return [cmds, labels]
    }, [[], new Map()])
}

const compute = (cmds, labels, ic, regs) => {
	let counter = 0
	while(ic < cmds.length) {
		const {ins, args} = cmds[ic]
		switch(ins) {
			case "ldi":
				regs[args[1]] = args[0]
				ic++
				break
			case "cpy":
				regs[args[1]] = regs[args[0]]
				ic++
				break
			case "add":
				regs[args[2]] = regs[args[0]] + regs[args[1]]
				ic++
				break
			case "sub":
				regs[args[2]] = regs[args[0]] - regs[args[1]]
				ic++
				break
			case "mul":
				regs[args[2]] = regs[args[0]] * regs[args[1]]
				ic++
				break
			case "mod":
				regs[args[2]] = regs[args[0]] % regs[args[1]]
				ic++
				break
			case "inc":
				regs[args[0]]++
				ic++
				break
			case "dec":
				regs[args[0]]--
				ic++
				break
			case "jmp":
				ic = labels.get(args[0])
				break
			case "jez":
				ic = regs[args[0]] == 0 ? labels.get(args[1]) : ic + 1
				break
			case "jnz":
				ic = regs[args[0]] != 0 ? labels.get(args[1]) : ic + 1
				break

			default: return "unknown instruction at " + ic + " :" + ins
		}
		counter++
		if (counter > 5e6) break
	}
	return [regs, counter]
}

const part1 = input => {
	const solutions = { "part 1": null, "part 2": null, "part 3": null}
	const [cmds, labels] = parseInput(input)
	console.log(cmds)
	console.log(labels)
	solutions["part 1"] = compute(cmds, labels, 0, new Uint16Array(16))[0][0]
	let total = 0
	for (let r = 0; r < 100; r++) {
		const regs = new Uint16Array(16)
		regs[0] = r
		const [vals, counter] = compute(cmds, labels, 0, regs)
		total += counter>=5e6 ? 1 : 0
	}
	solutions["part 2"] = total
	total = 0
	for (let s = 0; s < 16; s++) {
		console.log({s})
		for (let r = 0; r < 65536; r++) {
			const regs = new Uint16Array(16)
			regs[0] = r
			regs[1] = s
			const [vals, counter] = compute(cmds, labels, 0, regs)
			total += counter>=5e6 ? 1 : 0
		}
	}
	solutions["part 3"] = total
	return solutions
}

const part2 = input => {
    return "The solution to all three parts has to be returned from part1()!"
}

module.exports = { part1, part2 }
