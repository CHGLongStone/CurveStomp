$(document).ready(function () {
    $('#usr_identity').click(function () {
        $('#usr_identity').val(create_UUID());
    })
    $('#usr_house_id').click(function () {
        $('#usr_house_id').val(create_UUID());
    })

    $('#btnsubmit').click(function(e){
        var usrobj          ={};
        usrobj['usremail']    = $('#usr_email').val();
        usrobj['usridn']      = $('#usr_identity').val();
        usrobj['usrpass']     = $('#usr_pass').val();
        usrobj['usr_total_mem']   = $('#usr_total_members').val();
        usrobj['usr_region']      = $('#usr_region').val();
        usrobj['usr_city']        = $('#usr_city').val();
        usrobj['usr_street']      = $('#usr_street').val();
        usrobj['usr_pcode']       = $('#usr_pcode').val();
        usrobj['usr_hid']         = $('#usr_hid').val();
       $.ajax({
           type: "POST",
           url: "/createuserprofile",
           dataType: 'json',
           data:usrobj,
           success:function(response){
               alert(response);
           }
       })
        


    })
    $('#usr_total_members').focusout(function () {
        var totalusr = $('#usr_total_members').val();

        document.getElementById("slider_value2").innerHTML = totalusr;
        for (var i = 0; i < totalusr; i++) {
            $("<div id='mydiv' class='field'>Age:<input type='text'>Gender:<select id='gender'><option value='1'>Male</option><option value='2'>Female</option></select></div>").appendTo("#memberdata");

        }


    });

    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
})