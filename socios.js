buttons = 0;

$(document).ready(function(){
	$('#mainContent a').click(function (e) {
	  	e.preventDefault()
	  	$(this).tab('show')
	});

	var timelineP = getTimeLine();
	var updateP = updateTimeLine();
	var mylineP = getMyLine();

	$.when(timelineP, updateP, mylineP).then(setButtonCallback, setButtonCallback);
});

function getTimeLine(){
	return $.getJSON("json/timeline.json")
		.done(function(data){
			var html = prepareMessages(data);
			$("#oldMessages").append(html);
		})
		.fail(function(jqxhr, status, error){
			var htmlErr = "<p>Request Failed: " + status + ": " + error + "</p>"
			$("#oldMessages").append(htmlErr);
		});
}

function updateTimeLine(){
	return $.getJSON("json/update.json")
		.done(function(data){
			if (data.messages.length == 0){
				return;
			}
			$("#moreMessages").show();
			var html = prepareMessages(data);
			$("#moreMessages").click(function(){
				$("#newMessages").show();
				$("#moreMessages").hide();
			});
			$("#newMessages").append(html);
		})
		.fail(function(jqxhr, status, error){
			var htmlErr = "<p>Request Failed: " + status + ": " + error + "</p>"
			$("#newMessages").append(htmlErr);
			$("#newMessages").show();
		});
}

function getMyLine(){
	return $.getJSON("json/myline.json")
		.done(function(data){
			var html = prepareMessages(data);
			$("#myMessages").append(html);
			
		}).
		fail(function(jqxhr, status, error){
			var htmlErr = "<p>Request Failed: " + status + ": " + error + "</p>"
			$("#myMessages").append(htmlErr);
		});
}

function prepareMessages(data){
	data.messages.sort(function(m1, m2){
		return new Date(m2.date) - new Date(m1.date);
	})

	var html = "";
	for (var i = 0; i < data.messages.length; i++){
		var mess =  data.messages[i];
		html += "<div class='message col-xs-12'>";
		html += "<img class='avatar col-xs-4 col-md-2' height='125' src='" + mess.avatar + "' alt='avatar'>";
		html += "<div class='col-xs-8 col-md-2'><p class='author'>" + mess.author + "</p>"
		html += "<p class='title'>" + mess.title + "</p>";
		html += "<input type='button' class='showDetail' value='Show More' name='" + buttons + "'></div>";
		html += "<div id='" + buttons + "' class='detailedInfo col-xs-12 col-md-8' hidden>";
		buttons += 1;
		var date = new Date(mess.date)
		html += "<p class='date'>" + date.toUTCString() + "</p>";
		html += "<p class='content'>" + mess.content + "</p>"; 
		html += "</div></div><br/>";
	}
	return html;
}

function setButtonCallback(){
	$(".showDetail").click(function(){
		var infId = this.name;
				
		if (this.value == "Show More"){
			$("#" + infId).show();
			this.value = "Hide";
		}else{
			$("#" + infId).hide();
			this.value = "Show More";
		}
	});
}