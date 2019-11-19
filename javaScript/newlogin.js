$(function () {
    $('#registration').click(function (e) {
        if ($('#userID').val() == "" || $('#userPass').val() == "") {
            alert(`名前, パスワードを全て入力してください`);
            return;
        }
        if ($('#userPass').val() != $('#userPassCheck').val()) {
            alert(`パスワードが一致していません
                Password is not confirmed`);
            return;
        }
        var keys = ['userID', 'userPass'];
        Promise.all([save(keys[0]), save(keys[1])]).then(values => {
            console.log(values);
            // alert(values);
            alert("ユーザー登録をしました");
            location.href = "menu.html";
        }).catch(errs => {
            console.log(errs);
        });
        // for (var i = 0; i < keys.length; i++) {
        //     console.log("point1")
        //     save(keys[i]);
        //     if(i == keys.length - 1){
        //         save(key[i]).then(() => {
        //             alert(`ユーザーを登録しました
        //             Registered new account`);           
        //             location.href = 'menu.html'    
        //         }).catch(err => console.log(err));
        //     }   
        // }
    });
});

