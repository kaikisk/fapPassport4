function appointmentRegistration() {
    // $('#Table1').empty();
    var date = $('#txtDate').val();
    var detail = $('#txtdetail').val();
    var val = '';
    for (var i = 1; i <= 7; i++) {
        if (document.getElementById("RblExamination" + i).selected) {
            val = $('#RblExamination' + i).val();
            break;
        }
    }
    var client = {
        dateClient: date,
        valClient: val,
        detailClient: detail
    }

    var appointmentsString = getData("appointments");

    appointmentsString.then(ap => {
        if (ap) {
            var appointments = JSON.parse(ap);
            var L = appointments.length;
            appointments[L] = client;
            var temp = JSON.stringify(appointments);
            console.dir(temp);
            saveAppointment(temp).then(() => {
                alert("登録が完了しました");
                resetElement();
                $('#Table1').append('<tr id=table' + L + '><td>' + appointments[L].dateClient +
                    '</td><td>' + appointments[L].valClient + '</td><td>' + appointments[L].detailClient
                    + '</td><td><button type="button" class="btn btn-secondary" onclick="clickRegister(' + L + ')">更新</button>' 
                    + '<button type="button" class="btn btn-success" onclick="clickResult(' + L + ')">結果</button>'
                    + '<button type="button" class="btn btn-danger" onclick="deleteAppointment(' + L + ')">削除</button></td></tr>');
                console.log("表示完了");
            }).catch(err => alert(err));
        }
    }).catch(err => {
        console.log(err + "はまだ登録されていません");
        var appointments = [client];
        var temp = JSON.stringify(appointments);
        console.dir(temp);
        saveAppointment(temp).then(() => {
            alert("登録が完了しました");
            resetElement();
            $('#Table1').append('<tr id=table' + 0 + '><td>' + appointments[0].dateClient +
                '</td><td>' + appointments[0].valClient + '</td><td>' + appointments[0].detailClient
                + '</td><td><button type="button" class="btn btn-secondary" onclick="clickRegister(' + 0 + ')">更新</button>' 
                + '<button type="button" class="btn btn-success" onclick="clickResult(' + 0 + ')">結果</button>' 
                + '<button type="button" class="btn btn-danger" onclick="deleteAppointment(' + 0 + ')">削除</button></td></tr>');
        }).catch(err => alert(err));
    })

}

function regCount(){
    
    var count = $('#count').val();
    var date = $('#txtDate').val();
    var detail = $('#txtdetail').val();
    var val = '';
    alert(count + "回");
    for (var i = 1; i <= 7; i++) {
        if (document.getElementById("RblExamination" + i).selected) {
            val = $('#RblExamination' + i).val();
            break;
        }
    }
    var client = {
        dateClient: date,
        valClient: val,
        detailClient: detail
    }

    // var appointmentsString = localStorage.getItem('appointments');
    // if (appointmentsString) {
    //     var appointments = JSON.parse(appointmentsString);
    //     var L = appointments.length;
    // } else {
    //     var appointments; 
    //     var L = 0;
    // }
    // for(var i=0; count > i; i++){
    //     appointments[L+i] = client;
    // }
    // appointmentsString = JSON.stringify(appointments);
    // localStorage.setItem('appointments',appointmentsString);

    var appointmentsString = getData("appointments");

    appointmentsString.then(ap => {
        if (ap) {
            var appointments = JSON.parse(ap);
            var L = appointments.length;
            // appointments[L] = client;
            for(var i = 0; count > i; i++){
                appointments[L + i] = client;
            }
            var temp = JSON.stringify(appointments);
            console.log(temp);
            saveAppointment(temp).then(() => {
                alert("登録が完了しました");
                resetElement();
                for(var i = 0; count > i; i++){
                    $('#Table1').append('<tr id=table' + (L+i) + '><td>' + appointments[L+i].dateClient +
                    '</td><td>' + appointments[L+i].valClient + '</td><td>' + appointments[L+i].detailClient
                    + '</td><td><button type="button" class="btn btn-secondary" onclick="clickRegister(' + (L+i) + ')">更新</button>' 
                    + '<button type="button" class="btn btn-success" onclick="clickResult(' + (L+i) + ')">結果</button>'
                    + '<button type="button" class="btn btn-danger" onclick="deleteAppointment(' + (L+i) + ')">削除</button></td></tr>');
                }   
                console.log("表示完了");
            }).catch(err => alert(err));
        }
    }).catch(err => {
        console.log(err + "はまだ登録されていません");
        var appointments;
        for(var i = 0; count > i; i++){
            appointments[i] = client;
        }
        var temp = JSON.stringify(appointments);
        saveAppointment(temp).then(() => {
            alert("登録が完了しました");
            resetElement();
            for(var i = 0; count > i; i++){
                $('#Table1').append('<tr id=table' + i + '><td>' + appointments[i].dateClient +
                '</td><td>' + appointments[i].valClient + '</td><td>' + appointments[i].detailClient
                + '</td><td><button type="button" class="btn btn-secondary" onclick="clickRegister(' + i + ')">更新</button>' 
                + '<button type="button" class="btn btn-success" onclick="clickResult(' + i + ')">結果</button>' 
                + '<button type="button" class="btn btn-danger" onclick="deleteAppointment(' + i + ')">削除</button></td></tr>');
            }
        }).catch(err => alert(err));
    })
}