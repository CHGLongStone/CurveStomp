$(document).ready(function () {
    var i=1;
    $('#h_id_uid').click(function () {
        $('#h_id_uid').val(create_UUID());
    })
    $('#usr_house_id').click(function () {
        $('#usr_house_id').val(create_UUID());
    })
    $('#h_mem_add').click(function(){
        var id='h_member_row'+i;
        var $elem = $( "#h_member_row" ).data( "arr", [ 1 ] ),
        $clone = $elem.clone( true,true )
        .data( "arr", $.extend( [], $elem.data( "arr" ) ) )
        .attr({"id":id}).insertAfter('#h_member_row');
        i=i+1;        
    })
    $('#h_id_pass_confirm').change(function(){
        var usrpass = $('#h_id_pass').val();
        var usrpasscnf  = $('#h_id_pass_confirm').val();
        if(usrpass==usrpasscnf)
        {
            $('#h_id_pass_confirm').css('border-color', 'green');
            $('#h_id_pass').css('border-color', 'green');
        }
        else
        {
            $('#h_id_pass_confirm').css('border-color', 'red');
            // $('#error').text="Passwords don't Match".fontcolor="red";
        }
    })

    $('#btnSubmit').click(function(e){
        var usrobj          ={};
        usrobj['usremail']    = $('#h_id_email').val();
        usrobj['usridn']      = $('#h_id_uid').val();
        usrobj['usrpass']     = $('#h_id_pass').val();
        usrobj['usr_total_mem']   = $('#h_mem_count').val();
        usrobj['usr_country']        = $('#h_loc_country').val();
        usrobj['usr_region']      = $('#h_loc_region').val();
        usrobj['usr_city']        = $('#h_loc_city').val();
        usrobj['usr_street']      = $('#h_loc_street').val();
        usrobj['usr_pcode']       = $('#h_loc_pcode').val();
        usrobj['usr_hid']         = $('#usr_hid').val();
        usrobj['usr_age']           = $('#h_mem_age').val();
        usrobj['usr_gender']        = $('#h_mem_bio_gender').val();
        usrobj['usr_cough']         = $('#m_symp_cough').val();
        usrobj['usr_cough_prod']    = $('#m_symp+cough_productive').val();
        usrobj['usr_pneumonia']  = $('#m_symp_pneumonia').val();
        usrobj['usr_breathing']     = $('#m_symp_breathing').val();
        usrobj['usr_walking']       = $('#usr_symp_walking').val();
        usrobj['usr_appetite']      = $('#usr_symp_appetite').val();
        usrobj['usr_diarrhea']      = $('#usr_symp_diarrhea').val();
        usrobj['usr_musclepain']    = $('#usr_symp_muscle_pain').val();
        usrobj['usr_fatigue']       = $('#usr_symp_fatigue').val();
        usrobj['usr_nose']          = $('#usr_symp_nose').val();
        usrobj['usr_fever']         = $('usr_symp_fever').val();
        usrobj['usr_headache']      = $('#usr_symp_headache').val();
        usrobj['usr_dizziness']     = $('#usr_symp_dizziness').val();
        usrobj['usr_nausea']        = $('#usr_symp_nausea').val();
        usrobj['usr_chills']        = $('#usr_symp_chills').val();
        usrobj['usr_gpain']         = $('#m_symp_general_pain').val();
        usrobj['usr_trans_isolation']     = $('#m_trans_isolation').val();
        usrobj['usr_trans_distance']        = $('m_trans_distance').val();
        usrobj['usr_trans_surface']         = $('#m_trans_surface').val();
        usrobj['usr_trans_human']           = $('m_trans_human').val();
        console.log(usrobj);
        // usrobj['usr_lab_tested']            = $('#m_lab_tested') 
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