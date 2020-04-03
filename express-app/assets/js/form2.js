$(document).ready(function () {
    $('#h_id_uid').click(function () {
        $('#h_id_uid').val(create_UUID());
    })
    $('#usr_house_id').click(function () {
        $('#usr_house_id').val(create_UUID());
    })

    $('#btnSubmit').click(function(e){
        var usrobj          ={};
        usrobj['usremail']    = $('#h_id_email').val();
        usrobj['usridn']      = $('#h_id_uid').val();
        usrobj['usrpass']     = $('#"h_id_pass').val();
        usrobj['usr_total_mem']   = $('#h_mem_count').val();
        usrobj['usr_country']        = $('#h_loc_country').val();
        usrobj['usr_region']      = $('#h_loc_region').val();
        usrobj['usr_city']        = $('#h_loc_city').val();
        usrobj['usr_street']      = $('#h_loc_street').val();
        usrobj['usr_pcode']       = $('#h_loc_pcode').val();
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