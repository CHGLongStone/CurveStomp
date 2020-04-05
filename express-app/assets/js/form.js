let form_data = {
    "household": {
        "identity": {
            "email": null,
            "unique_identifier": null,
            "passcode": null,
            "confirm_passcode": null
        },
        "location": {
            "country": null,
            "region": null,
            "city": null,
            "street_name": null,
            "postal_code": null
        }
    },
    "members": {}
};

$(document).ready(function () {
    var i = 1;
    var usrobj = {};
    var household = {};
    var identity = {};
    var location = {};
    var members = {};
    var symptoms = {};
    var transmissions = {};
    var clinical_findings = {};


    $('#h_id_load').click(() => {
        var exidn = {};
        exidn['identity'] = $('#h_id_uid').val();
        exidn['pass'] = $('#h_id_pass').val();

        if (exidn['identity'] != null && exidn['pass'] != null) {
            $.ajax({
                type: "POST",
                url: "/login",
                dataType: 'json',
                data: exidn,
                success: function (response) {
                    console.log(response);
                }
            })

        }
    });

    $('#h_id_create').click(() => {
        $('#h_id_pass_confirm')[0].parentNode.removeAttribute("style");
    });

    $('#h_id_uid').click((e) => {
        e.target.value = create_UUID();
    });

    $('#usr_house_id').click((e) => {
        e.target.value = create_UUID();
    });


    $('#h_member_row').find('#h_mem_alias').on('input', function () {

        var age = $('#h_member_row').find('#h_mem_age').val();
        var gender = $('#h_member_row').find('#h_mem_bio_gender').val();
        var alias = $('#h_member_row').find('#h_mem_alias').val();
        if (age == null || age == '') {
            $('#h_member_row').find('#h_mem_age').css('border-color', 'red');

        } else {
            $('#h_member_row').find('#h_mem_age').css('border-color', 'green');
        }
        if (alias == null || alias == '') {
            $('#h_member_row').find('#h_mem_alias').css('border-color', 'red');

        } else {
            $('#h_member_row').find('#h_mem_alias').css('border-color', 'green');
        }
        $('#h_member_row').find('legend').html(age + gender + '-' + alias);
    });

    $('#h_mem_add').click(function () {
        var id = 'h_member_row' + i;
        $('#h_member_row').clone(false, false).attr({"id": id}).insertAfter('#h_member_row');
        i = i + 1;
    });

    $('#h_id_pass_confirm').change(function () {
        var usrpass = $('#h_id_pass').val();
        var usrpasscnf = $('#h_id_pass_confirm').val();
        if (usrpass == usrpasscnf) {
            $('#h_id_pass_confirm').css('border-color', 'green');
            $('#h_id_pass').css('border-color', 'green');
        } else {
            $('#h_id_pass_confirm').css('border-color', 'red');
            // $('#error').text="Passwords don't Match".fontcolor="red";
        }
    })

    $('#h_loc_country').focusout(() => {
        if (location['country'] == null) {
            $('#h_loc_country').css('border-color', 'red');
        }
    })
    $('#h_loc_city').focusout(() => {
        if (location['city'] == null) {
            $('#h_loc_city').css('border-color', 'red');
        }
    })
    $('#h_loc_region').focusout(() => {
        if (location['region'] == null) {
            $('#h_loc_region').css('border-color', 'red');
        }
    })
    $('#h_loc_street').focusout(() => {
        if (location['street_name'] == null) {
            $('#h_loc_street').css('border-color', 'red');
        }
    })
    $('#h_loc_pcode').focusout(() => {
        if (location['postal_code'] == null) {
            $('#h_loc_pcode').css('border-color', 'red');
        }
    })
    $('#h_loc_country').on('input', () => {
        location['country'] = $('#h_loc_country').val();
        if (location['country'] == null) {
            $('#h_loc_country').css('border-color', 'red');
        } else {
            $('#h_loc_country').css('border-color', 'green');
        }
    })
    $('#h_loc_city').on('input', () => {
        location['city'] = $('#h_loc_city').val();
        if (location['city'] == null) {
            $('#h_loc_city').css('border-color', 'red');
        } else {
            $('#h_loc_city').css('border-color', 'green');
        }
    })
    $('#h_loc_region').on('input', () => {
        location['region'] = $('#h_loc_region').val();
        if (location['region'] == null) {
            $('#h_loc_region').css('border-color', 'red');
        } else {
            $('#h_loc_region').css('border-color', 'green');
        }
    })

    $('#h_loc_pcode').on('input', () => {
        location['postal_code'] = $('#h_loc_pcode').val();
        if (location['postal_code'] == null) {
            $('#h_loc_pcode').css('border-color', 'red');
        } else {
            $('#h_loc_pcode').css('border-color', 'green');
        }
    })
    $('#h_loc_street').on('input', () => {
        location['street_name'] = $('#h_loc_street').val();
        if (location['street_name'] == null) {
            $('#h_loc_street').css('border-color', 'red');
        } else {
            $('#h_loc_street').css('border-color', 'green');
        }
    })

    $('#h_member_row').find('#h_mem_age').on('input', () => {
        var mage = $('#h_member_row').find('#h_mem_age').val();
        if (mage == null) {
            $('#h_member_row').find('#h_mem_age').css('border-color', 'red');
        } else {
            $('#h_member_row').find('#h_mem_age').css('border-color', 'green');
        }
    })


    $('#btnSubmit').click(function (e) {
        identity['email'] = $('#h_id_email').val();
        identity['unique_id'] = $('#h_id_uid').val();
        identity['passcode'] = $('#h_id_pass').val();
        location['region'] = $('#h_loc_region').val();
        location['city'] = $('#h_loc_city').val();
        location['street_name'] = $('#h_loc_street').val();
        location['postal_code'] = $('#h_loc_pcode').val();
        household['identity'] = identity;
        household['location'] = location;
        usrobj['household'] = household;
        usrobj['usr_total_mem'] = $('#h_mem_count').val();
        usrobj['usr_hid'] = $('#usr_hid').val();
        usrobj['usr_age'] = $('#h_mem_age').val();
        usrobj['usr_gender'] = $('#h_mem_bio_gender').val();
        usrobj['usr_cough'] = $('#m_symp_cough').val();
        usrobj['usr_cough_prod'] = $('#m_symp+cough_productive').val();
        usrobj['usr_pneumonia'] = $('#m_symp_pneumonia').val();
        usrobj['usr_breathing'] = $('#m_symp_breathing').val();
        usrobj['usr_walking'] = $('#usr_symp_walking').val();
        usrobj['usr_appetite'] = $('#usr_symp_appetite').val();
        usrobj['usr_diarrhea'] = $('#usr_symp_diarrhea').val();
        usrobj['usr_musclepain'] = $('#usr_symp_muscle_pain').val();
        usrobj['usr_fatigue'] = $('#usr_symp_fatigue').val();
        usrobj['usr_nose'] = $('#usr_symp_nose').val();
        usrobj['usr_fever'] = $('usr_symp_fever').val();
        usrobj['usr_headache'] = $('#usr_symp_headache').val();
        usrobj['usr_dizziness'] = $('#usr_symp_dizziness').val();
        usrobj['usr_nausea'] = $('#usr_symp_nausea').val();
        usrobj['usr_chills'] = $('#usr_symp_chills').val();
        usrobj['usr_gpain'] = $('#m_symp_general_pain').val();
        usrobj['usr_trans_isolation'] = $('#m_trans_isolation').val();
        usrobj['usr_trans_distance'] = $('m_trans_distance').val();
        usrobj['usr_trans_surface'] = $('#m_trans_surface').val();
        usrobj['usr_trans_human'] = $('m_trans_human').val();
        console.log(usrobj);
        // usrobj['usr_lab_tested']            = $('#m_lab_tested') 
        $.ajax({
            type: "POST",
            url: "/createuserprofile",
            dataType: 'json',
            data: usrobj,
            success: function (response) {
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


    // Add a new member row when 'add new member' is clicked
    function saveMemberRow(memb_row) {

        memb_row = $(memb_row);

        // Grab input values
        let m_age = memb_row.find('#h_mem_age').val();
        let m_sex = memb_row.find('#h_mem_bio_gender').val();
        let m_alias = memb_row.find('#h_mem_alias').val().toUpperCase();

        // TODO: Validate input values
        if (([m_age, m_sex].includes(null) || [m_age, m_sex].includes(''))) {
            console.log("INVALID MEMBER ROW: " + m_age + ',' + m_sex + ',' + m_alias);
            return false;
        }
        let memb_id = m_age + m_sex + '-' + m_alias;
        if (memb_id in form_data['members']) {
            console.log("DUPLICATE MEMBER EXISTS: " + memb_id);
            return false;
        }
        let prev_memb_id = memb_row.find('legend').html();
        if (prev_memb_id != "AAAS-NN") {
            console.log("Swapping: " + prev_memb_id);
            // We are altering a member. Preserve all data, then remove.
            form_data['members'][memb_id] = form_data['members'][prev_memb_id];
            delete form_data['members'][prev_memb_id];
        } else {
            form_data['members'][memb_id] = {};
        }

        // Save data.
        form_data['members'][memb_id]['age'] = m_age;
        form_data['members'][memb_id]['sex'] = m_sex;
        form_data['members'][memb_id]['alias'] = m_alias;

        // Update UI
        memb_row.find('legend').html(memb_id);
        return true;
    }

    function delMember(memb_row) {
        // TODO: prompt user for confirmation before deleting
        memb_row = $(memb_row);

        let prev_memb_id = memb_row.find('legend').html();
        if (prev_memb_id == "AAAS-NN") {
            // We are altering a member. Preserve all data, then remove.
            memb_row.attr({"id": 'AAAS-NN'});
            memb_row.find('#h_mem_age').val(null);
            memb_row.find('#h_mem_sex').val(null);
            memb_row.find('#h_mem_alias').val(null);
        } else {
            let m_age = memb_row.find('#h_mem_age').val();
            let m_sex = memb_row.find('#h_mem_bio_gender').val();
            let m_alias = memb_row.find('#h_mem_alias').val().toUpperCase();
            let memb_id = m_age + m_sex + '-' + m_alias;
            if (memb_id in form_data['members']) {
                delete form_data['members'][memb_id];
            }
            memb_row.remove();
        }
    }

    $('#h_mem_save').click((e) => {
        saveMemberRow(e.target.parentNode.parentNode.parentNode);
    });

    $('#h_mem_del').click((e) => {
        delMember(e.target.parentNode.parentNode.parentNode)
    });

    $('#h_mem_add').click(() => {
        let prv = $('fieldset.h_member_row:nth-last-of-type(1)');
        let nxt = prv;
        if (saveMemberRow(prv)) {
            nxt = prv.clone().insertAfter(prv);
            nxt.find('#h_mem_save').click((e) => {
                saveMemberRow(e.target.parentNode.parentNode.parentNode);
            });
            nxt.find('#h_mem_del').click((e) => {
                delMember(e.target.parentNode.parentNode.parentNode);
            });
        }
        nxt.attr({"id": 'AAAS-NN'});
        nxt.find('#h_mem_age').val(null);
        nxt.find('#h_mem_sex').val(null);
        nxt.find('#h_mem_alias').val(null);
        nxt.find('legend').html("AAAS-NN");
        return prv;
    });
});