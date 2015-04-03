<?php
require_once(__DIR__ . "/../Model/config.php");
//make an if statement whether the session variable has been set to true or not
function authenticateUser() {
    if(!isset($_SESSION["authenticated"])) {
        return false;
    }
    else {
        if($_SESSION["authenticated"] != true) {
            return false;
        }
        else {
            return true;
    }
  }
}
//determine a way to call the function