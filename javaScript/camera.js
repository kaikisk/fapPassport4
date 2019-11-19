var tempImage;
var width = $(".video").width();
var height = $(".video").height();
var video = document.getElementById("myVideo"); // 適当にvideoタグのオブジェクトを取得
// var constrains = { video: { facingMode: "environment", width: width, height: height }, audio: false }; // 映像・音声を取得するかの設定, リアカメラ設定
var constrains = { video: { facingMode: "environment" }, audio: false }; // 映像・音声を取得するかの設定, リアカメラ設定

navigator.mediaDevices.getUserMedia(constrains)
    .then(gotStream).catch(function (err) {
        console.log("An error occured! " + err);
    });

function gotStream(stream) {
    video.srcObject = stream; // streamはユーザーのカメラとマイクの情報で、これをvideoの入力ソースにする
    // alert(constrains);

    const track = stream.getVideoTracks()[0];
}


function takePhoto() {
    var photo = {}
    photo.width = width;
    photo.height = height;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    //videoの縦幅横幅を取得
    var w = video.offsetWidth;
    var h = video.offsetHeight;
    // alert("width: " + w + ", height: " + h + ", videoWidth: " + width + ", videoHeight: " + height);
    // alert(", videoWidth: " + width + ", videoHeight: " + height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    ctx.drawImage(video, 0, 0, width, height);
    var img = canvas.toDataURL('image/jpeg');
    console.log(img);
    $(".video").html('<canvas id="canvas1"></canvas>');
    var canvas1 = document.getElementById('canvas1');
    canvas1.setAttribute("width", width);
    canvas1.setAttribute("height", height);
    var ctx1 = canvas1.getContext('2d');
    var img1 = new Image();
    img1.onload = function () {
        ctx1.drawImage(img1, 0, 0); // Or at whatever offset you like
        // alert("画像横：" + img1.width + "画像高さ：" + img1.height + ", videoWidth: " + width + ", videoHeight: " + height);
    };
    img1.src = img;
    $('#btn_update').html('<button class="btn btn-primary btn_fifty" id="ok">OK</button>'
        + '<button class="btn btn-primary btn_fifty" id="cancel">取り直し</button>');
    //OKボタンを押した時
    $("#ok").click(() => {
        getData("tempResult").then(clt => {
            var clt1 = JSON.parse(clt);
            photo.photoIndex = clt1.photoIndex;
            console.log("photo index: " + photo.photoIndex);
            photo.img = img;
            saveImg(photo).then(() => {
                console.log("写真を保存しました");
                location.href = "previewPhoto.html";
            }).catch(err => alert(err));
        }).catch(err => console.log(err));


    });
    $("#cancel").click(() => {
        $(".video").html('<video class="myVideo" id="myVideo" autoplay="1"></video>'
            + '<script type="text/javascript" src="camera.js"></script>'
            + '<canvas id="canvas" style="display:none;"></canvas>');
        $('#btn_update').html('<button id="takePhoto" class="btn btn-primary btn-lg btn-block" onclick="takePhoto()">写真撮影</button>');
        window.stream.getTracks().forEach(function (track) {
            track.stop();
        });
        navigator.mediaDevices.getUserMedia(constrains)
            .then(gotStream).catch(function (err) {
                console.log("An error occured! " + err);
            });
    });
}

function saveImg(val) {
    return new Promise((resolve, reject) => {
        var db;
        var request = indexedDB.open("fapPassport");
        request.onsuccess = function (event) {
            console.log("indexedDB.open pass onsuccess");
            db = event.target.result;
            var ts = db.transaction(["photo"], "readwrite");
            var store = ts.objectStore("photo");
            var request = store.add(val);
            request.onsuccess = function (event) {
                resolve("success put img");
            }
            request.onerror = function (event) {
                reject("エラーが発生しました。");
            }
        }
        request.onerror = function () {
            console.log("indexedDBを開くのに失敗しました");
        }
    });
}