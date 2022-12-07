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

    constructor(gridX: number, gridY: number, numPlows: number, percentCleared : number = .10){
        this.gridX = gridX;
        this.gridY = gridY;
        this.roads = this.buildRoads(gridX, gridY, percentCleared);
        this.numPlows = numPlows;
        this.plowPaths = {};
    };

    private nodeToString(node: Node) : string {
        return `x:${node.x},y:${node.y}`;
    }

    buildRoads(gridX: number, gridY: number, percentCleared: number) : { [key: string]: {[key: string]: Road} }{
        let roads : { [key: string]: {[key: string]: Road} } = {};
        
        for (let x = 0; x < gridX + 1; x++){
            for (let y = 0; y < gridY + 1; y++){
                let currRoads : {[key: string]: Road} = {};
                if (x+1 <= gridX)
                    currRoads[this.nodeToString({ x: x+1, y })] = {from: {x, y}, to: { x: x+1, y }, fixed: false, cleared: false};
                if (x - 1 >= 0)
                    currRoads[this.nodeToString({ x: x-1, y })] = {from: {x, y}, to: { x: x-1, y  },fixed: false, cleared: false};
                if (y + 1 <= gridY)
                    currRoads[this.nodeToString({ x, y: y + 1 })] = {from: {x, y}, to: { x, y: y + 1 },fixed: false, cleared: false};
                if (y - 1 >= 0)
                    currRoads[this.nodeToString({ x, y: y -1 })] = {from: {x, y}, to: { x, y: y -1 },fixed: false, cleared: false};

                roads[this.nodeToString({ x, y })] = currRoads;
            }
        }

        percentCleared = percentCleared >= 1.0? 0.9 : percentCleared;
        percentCleared = percentCleared < 0.0? 0.0 : percentCleared;

        let i = 0;
        while (i < gridX*gridY*percentCleared){
            const startX = randomInt(gridX);
            const startY = randomInt(gridX);

            const deltaX = (randomInt(2)-1);
            const deltaY = (randomInt(2)-1);

            if (
                (deltaX === 0 && deltaY === 0) ||
                (deltaX === 1 && deltaY === 1) ||
                (deltaX === 1 && deltaY === -1) ||
                (deltaX === -1 && deltaY === 1) ||
                (deltaX === -1 && deltaY === -1) ||
                (startX + deltaX > gridX) ||
                (startX + deltaX < 0) ||
                (startY + deltaY > gridX) ||
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

    setRoad(from: Node, to: Node, value: boolean = true) : boolean {
        let road = this.roads?.[this.nodeToString(from)]?.[this.nodeToString(to)];
        
        if (!road?.fixed){
            this.roads[this.nodeToString(from)][this.nodeToString(to)] = {...road, fixed: false, cleared: value};
            this.roads[this.nodeToString(to)][this.nodeToString(from)] = {...road, fixed: false, cleared: value};

            //TODO check that road is valid move

            return true;
        }

        return false;
        
    }

    flipRoad(from: Node, to: Node, by?: number) : boolean {
        let road = this.roads?.[this.nodeToString(from)]?.[this.nodeToString(to)];
        
        const fromStr = this.nodeToString(from);
        const toStr = this.nodeToString(to);
        
        if (!road?.fixed){
            const newVal = {from, to, fixed: false, cleared: !road?.cleared, clearedBy: !road?.cleared? by : undefined};
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

            //TODO check that road is valid move
            return true;
        }

        return false;
        
    }

    getRoad(from: Node, to: Node) : Road | undefined {
        return this.roads?.[this.nodeToString(from)]?.[this.nodeToString(to)];
    }

    getRoads(node: Node) : Road[] {
        return Object.values(this.roads?.[this.nodeToString(node)] ?? {});
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

    submitPlowPath(plowId : number) {
        const startingNode = this.getPlowStartNode(plowId);
        console.log(startingNode);
        if (startingNode === undefined){
            throw new Error('no starting node found');
        }

        const buildPath = (node: Node, tail : Node[]) : Node[] => {
            for (const nxt of Object.keys(this.roads[this.nodeToString(node)])){
                const road = this.roads[this.nodeToString(node)][nxt];
                if (road.clearedBy === plowId){
                    return buildPath(road.to, [...tail, road.to]);
                }
            }
            return tail;
        }

        this.plowPaths[plowId] = buildPath(startingNode, []);

        //Check if valid
    }

    addPlowPath(plowId: number, from: Node, to: Node) : boolean | string {
        let road = this.roads?.[this.nodeToString(from)]?.[this.nodeToString(to)];
        
        const fromStr = this.nodeToString(from);
        const toStr = this.nodeToString(to);
        
        if (!road?.fixed){
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

            //TODO check that road is valid move
            return true;
        }

        return false;

       

        return false;
    }

    computeScore() : number {
        //TODO

        return 0;
    }


}