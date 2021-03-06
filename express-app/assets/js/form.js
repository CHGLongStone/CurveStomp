/*
Minify-Obfuscate-Minify:
Minify: https://www.minifier.org/
Obfuscate: https://obfuscator.io/
 */


const SERVERURL = ''; // Change this to accommodate CORS

function saveMemberRow(memb_row) {

    memb_row = $(memb_row);

    // Grab input values
    let valid = true;
    let m_age = memb_row.find('#h_mem_age').val();
    let m_sex = memb_row.find('#h_mem_bio_gender').val();
    let m_alias = memb_row.find('#h_mem_alias').val().toUpperCase();
    let memb_id = m_age + m_sex + '-' + m_alias;

    // Validate user input
    if (m_age === null || m_age === '' || m_age < 0 || m_age > 200) {
        memb_row.find('#h_mem_age').css('background-color', 'var(--invalid_data');
        valid = false
    } else {
        memb_row.find('#h_mem_age').css('background-color', '');
    }
    if (m_sex === null || m_sex === '' || !["M", "F"].includes(m_sex)) {
        memb_row.find('#h_mem_bio_gender').css('background-color', 'var(--invalid_data');
        valid = false
    } else {
        memb_row.find('#h_mem_bio_gender').css('background-color', '');
    }

    if (!valid) {
        console.log("[" + Date.now() + "]: " + "INVALID MEMBER ROW: " + memb_id);
        return false;
    }

    if (memb_id in form_data.members) {
        console.log("[" + Date.now() + "]: " + "DUPLICATE MEMBER EXISTS: " + memb_id);
        return false;
    }

    let prev_memb_id = memb_row.find('legend').html();

    if (prev_memb_id != "AAAS-NN") {
        console.log("[" + Date.now() + "]: " + "Swapping: " + prev_memb_id);
        // We are altering a member. Preserve all data, then remove.
        form_data.members[memb_id] = form_data.members[prev_memb_id];
        delete form_data.members[prev_memb_id];
    } else {
        form_data.members[memb_id] = {};
    }

    // Save data.
    form_data.members[memb_id] = {
        'age': m_age,
        'sex': m_sex,
        'alias': m_alias
    };

    memb_row.find('#h_mem_age').prop('disabled', true);
    memb_row.find('#h_mem_bio_gender').prop('disabled', true);
    memb_row.find('#h_mem_alias').prop('disabled', true);

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
        memb_row.find('#h_mem_bio_gender').val(null);
        memb_row.find('#h_mem_alias').val(null);
    } else {
        // Wipe data from form_data
        let m_age = memb_row.find('#h_mem_age').val();
        let m_sex = memb_row.find('#h_mem_bio_gender').val();
        let m_alias = memb_row.find('#h_mem_alias').val().toUpperCase();
        let memb_id = m_age + m_sex + '-' + m_alias;
        if (memb_id in form_data.members) {
            delete form_data.members[memb_id];
        }
        // Make sure not to remove the last slot, so that users can enter new members
        if (jQuery.isEmptyObject(form_data.members)) {
            memb_row.attr({"id": 'AAAS-NN'});
            memb_row.find('#h_mem_age').val(null);
            memb_row.find('#h_mem_bio_gender').val(null).prop('selectedIndex', 0);
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
        credentials: 'same-origin',
        mode: 'same-origin',
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    }).then(resp => {
        // let error_container = $('#error_info');
        if (!resp.ok) {
            console.log("[" + Date.now() + "]: " + "POST Status: " + resp.status);
            // error_container.html("NETWORK ERROR: " + resp.status + ". Please try again.").show();
            return Promise.reject("server")
        }
        // error_container.html('').hide();
        return resp.json()
    })
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
    // Utility function to encapsulate UI transition logic
    switch (state_string) {
        case 'login':
            $('section#member').hide();
            $('fieldset#h_location').hide();
            $('fieldset#h_members').hide();
            $('#h_id_pass_confirm').parent().hide();
            break;
        case 'createProfile':
            $('section#member').hide();
            $('section#household').show();
            $('form > .explainer').hide();
            $('section > fieldset#identity').show();
            $('section > fieldset#h_location').show();
            $('section > fieldset#h_members').hide();
            $('#h_id_pass_confirm').parent().show();
            $('#h_id_load').hide();
            $('#h_id_create').hide();
            break;
        case 'memberReport':
            $('form > .explainer').hide();
            $('section#household').hide();
            $('section#member').show();
            $('#m_labresults > legend').click();
            break;
        case 'profile':
            $('form > .explainer').hide();
            $('section#household').show();
            $('section#member').hide();
            $('section > fieldset#h_location').show();
            $('section > fieldset#h_members').show();
            $('#h_id_uid').prop('disabled', true);
            $('#h_id_pass').prop('disabled', true);
            $('#h_id_load').hide();
            $('#h_id_create').hide();
            collapseOn($('section > fieldset#h_identity > legend'));
            collapseOn($('section > fieldset#h_location > legend'))
            break;
        default:
            displayState.cur_display = null;
    }
    displayState.cur_display = state_string;
    console.log("[" + Date.now() + "]: " + 'Display mode: ' + displayState.cur_display);
}

function formatHouseholdId(hhid) {
    // hhid must be an integer between 0 and 999999999999
    if (!isNaN(hhid) && hhid != '') {
        let str = hhid.toString();
        str = str.padStart(str.length > 9 ? 12 : 9, "0");
        const numChunks = Math.ceil(str.length / 3);
        let chunks = new Array(numChunks);
        for (let i = 0, o = 0; i < numChunks; ++i, o += 3) {
            chunks[i] = str.substr(o, 3)
        }
        return chunks.join('-')
    }
    return ''
}

function getLabelFor(elem) {
    return $('label[for="' + $(elem).prop('id') + '"]')
}

form_data = {
    "household": {
        "identity": {
            "unique_identifier": '',
            "passcode": ''
        },
        "location": {
            "country": '',
            "region": '',
            "city": '',
            "street_name": '',
            "postal_code": ''
        }
    },
    "members": {}
};

$(document).ready(function () {

    // Set initial display state:
    displayState('login');
    for (let header of document.querySelectorAll("h2, section > fieldset > legend")) {
        header.classList.add("collapsible");
        header.addEventListener("click", () => {
            Array.from(header.parentNode.children)
                .filter(n => n !== header)
                .forEach(n => n.classList.toggle("hidden"))
        });
    }
    $('form>h1').append('<sup id="beta_tag">[<i>beta</i>]</sup>');

    // Load existing profile
    $('#h_id_load').click(() => {
        let pass = $('#h_id_pass');
        let hid = $('#h_id_uid');

        // Validate user's passcode and Household ID:
        let raw_hid = parseInt(hid.val().replace(/[^\d]/g, ''));
        if (isNaN(raw_hid) || pass.val().length < 6) {
            pass.val("").css('border-color', 'var(--invalid_data');
            hid.css('border-color', 'var(--invalid_data');
            return;
        }

        // Display a formatted HHID to the user:
        hid.val(formatHouseholdId(raw_hid));

        form_data.household.identity.unique_identifier = raw_hid; // is not NaN
        form_data.household.identity.passcode = pass.val(); // string, length >= 6


        asyncPostJSON(SERVERURL + '/api/get_profile', form_data.household.identity).then(res => {

            // TODO: Verify assumptions on returned object...

            // Store returned data into local object.
            form_data.household.identity.unique_identifier = res.household.identity.unique_identifier;
            form_data.household.location = res.household.location;
            form_data.members = res.members;

            // Update UI with retrieved household information
            $('#h_id').html(": " + formatHouseholdId(form_data.household.identity.unique_identifier));
            hid.val(formatHouseholdId(form_data.household.identity.unique_identifier));
            $('#h_loc_country').val(form_data.household.location.country);
            $('#h_loc_region').val(form_data.household.location.region);
            $('#h_loc_city').val(form_data.household.location.city);
            $('#h_loc_street').val(form_data.household.location.street_name);
            $('#h_loc_pcode').val(form_data.household.location.postal_code);

            // Load Member information from data obj into member rows
            for (let member of Object.keys(form_data.members)) {

                // Grab the last member row (which, at first, is assumed empty).
                let m_row = $('fieldset.h_member_row:nth-last-of-type(1)');

                // Set aside an empty member clone.
                let new_m_row = m_row.clone(); // TODO: does this need to be done every iteration?

                // Insert data into existing row
                m_row.find("#h_mem_age").val(form_data.members[member].age).prop('disabled', true);
                m_row.find("#h_mem_bio_gender").val(form_data.members[member].sex).prop('disabled', true);
                m_row.find("#h_mem_alias").val(form_data.members[member].alias).prop('disabled', true);
                m_row.find('legend').html(member);
                m_row.attr('id', member);

                // Adjust the UI controls to match our state
                let btn = m_row.find('#h_mem_save');
                btn.clone().attr('id', 'h_mem_delete').val('Delete').insertAfter(btn).click((e) => {
                    // TODO: consider implementing logic to flag member as disabled in DB?
                    delMember(e.target.parentNode.parentNode.parentNode);
                });
                btn.clone().attr('id', 'h_mem_report').val('Report').insertAfter(btn).click(() => {
                    // Reference the current member in the section title
                    let age = m_row.find('#h_mem_age').val();
                    let sex = m_row.find('#h_mem_bio_gender').val();
                    let alias = m_row.find('#h_mem_alias').val();
                    $('#m_cur_memcode').html(age + sex + '-' + alias); // TODO: what if no sex?
                    displayState("memberReport");
                });
                btn.remove();

                // plug our template empty row in at the end.
                new_m_row.insertAfter(m_row);
            }

            // Remove unneccessary member rows:
            if (!jQuery.isEmptyObject(form_data.members)) {
                let m_row = $('fieldset.h_member_row:nth-last-of-type(1)');
                if (m_row.find('legend').html() == 'AAAS-NN') {
                    m_row.remove();
                }
            }

            // Organize UI
            displayState('profile');

        }).catch(err => {
            if (err == "server") return;
            throw err
        });
    });

    // Save location data to form data
    $('#h_loc_save').click(() => {
        let isValid = true;
        let validate = (inspected) => {
            if (jQuery.isEmptyObject(inspected.val())) {
                inspected.val("").css('border-color', 'var(--invalid_data');
                isValid = false;
                return ''
            } else {
                inspected.css('border-color', 'var(--validated_data');
                return inspected.val();
            }
        };

        // Store data to local object, valid or not.
        form_data.household.location.country = validate($('#h_loc_country'));
        form_data.household.location.city = validate($('#h_loc_city'));
        form_data.household.location.street_name = validate($('#h_loc_street'));
        form_data.household.location.region = $('#h_loc_region').val();
        form_data.household.location.postal_code = $('#h_loc_pcode').val();

        return isValid;
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
            prv = nxt; // swap back to selected.
        }

        prv.css('background-color', '');
        prv.attr({"id": 'AAAS-NN'});
        prv.find('#h_mem_delete').remove();
        prv.find('#h_mem_report').remove();
        prv.find('#h_mem_age').val(null).prop('disabled', false).css('background-color', '');
        prv.find('#h_mem_bio_gender').prop('selectedIndex', 0).prop('disabled', false).css('background-color', '');
        prv.find('#h_mem_alias').val(null).prop('disabled', false).css('background-color', '');
        prv.find('legend').html("AAAS-NN");
    });

    // Delete Member row when 'Delete' is clicked
    $('#h_mem_del').click((e) => {
        delMember(e.target.parentNode.parentNode.parentNode)
    });

    // Submit a member report
    $('#btnSubmit').click(() => {
        let memb_id = $('#m_cur_memcode').html(); // TODO: find a better way of grabbing this?

        if (!(memb_id in form_data.members)) {
            // This shouldn't happen, but protecting just in case.
            form_data.members[memb_id] = {}
        }

        // store data into data store TODO: Validate data
        // TODO: Consider automating this process in a loop...
        form_data.members[memb_id].symptoms = {                   // TODO:
            'm_symp_cough': $('#m_symp_cough').val(),
            'm_symp_fever': $('#m_symp_fever').val(),
            'm_symp_fatigue': $('#m_symp_fatigue').prop('checked'),
            'm_symp_nose': $('#m_symp_nose').prop('checked'),
            'm_symp_breathing': $('#m_symp_breathing').prop('checked'),
            'm_symp_throat': $('#m_symp_throat').prop('checked'),
            'm_symp_headache': $('#m_symp_headache').prop('checked'),
            'm_symp_walking': $('#m_symp_walking').prop('checked'),
            'm_symp_appetite': $('#m_symp_appetite').prop('checked'),
            'm_symp_diarrhea': $('#m_symp_diarrhea').prop('checked'),
            'm_symp_muscle_pain': $('#m_symp_muscle_pain').prop('checked'),
            'm_symp_dizziness': $('#m_symp_dizziness').prop('checked'),
            'm_symp_nausea': $('#m_symp_nausea').prop('checked'),
            'm_symp_chills': $('#m_symp_chills').prop('checked'),
            'm_symp_general_pain': $('#m_symp_general_pain').prop('checked'),
            'm_symp_smell_loss': $('#m_symp_smell_loss').prop('checked')
        };
        form_data.members[memb_id].transmission = {
            'm_trans_distance': $('#m_trans_distance').val(),
            'm_trans_surface': $('#m_trans_surface').val(),
            'm_trans_human': $('#m_trans_human').val()
        };
        form_data.members[memb_id].lab_results = {
            'm_lab_tested': $('#m_lab_tested').val(),
            'm_lab_hospitalized': $('#m_lab_hospitalized').prop('checked'),
            'm_lab_hosp_days': $('#m_lab_hosp_days').val(),
            'm_lab_hosp_icu': $('#m_lab_hosp_icu').prop('checked'),
            'm_lab_recovered': $('#m_lab_recovered').prop('checked'),
            'm_lab_ventilation': $('#m_lab_ventilation').prop('checked'),
            'm_lab_oxygen': $('#m_lab_oxygen').prop('checked'),
            'm_lab_symptoms': $('#m_lab_symptoms').val(),
            'm_lab_antibodies': $('#m_lab_antibodies').val(),
            'm_lab_pneumonia': $('#m_lab_pneumonia').prop('checked')
        };

        // Reset all report fields to their defaults...
        let selector = '#member .field_container > input, #member .field_container > select';
        for (let elem of document.querySelectorAll(selector)) {
            elem = $(elem);
            if (elem.prop("id") == "m_symp_fever") {
                elem.val(36.7);
            } else {
                switch (elem.prop("type").toLowerCase()) {
                    case 'text':
                    case 'password':
                    case 'textarea':
                    case 'hidden':
                        elem.val("");
                        break;
                    case 'radio':
                    case 'checkbox':
                        elem.prop("checked", false);
                        break;
                    case 'select-one':
                    case 'select-multi':
                        elem.prop("selectedIndex", 0);
                        break;
                    case 'number':
                        elem.val(0);
                        break;
                    default:
                        break;
                }
            }
        }

        // Send the member's report to the server
        let report = {
            'household': form_data.household,
            'report': form_data.members[memb_id]
        };
        asyncPostJSON(SERVERURL + '/api/submit_report', report).then(res => {
            console.log("[" + Date.now() + "]: " + res);
            // mark the member row as complete.
            $('#' + memb_id).css('background-color', 'var(--validated_data)')
                .find('#h_mem_report').hide();

            displayState('profile')
        }).catch(err => {
            if (err == "server") return;
            // TODO: visual cue of failure?
            throw err
        });


    });

    // Create a new profile
    $('#h_id_create').click(() => {
        // Remove any existing data
        form_data = {
            "household": {
                "identity": {
                    "unique_identifier": '',
                    "passcode": ''
                },
                "location": {
                    "country": '',
                    "region": '',
                    "city": '',
                    "street_name": '',
                    "postal_code": ''
                }
            },
            "members": {}
        };

        // Grab a unique household ID.
        asyncPostJSON(SERVERURL + '/api/generate_id', {}).then(res => {

            let pass = $('#h_id_pass');
            let label = getLabelFor(pass);
            let locSaveBtn = $('#h_loc_save');
            form_data.household.identity.unique_identifier = parseInt(res);

            // Update and disable the 'Household ID' field:
            $('#h_id_uid').val(formatHouseholdId(res)).prop('disabled', true);

            // Inform the user of password requirements:
            label.html(label.html().slice(0, -1) + ' (6+ chars):');

            // Hijack the 'location save' button to create the 'Create Profile' button:
            let create_profile_btn = locSaveBtn.clone().prop('id', 'h_prof_create').val("Create Profile");
            create_profile_btn.insertAfter(locSaveBtn).click((e) => {
                // Validate & store user's passcode:
                let cnfrm = $('#h_id_pass_confirm');
                if (pass.val().length < 6 || pass.val() != cnfrm.val()) {
                    pass.val("").css('border-color', 'var(--invalid_data');
                    cnfrm.val("").css('border-color', 'var(--invalid_data');
                    return;
                }
                pass.css('border-color', 'var(--validated_data');
                cnfrm.css('border-color', 'var(--validated_data');
                form_data.household.identity.passcode = pass.val();

                // Validate & store location data
                if (!locSaveBtn.click()) return;

                // Attempt to create a new user profile on the server:
                asyncPostJSON(SERVERURL + '/api/create_profile', form_data.household).then(res => {
                    $(e.target).remove(); // destroy the 'create profile' button
                    locSaveBtn.show(); // reveal 'save location' button to allow location changes
                    displayState('profile');
                }).catch(err => {
                    if (err == "server") return; // A network error occurred in POST
                    throw err
                });
            });

            locSaveBtn.hide(); // hide the location save button to avoid UX confusion
            displayState('createProfile')

        }).catch(err => {
            if (err == "server") return; // A network error occurred in POST
            throw err
        });
    });
});