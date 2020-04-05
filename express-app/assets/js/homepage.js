$(document).ready(()=>{
   
    $('#h_id_signup').click(()=>{
        $('#h_location').show();
        $('#h_id_signup').css("display","none");
        $('#h_id_login').css("display","none");
        $('#h_id_pass_confirm_container').show();
        // $("#h_id_uid").prop("readonly", true);
        $('#h_id_uid').val(create_UUID());
    })
    $('#h_id_login').click(()=>{

    })

    $('#h_id_submit').click(()=>{
        var profiledata = {};
        profiledata['huid'] = $('#h_id_uid').val();
        profiledata['pass'] = $('#h_id_pass').val();
        profiledata['country']  = $('#h_loc_country').val();
        profiledata['region']   = $('h_loc_region').val();
        profiledata['city']     = $('#h_loc_city').val();
        profiledata['postal_code']  = $('#h_loc_pcode').val();
        profiledata['street_name']  = $('#h_loc_street').val();
        console.log(profiledata);

        //POSTING Data to express server

        $.ajax({
            type: "POST",
            url: "/creathouseholdprofile",
            dataType: 'json',
            data: profiledata,
            success: function (response) {
                console.log(response);
            }
        })
    })

    // Generate GUID for New Profile

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