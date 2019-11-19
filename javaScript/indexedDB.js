$(function createDatabase() {
    return new Promise(function (resolve, reject) {
        var db;
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;

        if (indexedDB) {
            // データベースを削除したい場合はコメントを外します。
            //indexedDB.deleteDatabase("mydb");
            var openRequest = indexedDB.open("fapPassport");

            openRequest.onupgradeneeded = function (event) {
                // データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
                console.dir(event);
                db = event.target.result;
                var store = db.createObjectStore("fapPass", { keyPath: "id" });
                store.createIndex("myvalueIndex", "myvalue");
                console.log("pass onupgradeneeded");
                var store1 = db.createObjectStore("photo", { keyPath: "id", autoIncrement: true });
                store1.createIndex("myvalueIndex", "myvalue");
            }


            openRequest.onsuccess = function (event) {
                db = event.target.result;
                console.log("pass onsuccess");
                console.dir("db: " + db);
                db.close();
                return;
            }
        } else {
            window.alert("このブラウザではIndexed DataBase API は使えません。");
        }
    })
});

//fapPassのデータの取得
function getData(key) {
    return new Promise(function (resolve, reject) {
        var db;
        var request = indexedDB.open('fapPassport');
        request.onsuccess = function (event) {
            db = event.target.result;
            var ts = db.transaction(["fapPass"], "readwrite");
            var store = ts.objectStore("fapPass");
            var requestName = store.get(key);
            requestName.onsuccess = function (event) {
                if (event.target.result !== undefined) {
                    // console.log("key: " + key + ", value: " + event.target.result.myvalue);
                    resolve(event.target.result.myvalue);
                } else {
                    reject(key + "の取得の失敗")
                }
            }
        }
        request.onerror = function () {
            alert("インデックスDBのエラーが起こっています");
        }
    });
};

//写真の取得
function getPhoto(index) {
    var canvas = $(".prevPhoto");
    var results = {};
    var i = 0;
    return new Promise(function (resolve, reject) {
        var db;
        var request = indexedDB.open('fapPassport');
        request.onsuccess = function (event) {
            db = event.target.result;
            var ts = db.transaction(["photo"], "readwrite");
            var store = ts.objectStore("photo");
            var requestName = store.openCursor();
            requestName.onsuccess = function (event) {
                var cursor = event.target.result;
                if (!cursor) {
                    results.i = i;
                    // console.dir(results);
                    // console.log("end");
                    resolve(results);
                    return;
                }
                if (cursor.value.photoIndex == index) {
                    results[i] = cursor.value;
                    results[i].id = cursor.key;
                    canvas.append('<img class="cnv" id="img' + cursor.key + '" style="display:none;"></img>' 
                    + '<button id="delete' + cursor.key + '" class="btn btn-danger btn-lg btn-block" onclick="deleteImg(' + cursor.key + ')">削除</button>'
                    + '<br />');
                    i++;
                    cursor.continue();
                }else{
                    cursor.continue();
                }
            }
        }
        request.onerror = function () {
            reject("写真の取得が失敗しました")
            alert("インデックスDBのエラーが起こっています");
        }
    });
};

function save(key) {
    return new Promise((resolve, reject) => {
        var db;
        var request = indexedDB.open("fapPassport");
        request.onsuccess = function (event) {
            // console.log("indexedDB.open pass onsuccess");
            db = event.target.result;
            var ts = db.transaction(["fapPass"], "readwrite");
            var store = ts.objectStore("fapPass");
            if ($('#' + key).val() != "") {
                var request = store.put({ id: key, myvalue: $('#' + key).val() });
                request.onsuccess = function (event) {
                    resolve(key + " : " + $('#' + key).val());
                }
                request.onerror = function (event) {
                    reject("エラーが発生しました。");
                }
            } else {
                resolve(key + "が入力されていません");
            }
        }
        request.onerror = function () {
            console.log("indexedDBを開くのに失敗しました");
        }
    });
}

function load(key) {
    var db;
    var request = indexedDB.open('fapPassport');
    request.onsuccess = function (event) {
        db = event.target.result;
        var ts = db.transaction(["fapPass"], "readwrite");
        var store = ts.objectStore("fapPass");
        var request = store.get(key);
        request.onsuccess = function (event) {
            if (event.target.result !== undefined) {
                var value = event.target.result.myvalue;
                if (value !== undefined) {
                    // console.log("key: " + key + ", value: " + value);
                    $("#" + key).text(value);
                    return;

                }
            } else {
                console.error(key + "の取得の失敗");
            }
        }
        request.onerror = function (event) {
            console.error("エラーが発生しました。");
        }
    }
}

function loadE(key) {
    var db;
    var request = indexedDB.open('fapPassport');
    request.onsuccess = function (event) {
        db = event.target.result;
        var ts = db.transaction(["fapPass"], "readwrite");
        var store = ts.objectStore("fapPass");
        var request = store.get(key);
        request.onsuccess = function (event) {
            if (event.target.result !== undefined) {
                var value = event.target.result.myvalue;
                if (value !== undefined) {
                    if (key != "bloodType") {
                        // console.log("key: " + key + ", value: " + value);
                        $("#" + key).val(value);
                        $("#" + key).text(value);
                        return;
                    } else {
                        $("#" + key).val(value);
                    }
                }
            } else {
                console.error(key + "の取得の失敗");
            }
        }
        request.onerror = function (event) {
            console.error("エラーが発生しました。");
        }
    }
}

function saveReservation(key, appoint) {
    return new Promise((resolve, reject) => {
        var db;
        var request = indexedDB.open("fapPassport");
        request.onsuccess = function (event) {
            console.log("pass onsuccess");
            db = event.target.result;
            var ts = db.transaction(["fapPass"], "readwrite");
            var store = ts.objectStore("fapPass");
            var request = store.put({ id: key, myvalue: appoint });
            request.onsuccess = function (event) {
                resolve(key + " : " + $('#' + key).val());
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

function saveAppointment(appoint) {
    var key = "appointments"
    return new Promise((resolve, reject) => {
        var db;
        var request = indexedDB.open("fapPassport");
        request.onsuccess = function (event) {
            // console.log("pass onsuccess");
            db = event.target.result;
            var ts = db.transaction(["fapPass"], "readwrite");
            var store = ts.objectStore("fapPass");
            var request = store.put({ id: "appointments", myvalue: appoint });
            request.onsuccess = function (event) {
                resolve(key + " : " + $('#' + key).val());
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

//検診予約の削除
function deleteAppointment(index) {
    var appointmentsString = getData("appointments");
    appointmentsString.then(ap => {
        if (ap) {
            var appointments = JSON.parse(ap);
            appointments.splice(index, 1);
            // console.log("削除後のappointments");
            // console.dir(appointments);
            var temp = JSON.stringify(appointments);
            saveAppointment(temp).then(() => {
                $('#table' + index).remove();
                console.log("削除成功");
            }).catch(err => {
                console.error("削除後のappointmentsの更新失敗");
            });
            console.log(temp);
        }
    })
}

//結果登録後のアポの削除
function deleteAppointment1(index) {
    var appointmentsString = getData("appointments");
    appointmentsString.then(ap => {
        if (ap) {
            var appointments = JSON.parse(ap);
            appointments.splice(index, 1);
            // console.log("削除後のappointments");
            // console.dir(appointments);
            var temp = JSON.stringify(appointments);
            saveAppointment(temp).then(() => {
                console.log("削除成功");
            }).catch(err => {
                console.error("削除後のappointmentsの更新失敗");
            });
            console.log(temp);
        }
    })
}

function deleteValue(objectName ,key) {
    var db;
    var request = indexedDB.open("fapPassport");
    request.onsuccess = function (event) {
        db = event.target.result;
        var ts = db.transaction([objectName], "readwrite");
        var store = ts.objectStore(objectName);
        var requestName = store.delete(key);

        requestName.onsuccess = (evet) => {
            console.log("削除しました");
        }
    }
}

function deleteImg(id) {
    var db;
    var request = indexedDB.open('fapPassport');
    request.onsuccess = function (event) {
        db = event.target.result;
        var ts = db.transaction(["photo"], "readwrite");
        var store = ts.objectStore("photo");
        var requestName = store.delete(id);

        requestName.onsuccess = () => {
            $("#img" + id).remove();
            $("#delete" + id).remove();
            getData("tempResult").then(rs => {
                temp = JSON.parse(rs);
                temp.number = temp.number - 1;
                saveTemp1(temp);
            }).catch(err => console.error(err));
            console.log("画像の削除完了");
        }
    }   
}

function saveTemp1(client) {
    var temp = JSON.stringify(client);
    saveReservation("tempResult", temp).then(() => {
      console.log("一時保存しました");
    }).catch(err => console.error(err));
  }