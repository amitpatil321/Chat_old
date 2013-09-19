<?php
  session_save_path();
  include("config.php");
  extract($_POST);
  if($type == "write"){
     $write_status = mysql_query("insert into ".$table." values('','".$sentby."','".$to."','".$msg."','unread','".time()."')") or die("error while sending...");
  }
  else if($type == "get"){
      $responce = array();
    //echo "select * from ".$table." where msg_to = '".$for."' and status = 'unread'";
    $res = mysql_query("select * from ".$table." where msg_to = '".$for."' and status = 'unread'") or die(mysql_error());
    if(mysql_num_rows($res)){
        while($row = mysql_fetch_assoc($res)){
            $row['from_user'] = get_name($row['from']); 
            $row['to_user'] = get_name($row['msg_to']); 
            $responce[] = $row;
        }
    }
     mysql_query("update ".$table." set status = 'read' where msg_to =".$for." and status = 'unread'");
     echo json_encode($responce);
  }
  
  function get_name($id){
    if($id != "")  {        
        $result = mysql_query("select * from users where id = '".$id."' limit 1");
        if(mysql_num_rows($result)){
            $row = mysql_fetch_array($result);
            return $row['user_name'];
        }        
    }else{
        return;
    }
        
  }
  /*
  function get_responce($type,$write_status,$table,$sentby){
	// fetch unread messages
	$res = mysql_query("select * from ".$table." where msg_to = '".$sentby."' and status = 'unread'") or die(mysql_error());
	while($row = mysql_fetch_array($res)){
            $responce[]['msg']  = $row['message'];
            $responce[]['to']   = $row['msg_to'];
            $responce[]['from'] = $row['from'];
	}
	if($type == "write")
		$responce["last_message"] = $write_status;
	// change message status 
	//mysql_query("update ".$table." set status = 'read' where msg_to =".$sentby." and status = 'unread'");
	echo json_encode($responce);
  }*/
?>