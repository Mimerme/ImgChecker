var BASE_URL = "https://www.google.com/searchbyimage?&image_url=";

function search_url(image_url, callback){
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        console.log("Request finished...");
        console.log(xhr.responseText);

        var card_response = xhr.responseText.getElementsByClassName("card-section");
        callback(card_response);
    };

    xhr.open("GET", BASE_URL + image_url, true);
    xhr.send();
}
