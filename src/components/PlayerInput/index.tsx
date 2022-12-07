import React, { useReducer, useState } from "react";
import { Alert, Button, Paper, Grid as MUIGrid, LinearProgress, Snackbar } from '@mui/material';

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
    const [alert, setAlert] = useState({ text: '', hasAlert: false });

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
                        <Snackbar open={alert.hasAlert} autoHideDuration={6000} onClose={() =>{}}>
                            <Alert variant="filled" severity="error" style={{width: "100%"}}>
                                {alert.text}
                            </Alert>
                        </Snackbar>
                    </MUIGrid>
                    <MUIGrid item xs={12}>
                        <Grid 
                            x={grid.x}
                            y={grid.y}
                            buildingStyle={(node) =>  ({backgroundColor: "#5c82e0", borderRadius: "5%"})}
                            roadStyle={(from, to) =>  {
                                const road = game.getRoad(from, to);
                                if (road?.fixed) {
                                    return{
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f2c43a 10px, #f2c43a 20px), linear-gradient( to bottom, #000000, #000000)'
                                    };
                                } else {
                                    return {backgroundColor: game.getRoad(from, to)?.cleared ? "black": "white"};
                                }
                            }}
                            intersectionStyle={(node) =>  {
                                const roadsLength = game.getRoads(node).filter(r => r.cleared).length;
                                const fixedRoads = game.getRoads(node).filter(r => r.fixed).length;

                                if (fixedRoads > 0 || roadsLength > 0) {
                                    return { backgroundColor: "black" };
                                } else {
                                    return {backgroundColor: "white"}
                                }
                            }}
                            onRoadClick={(from, to,)=> {
                                try {
                                    game.addPlowPath(processedPlows, from, to);
                                    setAlert({hasAlert: false, text: ''})
                                } catch (error: any) {
                                    setAlert({hasAlert: true, text: error.message})
                                }
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
                            disabled={processedPlows === numPlows}
                            onClick={() => {
                                setProcessedPlows(processedPlows + 1);
                            }}
                        >
                            Next
                        </Button>
                    </MUIGrid>
                </MUIGrid>
            </Paper>
        </div>
    )
}