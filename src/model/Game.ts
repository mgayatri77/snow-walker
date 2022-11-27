import { randomInt } from "crypto";

type Node = {
    x: number;
    y: number;
};

type Road = {
    fixed: boolean;
    cleared: ( 0 | 1);
}

export class Game {
    roads: Map<Node, Map<Node, Road>>;
    numPlows: number;

    constructor(gridX: number, gridY: number, numPlows: number, percentCleared : number = .10){
        this.roads = this.buildRoads(gridX, gridY, percentCleared);
        this.numPlows = numPlows;
    };

    buildRoads = (gridX: number, gridY: number, percentCleared: number) : Map<Node, Map<Node, Road>> => {
        let roads : Map<Node, Map<Node, Road>> = new Map<Node, Map<Node, Road>>()
        
        for (let x = 0; x < gridX; x++){
            for (let y = 0; y < gridY; y++){
                let currRoads : Map<Node, Road> = new Map<Node, Road>();
                if (x+1 < gridX)
                    currRoads.set({ x: x+1, y }, {fixed: false, cleared: 0});
                if (x - 1 > 0)
                    currRoads.set({ x: x-1, y }, {fixed: false, cleared: 0});
                if (y + 1 > gridY)
                    currRoads.set({ x, y: y + 1 }, {fixed: false, cleared: 0});
                if (y - 1 < 0)
                    currRoads.set({ x, y: y -1 }, {fixed: false, cleared: 0});

                roads.set({ x, y }, currRoads);
            }
        }

        percentCleared = percentCleared >= 1.0? 0.9 : percentCleared;
        percentCleared = percentCleared < 0.0? 0.0 : percentCleared;

        let i = 0;
        while (i < gridX*gridY*percentCleared){
            let startX = randomInt(gridX);
            let endX = randomInt(gridX);
            let startY = randomInt(gridY);
            let endY = randomInt(gridY);

            if (roads.get({ x: startX, y: startY})?.get({ x: endX, y: endY })?.cleared === 1) {
                continue
            } else {
                roads.get({ x: startX, y: startY})?.set({ x: endX, y: endY }, {fixed: true, cleared: 1});
                roads.get({ x: endX, y: endY})?.set({ x: startX, y: startX }, {fixed: true, cleared: 1});
                i++;
            }
        }
        return roads;
    }

    setRoad = (from: Node, to: Node, value: (0 | 1) = 1) : boolean => {
        let r1 = this.roads.get(from)?.get(to);
        
        if (!r1?.fixed && r1?.cleared !== value){
            this.roads.get(from)?.set(to, {fixed: false, cleared: value});
            this.roads.get(to)?.set(from, {fixed: false, cleared: value});

            //TODO check that road is valid move

            return true;
        }

        return false;
        
    }

    computeScore = () : number => {
        //TODO

        return 0;
    }


}