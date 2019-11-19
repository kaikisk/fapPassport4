$(function () {
    txtName = getData("userID");
    txtPass = getData("userPass");
    // ErrText = getUserData("txtAAA");

    txtName.then((name) => {
        txtPass.then((pass) => {
            console.log("name: " + name + ", pass: " + pass);
            document.getElementById("signup").style.display = "none";
        }).catch(err => {
            console.log(err);
            alert("ユーザーPWが登録されていません");
            document.getElementById("signin").style.display = "none";
            console.log("");
        })
    }).catch(err => {
        console.log(err);
        alert("ユーザー登録がされていません");
        document.getElementById("signin").style.display = "none";
        console.log("");
    });
})

function clickLoginButton() {
    console.log("txtName2: " + txtName);
    console.log("txtPass2: " + txtPass);
    console.log("UserID: " + $('#txtUserID').val());
    console.log("pass: " + $('#txtPass').val());
    txtName.then((name) => {
        txtPass.then((pass) => {
            if($('#txtUserID').val() == name && $('#txtPass').val() == pass){
                location.href = 'menu.html';
            }
            if ($('#txtUserID').val() != name) {
                alert('ユーザーIDが違います');
                $('#txtUserID').val("");
            }
            if ($('#txtPass').val() != pass) {
                alert('パスワードが違います');
                $('#txtPass').val("");
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
}