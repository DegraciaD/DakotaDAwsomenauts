<?php
class Database {
    private $connection;
    private $host;
    private $username;
    private $password;
    private $database;
    public $error;
    public function __construct($host, $username, $password, $database) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
        $this->connection = new mysqli($host, $username, $password);
        if ($this->connection->connect_error) {
            die("<P>Error: " . $this->connection->connect_error . "</P>");
        }
        $exists = $this->connection->select_db($database);
        if (!$exists) {
            $query = $this->connection->query("CREATE DATABASE $database");
            if ($query) {
                echo"<P>Successfully created  database: " . $database . "</P>";
            }
        } else {
            echo "<P>Database already exists.</P>";
        }
    }
    public function openConnection() {
        $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
        if ($this->connection->connect_error) {
            die("<P>Error: " . $this->connection->connect_error . "</P>");
        }
    }
    public function closeConnection() {
        if (isset($this->connection)) {
            $this->connection->close();
        }
    }
    public function query($string) {
        $this->openConnection();
        $query = $this->connection->query($string);
        if(!$query){
            $this->error = $this->connection->error;
        }
        
        $query = $this->closeConnection();
        return $query;
    } 
}

