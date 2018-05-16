document.onmousedown = myMouseDownHandler;
var o_lay = document.createElement("div");
o_lay.setAttribute("id", "overlay");
o_lay.setAttribute("onmousemove", 'hoverCheck()');


function hoverCheck(event) {
    console.log("hi");
    var overlay = document.getElementById("overlay")
    
    overlay.style.display = "none";
    var node = document.elementFromPoint(event.x, event.y);
    console.log(node);
    if (node.tagName == "IMG"){
        if (node.classList.contains("hover-selected-mimerme")){
            console.log("owo");
            node.classList.remove("hover-selected-mimerme");
        } else{
            console.log("test");
            node.classList.add("hover-selected-mimerme");
        }
        
    }
    overlay.style.display = "block";
}

document.getElementsByTagName("html")[0].appendChild(o_lay)

function myMouseDownHandler(event) {
    /*var nodes = document.querySelectorAll( ":hover" );
    console.log(event);
    for(var i = 0; i < nodes.length; i++){
        if (nodes[i].tagName == "IMG"){
            nodes[i].onmousedown = function(){console.log("tesT");};
            nodes[i].style.outline = "thick solid #0000FF"
        }
    }*/
    var overlay = document.getElementById("overlay")
    
    overlay.style.display = "none";
    var node = document.elementFromPoint(event.x, event.y);
    console.log(node);
    if (node.tagName == "IMG"){
        if (node.classList.contains("selected-mimerme")){
            console.log("owo");
            node.classList.remove("selected-mimerme");
        } else{
            console.log("test");
            node.classList.add("selected-mimerme");
        }
        
    }
    overlay.style.display = "block";
}