<?php
class Database{
    function connect(){
        $dbTable = 'tracking';
        $dbUser = 'root';
        $dbPass = 'root';
        $host = "localhost";

        $db = new mysqli($host, $dbUser, $dbPass, $dbTable);
        $db->set_charset("utf8");

        if($db->connect_errno > 0){
            die('Unable to connect to database [' . $db->connect_error . ']');
        }

        return $db;
    }
}