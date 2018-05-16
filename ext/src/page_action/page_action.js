var selecting = false;
var images_to_check = [];
var status_bar;

function add_row_to_table(table_element, source, size){
  let table_row = document.createElement('tr');
  
  let row_source = document.createElement("td"); 
  row_source.innerHTML = source.substr(0, 25);
  if (source.length > 25)
    row_source.innerHTML += "...";
  
  let row_img = document.createElement("td");
  let img = document.createElement("img");
  img.src = source;
  img.style = "max-width: 75px; min-width: 45px;";
  row_img.appendChild(img);

  let row_size = document.createElement("td"); 
  row_size.innerHTML = size;

  table_row.appendChild(row_source);
  table_row.appendChild(row_img);
  table_row.appendChild(row_size);

  table_element.appendChild(table_row);
}


window.onload = function () {
  status_bar = document.getElementById("status");
  var table = document.getElementsByTagName("table")[0];

  //Retrieve values from the injected script on a per tab basis
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "give_vars"}, function(response){
      console.log(response);
      status_bar.innerHTML = response["status_text"];
      selecting = response["selecting"];
      images_to_check = response["images"];

      let toggle_button = document.getElementById("toggle");
      if (selecting)
        toggle_button.innerHTML = "Exit Image Selection Mode";
      else 
        toggle_button.innerHTML = "Pick Image";

      //Initialize the table with the queued up images 
      for(let i = 0; i < images_to_check.length; i++){
        add_row_to_table(table, images_to_check[i]["source"], 
          images_to_check[i]["size"]);
      }

      initialize_rest_of_page();
    });
  });
}

//No synchronous message passing so this'll do ¯\_(ツ)_/¯
function initialize_rest_of_page(){

  document.getElementById("toggle").onclick = function(){
    selecting = !selecting;
    if (selecting){
      this.innerHTML = "Exit Image Selection Mode";
      status_bar.innerHTML = "Selecting images...";
    }
    else {
      this.innerHTML = "Pick Image";
      status_bar.innerHTML = "Exited image selection";
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "toggle_highlight"});
    });
  }
}