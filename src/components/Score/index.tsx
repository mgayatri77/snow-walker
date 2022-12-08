import React, { useReducer, useState } from "react";
import { Alert, Button, Paper, Grid as MUIGrid, LinearProgress, Snackbar } from '@mui/material';

import { Grid } from '../Grid'
import { GameConfig, GridConfig, PlayerType } from "../ConfigureGame";

import { Game } from "../../model/Game"
import { padding } from "@mui/system";

export type ScoreProps = {
    config: GameConfig;
    player1Game: Game;
    player2Game: Game;
    onEnd: () => void;
}

export const Score = ({config, player1Game, player2Game, onEnd}: ScoreProps) => {

    return (
         <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <MUIGrid container spacing={2} style={{padding: "10%"}}>
                    <MUIGrid item xs={6} style={{textAlign: 'center'}}>
                        {config.player1.type == PlayerType.human? config.player1.name : config.player1.type} Score: {player1Game.getScore()} {/*// player1Game.getScore()*/}
                    </MUIGrid>
                    <MUIGrid item xs={6} style={{textAlign: 'center'}}>
                        {config.player2.type == PlayerType.human? config.player2.name : config.player2.type} Score: {player2Game.getScore()} {/*// player1Game.getScore()*/}
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        <Grid 
                            x={config?.grid.x}
                            y={config?.grid.y}
                            buildingStyle={(node) =>  ({backgroundColor: "#5c82e0", borderRadius: "5%"})}
                            roadStyle={(from, to) =>  {
                                const road = player1Game.getRoad(from, to);
                                if (road?.fixed) {
                                    return{
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f2c43a 10px, #f2c43a 20px), linear-gradient( to bottom, #000000, #000000)'
                                    };
                                } else if (player1Game.getRoad(from, to)?.cleared) {
                                    return {backgroundColor: "#a5a6a8"};
                                } else {
                                    return {backgroundColor: "white"};
                                }
                            }}
                            intersectionStyle={(node) =>  {
                                const roadsLength = player1Game.getRoads(node).filter(r => r.cleared).length;
                                const fixedRoads = player1Game.getRoads(node).filter(r => r.fixed).length;

                                if (fixedRoads > 0 ) {
                                    return { backgroundColor: "black" };
                                } else if (roadsLength > 0) {
                                    return { backgroundColor: "#a5a6a8" };
                                } else {
                                    return {backgroundColor: "white"}
                                }
                            }}
                        />
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        <Grid 
                            x={config?.grid.x}
                            y={config?.grid.y}
                            buildingStyle={(node) =>  ({backgroundColor: "#5c82e0", borderRadius: "5%"})}
                            roadStyle={(from, to) =>  {
                                const road = player2Game.getRoad(from, to);
                                if (road?.fixed) {
                                    return{
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f2c43a 10px, #f2c43a 20px), linear-gradient( to bottom, #000000, #000000)'
                                    };
                                } else if (player2Game.getRoad(from, to)?.cleared) {
                                    return {backgroundColor: "#a5a6a8"};
                                } else {
                                    return {backgroundColor: "white"};
                                }
                            }}
                            intersectionStyle={(node) =>  {
                                const roadsLength = player2Game.getRoads(node).filter(r => r.cleared).length;
                                const fixedRoads = player2Game.getRoads(node).filter(r => r.fixed).length;

                                if (fixedRoads > 0 ) {
                                    return { backgroundColor: "black" };
                                } else if (roadsLength > 0) {
                                    return { backgroundColor: "#a5a6a8" };
                                } else {
                                    return {backgroundColor: "white"}
                                }
                            }}
                        />
                    </MUIGrid>
                    <MUIGrid item xs={12}>
                        <Button variant="outlined" onClick={() => onEnd()} style={{width:"100%"}}>
                            Restart
                        </Button>
                    </MUIGrid>
                </MUIGrid>
            </Paper>
        </div>
    )
}