<?php
// Filename of your index page
$index = "game.html";
// Metadata
$game = "SnowWalker";
$team = "Checkmate";
$instruction = <<<EOD
<p> Welcome to grid city! </p>

<p> Add more here </p>
<p> <strong> Note: </strong> For best experience, maximize window as much as possible. </p>
EOD;

// Size of the popup window
$width = 940;
$height = 1000;
// If your score is sortable, 1 if higher score is better, -1 if smaller score is better, 0 otherwise.
$scoring = 0;

include '../../template.php';