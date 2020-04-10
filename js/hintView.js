var simplemde = new SimpleMDE({ element: document.getElementById("inputor") });
var hintDiv = $("#hintDiv");
var hintSel = $('#hintSel');
var start;
var start_pos;
var end;
var end_pos;
var reg = /[^a-zA-Z0-9-]/g;
var div = $("div.CodeMirror-scroll");
var cursor = $("div.CodeMirror-cursor");
var MyChannel = null;

function getWord(){
	//var text = textarea.val();
    var pos = simplemde.codemirror.getCursor();
    var cur = pos["ch"];
    var text = simplemde.codemirror.getLine(pos["line"]);
    //var cur
    // reg.exec(text.substring(0, cur));
    var str_start = text.substring(0, cur);
    var match_list = str_start.match(reg);
    if(match_list == null) start = -1;
    else start = str_start.lastIndexOf(match_list.pop());
    
    var str_end = text.substring(cur, text.length);
    var match_list = str_end.match(reg);
    if(match_list == null) end = text.length;
    else end = str_end.indexOf(match_list[0])+cur;

    console.log(start);
    console.log(end);
    var word = text.substring(start+1, end);
    console.log(word);
    start_pos = {"line": pos["line"], "ch":start+1};
    end_pos = {"line": pos["line"], "ch":end};
    return word;
}

function buildView(data){
	$("div.CodeMirror").css({"z-index":"0"});
	var rect = $("div.CodeMirror-cursor")[0].getBoundingClientRect();
	hintSel.children().remove();
	data.forEach(function(e, idx){
		var optText = "<option value='"+e+"''>"+e+"</option>";
		console.log(optText);
		$("#hintSel").append(optText);
	});
	// hintDiv.css({"top":pos.top, "left":pos.left, "display":"block", "position":"absolute" });
	hintDiv.css({"top":rect.top, "left":rect.left, "display":"block", "position":"absolute" });
	hintSel.focus();
	hintSel.children().first().attr("selected", "selected");
	$("option").click(function(){
		submit($(this));
	});
	$("#first").attr("selected","selected");
}

function getData(word){
	var data = ["abcde", "abc", "abc"];
	new QWebChannel(qt.webChannelTransport, function(channel) {
                MyChannel = channel.objects.MyChannel;
				MyChannel.syn(word, function(data){
					data = JSON.parse(data);
					buildView(data);
				});
	});
	return data
}

function submit(ele=null){
	console.log("submit!");
	var val = ele==null? $("option[selected='selected']").val():ele.val();
	simplemde.codemirror.replaceRange(val, start_pos, end_pos);
	hide();
}
function hide(){
	$("option[selected='selected']").removeAttr("selected");
	hintDiv.hide();
	simplemde.codemirror.focus(end_pos);
}

function select(cur, next){
	next.attr("selected", "selected");
	cur.removeAttr("selected");
	var optionTop = next.offset().top
  	var selectTop = hintSel.offset().top;
  	console.error(optionTop);
  	console.error(selectTop);
  	hintSel.scrollTop(hintSel.scrollTop() + (optionTop - selectTop) - 73);
}

//div.keydown(function(e){
document.addEventListener("keydown", function(e) {
	e = e || window.event;
	//alert("hello");
	if(!hintDiv.is(":visible")){
	    if(e.ctrlKey && e.keyCode == 13) {
	        // Ctrl-Enter pressed
	         var word = getWord();
	         var data = getData(word);
	    }
    }else{
    	if(e.keyCode == 13){
			e.preventDefault();
			submit();
		}else if(e.keyCode == 27){
			e.preventDefault();
			hide();
		}else if(e.keyCode == 38){ //up
			//e.preventDefault();
			var cur = $("option[selected='selected']");
			if(cur && cur.prev().length !=0){
				select(cur, cur.prev());
			}
		}else if(e.keyCode == 40){ //down
			//e.preventDefault();
			var cur = $("option[selected='selected']");
			if(cur && cur.next().length != 0){
				select(cur, cur.next());
			}
		}
    }
    return true;
}, false);