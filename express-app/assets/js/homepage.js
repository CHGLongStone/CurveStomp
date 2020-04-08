$(document).ready(()=>{
    var countrylist;
    $.ajax({
        type: "GET",
        url:    "/countrylist",
        success:function(response){
            countrylist=response;
        }
    })
    $('#createprofile').on('shown.bs.modal', function () {
        var req =1;
        var select = $("<datalist></datalist>").attr("id", "country_list").attr("name", "country_list");
        $.each(countrylist,function(index,countrylist){
         select.append($("<option></option>").attr("value", countrylist.code).text(countrylist.FormalName));
        });     
        $("#countrycontainer").append(select);
        $.ajax({
                    type: "GET",
                    url: "/gethouseholdid",
                    success: function (response) {
                        var firstpart   = response.slice(0,3);
                        var secondpart  = response.slice(3,6);
                        var thirdpart   = response.slice(6,9);
                        $('#huid').val(response);
                        $('#h_id_label').text("Household ID:"+firstpart+"-"+secondpart+"-"+thirdpart);
                    }
                })
        
      })
      $('#h_id_pass_confirm').focusout(()=>{
          
          var pass  = $('#hpass').val();
          var passcnf   = $('#h_id_pass_confirm').val();
          console.log(pass);
          console.log(passcnf);
          if(pass==passcnf)
          {
              
              $('#hpass').css("border-color","green");
              $('#h_id_pass_confirm').css("border-color","green");
          }
          else
          {
            $('#hpass').css("border-color","red");
            $('#h_id_pass_confirm').css("border-color","red");

          }
      })
    $('#h_id_login').click(()=>{

    })

    // $('#h_id_submit').click(()=>{
    //     var profiledata = {};
    //     profiledata['huid'] = create_UUID();
    //     profiledata['pass'] = $('#h_id_pass').val();
    //     profiledata['country']  = $('#h_loc_country').val();
    //     profiledata['region']   = $('h_loc_region').val();
    //     profiledata['city']     = $('#h_loc_city').val();
    //     profiledata['postal_code']  = $('#h_loc_pcode').val();
    //     profiledata['street_name']  = $('#h_loc_street').val();
    //     console.log(profiledata);

    //     //POSTING Data to express server

    //     $.ajax({
    //         type: "POST",
    //         url: "/creathouseholdprofile",
    //         dataType: 'json',
    //         data: profiledata,
    //         success: function (response) {
    //             console.log(response);
    //         }
    //     })
    // })

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