const SERVERURL = 'http://localhost:37248';

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
        // Reference the current member in the section title
        $('#m_cur_memcode').html(memb_id);
        displayState('memberReport')
    });

    // Remove the "save" button from the member row
    btn.remove();
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

function asyncPostJSON(url, obj) {
    return fetch(url, {
        // credentials: 'same-origin',
        // mode: 'same-origin',
        // mode: 'no-cors',
        // crossOrigin: null,
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    }).then(resp => {
        if (!resp.ok) {
            console.log("Status: " + resp.status);
            return Promise.reject("server")
        }
        return resp.json()
    }).catch(err => {
        if (err == "server") return;
        $('#error_info').html(err).show();
        throw err
    });
}

function collapseOn(anchor) {
    Array.from(anchor.siblings())
        .forEach(n => {
            if (!n.classList.contains("hidden"))
                n.classList.add("hidden");
        });
}

function expandOn(anchor) {
    Array.from(anchor.siblings())
        .forEach(n => {
            if (n.classList.contains("hidden"))
                n.classList.remove("hidden");
        });
}

function displayState(state_string) {
    displayState.cur_display = state_string;
    if (state_string == 'login') {
        $('#member').hide();
        $('fieldset#h_location').hide();
        $('fieldset#h_members').hide();
        $('#h_id_pass_confirm').parent().hide();
    } else if (state_string == 'createProfile') {
        $('section#member').hide();
        $('section#household').show();
        $('form > .explainer').hide();
        $('section > fieldset#identity').show();
        $('section > fieldset#h_location').show();
        $('section > fieldset#h_members').hide();
        $('#h_id_pass_confirm').parent().show();
        $('#h_id_load').hide();
        $('#h_id_create').hide();
    } else if (state_string == 'memberReport') {
        $('form > .explainer').hide();
        $('#household').hide();
        $('#member').show();
        $('#m_labresults > legend').click();
    } else if (state_string == 'profile') {
        $('form > .explainer').hide();
        $('#household').show();
        $('#member').hide();
        $('section > fieldset#h_location').show();
        $('section > fieldset#h_members').show();
        collapseOn($('section > fieldset#h_identity > legend'));
        collapseOn($('section > fieldset#h_location > legend'))
    } else {
        displayState.cur_display = null;
    }
    console.log('Display mode: ' + displayState.cur_display);
}


let form_data = {
    "household": {
        "identity": {
            "unique_identifier": '123-456-789',
            "passcode": null,
            "confirm_passcode": null
        },
        "location": {
            "country": 'Canada',
            "region": "Ontario",
            "city": "Ottawa",
            "street_name": "Triangle St.",
            "postal_code": "M8C 7J9"
        }
    },
    "members": {
        "38M-JG": {
            "age": 38,
            "sex": "M",
            "alias": "JG"
        },
        "32F-VG": {
            "age": 32,
            "sex": "F",
            "alias": "VG"
        },
        "1M-UG": {
            "age": 1,
            "sex": "M",
            "alias": "UG"
        },
    }
};

$(document).ready(function () {

    // Make all fieldsets and H2 titled elements collapsible
    for (let header of document.querySelectorAll("h2, section > fieldset > legend")) {
        header.classList.add("collapsible");
        header.addEventListener("click", () => {
            Array.from(header.parentNode.children)
                .filter(n => n !== header)
                .forEach(n => n.classList.toggle("hidden"))
        });
    }

    asyncPostJSON(SERVERURL + '/api/commcheck', {
        'id': 'me',
        'msg': 'hello world'
    }).then(res => {
        console.log(res);
    });

    displayState('login');

    // Load existing profile TODO: UN-STUB.
    $('#h_id_load').click(() => {
        // Organize UI
        displayState('profile');

        // Load Identity information from data obj
        $('#h_id').html(": " + form_data['household']['identity']['unique_identifier']);
        $('#h_loc_country').val(form_data['household']['location']['country']);
        $('#h_loc_region').val(form_data['household']['location']['region']);
        $('#h_loc_city').val(form_data['household']['location']['city']);
        $('#h_loc_street').val(form_data['household']['location']['street_name']);
        $('#h_loc_pcode').val(form_data['household']['location']['postal_code']);

        // Load Member information from data obj
        for (let member of Object.keys(form_data['members'])) {
            let m_row = $('fieldset.h_member_row:nth-last-of-type(1)');
            let new_m_row = m_row.clone();
            m_row.find("#h_mem_age").val(form_data['members'][member]['age']);
            m_row.find("#h_mem_bio_gender").val(form_data['members'][member]['sex']);
            m_row.find("#h_mem_alias").val(form_data['members'][member]['alias']);
            m_row.find('legend').html(member);
            m_row.attr('id', member);
            let btn = m_row.find('#h_mem_save');
            btn.clone().attr('id', 'h_mem_delete').val('Delete').insertAfter(btn).click((e) => {
                delMember(e.target.parentNode.parentNode.parentNode);
            });
            btn.clone().attr('id', 'h_mem_report').val('Report').insertAfter(btn).click(() => {
                // Reference the current member in the section title
                $('#m_cur_memcode').html(member);
                displayState("memberReport");
            });
            // Remove the "save" button from the member row
            btn.remove();
            new_m_row.insertAfter(m_row);
        }

        // Remove unneccessary member rows:
        if (!jQuery.isEmptyObject(form_data['members'])) {
            let m_row = $('fieldset.h_member_row:nth-last-of-type(1)');
            if (m_row.find('legend').html() == 'AAAS-NN') {
                m_row.remove();
            }
        }
    });

    // Save location data to form data
    $('#h_loc_save').click(() => {
        form_data['household']['location'] = {
            'country': $('#h_loc_country').val(),
            'region': $('#h_loc_region').val(),
            'city': $('#h_loc_city').val(),
            'street_name': $('#h_loc_street').val(),
            'postal_code': $('#h_loc_pcode').val()
        };
    });

    // Add a new member row when 'add new member' is clicked
    $('#h_mem_save').click((e) => {
        saveMemberRow(e.target.parentNode.parentNode.parentNode);
    });
    $('#h_mem_add').click(() => {
        let prv = $('fieldset.h_member_row:nth-last-of-type(1)');
        saveMemberRow(prv);

        if (prv.find("legend").html() != "AAAS-NN") {
            let nxt = prv.clone();
            nxt.insertAfter(prv);
            let btn = nxt.find('#h_mem_delete');
            btn.clone().attr('id', 'h_mem_save').val("Save").insertAfter(btn).click((e) => {
                saveMemberRow(e.target.parentNode.parentNode.parentNode);
            });
            prv = nxt;
        }

        prv.attr({"id": 'AAAS-NN'});
        prv.find('#h_mem_delete').remove();
        prv.find('#h_mem_report').remove();
        prv.find('#h_mem_age').val(null);
        prv.find('#h_mem_sex').val(null);
        prv.find('#h_mem_alias').val(null);
        prv.find('legend').html("AAAS-NN");
    });

    // Delete Member row when 'Delete' is clicked
    $('#h_mem_del').click((e) => {
        delMember(e.target.parentNode.parentNode.parentNode)
    });

    $('#btnSubmit').click(() => {
        let memb_id = $('#m_cur_memcode').html();

        // store data into data store TODO: Validate data
        form_data['members'][memb_id]['symptoms'] = {
            'm_symp_cough': $('#m_symp_cough').val(),
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
            'm_trans_distance': $('#m_trans_distance').val(),
            'm_trans_surface': $('#m_trans_surface').val(),
            'm_trans_human': $('#m_trans_human').val()
        };
        form_data['members'][memb_id]['lab_results'] = {
            'm_lab_tested': $('#m_lab_tested').val(),
            'm_lab_hospitalized': $('#m_lab_hospitalized').val(),
            'm_lab_hosp_days': $('#m_lab_hosp_days').val(),
            'm_lab_hosp_icu': $('#m_lab_hosp_icu').val(),
            'm_lab_recovered': $('#m_lab_recovered').val(),
            'm_lab_ventilation': $('#m_lab_ventilation').val(),
            'm_lab_oxygen': $('#m_lab_oxygen').val(),
            'm_lab_symptoms': $('#m_lab_symptoms').val()
        };

        let report = {
            'household': form_data['household'],
            'report': form_data['members'][memb_id]
        };
        asyncPostJSON(SERVERURL + '/api/submit_report', report).then(res => {
            console.log(res);
        });

        // mark the member row as complete.
        $('#' + memb_id).css('background-color', 'var(--validated_data)');
        displayState('profile')
    });

    // Create a new profile
    $('#h_id_create').click(() => {
        // Remove any existing data
        form_data = {
            "household": {
                "identity": {
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

        // Stub a new identity:
        $('#h_id_uid').val("987-654-321");

        // Hijack the location save button
        let btn = $('#h_loc_save');
        btn.clone().insertAfter(btn).val("Create Profile").click((e) => {
            // TODO: Validate inputs
            form_data['household']['identity']['unique_identifier'] = $('#h_id_uid').val();
            form_data['household']['identity']['passcode'] = $('#h_id_pass').val();
            form_data['household']['identity']['confirmed'] = $('#h_id_pass_confirm').val();
            $('#h_loc_save').click();
            $(e.target).hide();
            btn.show();
            $('#h_id_load').click();
        });
        btn.hide();

        // Sort UI
        displayState('createProfile')
    });

})
;