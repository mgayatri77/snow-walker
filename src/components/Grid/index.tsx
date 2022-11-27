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

    const [intersectionState, setIntersectionState] = useState(build2DArray(x, y, 0));
    const [verticalRoadState, setVerticalRoadState] = useState(build2DArray(x, y, 0));
    const [horizontalRoadState, setHorizontalRoadState] = useState(build2DArray(x, y, 0));

    const building = (x_idx: number, y_idx : number) => (<div key={`building-${x_idx}-${y_idx}`} onClick={() => {}} style={{backgroundColor: "blue",}}/>);
    const verticalRoad = (x_idx: number, y_idx : number)  => (<div key={`vertical-road-${x_idx}-${y_idx}}`} 
        onClick={() => {
            verticalRoadState[x_idx][y_idx] ^= 1;
            setVerticalRoadState([...verticalRoadState])
        }}
        onDragOver={() => {
            verticalRoadState[x_idx][y_idx] = 1;
            setVerticalRoadState([...verticalRoadState])
        }}
        style={{backgroundColor:  verticalRoadState?.[x_idx]?.[y_idx]? "black" : "white",}}/>);
    const horizontalRoad = (x_idx: number, y_idx : number)  => (<div key={`horizontal-road-${x_idx}-${y_idx}}`} 
        onClick={() => {
            horizontalRoadState[x_idx][y_idx] ^= 1;
            setHorizontalRoadState([...horizontalRoadState])
        }} 
        onDragOver={() => {
            horizontalRoadState[x_idx][y_idx] = 1;
            setHorizontalRoadState([...horizontalRoadState])
        }}
        style={{backgroundColor: horizontalRoadState?.[x_idx]?.[y_idx]? "black" : "white",}}/>);
    const intersection = (x_idx: number, y_idx: number) => (<div key={`intersection-${x_idx}-${y_idx}`} 
        onClick={() => {
            intersectionState[x_idx][y_idx] ^= 1;
            setIntersectionState([...intersectionState])
        }}
        onDragOver={() => {
            intersectionState[x_idx][y_idx] = 1;
            setIntersectionState([...intersectionState])
        }}
        style={{backgroundColor: intersectionState?.[x_idx]?.[y_idx]? "black" : "white"}}/>);

    let grid : React.ReactNode[]  = []

    for (let i = 0; i < x; i++){
        let rowBuilding: React.ReactNode[] = []
        let rowRoad: React.ReactNode[] = []
        for (let j = 0; j < y; j ++) {
            rowBuilding.push(building(i, j));
            rowRoad.push(verticalRoad(i + 1, j + 1))
            if (j !== y - 1) {
                rowBuilding.push(horizontalRoad(i + 1, j + 1));
                rowRoad.push(intersection(i + 1, j + 1))
            }
        }
        grid.push(( <div key={`grid-building-row-${i}`} style={{display: "inline-grid",  gridTemplateRows: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`}}> {rowBuilding} </div> ))
        if (i !== x - 1) {
            grid.push(( <div key={`grid-road-row-${i}`} style={{display: "inline-grid", gridTemplateRows: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`}}> {rowRoad} </div> ))
        }
    }



    return (
        <>
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
            <button onClick={() => {
                setHorizontalRoadState(build2DArray(x, y, 0));
                setVerticalRoadState(build2DArray(x, y, 0));
                setIntersectionState(build2DArray(x, y, 0));
            }}> Reset </button>
        </>
    )
}