// August 2022
// Rafael Anguiano

// Test Cases on Readme.md

// Constant for Log Style
const LOG = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    // Foreground (text) colors
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    // Background colors
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

// Adding a Method to sort the array once something is added 
class SortedArray extends Array {
    constructor(...args) {
        super(...args)
    }

    add(item) {
        this.push(item)
        this.sort((a, b) => a.cost - b.cost)
    }
}

// Node Class
class Node {

    constructor(state, steps, parent) {
        this.state = state
        this.steps = steps
        this.parent = parent
        
        this.children = this.expand(parent);
        this.heuristic = this.getHeuristic();
        
        this.cost = this.heuristic + this.steps;
    }

    // Look for viable childrens
    expand = (parent) => {
        let blankSpace = this.getPosition(0)
        let availableMoves = new SortedArray();
        // Left
        if(blankSpace !== 0 && blankSpace != 3 && blankSpace != 6) {
            let newLeftState = [...this.state]
            newLeftState[blankSpace] = this.state[blankSpace - 1]
            newLeftState[blankSpace - 1] = 0
            if(newLeftState !== parent.state) {
                availableMoves.add(newLeftState)
            }
        }

        // Right
        if(blankSpace != 2 && blankSpace != 5 && blankSpace != 8) {
            let newRightState = [...this.state]
            newRightState[blankSpace] = this.state[blankSpace + 1]
            newRightState[blankSpace + 1] = 0
            if(newRightState !== parent.state) {
                availableMoves.add(newRightState)
            }
        }

        // Up
        if(blankSpace !== 0 && blankSpace != 1 && blankSpace != 2) {
            let newUpState = [...this.state]
            newUpState[blankSpace] = this.state[blankSpace - 3]
            newUpState[blankSpace - 3] = 0
            if(newUpState !== parent.state) {
                availableMoves.add(newUpState)
            }
        }

        // Down
        if(blankSpace != 6 && blankSpace != 7 && blankSpace != 8) {
            let newDownState = [...this.state]
            newDownState[blankSpace] = this.state[blankSpace + 3]
            newDownState[blankSpace + 3] = 0
            if(newDownState !== parent.state) {
                availableMoves.add(newDownState)
            }
        }

        return availableMoves
    }

    // Getter of the Heuristic
    getHeuristic = () => {
        const solution = [1,2,3,8,0,4,7,6,5]
        let h = 0

        for(let i = 0; i < solution.length; i++) {
            if(this.state[i] !== solution[i]) {
                h++
            }
        }

        return h
    }

    //  Getter of the position of any number in state
    getPosition = (number) => {
        for(let i = 0; i < this.state.length; i++) {
            if(this.state[i] === number) {
                return i
            }
        }
    }

}

// Geting Heuristic (Yes! Again)
const validation = (state) => {

    const solution = [1,2,3,8,0,4,7,6,5]
    let heuristic = 0

    for(let i = 0; i < solution.length; i++) {
        if(state[i] !== solution[i]) {
            heuristic++
        }
    }

    return heuristic
}

// Movement and Solving
const Puzzle8 = (state) => {

    // For Debugging
    console.log(LOG.fg.cyan, `Initial State : ${state}`, LOG.reset)

    // Initializing variables
    let current = new Node([...state], 0, {});
    let visited = new SortedArray()   // Visited
    let nextNodes = new SortedArray() // Next Nodes
    let solutionFound = false

    while(!solutionFound) {

        // For Debugging 
        console.log(`${LOG.fg.green} Current State: ${current.state} ${LOG.reset}`)

        // Adding this node to visited nodes
        visited.add(current);

        // Adding the children nodes to the Queue
        for(let i = 0; i < current.children.length; i++) {
            nextNodes.add(new Node(current.children[i], current.steps + 1, current))
        }

        // Validating if this is my desire solution
        if(validation(current.state) === 0) {
            solutionFound = true
            console.log(`${LOG.fg.red} Last State: ${current.state} ${LOG.reset}`)
            return current
        }

        // Cheking if any of my next Nodes have a better heuristic
        if(current.cost > nextNodes[0].cost) {
            let temp = nextNodes.shift()
            visited.add(current)
            current = temp
            continue;
        }

        // Checking if any of my visited nodes has a better heuristic
        if(current.cost > visited[0].cost) {
            let temp = visited.shift()
            visited.add(current)
            current = temp
            continue;
        }

        // Selecting the best next Node
        current = nextNodes.shift()
    }

    return current;
}

// Recursive function to Print solution
const printSolution = async (node) => {

    // Checking if the node has a property parent
    if(!node.parent){
        return
    }

    // Doing the recursion to get the first node
    printSolution(node.parent)

    // Title
    console.log(`${LOG.fg.magenta} Level: ${node.steps + 1} ${LOG.reset}`)

    // Printing by rows
    let row = []
    for(let i=0; i<node.state.length; i++){
        row.push(node.state[i])
        if(row.length == 3){
            console.log(row)
            row = []
        }
    }

    return
}

// Reciving and processing input
const myArgs = process.argv.slice(2);
const state = myArgs[0].split("")

// Validations of the input
for(let i = 0; i < state.length; i++) {
    state[i] = parseInt(state[i], 10)
    if(state[i] < 0 || 8 < state[i] /* || state[i] == isNaN(state[i]) */){
        console.log("This is not a valid input");
        return 1;
    }
}

if(new Set(state).size != state.length || state.length != 9){
    console.log("This is not a valid input");
    return 1;
}

// Let´s move!
const solution = Puzzle8(state);
printSolution(solution)