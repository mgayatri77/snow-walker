export type Node = {
    x: number;
    y: number;
};

export type Road = {
    from: Node,
    to: Node,
    fixed: boolean;
    cleared: boolean;
    clearedBy?: number;
}

const randomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export class Game {
    gridX : number;
    gridY : number;
    roads: { [key: string]: {[key: string]: Road} };
    plowPaths: { [key: number]: Node[] };
    numPlows: number;
    maxRoads: number;
    score: number; 

    constructor(gridX: number, gridY: number, numPlows: number, maxRoads: number, percentCleared : number = .10){
        this.gridX = gridX;
        this.gridY = gridY;
        this.roads = this.buildRoads(percentCleared);
        this.numPlows = numPlows;
        this.maxRoads = maxRoads;
        this.plowPaths = {};
        this.score = Infinity;             
    };

    private nodeToString(node: Node) : string {
        return `x:${node.x},y:${node.y}`;
    }

    private isValidNode(node: Node) : boolean { 
        return node.x >= 0 && node.y >= 0 && node.x <= this.gridX && node.y <= this.gridY; 
    }

    private isValidBuilding(x: number, y: number) : boolean { 
        return x >= 0 && y >= 0 && x < this.gridX && y < this.gridY; 
    }

    buildRoads(percentCleared: number) : { [key: string]: {[key: string]: Road} }{
        let roads : { [key: string]: {[key: string]: Road} } = {};
        
        for (let x = 0; x < this.gridX + 1; x++){
            for (let y = 0; y < this.gridY + 1; y++){
                let currRoads : {[key: string]: Road} = {};
                if (x+1 <= this.gridX)
                    currRoads[this.nodeToString({ x: x+1, y })] = {from: {x, y}, to: { x: x+1, y }, fixed: false, cleared: false};
                if (x - 1 >= 0)
                    currRoads[this.nodeToString({ x: x-1, y })] = {from: {x, y}, to: { x: x-1, y  },fixed: false, cleared: false};
                if (y + 1 <= this.gridY)
                    currRoads[this.nodeToString({ x, y: y + 1 })] = {from: {x, y}, to: { x, y: y + 1 },fixed: false, cleared: false};
                if (y - 1 >= 0)
                    currRoads[this.nodeToString({ x, y: y -1 })] = {from: {x, y}, to: { x, y: y -1 },fixed: false, cleared: false};

                roads[this.nodeToString({ x, y })] = currRoads;
            }
        }

        percentCleared = percentCleared >= 1.0? 0.9 : percentCleared;
        percentCleared = percentCleared < 0.0? 0.0 : percentCleared;

        let i = 0;
        while (i < this.gridX*this.gridY*percentCleared){
            const startX = randomInt(this.gridX);
            const startY = randomInt(this.gridY);

            const deltaX = (randomInt(2)-1);
            const deltaY = (randomInt(2)-1);

            if (
                (deltaX === 0 && deltaY === 0) ||
                (deltaX === 1 && deltaY === 1) ||
                (deltaX === 1 && deltaY === -1) ||
                (deltaX === -1 && deltaY === 1) ||
                (deltaX === -1 && deltaY === -1) ||
                (startX + deltaX > this.gridX) ||
                (startX + deltaX < 0) ||
                (startY + deltaY > this.gridY) ||
                (startY + deltaY < 0)
            )
                continue;

            let endX = startX + deltaX;
            let endY = startY + deltaY;

            const fromStr = this.nodeToString({x: startX, y: startY});
            const toStr = this.nodeToString({x: endX, y: endY});

            if (roads[this.nodeToString({ x: startX, y: startY})]?.[this.nodeToString({ x: endX, y: endY })]?.cleared === true) {
                continue
            } else {
                const newVal = {
                    from: {x: startX, y: startY},
                    to: {x: endX, y: endY},
                    fixed: true,
                    cleared: true
                };
                roads = {
                    ...roads,
                    [fromStr]: {
                        ...roads[fromStr],
                        [toStr]: newVal
                    },
                    [toStr]: {
                        ...roads[toStr],
                        [fromStr]: newVal
                    }
                };
                i++;
            }
        }
        return roads;
    }
    
    getCorners(x: number, y: number) : number[][] {
        return [[x,y],[x+1,y],[x,y+1],[x+1,y+1]];
    }

    getBuildingsFromCorner(x: number, y: number) : number[][] {
        return [[x,y],[x-1,y],[x,y-1],[x-1,y-1]]; 
    }

    getRoad(from: Node, to: Node) : Road | undefined {
        return this.roads?.[this.nodeToString(from)]?.[this.nodeToString(to)];
    }

    getRoads(node: Node) : Road[] {
        return Object.values(this.roads?.[this.nodeToString(node)] ?? {});
    }

    hasPlowedRoad(node: Node) : boolean {
        let currRoads: Road[] = this.getRoads(node); 
        for (let i = 0; i < currRoads.length; i++) {
            if (currRoads[i].cleared || currRoads[i].fixed) {
                return true; 
            }
        }
        return false;
    }

    getPlowStartNode(plowId: number) : Node | undefined {
        //Check top/bottom edge for plow start
        for (let i = 1; i < this.gridX; i++) {
            const fromTopStr = this.nodeToString({x: i, y: 0});
            const toTopStr = this.nodeToString({x: i, y: 1});

            const fromBottomStr = this.nodeToString({x: i, y: this.gridY});
            const toBottompStr = this.nodeToString({x: i, y: this.gridY - 1});

            if (this.roads[fromTopStr][toTopStr].clearedBy === plowId){
                return {x: i, y: 0};
            }
            if (this.roads[fromBottomStr][toBottompStr].clearedBy === plowId){
                return {x: i, y: this.gridY};
            }
        }

        //Check left/right edge for plow start
        for (let i = 0; i < this.gridY; i++) {
            const fromLeftStr = this.nodeToString({x: 0, y: i});
            const toLeftStr = this.nodeToString({x: 1, y: i});

            const fromRightStr = this.nodeToString({x: this.gridX, y: i});
            const toRightpStr = this.nodeToString({x: this.gridX - 1, y: i});

            if (this.roads[fromLeftStr][toLeftStr].clearedBy === plowId){
                return {x: 0, y: i};
            }
            if (this.roads[fromRightStr][toRightpStr].clearedBy === plowId){
                return {x: this.gridX, y: i};
            }
        }

        return undefined
    }

    addPlowPath(plowId: number, from: Node, to: Node) : boolean | string {
        const currNumRoads = Object.values(this.plowPaths).reduce((acc, path) => acc + path.length - 1, 0);

        if (currNumRoads === this.maxRoads){
            throw new Error("Maximum roads reched!");
        } 

        let road = this.roads?.[this.nodeToString(from)]?.[this.nodeToString(to)];
        
        const fromStr = this.nodeToString(from);
        const toStr = this.nodeToString(to);
        
        if ((road?.clearedBy !== undefined && road.clearedBy !== plowId) || road?.fixed){
            throw new Error("Path has already been cleared!");
        } else if (!road?.fixed){
            const newState = !road?.cleared;
            const newVal = {from, to, fixed: false, cleared: newState, clearedBy: newState? plowId : undefined};
            const currPath = this.plowPaths[plowId] ?? [];

            if (currPath.length <= 1 && newState){
                //Check if starting in edge
                if (from.x === 0 || from.y === 0) {
                    this.plowPaths[plowId] = [from, to];
                } else if (to.x === this.gridX || to.y === this.gridY) {
                    this.plowPaths[plowId] = [to, from];
                } else {
                    console.log(from, to, this.gridX, this.gridY)
                    throw new Error("Path must start from the edge of the grid!");
                }
            } else if (newState) {
                if (from.x === currPath.at(-1)?.x && from.y === currPath.at(-1)?.y){
                    this.plowPaths[plowId] = [...currPath, to];
                } else if (to.x === currPath.at(-1)?.x && to.y === currPath.at(-1)?.y){
                    this.plowPaths[plowId] = [...currPath, from];
                } else {
                    throw new Error("New road must be connected to current path!");
                }
            } else {
                if (from.x === currPath.at(-1)?.x && from.y === currPath.at(-1)?.y){
                    currPath.pop();
                    this.plowPaths[plowId] = currPath;
                } else if (to.x === currPath.at(-1)?.x && to.y === currPath.at(-1)?.y){
                    currPath.pop();
                    this.plowPaths[plowId] = currPath;
                } else {
                    throw new Error("Can only disconect last road!");
                }
            }

            this.roads = {
                ...this.roads,
                [fromStr]: {
                    ...this.roads[fromStr],
                    [toStr]: newVal
                },
                [toStr]: {
                    ...this.roads[toStr],
                    [fromStr]: newVal
                }
            }
            this.computeScore();
            return true;
        }
        return false;
    }

    resetPlowPath(plowId: number) {
        const currPath = this.plowPaths[plowId] ?? [];

        for (let fromIdx = 0; fromIdx <= currPath.length - 2; fromIdx++){
            const from = currPath[fromIdx];
            const to = currPath[fromIdx + 1];
            const fromStr = this.nodeToString(from);
            const toStr = this.nodeToString(to);

            const newVal = {from, to, fixed: false, cleared: false, clearedBy: undefined};

            this.roads = {
                ...this.roads,
                [fromStr]: {
                    ...this.roads[fromStr],
                    [toStr]: newVal
                },
                [toStr]: {
                    ...this.roads[toStr],
                    [fromStr]: newVal
                }
            }
        }

        this.plowPaths[plowId] = [];
    }

    // returns current score
    getScore() : number {
        return this.score; 
    }

    // Score computed with as max distance 
    // travelled to get to adjacent building 
    computeScore() {
        if (!this.areBuildingsConnected()) {
            // all buildings not connected, so return 0
            this.score = Infinity;
        }
        else {
            this.score = this.getMaxDistance();
        }
    }

    areBuildingsConnected() : boolean {
        // run BFS from top left building
        let distances: number[][] = this.runBfs(0, 0, Infinity);   

        // check if every building was visited (distance set to < Infinity)
        let infiniteDistance = distances.some(row => row.includes(Infinity)); 
        return (infiniteDistance === false);
    }

    getMaxDistances() : number[][] {
        let maxDistances: number[][] = Array.from({length: this.gridX}, () =>
            Array.from({length: this.gridY}, () => 0)
        );
        
        for (let i = 0; i < this.gridX; ++i) {
            for (let j = 0; j < this.gridY; ++j) {
                // run BFS from Building at i, j
                let distances = this.runBfs(i, j, Infinity);
                let dirs = [[-1,0],[0,-1],[1,0],[0,1]]
                // loop over adjacent buildings
                for (let d = 0; d < dirs.length; ++d) {
                    let x = i + dirs[d][0]; 
                    let y = j + dirs[d][1]; 
                    // update max distance to adjacent building if needed
                    if (this.isValidBuilding(x, y)) {
                        maxDistances[i][j] = Math.max(maxDistances[i][j], distances[x][y]);
                    }
                }
            }
        }

        return maxDistances;
    }

    getMaxDistance() : number {
        let maxDistance: number = 0; 
        for (let i = 0; i < this.gridX; ++i) {
            for (let j = 0; j < this.gridY; ++j) {
                // run BFS from Building at i, j
                let distances = this.runBfs(i, j, 0);
                let dirs = [[-1,0],[0,-1],[1,0],[0,1]]
                // loop over adjacent buildings
                for (let d = 0; d < dirs.length; ++d) {
                    let x = i + dirs[d][0]; 
                    let y = j + dirs[d][1]; 
                    // update max distance to adjacent building if needed
                    if (this.isValidBuilding(x, y)) {
                        maxDistance = Math.max(maxDistance, distances[x][y]);
                    }
                }
            }
        }
        return maxDistance;  
    }

    runBfs(i: number, j: number, init_dist: number) : number[][] {
        // data structures to run BFS
        let queue: number[][] = []; 
        let visited: boolean[][] = Array.from({length: this.gridX}, () =>
            Array.from({length: this.gridY}, () => false)
        );
        let distances: number[][] = Array.from({length: this.gridX}, () =>
            Array.from({length: this.gridY}, () => init_dist)
        );

        // push source to queue
        queue.push([i, j]); 
        visited[i][j] = true;
        distances[i][j] = 0; 

        // run while nodes present in queue
        while (queue.length > 0) {
            // fetch next buildings and compute corners
            let next: number[] = queue.shift()!; 
            let corners = this.getCorners(next[0], next[1]);
            
            // get connected buildings
            for (let c = 0; c < corners.length; c++) {
                let node = {x: corners[c][0], y: corners[c][1]}
                if (this.isValidNode(node) && this.hasPlowedRoad(node)) {
                    let buildings: number[][] = this.getBuildingsFromCorner(corners[c][0], corners[c][1]);
                    // add connected buildings to queue
                    for (let b = 0; b < buildings.length; b++) {
                        let bx = buildings[b][0]; 
                        let by = buildings[b][1];
                        if (this.isValidBuilding(bx, by) && !visited[bx][by]) {
                            visited[bx][by] = true;
                            queue.push([bx, by]);
                            if (next[0] === i && next[1] === j) {
                                distances[bx][by] = 0; 
                            } else {
                                distances[bx][by] = distances[next[0]][next[1]] + 1; 
                            } 
                        }
                    }
                }
            }
        }
        return distances; 
    }
}