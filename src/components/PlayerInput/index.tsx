import { useReducer, useState } from "react";
import { Alert, Button, Paper, Grid as MUIGrid, LinearProgress, Snackbar, Typography } from '@mui/material';

import { Grid } from '../Grid'
import { GridConfig } from "../ConfigureGame";

import { Game } from "../../model/Game"

export type PlayerInputProps = {
    playerName?: string;
    grid: GridConfig;
    numPlows: number;
    game: Game;
    onEnd: () => void;
}

export const PlayerInput = ({playerName, grid, numPlows, game, onEnd}: PlayerInputProps) => {
    const [processedPlows, setProcessedPlows] = useState(1);
    const [alert, setAlert] = useState({ text: '', hasAlert: false });

    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const maxPathData = game.getMaxPathData(); 
    const maxPaths = maxPathData.paths; 
    const maxDistances = maxPathData.distances; 
    
    return (
         <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <MUIGrid container spacing={2} style={{padding: "10%"}}>
                    <MUIGrid item xs={3}>
                        <Typography>Current Score: {game.getScore()}</Typography>
                    </MUIGrid>
                    <MUIGrid item xs={3}>
                        <Typography>Current Player: {playerName}</Typography>
                    </MUIGrid>
                    <MUIGrid item xs={3}>
                        <Typography>Current Plow:  {processedPlows} / {numPlows} </Typography>
                    </MUIGrid>
                    <MUIGrid item xs={3}>
                        <Typography>Road Budget Used:  {game.getNumPathsUsed()} / {game.maxRoads} </Typography>
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
                            renderBuilding={(node) =>  (
                                <div 
                                    key={`building-player-input-${node.x}-${node.y}`} 
                                    style={{backgroundColor: "#5c82e0", borderRadius: "5%", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center"}}
                                    onClick={() => {
                                        console.log(node.x, node.y);
                                        console.log(maxPaths[node.x][node.y]);
                                    }}
                                >
                                    <p style={{flex: "0 0 120px", flexDirection: "row"}}>
                                        <Typography>{maxDistances[node.x][node.y]}</Typography>
                                    </p>
                                </div>
                            )}
                            roadStyle={(from, to) =>  {
                                const road = game.getRoad(from, to);
                                if (road?.fixed) {
                                    return{
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f2c43a 10px, #f2c43a 20px), linear-gradient( to bottom, #000000, #000000)'
                                    };
                                } else if (game.getRoad(from, to)?.cleared) {
                                    return {backgroundColor: game.getRoad(from, to)?.clearedBy === processedPlows ? "black": "#a5a6a8"};
                                } else {
                                    return {backgroundColor: "white"};
                                }
                            }}
                            intersectionStyle={(node) =>  {
                                const roadsLength = game.getRoads(node).filter(r => r.cleared).length;
                                const fixedRoads = game.getRoads(node).filter(r => r.fixed).length;
                                const clearedBy = game.getRoads(node).filter(r => r.clearedBy === processedPlows).length;

                                if (fixedRoads > 0 ) {
                                    return { backgroundColor: "black" };
                                } else if (roadsLength > 0) {
                                    return { backgroundColor: clearedBy > 0 ? "black" : "#a5a6a8" };
                                } else {
                                    return {backgroundColor: "white"}
                                }
                            }}
                            onRoadClick={(from, to,)=> {
                                try {
                                    game.addPlowPath(processedPlows, from, to);
                                    game.computeScore();
                                    setAlert({hasAlert: false, text: ''})
                                } catch (error: any) {
                                    setAlert({hasAlert: true, text: error.message})
                                }
                            }}
                        />
                    </MUIGrid>
                    <MUIGrid item xs={4}>
                        <Button 
                            variant="outlined" 
                            style={{width: "100%"}}
                            disabled={processedPlows <= 1}
                            onClick={() => {
                                game.resetPlowPath(processedPlows);
                                setProcessedPlows(processedPlows - 1);
                            }}
                        >
                            Previous Plow
                        </Button>
                    </MUIGrid>
                    <MUIGrid item xs={4}>
                        <Button 
                            onClick={() => {
                                game.resetPlowPath(processedPlows);
                                forceUpdate();
                            }}
                            variant="outlined"
                            style={{width: "100%"}}
                        >
                            Reset
                        </Button>
                    </MUIGrid>
                    <MUIGrid item xs={4}>
                        <Button 
                            variant="outlined" 
                            style={{width: "100%"}}
                            onClick={() => {
                                if (processedPlows < numPlows)
                                    setProcessedPlows(processedPlows + 1);
                                else
                                    onEnd();
                            }}
                        >
                            {processedPlows < numPlows? 'Next Plow' : 'Submit'}
                        </Button>
                    </MUIGrid>
                </MUIGrid>
            </Paper>
        </div>
    )
}