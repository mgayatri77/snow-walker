<?php
// Filename of your index page
$index = "game.html";
// Metadata
$game = "SnowWalkers";
$team = "Checkmate";
$instruction = <<<EOD
<p> Welcome to Grid City! </p>
<p> Grid City is a small planned city laid out as a grid with streets going north-south and east-west. There is one building per city block. The grid has suffered a snow storm and the Snow Clearing Department (GridClear) wishes to make it possible to reach each city block. The path itself may snake through the city and even loop, but the plows cannot double-back on a paved road for fear of running over the many pedestrians.</p> 
<p>The head of GridClear consults you to help plan the path. Your paths must start on the outside boundary of the grid, but you and the goal is to ensure that for any two blocks that neighbor one another north-south or east-west, a resident will need to travel over only a few streets (or through a few buildings) along the cleared path.</p>
<p>The "score" of a path is the worst case, i.e. the largest number of such streets/buildings. Crossing a plowed intersection costs nothing, but it is impossible to cross an unplowed intersection or street. Each building block has an entrance at every corner and that walking through a building to any other corner (even to the diagonally opposite one) costs the same as walking one city block along a plowed street.</p>

</p> <strong> Rules </strong>
    <p> - Game Setttings: GridX and GridY must be greater than 1.  
    <p> - This is a two player game. Both players must submit plows after which their scores will be displayed. </p>
    <p> - A small number of paths may have already been cleared by GridClear and will be marked in black and yellow. </p>
    <p> - A plow path must begin from the edges of the grid. </p>
    <p> - A plow path cannot go over previously plowed paths. </p> 
    <p> - Paths must be connected before submitting. </p>
</p>

<p> <strong> Instructions </strong>
    <p> - Press pop-up to access game window. </p>
    <p> - Game Setttings: Select the Grid Size X and Y, Number of Plows per player and the Player Names. Click 'Play' to begin. Note, Number of Plows should be chosen wisely so that players cannot easily connect all buildings.  
    <p> - Submitting Plow Paths: Click on the roads that you wish to plow for the Current Plow. Click 'Next Plow' to submit a plow path for the current plow and 'Submit' to finish submitting all plow paths for the current player, 'Reset' to reset the current plow path and 'Previous Plow' to resubmit the Previous Plow.
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