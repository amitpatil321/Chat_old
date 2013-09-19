<?php
include("database.class.php");

class chat extends database
{
	public function __construct(){
		$dbConn = parent::__construct();
		if(!$dbConn)
			$this->print("error","Database connection failed");
			 
	}
    public static function get_online_users(){

		
	}
	public function doprint($type,$string = "Unexpected error !"){
		if($type == "error")
			echo "<div lass=\"error\">".$string."</div>";
		else if($type == "message")
			echo "<div lass=\"msg\">".$string."</div>";
	}
}
?>