var open_windows = 0,chat_window_left;
var chat_window_width = 250;
var last_msg_time = new Array();
$().ready(function(){
	var id,chat_user_name,chat_window_left = 0;
	$(".user-list .list li").click(function(){
		id	       = $(this).attr("id");
		chat_user_name = $(this).html();

		// check if chat window is allready open for same user ?? if yes set focus, If no then create window
		if($(document).find(".chat-window[id='"+id+"']").html() == null)
			create_window(id,chat_user_name);
		else
			$(document).find(".chat-window[id='"+id+"']").find("textarea").focus();
	});
	$(document).click(function(){
		//alert($(document).find(".header").html());
	});
	$(".active-window").live("click",function(){
		//alert("asas");
		minimize_window();
		//$(".header").trigger(live("click"));
	});
	$(".header").live("click",function(){
           minimize_window();     
	});
	$(".header").click(function(){
		   //alert("Aaa");
           minimize_window();     
	});
	$(".chat-window").live("click",function(){
		$(this)
		.find("textarea")
		.trigger("focus");	
	});
	$(".chat-window textarea").live("focus",function(){
		if($(this).parent().find(".active-window").html() != null)
		$(this).parent().find(".active-window").removeClass("active-window").addClass("header");
		$(this).addClass("active-textarea");
		//$(this).parent().find(".header").addClass("active-window");
	});
	$(".chat-window textarea").live("blur",function(){
		$(this).removeClass("active-textarea");
		//$(this).parent().find(".header").removeClass("active-window");
	});
	$(".chat-window textarea").live("keydown",function(e){
		if(e.keyCode == 13){
			var from = $("input[name='user']").val();
			var msg = sanitize_string($(this).val());
			var to = $(this).parent().attr("id");  
			
			if(msg != "" && msg.length){
				last_msg_time = $(this).parent().find(".sender_lst_msg").val();     
				new_msg_time  = Math.round((new Date()).getTime() / 1000);     
				
				send_receive(msg,to,from);

				// check if time diff between 2 messages is less than half minute then combine message with last message,                  
			   if(parseInt(new_msg_time - last_msg_time) >= 30){
					create_message(msg,to,from);
				}else{
					$(this)
					.parent()
					.find(".chat-message-str")
					.last()
					.append("<div>"+msg+"</div>");
				}
				$(this).val("").focus();
				// position scrolbar to bottom always
				$(".chat-window .chat-text").attr({ scrollTop: $(".chat-window .chat-text").attr("scrollHeight")});
				$(this).parent().find(".sender_lst_msg").val(new_msg_time);
			}
			// return false to neutral the next line keystroke
			return false;
		}
	});
	$(".close-chat").live("click",function(){
		$(this).parent().parent().remove();
		open_windows--;
        rearrange_windows();
	});
        
        minimize_window = function(){
		if($(this).parent().css("height") == "300px"){
			//alert($(this).parent().find(".min-chat").removeClass("min-chat").addClass("max-chat"));
			$(this)
				.parent()
				.css("height","22px")
				.find("textarea")
				.css("display","none");
			$(this)
				.parent()
				.find(".min-chat")
				.removeClass("min-chat")
				.addClass("max-chat");
		}
		else{
			$(this)
				.parent()
				.css("height","300px")
				.find("textarea")
				.css("display","block");
			$(this).parent()
				.find(".max-chat")
				.removeClass("max-chat")
				.addClass("min-chat");
		}            
        }
        create_message = function(msg,to,from){
            $(document)
            .find(".chat-window[id="+to+"]")
            .find(".chat-text")
            .append('<div class="each-message"><div class="chat-user-photo"><img src="images/image_uid'+from+'.jpg" width="30" height="30"></div><div class="chat-user-name">'+$("input[name='logged_user']")
            .val()+'</div><div class="chat-message-str">'+msg+'</div></div>');            
        }

        rearrange_windows = function(){
            $(document).find(".chat-window").each(function(i){
               $(this).animate({
                  right : parseInt(chat_window_width * i) + (10 * i) 
               },1000);
               //if(open_windows != 0) chat_window_left+=open_windows * 10;    
            });
        }

        window_exists = function(senders_id) {
            // check if window availables
            if($(".chat-window[id='"+senders_id+"']").html() == null)
                return false;
            return true;
        };

        sanitize_string = function(string){
            // What a tag looks like
            var matchTag = /<(?:.|\s)*?>/g;
            // Replace the tag
            return string.replace(matchTag, "");
        }    

        get_messages = function(msg,to,sentBy){
        var msg_for = $("input[name='user']").val();
		$.ajax({
                    type : "POST",
                    url  :"ajax_server.php",
                    data :"type=get&for="+msg_for,
                    success: function(responce){
                        var json = jQuery.parseJSON(responce);
                        $.each(json, function(i,each_comment){  
                            if(!window_exists(each_comment.from))
                                create_window(each_comment.from,each_comment.from_user);
										$(".chat-window").blur();			
                                        last_msg_time = $(".chat-window[id='"+each_comment.from+"']").find(".recvr_lst_msg").val();     
                                        new_msg_time  = Math.round((new Date()).getTime() / 1000);     

                                        // check last message receive time if its more that 30 secs then create new message box if not then append it to old message
                                        if(parseInt(new_msg_time - last_msg_time) >= 30 ){
                                                $(".chat-window[id='"+each_comment.from+"']")
                                                .find(".chat-text")
                                                .append('<div class="each-message"><div class="chat-user-photo"><img src="images/image_uid'+each_comment.from+'.jpg" width="30" height="30"></div><div class="chat-user-name">'+each_comment.from_user+'</div><span class="chat-message-str">'+each_comment.message+'</span></div>');
                                                $(".chat-window[id='"+each_comment.from+"']")
                                                .find(".recvr_lst_msg")
                                                .val(new_msg_time);
                                                //alert($(".chat-window[id='"+each_comment.from+"']"));
                                        }else{
                                                $(".chat-window[id='"+each_comment.from+"']")
                                                .find(".chat-message-str")
                                                .last()
                                                .append("<div>"+each_comment.message+"</div>");
                                        }
                                        $(".chat-window[id='"+each_comment.from+"']").parent().find(".header").removeClass("header").addClass("active-window");
                                        $(".chat-window .chat-text").attr({ scrollTop: $(".chat-window .chat-text").attr("scrollHeight")});
                                });
                    }
            });
            setTimeout(get_messages,1000);
        }
        
        create_window = function(id,chat_user_name){
                chat_window_left = open_windows * chat_window_width;
                if(open_windows != 0) chat_window_left+=open_windows * 10;
               
				$('<div class="chat-window" id="'+id+'" style="right:'+chat_window_left+'px;margin-right:5px;display:block;"><div class="header">'+chat_user_name+'<input type="hidden" class="sender_lst_msg" size="5"><input type="hidden" class="recvr_lst_msg" size="5"><div class="close-chat"></div><div class="min-chat"></div></div><div class="chat-text"></div><textarea></textarea></div>').appendTo("body");	
                // set focus to newly added chat window, so user can start typing right now
                $(document).find(".chat-window[id="+id+"]").find("textarea").focus();
                open_windows++;
        }     

		setTimeout(get_messages,1000);
});


/*
function sanitize_string(string){
    // What a tag looks like
    var matchTag = /<(?:.|\s)*?>/g;
    // Replace the tag
    return string.replace(matchTag, "");
}*/

function send_receive(msg,to,sentBy){
        $.ajax({
                type : "POST",
                url  :"ajax_server.php",
                data :"msg="+msg+"&to="+to+"&type=write&sentby="+sentBy,
                success: function(msg){

                }
	});
	//setTimeout(send_receive,1000);
}
