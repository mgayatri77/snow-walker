import React from "react";
import { Button, Paper, Grid as MUIGrid, Alert } from '@mui/material';

import { Grid } from '../Grid'
import { GameConfig, PlayerType } from "../ConfigureGame";

import { Game } from "../../model/Game"

export type ScoreProps = {
    config: GameConfig;
    player1Game: Game;
    player2Game: Game;
    onEnd: () => void;
}

export const Score = ({config, player1Game, player2Game, onEnd}: ScoreProps) => {
    if (config.player1.type !== PlayerType.human) {
        player1Game.makeRandomAIMoves(); 
        player1Game.computeScore(); 
    }
    if (config.player2.type !== PlayerType.human) {
        player2Game.makeRandomAIMoves();
        player2Game.computeScore();  
    }

    const player1Scores = player1Game.getMaxDistances();
    const player2Scores = player2Game.getMaxDistances();

    const winner = () => {
        const score1 = player1Game.getScore();
        const score2 = player2Game.getScore()
        if (score1 === score2){
            const pathsUsed1 = player1Game.getNumPathsUsed();
            const pathsUsed2 = player2Game.getNumPathsUsed();
            
            if (pathsUsed1 === pathsUsed2){
                return "Game ended in a tie :/";
            } else if (pathsUsed1 > pathsUsed2) {
                return `${config.player2.name} wins by tie breaker, with a score of ${score2} and ${pathsUsed2} paths!`;
            } else {
                return `${config.player1.name} wins by tie breaker, with a score of ${score1} and ${pathsUsed1} paths!`;
            }

        } else if (score1 > score2) {
            return `${config.player2.name} wins the game with a score of ${score2}!`;
        } else {
            return `${config.player1.name} wins the game with a score of ${score1}!`;
        }
    }

    return (
         <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <MUIGrid container spacing={2} style={{padding: "10%"}}>
                    <MUIGrid item xs={6} style={{textAlign: 'center'}}>
                        {config.player1.name} Score: {player1Game.getScore()}
                    </MUIGrid>
                    <MUIGrid item xs={6} style={{textAlign: 'center'}}>
                        {config.player2.name} Score: {player2Game.getScore()}
                    </MUIGrid>
                    <MUIGrid item xs={6}>
                        <Grid 
                            x={config?.grid.x}
                            y={config?.grid.y}
                            renderBuilding={(node) =>  (
                                <div 
                                    key={`building-score-player-1-${node.x}-${node.y}`} 
                                    style={{backgroundColor: "#5c82e0", borderRadius: "5%", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center"}}
                                >
                                    <p style={{flex: "0 0 120px", flexDirection: "row"}}>{player1Scores[node.x][node.y]}</p>
                                </div>
                            )}
                            roadStyle={(from, to) =>  {
                                const road = player1Game.getRoad(from, to);
                                if (road?.fixed) {
                                    return{
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f2c43a 10px, #f2c43a 20px), linear-gradient( to bottom, #000000, #000000)'
                                    };
                                } else if (player1Game.getRoad(from, to)?.cleared) {
                                    return {backgroundColor: "red"};
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
                                    return { backgroundColor: "red" };
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
                            renderBuilding={(node) =>  (
                                <div 
                                    key={`building-score-player-2-${node.x}-${node.y}`} 
                                    style={{backgroundColor: "#5c82e0", borderRadius: "5%", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center"}}
                                >
                                    <p style={{flex: "0 0 120px", flexDirection: "row"}}>{player2Scores[node.x][node.y]}</p>
                                </div>
                            )}
                            roadStyle={(from, to) =>  {
                                const road = player2Game.getRoad(from, to);
                                if (road?.fixed) {
                                    return{
                                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #f2c43a 10px, #f2c43a 20px), linear-gradient( to bottom, #000000, #000000)'
                                    };
                                } else if (player2Game.getRoad(from, to)?.cleared) {
                                    return {backgroundColor: "red"};
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
                                    return { backgroundColor: "red" };
                                } else {
                                    return {backgroundColor: "white"}
                                }
                            }}
                        />
                    </MUIGrid>
                    <MUIGrid item xs={12}>
                        <Alert variant="filled">
                            {winner()}
                        </Alert>
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