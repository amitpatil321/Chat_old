<?php

class database 
{
	private $host	= "localhost";
	private $dbuser	= "root";
	private $dbpass	= "admin";
	private $dbname	= "chat";
     
	public function __construct(){
		$conn = @mysql_connect($this->host,$this->dbuser,$this->dbpass);
		if($conn){
			if(mysql_select_db($this->dbname,$conn))
				return 1;
			return 0;
		}else {
			echo "<span style='color:red;'><b>Database connection error</b></span>"; 
			exit;
		}
	}

}
?>