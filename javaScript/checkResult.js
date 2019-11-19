$(function () {
    var resultsString = getData("results");

    resultsString.then(result => {
        var results = JSON.parse(result);
        console.log("pass results");
        for (var i = 0; i < results.length; i++) {
            $('#Table1').append('<tr id=table' + i + '><td>' + results[i].dateClient +
                '</td><td>' + results[i].valClient + '</td><td>' + results[i].detailClient
                + "</td><td>" + results[i].resClient
                + '</td><td><button type="button" class="btn btn-primary" onclick="clickResult1(' +
                i + ')">結果</button></td></tr>');
        }
    }).catch(() => console.log("診察予約、結果が登録されていません"));
})

function clickResult1(index) {
    var resultsString = getData("results");

    resultsString.then(result => {

        var results = JSON.parse(result);
        var target = results[index];
        $('#txtDate').val(target.dateClient);
        $('#txtdetail').val(target.detailClient);
        $('#Examination').val(target.valClient);
        $('#rblresult').val(target.resClient);
        $("#photoNumber").text("（" + target.number + "枚）");
        console.log("photoIndex: " + photoIndex);
        target.index = index;
        index = index;
        photoIndex = target.photoIndex;

        $('#btn_update').html('<button class="btn btn-primary btn_fifty" id="update">更新</button>'
            + '<button class="btn btn-primary btn_fifty yellow_color" id="cancel">キャンセル</button>');

        $("#movePhoto").off();

        $(document).on('click', '#movePhoto', () => {
            target.dateClient = $('#txtDate').val();
            target.detailClient = $('#txtdetail').val();
            target.valClient = $('#Examination').val();
            target.resClient = $('#rblresult').val();
            console.log("target: ");
            console.dir(target);
            saveTemp(target);
        });

        $('#update').click(() => {
            target.dateClient = $("#txtDate").val();
            target.detailClient = $('#txtdetail').val();
            target.valClient = $('#Examination').val();
            target.resClient = $("#rblresult").val();
            results[index] = target;
            var temp = JSON.stringify(results);
            saveReservation("results", temp).then(() => {
                alert("更新しました");
                resetElement();
                $('#table' + index).html('<td>' + results[index].dateClient +
                    '</td><td>' + results[index].valClient + '</td><td>' + results[index].detailClient
                    + '</td><td>' + results[index].resClient
                    + '<td><button type="button" class="btn btn-primary" onclick="clickResult1(' + index + ')">結果</button></td>');

                $('#btn_update').html('<button class="btn btn-primary btn-lg btn-block" id="submit" onclick="resultRegistration()">登録</button>');
            }).catch((err) => alert(err));
        });

        $('#cancel').click(() => {
            resetElement();
            $('#btn_update').html('<button class="btn btn-primary btn-lg btn-block" id="submit" onclick="resultRegistration()">登録</button>');
            return;
        })
    }).catch((err) => alert(err));
}
