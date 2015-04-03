<?php

require_once(__DIR__ . "/../Model/config.php");


$exp = fiter_input(INPUT_POST, "exp", FILTER_SANITIZE_STRING);
$exp1 = fiter_input(INPUT_POST, "exp1", FILTER_SANITIZE_STRING);
$exp2 = fiter_input(INPUT_POST, "exp2", FILTER_SANITIZE_STRING);
$exp3 = fiter_input(INPUT_POST, "exp3", FILTER_SANITIZE_STRING);
$exp4 = fiter_input(INPUT_POST, "exp4", FILTER_SANITIZE_STRING);

$query = $_SESSION["connection"]->query("UPDATE users SET "
. "exp = $exp, "
. "exp1 = $exp1, "
. "exp2 = $exp2, "
. "exp3 = $exp3, "
. "exp4 = $exp4 WHERE username = \"" . $__SESSION["name"]. "\"");

if($query){
    echo "true";
}else{
    echo "<p>" . $_SESSION["connection"]->error . "</p>";
}
