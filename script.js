function sendMessage(message) {
  var el = document.getElementById("copy");
  
  var cln = el.cloneNode(true);
  cln.hidden= false;
  document.getElementById("messages").appendChild(cln);
  var el2 = cln.getElementsByClassName("markup-2BOw-j messageContent-2qWWxC")[0];
  el2.innerText = message;

  var elem = document.getElementById("messages");
  elem.scrollTop = elem.scrollHeight;
}

function reqListener () {
  console.log(this.responseText);

  var data = JSON.parse(this.responseText);

  var id = data.id;
  var avatar = data.avatar;

  var imageUrl = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".webp";

  var name = data.name;
  
  document.getElementsByClassName("avatar-1BDn8e clickable-1bVtEA")[0].src = imageUrl;
  document.getElementsByClassName("username-1A8OIy clickable-1bVtEA")[0].innerText = name;

  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var pm = false;
  if (h >= 12) {
    pm = true;
  }
  if (h == 0) {
    h = 12;
  }
  document.getElementsByClassName("timestamp-3ZCmNB")[0].innerText = "Today at " + h + ":" + m + (pm ? " PM" : " AM");
}

var url = "https://discord.com/api/webhooks/774407441814782054/GZEqSLOGiz3ohLeJG9U36DctBZQDoNvJX3AeRQXtOcKAvgnXTPLMkL9O5w8ru1N2I3-E";

document.body.onload = begin;

function begin() {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url);
  //oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  oReq.send();
}


function submit(text) {
  if (text.length <= 0) return;
  var request = new XMLHttpRequest();
  request.open("POST", url);
  request.addEventListener("load", function() {
    var data = JSON.parse(this.responseText);
    console.log(data);

    sendMessage()
  });
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  let postData = { "content": text };
  request.send(JSON.stringify(postData))

  sendMessage(text);
}


document.getElementById("message_input").addEventListener("input", function(){
  if (this.innerText.length > 0) {
    document.getElementById("placeholder").hidden = true;
  } else {
    document.getElementById("placeholder").hidden = false;
  }
});

document.getElementById("message_input").addEventListener("keypress", function(e){
  if (e.keyCode == 13) {
    e.preventDefault();
    submit(this.innerText);
    this.innerText = "";
    document.getElementById("placeholder").hidden = false;
  }
});

document.getElementById("message_input").onpaste = function(event){
  var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  console.log(JSON.stringify(items)); // will give you the mime types
  var self = this;
  for (index in items) {
    var item = items[index];
    if (item.kind === 'file') {
      var blob = item.getAsFile();
      var reader = new FileReader();
      reader.onload = function(event){
        var image = new Image();
        image.src = event.target.result;
        self.appendChild(image);
        // console.log(event.target.result);
      }
      reader.readAsDataURL(blob);
    }
  }
}

document.getElementById("url_input").addEventListener("input", function(){
  if (this.innerText.length > 0) {
    document.getElementById("placeholder_url").hidden = true;
  } else {
    document.getElementById("placeholder_url").hidden = false;
  }
});

document.getElementById("url_input").addEventListener("keypress", function(e){
  if (e.keyCode == 13) {
    e.preventDefault();
    url = this.innerText;
    begin();
    this.innerText = "";
    document.getElementById("placeholder_url").hidden = false;
  }
});
