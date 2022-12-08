import React, { useState } from "react";

import { PlayerInput } from "../components/PlayerInput";
import { ConfigureGame, GameConfig, PlayerType } from "../components/ConfigureGame"
import { Score } from "../components/Score"

import { Game } from "../model/Game";

enum Stage {
    Config = 1,
    Player1,
    Player2,
    Score
}

export const MainPage = () => {
    const [currentStage, setCurrentStage] = useState(Stage.Config);
    const [gameConfig, setGameConfig] = useState<GameConfig>({
        grid: {
            x: 0,
            y: 0,
        },
        numPlows: 0,
        player1: {},
        player2: {}
    });
    const [scores, setScores] = useState({
        player1: 0,
        player2: 0
    })

    const [games, setGames] = useState<{ player1 : Game | undefined, player2: Game | undefined }>({
        player1: undefined,
        player2: undefined
    });

    switch (currentStage) {
        case Stage.Config:
            return (
                <ConfigureGame onSubmit={(config: GameConfig) => {
                    setCurrentStage(Stage.Player1)
                    setGameConfig(config)
                    const player1Game = new Game(config.grid.x, config.grid.y, config.numPlows)
                    const player2Game = new Game(config.grid.x, config.grid.y, config.numPlows)
            
                    player2Game.roads = {...player1Game.roads};

                    setGames({
                        player1: player1Game,
                        player2: player2Game
                    });
                }}/>
            );
        case Stage.Player1:               
            if (gameConfig.player1.type !== PlayerType.human){
                setCurrentStage(Stage.Player2)
                // TODO: Call AI to make moves on the game
                break;
            }

            if (games.player1 !== undefined)
                return (
                    <div  style={{
                        height: "90vh",
                        width: "90vw",
                        display: "grid", 
                        gridColumnStart: "1",
                        gridColumnEnd: "span col4-start",
                        gridRowStart: 2,
                        gridRowEnd: "span 10",
                    }} >
                        <div>
                            <PlayerInput 
                                playerName={gameConfig.player1.name}
                                grid={gameConfig.grid}
                                numPlows={gameConfig.numPlows}
                                game={games.player1}
                                onEnd={() => {
                                    setCurrentStage(Stage.Player2);
                                }}
                            />
                        </div>
                    </div>
                );
            break;
        case Stage.Player2:
            if (gameConfig.player2.type !== PlayerType.human){
                setCurrentStage(Stage.Score)
                // TODO: Call AI to make moves on the game
                break;
            }

            if (games.player2 !== undefined)
                return (
                    <div  style={{
                        height: "90vh",
                        width: "90vw",
                        display: "grid", 
                        gridColumnStart: "1",
                        gridColumnEnd: "span col4-start",
                        gridRowStart: 2,
                        gridRowEnd: "span 10",
                    }} >
                        <div>
                            <PlayerInput 
                                playerName={gameConfig.player2.name}
                                grid={gameConfig.grid}
                                numPlows={gameConfig.numPlows}
                                game={games.player2}
                                onEnd={() => {
                                    setCurrentStage(Stage.Score);
                                }}
                            />
                        </div>
                    </div>
                );
            break;
        case Stage.Score:
            if (games.player1 !== undefined && games.player2 !== undefined){
                return (
                    <div  style={{
                        height: "90vh",
                        width: "90vw",
                        display: "grid", 
                        gridColumnStart: "1",
                        gridColumnEnd: "span col4-start",
                        gridRowStart: 2,
                        gridRowEnd: "span 10",
                    }} >
                        <div>
                            <Score
                                config={gameConfig}
                                player1Game={games.player1}
                                player2Game={games.player2}
                            />
                         </div>
                    </div>
                );
            }
            break;
    }

    return <div/>
}