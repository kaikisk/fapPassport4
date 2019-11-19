$(function() {
    var keys = ['telFam', 'telAtten','bloodType','height','weight',
    'medi1','medi2','medi3',
    'anam','anam2','anam3',
    'txtName'];
    var saveData = new Array();
    // var loadData = new Array();
    for(var i = 0; i < keys.length; i++) {
        loadE(keys[i]);
    }

    $('#update').click(function(e){
        for(var i = 0; i < keys.length; i++) {
            saveData.push(save(keys[i]));
        }
        Promise.all(saveData).then(values =>{
            console.log(values);
            // alert(values);
            location.href="myData.html";
        }).catch(errs => {
            alert(errs);
        })
        
    });
});