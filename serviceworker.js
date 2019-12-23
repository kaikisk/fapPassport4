var ORIGIN = location.protocol + '//' + location.hostname + '/fapPassport3';
var STATIC_CACHE_NAME = 'static_v2';
console.log('ORIGIN : ' + ORIGIN);
var STATIC_FILES = [
  ORIGIN + '/',
  ORIGIN + '/index.html',
  ORIGIN + '/HTML/newlogin.html',
  ORIGIN + '/HTML/menu.html',
  ORIGIN + '/HTML/apps.html',
  ORIGIN + '/HTML/myData.html',
  ORIGIN + '/HTML/editMyData.html',
  ORIGIN + '/HTML/appointment.html',
  ORIGIN + '/HTML/result.html',
  ORIGIN + '/HTML/previewPhoto.html',
  ORIGIN + '/HTML/takephoto.html',

  ORIGIN + '/bootstrap.min.css',
  ORIGIN + '/custom.css',
  ORIGIN + '/jquery-2.2.4.min.js',

  ORIGIN + '/clinic/clinicalData.html',
  ORIGIN + '/clinic/clinic1/clinic1.html',
  ORIGIN + '/clinic/clinic1/shikkan1.png',
  ORIGIN + '/clinic/clinic1/shikkan2.png',
  ORIGIN + '/clinic/clinic1/shikkan3.png',

  ORIGIN + '/javaScript/indexedDB.js',
  ORIGIN + '/javaScript/login.js',
  ORIGIN + '/javaScript/newlogin.js',
  ORIGIN + '/javaScript/myData.js',
  ORIGIN + '/javaScript/editmydata.js',
  ORIGIN + '/javaScript/previewPhoto.js',
  ORIGIN + '/javaScript/camera.js',
  ORIGIN + '/javaScript/appointment.js',
  ORIGIN + '/javaScript/checkAppointment.js',
  ORIGIN + '/javaScript/result.js',
  ORIGIN + '/javaScript/checkResult.js',
];

var STATIC_FILE_URL_HASH = {};
STATIC_FILES.forEach(function (x) { STATIC_FILE_URL_HASH[x] = true });

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(function (cache) {
        console.log('Install cache');
        return cache.addAll(STATIC_FILES);
      })
  )
})

self.addEventListener('fetch', function (event) {
  //ブラウザが回線に接続しているかをboolで返してくれる
  var online = navigator.onLine;

  //回線が使えるときの処理
  if (online) {
    console.log("online!!!");
    event.respondWith(
      caches.match(event.request)
        .then(
          function (response) {
            if (response) {
              return response;
            }
            //ローカルにキャッシュがあればすぐ返して終わりですが、
            //無かった場合はここで新しく取得します
            return fetch(event.request)
              .then(function (response) {
                // 取得できたリソースは表示にも使うが、キャッシュにも追加しておきます
                // ただし、Responseはストリームなのでキャッシュのために使用してしまうと、ブラウザの表示で不具合が起こる(っぽい)ので、複製しましょう
                cloneResponse = response.clone();
                if (response) {
                  //ここ&&に修正するかもです
                  if (response || response.status == 200) {
                    //現行のキャッシュに追加
                    caches.open(STATIC_CACHE_NAME)
                      .then(function (cache) {
                        cache.put(event.request, cloneResponse)
                          .then(function () {
                            //正常にキャッシュ追加できたときの処理(必要であれば)
                          });
                      });
                  } else {
                    //正常に取得できなかったときにハンドリングしてもよい
                    return response;
                  }
                  return response;
                }
              }).catch(function (error) {
                //デバッグ用
                return console.log(error);
              });
          })
    );
  } else {
    console.log("offline!!!");
    //オフラインのときの制御
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true })
        .then(function (response) {
          // キャッシュがあったのでそのレスポンスを返す
          if (response) {
            return response;
          }
          //オフラインでキャッシュもなかったパターン
          return caches.match("offline.html")
            .then(function (responseNodata) {
              //適当な変数にオフラインのときに渡すリソースを入れて返却
              //今回はoffline.htmlを返しています
              return responseNodata;
            });
        }
        )
    );
  }
});

const STATIC_CACHE_NAMES = [
  STATIC_CACHE_NAME
];

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.filter(function (key) {
            return !STATIC_CACHE_NAMES.includes(key);
          }).map(function (key) {
            return caches.delete(key);
          })
        );
      })
  );
});