<?php
  $host = "localhost";
  $db_uname = "root";
  $db_pass = "admin";
  $database = "chat";
  $table = "messages";
  if (!$conn = mysql_connect($host,$db_uname,$db_pass)){
    die('Could not connect: ' . mysql_error());
  }else{ 
	mysql_select_db($database,$conn);
  }
?>