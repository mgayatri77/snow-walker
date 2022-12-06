import React, { useReducer, useState } from "react";
import { Button, Paper, Grid as MUIGrid, LinearProgress } from '@mui/material';

import { Grid } from '../Grid'
import { GridConfig } from "../ConfigureGame";

import { Game } from "../../model/Game"

export type PlayerInputProps = {
    playerName?: string;
    grid: GridConfig;
    numPlows: number;
    game: Game
}

export const PlayerInput = ({playerName, grid, numPlows, game}: PlayerInputProps) => {
    const [processedPlows, setProcessedPlows] = useState(0);
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    return (
         <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <MUIGrid container spacing={2} style={{padding: "10%"}}>
                    <MUIGrid item xs={6}>
                        Current Player: {playerName}
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        Current Plow: {processedPlows + 1}
                    </MUIGrid>
                    <MUIGrid item xs={12}>
                        <LinearProgress variant="determinate" value={100*processedPlows/numPlows} />
                    </MUIGrid>
                    <MUIGrid item xs={12}>
                        <Grid 
                            x={grid.x}
                            y={grid.y}
                            buildingStyle={(node) =>  ({backgroundColor: "blue"})}
                            roadStyle={(from, to) =>  ({backgroundColor: game.getRoad(from, to)?.cleared ? "black": "white"})}
                            intersectionStyle={(node) =>  {
                                const  roadsLength = game.getRoads(node).filter(r => r.cleared).length;
                                return {backgroundColor: roadsLength > 0 ? "black": "white"}
                            }}
                            onRoadClick={(from, to,)=> {
                                game.flipRoad(from, to, processedPlows);
                                forceUpdate();
                            }}
                        />
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        <Button 
                            onClick={() => {}}
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
                            onClick={() => {setProcessedPlows(processedPlows + 1);}}
                        >
                            Next
                        </Button>
                    </MUIGrid>
                </MUIGrid>
            </Paper>
        </div>
    )
}