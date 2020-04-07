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
 $(document).ready(()=>{
   
    $('#h_mem_add').click(() => {
      
        let prv = $('fieldset.h_member_row:nth-last-of-type(1)');
        let nxt = prv;
        if (saveMemberRow(prv) || prv.find("legend").html() != "AAAS-NN") {
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
    });

 })
 
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


