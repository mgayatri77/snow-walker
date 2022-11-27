import React, { useState } from "react";

type GridProps = {
    x: number;
    y: number;
};

const build2DArray = ( x: number, y:  number, defaultValue? : any) => {
    let matrix: any[][] = [];

    for (let i = 0; i < x; i++){
        let row: any[] = [];
        for (let j = 0; j < y; j++){
            row.push(defaultValue ?? false)
        }
        matrix.push(row)
    }
    return matrix;
}

export const Grid= ({x, y}: GridProps) => {
    const blockXPercent = Math.floor(100/x);
    const buildingXPercent = Math.floor(blockXPercent*0.8);
    const roadXPercent =blockXPercent - buildingXPercent;
    const blockYPercent = Math.floor(100/y);
    const buildingYPercent = Math.floor(blockYPercent*0.8);
    const roadYPercent =blockYPercent - buildingYPercent;

    const [intersectionState, setIntersectionState] = useState(build2DArray(x, y, "white"));

    const building = (x_idx: number, y_idx : number) => (<div key={`building-${x_idx}-${y_idx}`} onClick={() => {}} style={{backgroundColor: "blue",}}/>);
    const road = (idx: number, direction:  string) => (<div key={`road-${idx}-${direction}`} onClick={() => {}} style={{backgroundColor: "white",}}/>);
    const intersection = (x_idx: number, y_idx: number) => (<div key={`intersection-${x_idx}-${y_idx}`} onClick={() => {
        intersectionState[x_idx][y_idx] = intersectionState[x_idx][y_idx] == "white"? "black" : "white";
        setIntersectionState([...intersectionState])
    }} style={{backgroundColor: intersectionState?.[x_idx]?.[y_idx]}}/>);

    let grid : React.ReactNode[]  = []

    for (let i = 0; i < x; i++){
        let rowBuilding: React.ReactNode[] = []
        let rowRoad: React.ReactNode[] = []
        for (let j = 0; j < y; j ++) {
            rowBuilding.push(building(i, j));
            rowRoad.push(road(j + 1, "vertical"))
            if (j !== y - 1) {
                rowBuilding.push(road(j + 1, "horizontal"));
                rowRoad.push(intersection(i + 1, j + 1))
            }
        }
        grid.push(( <div key={`grid-building-row-${i}`} style={{display: "inline-grid",  gridTemplateRows: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`}}> {rowBuilding} </div> ))
        if (i !== x - 1) {
            grid.push(( <div key={`grid-road-row-${i}`} style={{display: "inline-grid", gridTemplateRows: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`}}> {rowRoad} </div> ))
        }
    }



    return (
        <div 
            key="grid"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${x}, ${buildingYPercent}% ${roadYPercent}%)`,
                width: "100vh",
                height: "100vh",
                backgroundColor: "white"
            }
        }>
           {grid}
        </div>
    )
}