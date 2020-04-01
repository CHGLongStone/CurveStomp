$(document).ready(function(){
$('#usr_total_members').focusout(function(){
    var totalusr    = $('#usr_total_members').val();
    document.getElementById("slider_value2").innerHTML=totalusr;
    for(var i=0;i<totalusr;i++)
    {
        $("<div id='mydiv' class='notice'>Age:<input type='text'>Gender:<select id='gender'><option value='1'>Male</option><option value='2'>Female</option></select></div>").appendTo("#memberdata");

    }
    
    
});
})