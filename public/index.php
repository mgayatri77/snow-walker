<?php
// Filename of your index page
$index = "game.html";
// Metadata
$game = "SnowWalkers";
$team = "Checkmate";
$instruction = <<<EOD
<p> Welcome to Grid City! </p>
<p> Grid City is a small planned city laid out as a grid with streets going north-south and east-west. There is one building per city block. The grid has suffered a snow storm and the Snow Clearing Department (GridClear) wishes to make it possible to reach each city block. </p> 
<p> The head of GridClear consults you to help plan the plow paths such that for any two adjacent (north, south, east, west, and any diagonal) buildings, a resident will need to travel over only a few streets/buildings. The "score" of a building is the worst case, i.e. the largest number of such streets/buildings required to go from that building to any adjacent building.</p>
<p> The total or overall score is the the maximum score across all buildings.</p>

<p> <strong> Rules </strong>
    <p> - Deciding Winner: The player with the lower overall score wins. 
    <p> - Tiebreaker 1: If overall scores are tied, the player with the lower sum of scores over all buildings wins. 
    <p> - Tiebreaker 2: If the overall score and sum of scores are tied, the player who plowed fewer roads wins. 
    <p> - Setttings: GridX and GridY must be greater than 1. 
    <p> - Paths: A plow path must begin from the boundaries of the grid. </p>
    <p> - Paths: A plow path cannot go over previously plowed paths. </p> 
    <p> - Paths: Each single plow path must be connected. </p> 
    <p> - Paths: A small number of paths may have already been plowed by GridClear and will be marked in black and yellow. </p>
    <p> - Scoring: Crossing a plowed intersection has zero cost. </p>
    <p> - Scoring: Walking through a building to any corner (even the diagonally opposite one) costs the same as walking along a plowed road.</p>
</p>

<p> <strong> Instructions </strong>
    <p> - Press pop-up to access game window. </p>
    <p> - Game Setttings: Select the Grid Size, Number of Plows, Maximum Number of Roads and Player Names. </p>
    <p> - Game Play: This is a two player game. Both players must submit plows after which their scores will be displayed. </p>
    <p> - Submitting Plow Paths: Click on the roads that you wish to plow for the Current Plow. Click 'Next Plow' to submit a plow path for the current plow, 'Submit' to finish submitting all plow paths, 'Reset' to reset the current plow path and 'Previous Plow' to resubmit the Previous Plow.
    <p> - Score: Displays the plow paths for both players and their scores. 
</p>
<p> <strong> Note: </strong> For best experience, maximize window as much as possible. </p>
EOD;

// Size of the popup window
$width = 940;
$height = 1000;
// If your score is sortable, 1 if higher score is better, -1 if smaller score is better, 0 otherwise.
$scoring = -1;

include '../../template.php';