import React from "react";
import { Button, Paper, Grid as MUIGrid, Alert, Typography } from '@mui/material';

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

    const player1MaxPathData = player1Game.getMaxPathData(); 
    const player1Scores = player1MaxPathData.distances; 
    const player2MaxPathData = player2Game.getMaxPathData(); 
    const player2Scores = player2MaxPathData.distances; 

    const winner = () => {
        const score1 = player1Game.getScore();
        const score2 = player2Game.getScore()
        if (score1 === score2){
            if (score1 === Infinity || score2 === Infinity) {
                return "Both scores are Infinity, Game ends in a tie :/";
            }
            const sumScores1 = player1Scores
                                .reduce(function(a,b) {return a.concat(b)}) // flatten array
                                .reduce(function(a,b) {return a + b}); 
            const sumScores2 = player2Scores
                                .reduce(function(a,b) {return a.concat(b)}) // flatten array
                                .reduce(function(a,b) {return a + b});
            
            if (sumScores1 === sumScores2) {
                const pathsUsed1 = player1Game.getNumPathsUsed();
                const pathsUsed2 = player2Game.getNumPathsUsed();
                if (pathsUsed1 === pathsUsed2){
                    return "Game ends in a tie :/";
                } else if (pathsUsed1 > pathsUsed2) {
                    return `${config.player2.name} wins by tie breaker, with Overall score = ${score2}, Sum of scores = ${sumScores1} and ${pathsUsed2} Roads Plowed!`;
                } else {
                    return `${config.player1.name} wins by tie breaker, with Overall score = ${score1}, Sum of scores = ${sumScores2} and ${pathsUsed1} Roads Plowed!`;
                }    
            }
            else if (sumScores1 > sumScores2) {
                return `${config.player2.name} wins by tie breaker, with Overall score = ${score2} and Sum of scores = ${sumScores2}!`; 
            } 
            else {
                return `${config.player2.name} wins by tie breaker, with Overall score = ${score2} and Sum of scores = ${sumScores1}!`;
            }
        } else if (score1 > score2) {
            return `${config.player2.name} wins the game with an Overall score of ${score2}!`;
        } else {
            return `${config.player1.name} wins the game with an Overall score of ${score1}!`;
        }
    }

    return (
         <div style={{width: "100vw", height: "100vh", display: "flex", flexGrow: "1", alignItems: "center", justifyContent: "center"}}>
            <Paper elevation={4} >
                <MUIGrid container spacing={2} style={{padding: "10%"}}>
                    <MUIGrid item xs={6} style={{textAlign: 'center'}}>
                        <Typography>{config.player1.name} Score: {player1Game.getScore()}</Typography>
                    </MUIGrid>
                    <MUIGrid item xs={6} style={{textAlign: 'center'}}>
                        <Typography>{config.player2.name} Score: {player2Game.getScore()}</Typography>
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
                                    <p style={{flex: "0 0 120px", flexDirection: "row"}}>
                                        <Typography>{player1Scores[node.x][node.y]}</Typography>
                                    </p>
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
                                    <p style={{flex: "0 0 120px", flexDirection: "row"}}>
                                        <Typography>{player2Scores[node.x][node.y]}</Typography>
                                    </p>
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