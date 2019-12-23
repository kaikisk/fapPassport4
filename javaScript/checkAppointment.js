var appointments;
$(function () {
    const startTime = performance.now(); // 開始時間

    var appointmentsString = getData("appointments");
    appointmentsString.then(ap => {
        appointments = JSON.parse(ap);
        for (var i = 0; i < appointments.length; i++) {
            // console.log(i + " : " + appointments[i])
            $('#Table1').append('<tr id=table' + i + '><td>' + appointments[i].dateClient +
                '</td><td>' + appointments[i].valClient + '</td><td>' + appointments[i].detailClient
                + '</td><td><button type="button" class="btn btn-secondary" onclick="clickRegister(' + i + ')">更新</button>'
                + '<button type="button" class="btn btn-success" onclick="clickResult(' + i + ')">結果</button>'
                + '<button type="button" class="btn btn-danger" onclick="deleteAppointment(' + i + ')">削除</button></td></tr>');
        }
        const endTime = performance.now();
        alert("実行時間： " + (endTime - startTime) + " ms");
    }).catch(err => {
        console.log("検診予約が登録されていません");
        const endTime = performance.now();
        alert("実行時間： " + (endTime - startTime) + " ms");
        });

})


/*
予約の更新
*/
function clickRegister(index) {
    var appointmentsString = getData("appointments");
    appointmentsString.then(ap => {
        var appointments = JSON.parse(ap);
        var target = appointments[index];
        $('#txtDate').val(target.dateClient);
        $('#txtdetail').val(target.detailClient);
        $('select[name="type"]').val(target.valClient);
        $('#btn_update').html('<button class="btn btn-primary btn_fifty btn-block" id="update">更新</button>'
            + '<button class="btn btn-warning btn_fifty btn-block" id="cancel">キャンセル</button>');
        //更新する
        $('#update').click(() => {
            target.dateClient = $('#txtDate').val();
            target.detailClient = $('#txtdetail').val();

            for (var i = 1; i <= 7; i++) {
                if (document.getElementById("RblExamination" + i).selected) {
                    target.valClient = $('#RblExamination' + i).val();
                    break;
                }
            }

            appointments[index] = target;
            var temp = JSON.stringify(appointments);
            console.log(temp);
            saveAppointment(temp).then(() => {
                $('#btn_update').html('<button class="btn btn-primary btn-lg btn-block" id="submit" onclick="appointmentRegistration()">登録</button>');
                resetElement();
                $('#table' + index).html('<td>' + appointments[index].dateClient +
                    '</td><td>' + appointments[index].valClient + '</td><td>' + appointments[index].detailClient
                    + '</td><td><button type="button" class="btn btn-secondary" onclick="clickRegister(' + index + ')">更新</button>'
                    + '<button type="button" class="btn btn-success" onclick="clickResult(' + index + ')">結果</button>'
                    + '<button type="button" class="btn btn-danger" onclick="deleteAppointment(' + index + ')">削除</button></td></tr>');
                console.log("更新が成功しました");
            }).catch(err => console.error("更新が失敗しました"));
        });

        //更新をキャンセルする
        $('#cancel').click(() => {
            resetElement();
            $('#btn_update').html('<button class="btn btn-primary btn-lg btn-block" id="submit" onclick="appointmentRegistration()">登録</button>');
            return;
        })
    }).catch(err => console.error(err));
}

/*
検診結果を登録する
*/
function clickResult(index) {
    var appointment = getData("appointments");
    appointment.then(ap => {
        var appointments = JSON.parse(ap);
        var target = appointments[index];
        var resultPage = "result.html" + "?date=" + target.dateClient
            + "&detail=" + target.detailClient + "&val=" + target.valClient
            + "&Aindex=" + index;

        resultPage = encodeURI(resultPage);
        location.href = resultPage;
    }).catch((err) => alert(err));
}

function resetElement() {
    $('#txtDate').val("");
    $('#txtdetail').val("");
    $('select[name="type"]').val("");
}