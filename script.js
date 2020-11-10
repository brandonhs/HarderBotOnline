function sendMessage(message) {
  var el = document.getElementById("messages").children[document.getElementById("messages").children.length-1];
  
  var cln = el.cloneNode(true);
  document.getElementById("messages").appendChild(cln);
  var el2 = cln.getElementsByClassName("markup-2BOw-j messageContent-2qWWxC")[0];
  el2.innerText = message;

  var elem = document.getElementById("messages");
  elem.scrollTop = elem.scrollHeight;

  //cln.getElementsByClassName("timestamp-3ZCmNB")[0].innerText;

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
}

const url = "https://discord.com/api/webhooks/774407441814782054/GZEqSLOGiz3ohLeJG9U36DctBZQDoNvJX3AeRQXtOcKAvgnXTPLMkL9O5w8ru1N2I3-E";

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", url);
oReq.send();


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

// document.getElementById("url_input").addEventListener("input", function(){
//   if (this.innerText.length > 0) {
//     document.getElementById("placeholder_url").hidden = true;
//   } else {
//     document.getElementById("placeholder_url").hidden = false;
//   }
// });
