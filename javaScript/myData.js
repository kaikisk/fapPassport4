$(function () {
    var keys = ['telFam', 'telAtten', 'bloodType', 'height', 'weight',
        'medi1', 'medi2', 'medi3',
        'anam', 'anam2', 'anam3',
        'txtName'];

    for (var i = 0; i < keys.length; i++) {
        load(keys[i]);
    }
});