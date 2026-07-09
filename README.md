FlipFlop 2026 in JavaScript
===========================

These are my solutions to the daily challenges of provided in flipflop.slome.org in plain JavaScript using NodeJS and the NPM module advent-of-code.

Installation
------------

After cloning this repository, run "npm install" and make sure that the aoc file is executable.

If you want to write a days challenge from scratch, issue "./aoc init 1" to generate a boilerplate file for day 1. You can change the boilerplate by editing the file dayTemplate.js.

To run part 1 of the first challenge with your own input, execute "./aoc 1 1 - < input1.txt".

There is a limitation of using the aoc library for flipcode: it does not support a part 3. Therefore, return an object with the three parts in the part 1 function. See the dayTemplate.js.

No Installation
---------------

Most of the solutions can be run on the Advent of Code page for the input data.

- Copy the code for one day, but leave out the first and last line (don't include the 'use strict' and the 'module.exports' lines). If the code has a line that has "require('./utils.js')" near the top, skip that line as well, but remember to copy the referenced functions from utils.js afterwards.
- Paste the code into the developer console in your browser when viewing the puzzle input page for a day.
- Paste the code of any functions that were referenced from utils.js, if any.
- Enter the command "part1(document.body.innerText)" to run the solution for part 1. Replace the 1 with a 2 for part two. Most of the time you will be able to run both parts repeatedly without problems, but sometimes you can only run one part correctly (e.g. if the code relies on a global cache or something like that). You will have to reload the page and copy the code again in that case, only running the part you are interested in.

Example for the second day of 2024:
- copy lines 5 through 23 from day02.js (i.e. all code excluding the lines that contain 'use strict', 'utils.js' and 'module.exports')
- open the page https://adventofcode.com/2024/day/2/input
- hit F12 or whatever shortcut opens the developer tools in your browser
- paste the code into the console tab and hit enter
- copy the code for the function combineConditionally from utils.js
- paste it into the console tab of the developer tools as well
- type "part1(document.body.innerText)" without the quotes into the console tab and hit enter for the solution to part 1 


The challenges
--------------

1. **[Day 1: Coffee Brewing](day01.js)** heating or cooling cups of coffee to a certain target temperature
2. **[Day 2: Lasering Walls](day02.js)** shooting lasers left and right at wall panels in a circle. Sometimes the walls move as well!
3. **[Day 3: Password Competition(day03.js)** calculating password strength
4. **[Day 4: Magic Flowerstalk(day04.js)** fear my botany powers cutting flowers higher than towers!
