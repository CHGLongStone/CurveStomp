function load_user_data(user_id, passcode) {
//    Attempt to retrieve user's data based on the unique ID
    console.log("Attempting to load:" + user_id)
}

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
    $('#member').toggle("hidden");

    // Handle changes to household:identity:unique_identifier
    $('#h_id_uid').change((e) => {
        console.log(e.target.value + ',' + $('#h_id_pass').val());
        load_user_data(e.target.value);
        if (form_data['household']['identity']['unique_identifier'] == null) {
            form_data['household']['identity']['unique_identifier'] = e.target.value;
        }
    });

    // Reveal the 'confirm passcode' field when 'create id' is clicked
    $('#h_id_create').click(() => {
        $('#h_id_pass_confirm')[0].parentNode.removeAttribute("style");
    });

    // Handle changes to household:identity:passcode
    $('#h_id_pass').change((e) => {
        form_data['household']['identity']['passcode'] = e.target.value;
    });

    // Handle changes to household:identity:confirm_passcode
    $('#h_id_pass_confirm').change((e) => {
        form_data['household']['identity']['confirm_passcode'] = e.target.value;
    });

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
        form_data['members'][memb_id] = {
            'age': m_age,
            'sex': m_sex,
            'alias': m_alias
        };

        // Update UI
        memb_row.find('legend').html(memb_id);
        memb_row.attr('id', memb_id);
        let btn = memb_row.find('#h_mem_save');
        btn.clone().attr('id', 'h_mem_delete').val('Delete').insertAfter(btn).click((e) => {
            delMember(e.target.parentNode.parentNode.parentNode);
        });
        btn.clone().attr('id', 'h_mem_report').val('Report').insertAfter(btn).click(() => {
            $('#m_cur_memcode').html(memb_id);
            $('#member')[0].classList.toggle('hidden');
            $('#household')[0].classList.toggle('hidden');
        });
        return true;
    }

    function delMember(memb_row) {
        // TODO: prompt user for confirmation before deleting
        memb_row = $(memb_row);

        let prev_memb_id = memb_row.find('legend').html();

        if (prev_memb_id == "AAAS-NN") {
            memb_row.attr("id", 'AAAS-NN');
            memb_row.find('#h_mem_age').val(null);
            memb_row.find('#h_mem_sex').val(null);
            memb_row.find('#h_mem_alias').val(null);
        } else {
            // Wipe data from form_data
            let m_age = memb_row.find('#h_mem_age').val();
            let m_sex = memb_row.find('#h_mem_bio_gender').val();
            let m_alias = memb_row.find('#h_mem_alias').val().toUpperCase();
            let memb_id = m_age + m_sex + '-' + m_alias;
            if (memb_id in form_data['members']) {
                delete form_data['members'][memb_id];
            }
            // Make sure not to remove the last slot, so that users can enter new members
            if (jQuery.isEmptyObject(form_data['members'])) {
                memb_row.attr({"id": 'AAAS-NN'});
                memb_row.find('#h_mem_age').val(null);
                memb_row.find('#h_mem_sex').val(null);
                memb_row.find('#h_mem_alias').val(null);
                memb_row.find('legend').html("AAAS-NN");
                memb_row.find('#h_mem_delete').remove();
                memb_row.find('#h_mem_report').remove();
            } else {
                memb_row.remove();
            }
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
        if (saveMemberRow(prv) || prv.find("legend").html() != "AAAS-NN") {
            nxt = prv.clone().insertAfter(prv);
            nxt.find('#h_mem_save').click((e) => {
                saveMemberRow(e.target.parentNode.parentNode.parentNode);
            });
        }
        nxt.attr({"id": 'AAAS-NN'});
        nxt.find('#h_mem_delete').remove();
        nxt.find('#h_mem_report').remove();
        nxt.find('#h_mem_age').val(null);
        nxt.find('#h_mem_sex').val(null);
        nxt.find('#h_mem_alias').val(null);
        nxt.find('legend').html("AAAS-NN");
    });

    $('#btnSubmit').click(() => {
        let memb_id = $('#m_cur_memcode').html();

        // TODO: Validate all the data in this member's report

        // store data into data store
        form_data['members'][memb_id]['symptoms'] = {
            'm_symp_cough': $('#m_symp_cough').val(),
            'm_symp_cough_productive': $('#m_symp_cough_productive').val(),
            'm_symp_pneumonia': $('#m_symp_pneumonia').val(),
            'm_symp_breathing': $('#m_symp_breathing').val(),
            'm_symp_walking': $('#m_symp_walking').val(),
            'm_symp_appetite': $('#m_symp_appetite').val(),
            'm_symp_diarrhea': $('#m_symp_diarrhea').val(),
            'm_symp_muscle_pain': $('#m_symp_muscle_pain').val(),
            'm_symp_fatigue': $('#m_symp_fatigue').val(),
            'm_symp_nose': $('#m_symp_nose').val(),
            'm_symp_throat': $('#m_symp_throat').val(),
            'm_symp_fever': $('#m_symp_fever').val(),
            'm_symp_headache': $('#m_symp_headache').val(),
            'm_symp_dizziness': $('#m_symp_dizziness').val(),
            'm_symp_nausea': $('#m_symp_nausea').val(),
            'm_symp_chills': $('#m_symp_chills').val(),
            'm_symp_general_pain': $('#m_symp_general_pain').val()
        };
        form_data['members'][memb_id]['transmission'] = {
            'm_trans_isolation': $('#m_trans_isolation').val(),
            'm_trans_distance': $('#m_trans_distance').val(),
            'm_trans_surface': $('#m_trans_surface').val(),
            'm_trans_human': $('#m_trans_human').val()
        };
        form_data['members'][memb_id]['lab_results'] = {
            'm_lab_tested': $('#m_lab_tested').val(),
            'm_lab_result': $('#m_lab_result').val(),
            'm_lab_hospitalized': $('#m_lab_hospitalized').val(),
            'm_lab_hosp_days': $('#m_lab_hosp_days').val(),
            'm_lab_hosp_icu': $('#m_lab_hosp_icu').val(),
            'm_lab_recovered': $('#m_lab_recovered').val(),
            'm_lab_ventilation': $('#m_lab_ventilation').val(),
            'm_lab_oxygen': $('#m_lab_oxygen').val(),
            'm_lab_symptoms': $('#m_lab_symptoms').val()
        };

        // mark the member row as complete.
        $('#' + memb_id).css('background-color', 'var(--validated_data)');
        console.log(memb_id);

        $('#member')[0].classList.toggle('hidden');
        $('#household')[0].classList.toggle('hidden');
    });
    // Initiate a report for a household member


})
;