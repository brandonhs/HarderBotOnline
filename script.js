const API_KEY = "2e1f12e2389bc94cf979adea7146d52a"; // maybe don't make this plain text? Nah no one will see this

var img = undefined;

var rel = false;


function sendMessage(message) {
  var el = document.getElementById("copy");

  var cln = el.cloneNode(true);
  cln.hidden = false;
  document.getElementById("messages").appendChild(cln);
  var el2 = cln.getElementsByClassName("markup-2BOw-j messageContent-2qWWxC")[0];
  el2.innerText = message;

  var elem = document.getElementById("messages");
  elem.scrollTop = elem.scrollHeight;
}

function reqListener() {
  console.log(this.responseText);

  var data = JSON.parse(this.responseText);

  var id = data.id;
  var avatar = data.avatar;

  var imageUrl = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".webp";

  var name = data.name;

  var s = document.getElementsByClassName("avatar-1BDn8e clickable-1bVtEA");

  s[s.length - 1].src = imageUrl;
  document.getElementsByClassName("username-1A8OIy clickable-1bVtEA")[0].innerText = name;

  document.title = name;

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
  document.getElementsByClassName("timestamp-3ZCmNB")[0].innerText = "Today at " + h + ":" + m.toString().padStart(2, '0') + (pm ? " PM" : " AM");


  if (rel) location.reload();
}

var url = "https://www.google.com";

document.body.onload = function () {
  begin();
}

function begin(s = undefined) {
  if (!s && localStorage.urls) {
    var f = JSON.parse(localStorage.urls);
    for (var i = 0; i < f.length; i++) {
      for (var j = 0; j < f.length; j++) {
        if (f[j] == f[i] && i != j) {
          var index = Math.min(i, j);
          f.splice(index, 1);
        }
      }
    }
    localStorage.urls = JSON.stringify(f);
  }

  if (localStorage.url) {
    localStorage.clear();
    alert("Reloading: Outdated storage detected!");
    location.reload();
  }

  if (localStorage.urls && !s) {
    var arr = JSON.parse(localStorage.urls);

    var el_cont = document.getElementById("url_container");
    var el_copy = document.getElementById("url_copy");

    arr.forEach((v, i) => {
      var cln = el_copy.cloneNode(true);
      cln.hidden = false;
      cln.id = "urls" + i;
      cln.onclick = function () {
        var index = parseInt(this.id[this.id.length - 1]);
        var a = JSON.parse(localStorage.urls);
        //localStorage.urls = JSON.stringify(a);
        //rel = true;
        begin(a[index]);
      }
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", () => {
        var data = JSON.parse(oReq.responseText);

        var id = data.id;
        var avatar = data.avatar;

        var imageUrl = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".webp";

        cln.src = imageUrl;

        el_cont.appendChild(cln);
      });
      oReq.open("GET", v);
      oReq.send();
    });

    url = arr[arr.length - 1];
  }

  if (s) {
    url = s;
  }

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", url);
  //oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  oReq.send();

  if (!localStorage.urls) {
    localStorage.urls = JSON.stringify([]);
  }
}


function submit(text) {
  if (text.length <= 0 && !img) return;

  if (img) {

    var name = Math.random().toString();

    var blob = dataURItoBlob(img);
    var raw = blob.arrayBuffer().then(buf => xhr.send(buf));

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://cors-anywhere.herokuapp.com/https://dev.filebin.net/');
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('bin', 'harderbotonlinev2');
    xhr.setRequestHeader('filename', name);

    var image_url = "https://dev.filebin.net/harderbotonlinev2/" + name;

    xhr.addEventListener("load", function () {
      let data = JSON.parse(this.responseText);

      var request = new XMLHttpRequest();
      request.open("POST", url);
      request.addEventListener("load", function () {
        var data = JSON.parse(this.responseText);
        console.log(data);

        sendMessage();
      });
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      let postData = {
        "content": text,
        "allowed_mentions": {
          "users": [], "parse": ["users", "roles", "everyone"]
        },
        "embeds": [
          {
            "image": {
              "url": image_url
            }
          }
        ]
      };
      request.send(JSON.stringify(postData));
    });

    //var req = new XMLHttpRequest();
   // req.open("POST", "https://cors-anywhere.herokuapp.com/https://dev.filebin.net/"")

    //console.log(img);
  } else {

    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.addEventListener("load", function () {
      var data = JSON.parse(this.responseText);
      console.log(data);

      sendMessage()
    });
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let postData = { "content": text, "allowed_mentions": { "users": [], "parse": ["users", "roles", "everyone"], } };
    request.send(JSON.stringify(postData));

  }
  sendMessage(text);
}


document.getElementById("message_input").addEventListener("input", function () {
  if (this.innerText.length > 0) {
    document.getElementById("placeholder").hidden = true;
  } else {
    document.getElementById("placeholder").hidden = false;
  }
});

document.getElementById("message_input").addEventListener("keypress", function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    submit(this.innerText);
    this.innerText = "";
    document.getElementById("placeholder").hidden = false;
  }
});

document.getElementById("message_input").onpaste = function (event) {
  var items = (event.clipboardData || event.originalEvent.clipboardData).items;
  //console.log(JSON.stringify(items)); // will give you the mime types
  var self = this;
  for (index in items) {
    var item = items[index];
    if (item.kind === 'file') {
      var blob = item.getAsFile();
      var reader = new FileReader();
      reader.onload = function (event) {
        var image = new Image();
        image.src = event.target.result;
        img = event.target.result;
        //console.log(img);
        self.appendChild(image);
        //console.log(event.target.result);
      }
      reader.readAsDataURL(blob);
    }
  }
}

document.getElementById("url_input").addEventListener("input", function () {
  if (this.innerText.length > 0) {
    document.getElementById("placeholder_url").hidden = true;
  } else {
    document.getElementById("placeholder_url").hidden = false;
  }
});

document.getElementById("url_input").addEventListener("keypress", function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    url = this.innerText;
    var arr = JSON.parse(localStorage.urls);
    arr.push(url);
    localStorage.urls = JSON.stringify(arr);
    this.innerText = "";
    document.getElementById("placeholder_url").hidden = false;
    rel = true;
    begin(url);
  }
});


// https://stackoverflow.com/questions/6850276/how-to-convert-dataurl-to-file-object-in-javascript
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


}
