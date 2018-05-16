window.onload = function () {
	chrome.extension.sendMessage({action: "page_load"});
}

var images_to_check = [];
var selecting = false;
var status_bar_text = "	Waiting for user input...";

function set_status(msg){
  status_bar_text = msg;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  console.log(sender);

  switch(request.action){
  	case "toggle_highlight":
  	console.log("toggling highlight");
  	toggle_selection();
  	break;

  	case "give_vars":
  	sendResponse({
  		"status_text": status_bar_text,
  		"selecting": selecting,
  		"images": images_to_check
  	});
  	break;
	
  	case "add_image":
  	images_to_check.push(request.src);
    set_status("Added " + request.src.substr(id.length - 20));
  	break;

  	default:
  	console.error("Invalid request");
  	break;
  }
});

function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}
function highlight_images(){
	//Some weird facebook hack
/*	var url = window.location.href;
	console.log(url);
	if(url.contains("://www.facebook.com")){
		document.getElementsByTagName("html")[0].className += " stop-scrolling";
	}*/
	let images = document.getElementsByTagName("img");
	console.log(images.length);
	for (let i = 0; i < images.length; i++){
		let rect = images[i].getBoundingClientRect();
		let image_overlay = document.createElement("div");
		image_overlay.className += " mimerme-hover-overlay";
		var cords = getCoords(images[i]);

		image_overlay.style.top = cords.top + "px";
		image_overlay.style.left = cords.left + "px";
		//image_overlay.style.bottom = rect.bottom + "px";
		//image_overlay.style.right = rect.right + "px";
		image_overlay.style.height = rect.height + "px";
		image_overlay.style.width = rect.width + "px";
		image_overlay.setAttribute("img_src", images[i].src);
		image_overlay.setAttribute("selected", "false");
		image_overlay.onclick = function(){
			if(this.getAttribute("selected") == "false"){
				add_image(this);
				this.className += " mimerme-hover-overlay-selected"
				image_overlay.setAttribute("selected", "true");
			}
			else{
				//TODO: code to remove iamge from array
				remove_image(images[i].src);
				this.classList.remove("mimerme-hover-overlay-selected");
				image_overlay.setAttribute("selected", "false");
			}
		};

		//If the image is already selected
		if(search_existing_images(images[i].src)){
			image_overlay.className += " mimerme-hover-overlay-selected"
			image_overlay.setAttribute("selected", "true");
		}

		document.getElementsByTagName("html")[0].appendChild(image_overlay)
	}
}

function unhighlight_images(){
/*	var url = window.location.href;
	if(url.contains("://www.facebook.com")){
		document.getElementsByTagName("html")[0].classList.remove("stop-scrolling");
	}*/
	let overlays = document.getElementsByClassName("mimerme-hover-overlay");
	console.log(overlays);
	do{
		overlays[0].remove();
	}while(overlays.length > 0);
}

function toggle_selection(){
	selecting = !selecting;
	if (selecting){
		highlight_images();
      	status_bar_text = "Selecting images...";
    }
	else {
		unhighlight_images();
		status_bar_text = "Exited image selection";
	}
}

function add_image(image_element){
	let image_src = image_element.getAttribute("img_src");

	images_to_check.push({
		"source": image_src, 
		"size": "" + image_element.clientWidth + "x" + image_element.clientHeight
	});
    set_status("Added " + image_src.substr(0, 30));
}

function remove_image(source){
	for(let i = 0; i < images_to_check.length; i++){
		if(images_to_check[i]["source"] == source){
			images_to_check.splice(i, 1);
			set_status("Removed " + source.substr(0, 30));
		}
	}
}

//returns true if the source already exists
function search_existing_images(source){
	for(let i = 0; i < images_to_check.length; i++){
		if(images_to_check[i]["source"] == source)
			return true;
	}
	return false;
}