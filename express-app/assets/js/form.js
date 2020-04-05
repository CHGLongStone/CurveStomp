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
    $('#h_mem_add').click(() => {
        let a = $('fieldset.h_member_row:nth-last-of-type(1)');
        // We compile the identity of the last member
        // We check if the identity already exists in the JSON
        // The identity doesn't exist. We add it.
        // We create a new, empty member for user input:
        a.clone().insertAfter(a).attr({"id": ""});
    });

});