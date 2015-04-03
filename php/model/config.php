<?php
require_once(__DIR__ . "/../Model/Database.php");
//sessions perserve information so we wouldn't have to generate the information over and over again
session_start();
session_regenerate_id(true);
$path = "/DakotaDAwsomenauts/php/";
$host = "localhost";
$username = "root";
$password = "root";
$database = "Awesomnauts_db";

if(!isset($_SESSION["connection"])) {  
$connection = new Database($host, $username, $password, $database);
$_SESSION["connection"] = $connection;
}