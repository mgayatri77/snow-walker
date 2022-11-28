import React, { useState } from "react";
import { Button, Paper, Grid as MUIGrid, LinearProgress } from '@mui/material';

type GridProps = {
    x: number;
    y: number;
    numPlows: number;
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

export const Grid= ({x, y, numPlows}: GridProps) => {
    const blockXPercent = Math.floor(100/x);
    const buildingXPercent = Math.floor(blockXPercent*0.95);
    const roadXPercent =blockXPercent - buildingXPercent;
    const blockYPercent = Math.floor(100/y);
    const buildingYPercent = Math.floor(blockYPercent*0.95);
    const roadYPercent =blockYPercent - buildingYPercent;

    const [intersectionState, setIntersectionState] = useState(build2DArray(x + 1, y + 1, 0));
    const [verticalRoadState, setVerticalRoadState] = useState(build2DArray(x + 1, y + 1, 0));
    const [horizontalRoadState, setHorizontalRoadState] = useState(build2DArray(x+1, y+1, 0));
    const [processedPlows, setProcessedPlows] = useState(0);

    const building = (x_idx: number, y_idx : number) => (<div key={`building-${x_idx}-${y_idx}`} onClick={() => {}} style={{backgroundColor: "blue",}}/>);
    const verticalRoad = (x_idx: number, y_idx : number)  => (<div key={`vertical-road-${x_idx}-${y_idx}}`} 
        onClick={() => {
            verticalRoadState[x_idx][y_idx] ^= 1;
            if (verticalRoadState[x_idx][y_idx] === 1) {
                intersectionState[x_idx][y_idx]++;
                intersectionState[x_idx][y_idx - 1]++;
            } else {
                intersectionState[x_idx][y_idx]--;
                intersectionState[x_idx][y_idx - 1]--;
            }
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
            if (horizontalRoadState[x_idx][y_idx] === 1) {
                intersectionState[x_idx][y_idx]++;
                intersectionState[x_idx - 1][y_idx]++;
            } else {
                intersectionState[x_idx][y_idx]--;
                intersectionState[x_idx - 1][y_idx]--;
            }
            setHorizontalRoadState([...horizontalRoadState])
        }} 
        onDragOver={() => {
            horizontalRoadState[x_idx][y_idx] = 1;
            setHorizontalRoadState([...horizontalRoadState])
        }}
        style={{backgroundColor: horizontalRoadState?.[x_idx]?.[y_idx]? "black" : "white",}}/>);
    const intersection = (x_idx: number, y_idx: number) => (<div key={`intersection-${x_idx}-${y_idx}`} 
        style={{backgroundColor: intersectionState?.[x_idx]?.[y_idx] > 0 ? "black" : "white"}}/>);

    let grid : React.ReactNode[]  = []

    for (let i = 0; i < x; i++){
        let rowBuilding: React.ReactNode[] = []
        let rowRoad: React.ReactNode[] = []
        for (let j = 0; j < y; j++) {
            rowBuilding.push(building(i, j));
            rowRoad.push(verticalRoad(i + 1, j + 1))
            if (j !== y - 1) {
                rowBuilding.push(horizontalRoad(i + 1, j + 1));
                rowRoad.push(intersection(i + 1, j + 1))
            }
        }
        grid.push(( <div key={`grid-building-row-${i}`} style={{display: "inline-grid",  gridTemplateColumns: `repeat(${y}, ${buildingYPercent}% ${roadYPercent}%)`}}> {rowBuilding} </div> ))
        if (i !== x - 1) {
            grid.push(( <div key={`grid-road-row-${i}`} style={{display: "inline-grid", gridTemplateColumns: `repeat(${y}, ${buildingYPercent}% ${roadYPercent}%)`}}> {rowRoad} </div> ))
        }
    }



    return (
         <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                        
                <MUIGrid container spacing={2} style={{padding: "10%"}}>
                    <MUIGrid item xs={4}>
                        Current Plow: {processedPlows + 1}
                    </MUIGrid>
                    <MUIGrid item xs={8}>
                        <LinearProgress variant="determinate" value={100*processedPlows/numPlows} />
                    </MUIGrid>
                    <MUIGrid item xs={12}>
                        <div 
                            key="grid"
                            style={{
                                display: "grid",
                                gridTemplateRows: `repeat(${x}, ${buildingXPercent}% ${roadXPercent}%)`,
                                width: "100%",
                                height: "50vh",
                                backgroundColor: "white"
                            }}
                        >
                            {grid}
                        </div>
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        <Button 
                            onClick={() => {
                                setHorizontalRoadState(build2DArray(x + 1, y + 1, 0));
                                setVerticalRoadState(build2DArray(x + 1, y + 1, 0));
                                setIntersectionState(build2DArray(x + 1, y + 1, 0));
                            }}
                            variant="outlined"
                            style={{width: "100%"}}
                        >
                            Reset
                        </Button>
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        <Button 
                            variant="outlined" 
                            style={{width: "100%"}}
                            onClick={() => {
                                setHorizontalRoadState(build2DArray(x + 1, y + 1, 0));
                                setVerticalRoadState(build2DArray(x + 1, y + 1, 0));
                                setIntersectionState(build2DArray(x + 1, y + 1, 0));
                                setProcessedPlows(processedPlows + 1);
                            }}
                        >
                            Submit
                        </Button>
                    </MUIGrid>
                </MUIGrid>
            </Paper>
        </div>
    )
}