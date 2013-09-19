<?php
  session_start();
  $_SESSION['users'] = array("","Amit","Sudhir","Srikant","Renya","Sandip");
  include("chat.class.php");
  $chatObj = new chat;
  
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"> <!--Enable IE quirks mode for position: fixed -->
<html>
 <head>
  <title> Chat </title>
  <meta http-equiv="X-UA-Compatible" content="ie=Emulateie7" />
  <meta name="generator" content="editplus"/>
  <meta name="author" content=""/>
  <meta name="keywords" content=""/>
  <meta name="description" content=""/>
  <link rel="stylesheet" type="text/css" media="all" href="css/classic.css"/>
  <script type="text/javascript" src="js/jquery.js"/></script>
  <script type="text/javascript" src="js/chat.js"/></script>
 </head>
 <body>
   <h1 style="color:red;font-size: 20px;"><?php echo $_SESSION['users'][$_GET['uid']]; ?></h1>   
   
   <input type="text" value="<?php echo $_GET['uid'];?>" name="user">
   <input type="button" value="Get Messages" onClick="javascript:get_messages()"/>

   <div class="user-list-main">
	  <div class="list-header">Buddy List</div>
	  <div class="user-list">
	    <ul class="list">
                <?php
                  foreach($_SESSION['users'] as $index=>$key)
                  {
                      if($index != $_GET['uid'])
                          echo  '<li id="'.$index.'">'.$key.'</li>'."\n\t\t";
                  }
                ?>
            </ul>
            <input type="hidden" name="logged_user" value="<?php echo $_SESSION['users'][$_GET['uid']] ?>"/>
	  </div>
   </div>	  
 </body>
</html>
