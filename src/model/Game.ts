export type Node = {
    x: number;
    y: number;
};

export type Road = {
    fixed: boolean;
    cleared: boolean;
    clearedBy?: number;
}

const randomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export class Game {
    roads: { [key: string]: {[key: string]: Road} };
    numPlows: number;

    constructor(gridX: number, gridY: number, numPlows: number, percentCleared : number = .10){
        this.roads = this.buildRoads(gridX, gridY, percentCleared);
        this.numPlows = numPlows;
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
                    currRoads[this.nodeToString({ x: x+1, y })] = {fixed: false, cleared: false};
                if (x - 1 >= 0)
                    currRoads[this.nodeToString({ x: x-1, y })] = {fixed: false, cleared: false};
                if (y + 1 <= gridY)
                    currRoads[this.nodeToString({ x, y: y + 1 })] = {fixed: false, cleared: false};
                if (y - 1 >= 0)
                    currRoads[this.nodeToString({ x, y: y -1 })] = {fixed: false, cleared: false};

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
                const newVal = {fixed: true, cleared: true};
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
            this.roads[this.nodeToString(from)][this.nodeToString(to)] = {fixed: false, cleared: value};
            this.roads[this.nodeToString(to)][this.nodeToString(from)] = {fixed: false, cleared: value};

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
            const newVal = {fixed: false, cleared: !road?.cleared, clearedBy: by};
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

    computeScore() : number {
        //TODO

        return 0;
    }


}