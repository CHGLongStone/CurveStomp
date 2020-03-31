/** 
* ported from https://github.com/CHGLongStone/just-core-stub/blob/master/_UI/MAIN_UI/assets/scripts/just-core.js
* some basic helper functions
*/
function prettyPrint(DOMid=null,min=null)
{
	if(null === DOMid){
		DOMid = '#jsonString';
	}
	if(null === min){
		min = '\t';
	}else{
		min = 0;
	}
	
	objData = $(DOMid).val();
	objData = jQuery.parseJSON(objData);
	objJSON = JSON.stringify(objData, null, min);
	$(DOMid).val(objJSON);  //text(),html(),val()
}

function pageSingle(id){
	if (document.getElementById(id)){
		(document.getElementById(id).style.display == 'none')? display = 'block': display = 'none' ;
		document.getElementById(id).style.display = display;
	}
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

/**
* the core javascript service object
*/
var CurveStomp = CurveStomp || {};

SERVICE_CALL = '';
user_guid = '';
passcode = '';
SESSIONID ='';

members_in_household = [];

CurveStomp = {
	API_PATH: '/formdata',
	request: function(callback) {
		console.log('Do Request');
	},
	login: function() {
		var container = $('#returning');
		var test_user_guid = container.find('#user_guid').val();
		var test_passcode = container.find('#passcode').val();
		console.log('test_user_guid:'+test_user_guid);
		console.log('test_passcode:'+test_passcode);
		//JSON.stringify(callresult, null, 2)
		SERVICE_CALL = 'user.authenticate';
		params = {
			"user_guid" : test_user_guid,
			"passcode" : test_passcode,
		};
		var callresult = CurveStomp.service.call(params);
		console.log('callresult:'+JSON.stringify(callresult, null, 2));
		
		if(true === callresult.result.data.authenticated){
			console.log('members_in_household:'+JSON.stringify(callresult.result.data.members_in_household, null, 2));
			number_members_in_household = Object.keys(callresult.result.data.members_in_household).length;
			console.log('members_in_household:'+JSON.stringify(callresult.result.data.members_in_household, null, 2));
			console.log('number_members_in_household:'+number_members_in_household);
			
			user_guid = test_user_guid;
			passcode = test_passcode;
			setCookie('user_guid',user_guid,14);
			setCookie('number_members_in_household',number_members_in_household,14);
			
			$( '#returning' ).hide();
			$( '#report_list' ).show();
			console.log('getCookie-user_guid:'+getCookie('user_guid'));
			console.log('getCookie-number_members_in_household:'+getCookie('number_members_in_household'));
			
		}else{
			alert('Login Failed');
		}
	},
	scrollPage: function() {
		$('html, body').animate({scrollTop:$(document).height()}, 'slow');
	},
	/**
	*
	**/
	validateIdentityProfile: function() {
		//$('html, body').animate({scrollTop:$(document).height()}, 'slow');
		console.log('validateIdentityProfile');
		var userIDSet = false;
		var notice = 'enter and email address'+"\r\n"+'or'+"\r\n"+'or a user identity';
		if('' != $('#email').val()){
			var email = $('#email').val();
			var iSValidEmail = CurveStomp.service.isValidEmailAddress(email);
			if(true === iSValidEmail){
				userIDSet = true;
				notice ='';
			}else{
				notice = ' email address failed validation ';
			}
		}
		if('' != $('#user_identity').val()){
			var user_identity = $('#user_identity').val();
			if(12 > user_identity.length){
				notice = ' user identity too short ';
			}else{
				userIDSet = true;
				notice ='';
			}
		}
		
		var pwdSet = false;
		var pwd_input = $('#pwd_input').val();
		var pwd_input_confirm = $('#pwd_input_confirm').val();
		
		if(
			pwd_input == pwd_input_confirm
			&& 
			'' != pwd_input_confirm
		){
			pwdSet = true;
		}else{
			notice = notice+"\r\n"+ ' password must be set and match confirmation field ';
		}

		var household_size = 0;
		household_size = $('#household_members').find(".member_row").length;
		if(0 == household_size){
			notice = notice+"\r\n"+ ' you must specify at least one person for a household ';
		}
		if(false === userIDSet || false === pwdSet || 0 == household_size){
			alert(notice);
			return;
		}
		$( '#location' ).show();
		CurveStomp.scrollPage();
	},
	
	validateLocationProfile: function() {
		console.log('validateLocationProfile');
		var location = false;
		var notice = 'address fields are required';
		
		
		if('' == $('[name=country]').val()){
			notice =  notice+"\r\n"+' country ';
		}
		if('' == $('[name=country_iso]').val()){
			notice =  notice+"\r\n"+' country ';
		}
		if('' == $('[name=region]').val()){
			notice =  notice+"\r\n"+' region (state or province) ';
		}
		if('' == $('[name=city]').val()){
			notice =  notice+"\r\n"+' city ';
		}
		if('' == $('[name=street]').val()){
			notice =  notice+"\r\n"+' street ';
		}
		if('' == $('[name=postal_code]').val()){
			notice =  notice+"\r\n"+' postal_code ';
		}
		if('' == $('[name=household_guid]').val()){
			notice =  notice+"\r\n"+' household id ';
		}
		
		if('address fields are required' != notice){
			alert(notice);
		}
	},
	

	
	map :{
		current_increment_idx : 0,
		lattitude : 0,
		longitude : 0,
		//display : {},
	},
	notice_delay: 500,
	validateGeoRequest: function() {
		if ("geolocation" in navigator) {
			/* geolocation is available */
			navigator.geolocation.getCurrentPosition(function(position) {
				lati = position.coords.latitude.toFixed(5);
				longi =  position.coords.longitude.toFixed(5);
				lati = Number(lati);
				longi = Number(longi);
				console.log('lati: '+lati);
				console.log('longi: '+longi);
				CurveStomp.getMap(lati,longi);
			});
		} else {
			/* geolocation IS NOT available */
			alert('geolocation IS NOT available');
			return;
		}
	},
	
	getMap: function(lati=0,longi=0 ) {
		console.log('Do getMap');
		$('#mapid').show();
		CurveStomp.map.lattitude = lati;
		CurveStomp.map.longitude = longi;
		
		L_bound = (longi - 2.05);
		U_bound = (lati + 0.05);

		CurveStomp.map.display = L.map('mapid');
		CurveStomp.map.display.setView([longi, lati], 15);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(CurveStomp.map.display);
		
		if(!CurveStomp.map.display.popup){
			var popupbody = $('[template="map_controls"]').clone(true);
			var renderedHTML = CurveStomp.templater.renderHTML('map', {}, popupbody);
			$('#map_bucket').append(renderedHTML);
			popupbody.removeAttr('template');
			renderedHTML = $('#map_bucket').html();
			CurveStomp.map.display.popup = L.marker([lati, longi]);
			CurveStomp.map.display.popup.addTo(CurveStomp.map.display);
			CurveStomp.map.display.popup.bindPopup(renderedHTML).openPopup();
		}
		$('#lattitude').val(lati);
		$('#longitude').val(longi);
	},
	

	clearNotice: function() {
		 $('#notice').remove();
	},
	
	setMapAccuracy: function(modifier) {
		console.log('setMapAccuracy: '+modifier);
		
		increment = [
			[0.00000, 5],
			[0.0001,4],
			[0.001,3],
			[0.01,2],
			[0.1,1]
		];
		
		var inc_list_length = increment.length;
		
		if('less' == modifier){
			if(CurveStomp.map.current_increment_idx + 1 < increment.length){
				CurveStomp.map.current_increment_idx++;
			}else{
				$('#coordinates').before('<div id="notice" class="col-sm-12 h3">limit reached</div>')
				$('#notice').delay(CurveStomp.notice_delay).fadeOut(function() {$(this).remove();});
				return;
			}
		}else{
			if(CurveStomp.map.current_increment_idx - 1 >= 0){
				CurveStomp.map.current_increment_idx--;
			}else{
				$('#coordinates').before('<div id="notice" class="col-sm-12 h3">limit reached</div>');
				$('#notice').delay(CurveStomp.notice_delay).fadeOut(function() {$(this).remove();});
				return;
			}
		}
		
		var current_increment = increment[CurveStomp.map.current_increment_idx][0];
		console.log('current_increment: '+current_increment);
		LA_TOP = (CurveStomp.map.lattitude + current_increment).toFixed(increment[CurveStomp.map.current_increment_idx][1]);
		LA_BOT = Number(CurveStomp.map.lattitude - current_increment).toFixed(increment[CurveStomp.map.current_increment_idx][1]);
		LO_LEFT = Number(CurveStomp.map.longitude - current_increment).toFixed(increment[CurveStomp.map.current_increment_idx][1]);
		LO_RIGHT = Number(CurveStomp.map.longitude + current_increment).toFixed(increment[CurveStomp.map.current_increment_idx][1]);
		
		$('#lattitude').val(LA_TOP);
		$('#longitude').val(LO_LEFT);
		if(CurveStomp.map.display.polygon){
			CurveStomp.map.display.polygon.remove();			
		}
		CurveStomp.map.display.polygon = L.polygon([
			[LA_TOP, LO_LEFT],
			[LA_TOP, LO_RIGHT],
			[LA_BOT, LO_RIGHT],
			[LA_BOT, LO_LEFT]
		]);
		CurveStomp.map.display.polygon.addTo(CurveStomp.map.display);
		
		CurveStomp.map.display.fitBounds([
			[LA_TOP, LO_LEFT],
			[LA_BOT, LO_RIGHT]
		]);
	},
	
	acceptSettings: function(modifier) {
		setTimeout(() => {  
			$('#mapid').hide();
		}, 1500);
	},
	
	createHash: function(hash_type=null,stringToHash) {
		console.log('createHash-hash_type: '+hash_type);
		 wordArray = CryptoJS.lib.WordArray.create();
		 stringToHash = stringToHash.toString();
		console.log('createHash-stringToHash: '+stringToHash);
		console.log('createHash-wordArray: '+wordArray);
		if('SHA-3' == hash_type){
			var hashed_value = CryptoJS.SHA3(stringToHash);
			hashed_value = hashed_value.toString();
		}else{
			var hashed_value = CryptoJS.MD5(stringToHash).toString(CryptoJS.enc.Base64);
		}
		return hashed_value;
	},
	uuidv4: function () {
	  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	  );
	},
};


/**
* Mikes templater modified
*/
CurveStomp.templater = {

	renderHTML: function(prefix, obj, html) {
		if (typeof obj !== typeof undefined && typeof prefix !== typeof undefined && typeof html !== typeof undefined){
			var keys = Object.keys(obj);
			var elmType = {
				"text" : [
					"DIV", 
					"SPAN", 
					"A", 
					"TD", 
					"I", 
					"LI", 
					"UL" 
				],
				"form" : [
					"INPUT"
				],
				"media" : [
					"IMG", 
					"CANVAS", 
					"CSS", 
					"SCRIPT" 
				]
			}

			$.each(keys, function(k,v) {
				if (v == 'id'){
					html.attr(prefix, obj[v]);
					var el = '';
				}else{
					var el = html.find('['+prefix+'-'+v+']');
				}

				if (el.length > 0){
					switch(true){
						case -1 < $.inArray(el.prev().prop('nodeName'), elmType.text)://inArray( value, array)
							el.html(obj[v]);
							break;
						case -1 < $.inArray(el.prev().prop('nodeName'), elmType.form):
							//console.log('---------form');
							if (
								el.attr('type') !== 'checkbox'
								|| 
								el.is('select')
							){
								el.val(obj[v]);
							}else if (el.attr('type') == 'checkbox'){
								if (obj[v] == 1 || obj[v] == true){
									el.prop('checked', true);
								}else{
									el.prop('checked', false);
								}
							}		
							break;
						case -1 < $.inArray(el.prev().prop('nodeName'), elmType.media):
							//console.log('---------media');
							if ((obj[v] !== '' || obj[v] !== null)){
								el.attr('src', obj[v]);
							}		
							break;
						default:
							//console.log('DEFAULT:');
							el.html(obj[v]);

							break;
					}
					if (el.is('div') || el.is('span'))
					{
						el.html(obj[v]);
					}else if (el.is('img') && (obj[v] !== '' || obj[v] !== null)){
						el.attr('src', obj[v]);
					}else if ((el.is('input') && el.attr('type') !== 'checkbox') || el.is('select')){
						el.val(obj[v]);
					}else if (el.is('input') && el.attr('type') == 'checkbox'){
						if (obj[v] == 1 || obj[v] == true){
							el.prop('checked', true);
						}else{
							el.prop('checked', false);
						}
					}
				}else{
					// console.log(v+' no element el.length'+el.length); 
					
				}
			});
			return html;
		}else{
			console.log('All parameters required. Prefix, Object and HTML object');
		}
	},
	
	
};


/**
* a service call wrapper 
*/
CurveStomp.service = {
	lastResult: '',
	callObj: {},
	/**
	* a method to do the call and provide default parameters 
	*/
	call: function(requestParams) {
		console.log('Start CurveStomp.service.call');
		/**
		var fakeCallResult =  {
				"result": {
					"status": "OK",
					"data": {
						'authenticated' : true,
						'members_in_household' : [
							{ 
								'inc' : 1, 
								'age' : 50,
								'gender' : 1,
							},
							{ 
								'inc' : 2, 
								'age' : 54,
								'gender' : 0,
							},
						],
					}
				},
				"error": null,
				"id": null,
			};
		return fakeCallResult;
		*/
		
		
		
		var request = {
			method: requestParams.SERVICE_CALL,
			params: requestParams.params,
			id: SESSIONID+'::'+SERVICE_CALL+'::'+Date.now(),
		};
		request = JSON.stringify(request);
		console.log(request);
		CurveStomp.service.callObj = $.ajax({
			type: 'post',
			/**
			headers: {
				'SESSIONID':SESSIONID,
				'passcode' : passcode,
				'user_guid' : user_guid,
				'digital_fingerprint' : digital_fingerprint,
			},
			*/
			dataType: "json",
			url: requestParams.method,
			data: request,
			cache: false
		})
		.done(function( data ) {
			if('OK' == data.result.status){
				if(data.result.info.callback){
					responseProcessor = data.result.info.callback+'(data.result);';
					console.log('responseProcessor=='+responseProcessor);
					eval(responseProcessor);
				}
				
				CurveStomp.service.lastResult = data.result;
			}
			return data.result;
		});
	},
	/**
	* #####################################################################
	* some service calls
	* #####################################################################
	*/
	
	/**
	* output the results of the ajax request to the browser
	*/
	notification: function(result) {
		console.log('notification');
		CurveStomp.service.lastResult = result;
		/**
		* look for the DOM element to write the notification 
		*/
		if($('#notification')){
			if('object' == typeof result){
				$('#notification').html(JSON.stringify(result, null, 2));
			}else{
				$('#notification').html(result);
			}
		}else{
			return false;
		}
	},	
	/**
	* optput the results of the ajax request to the browser
	* from a list (array) of results 
	*/
	notificationList: function(result) {
		console.log('CurveStomp.signUp.signUpNotification:'+JSON.stringify(result, null, 2));
		if('OK' == result.status){
			var msg = '';
			$.each(result.info.msg, function(k,v) {
				msg = msg+""+v+"<br>";
				//params[v.name] = v.value;
			});
			CurveStomp.service.notification(msg);
		}		
	},
	/**
	* a standard regex to validate email format
	* function pulled from here https://gist.github.com/slovisi/6387824
	*/
	isValidEmailAddress: function(emailAddress) {
		console.log('isValidEmailAddress:'+emailAddress);
		/**
		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		* alt pattern here http://emailregex.com/
		*/
		var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return pattern.test(emailAddress);
	},	

	/**
	* #####################################################################
	* some util funcitons 
	* 
	* #####################################################################
	*/
	

	/**
	* util function to create new array input element by name
	*/
	createNeedleElm: function(elementName, containerName) {
		console.log('Start createNeedleElm elementName['+elementName+']');
		var htmlTemplate = $('[template="'+elementName+'"]').clone(true);
		console.log('html:::'+htmlTemplate);
		var renderedHTML = CurveStomp.templater.renderHTML(''+elementName+'', {}, htmlTemplate);
		$('#'+containerName+'').append(renderedHTML);
		htmlTemplate.removeAttr('template');
	},
	
	
	/**
	* util function to create new array input element by name
	*/
	addNeedleElm: function(elementName, containerName) {
		console.log('Start createNeedleElm elementName['+elementName+']');
		var htmlTemplate = $('[template="'+elementName+'"]').clone(true);
		console.log('html:::'+htmlTemplate);
		var renderedHTML = CurveStomp.templater.renderHTML(''+elementName+'', {}, htmlTemplate);
		$('#'+containerName+'').append(renderedHTML);
		htmlTemplate.removeAttr('template');
	},
	
	APISettingsNotification: function(result) {
		console.log('CurveStomp.signUp.signUpNotification:'+JSON.stringify(result, null, 2));
		if('OK' == result.status){
			var msg = '';
			//msg = msg+"Status: "+result.status+"<br>";
			msg = msg+""+result.info.msg+"<br>";
			CurveStomp.service.notification(msg);
		}
	},

};




/**
* ported from 
* https://github.com/moll/json-stringify-safe/
*/
CurveStomp.var_export = {
	// a method to do the call and provide default parameters 
	//exports: module.exports = stringify,
	//exports.getSerialize: serializer,

	stringify: function(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, this.serializer(replacer, cycleReplacer), spaces)
	},

	serializer: function(replacer, cycleReplacer) {
	  var stack = [], keys = []

	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
		if (stack[0] === value) return "[Circular ~]"
		return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
	  }

	  return function(key, value) {
		if (stack.length > 0) {
		  var thisPos = stack.indexOf(this)
		  ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
		  ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
		  if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
		}
		else stack.push(value)

		return replacer == null ? value : replacer.call(this, key, value)
	  }
	},															
};

console.log(CurveStomp);


/**
* a service call wrapper 
*/
CurveStomp.registration = {
	user: function() {
		console.log('CurveStomp.registration.user');
		CurveStomp.validateIdentityProfile();
		console.log('CurveStomp.registration.user-identity validation done');
		CurveStomp.validateLocationProfile();
		console.log('CurveStomp.registration.user-location validation done');
		var household_members = [];
		var inc =1;
		$('#household_members').find(".member_row").each(function( index ) {
			//console.log( index + ": " + $( this ).text() );
			
			console.log( index + ": " + $( this ).find( '[name=member_age]' ).val() );
			var member = {
				age: $( this ).find( '[name=member_age]' ).val(),
				gender: $( this ).find( '[name=gender_select]' ).val(),
				member_id : $( this ).find( '[name=member_id]' ).val(),
			};
			household_members[inc] = member;
			inc++;
		});
		
		console.log('CurveStomp.registration.user-prevalidation done');
		var params = {
			identity : {
				email:  $('#email').val(),
				user_identity:  $('#user_identity').val(),
				pwd_input:  $('#pwd_input').val(),
				pwd_input_confirm:  $('#pwd_input_confirm').val(),
				"household_members": household_members
			},
			household : {
				household_size:  $('#household_size').val(),
			},
			location : {
				country:  $('#country').val(),
				country_iso:  $('#country_iso').val(),
				region:  $('#region').val(),
				city:  $('#city').val(),
				street:  $('#street').val(),
				postal_code:  $('#postal_code').val(),
				household_guid:  $('#household_guid').val(),
				lattitude:  $('#lattitude').val(),
				longitude:  $('#longitude').val(),
			}
			
			
		};
		
		number_members_in_household = household_size;
		
		console.log("params:"+JSON.stringify(params, null, 2));
		
		requestParams = {
			'SERVICE_CALL': 'register.user',
			'params':  params
		};

		callResult = CurveStomp.service.call(requestParams);
		console.log("callResult:"+JSON.stringify(callResult, null, 2));
		$( '#report_list' ).show();
		CurveStomp.scrollPage();
		return;
	},
	
	setMembers: function(num_members) {
		var current_members = $('#household_members').find(".member_row").length;
		if(num_members == current_members){
			return;
		}
		if( current_members > num_members){
			i = current_members-1;
			var rows = $(".member_row");
			while(i >= num_members){
				$(".member_row").eq( i ).remove();
				i--;
			}
			return;
		}
		
		i = current_members;
		while(i <= num_members){
			i++;
			if(i > num_members){
				break;
			}
			var htmlTemplate = $('[template="household_member"]').clone(true);
			member = {
				member_id : i,
				guid: 'asdwefjlsakdjfskjf'
			};
			var renderedHTML = CurveStomp.templater.renderHTML('household', member, htmlTemplate);
			$('#household_members').append(renderedHTML);
			htmlTemplate.removeAttr('template');
			
		}
	},
};

/**
* a service call wrapper 
*/
CurveStomp.reports = {
	
	/**
	* Report data structure for slider questions
	* min max & default values
	* min max labeled
	*/
	symptom : {
		//symptom_log_pk
		//individual_fk
		//symptom_log_timestamp
		dry_cough : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		pneumonia : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		difficulty_breathing : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		difficulty_walking : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		appetite : {value: 5, min: 0, max: 9, min_label: 'lower', max_label: 'higher', step: 1},
		diarrhea : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		muscle_ache : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		fatigue : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		runny_nose : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		congestion : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		sore_throat : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		//fever_f : {value: 5, min: 1, max: 9, min_label: 'low', max_label: 'high', step: 0.1},
		fever_c : {value: 5, min: 0, max: 9, min_label: 'lower', max_label: 'higher', step: 0.1},
		headache : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		confusion__dizzyness : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		nausea : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		chills : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		other_pain : {value: 0, min: 0, max: 9, min_label: 'none', max_label: 'severe', step: 1}
		
	}, 
	
	/**
	* Report data structure for slider questions
	* min max & default values
	* min max labeled
	*/
	transmission : {
		isolation : {value: 1, min: 1, max: 9, min_label: 'very isolated', max_label: 'not isolated', step: 1},
		travel_amount : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'frequent', step: 1},
		travel_distance : {value: 1, min: 1, max: 99, min_label: '0 km', max_label: '99 km+', step: 5},
		surface_touch : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'frequent', step: 1},
		number_of_regular_contacts : {value: 1, min: 1, max: 9, min_label: 'less than 5', max_label: 'more than 20', step: 1},
	},
	
	/**
	* set the assotiated input value for a dynamically generated slider
	*/
	setItemValue : function(event, ui) {
		var row_item = $(event.target).closest('.row');
		$(row_item).find(':input').val(ui.value);
	},
	
	/**
	* create a report from a Report data structure
	*/
	renderReport : function(report_name) {
		console.log('report_name'+report_name);
		var report_data = CurveStomp.reports[report_name];
		var elem_name = '#'+report_name+'_form';
		console.log('elem_name'+elem_name);
		newElem = $(elem_name);
		newElem.show();
		var htmlTemplate = '';
		
		
		htmlTemplate = $('[template="symptom_report_item"]').clone(true);
		htmlTemplate.removeAttr('template');
		
		outer_parent_container = newElem.closest(elem_name);
		i = 1;
		while(i <= number_members_in_household){
			var container_name = 'member_'+i+'_symptom_form';
			outer_parent_container.append('<div id="'+container_name+'"><h2>Household Member: '+i+'</h2></div>');
			var container_select = '#'+container_name;
			var container = $(container_select);
			
			$.each(report_data, function(k,v) {
				iHtml = htmlTemplate.clone(true);
				if(k.includes('__')){
					display_name = k.replace(/__/g, " / ");
				}else{
					display_name = k.replace(/_/g, " ");
				}
				v['name'] = k;
				v['display_name'] = display_name;
				v['slider_name'] = k+"_symptom_level";
				finishedHtml = CurveStomp.templater.renderHTML('report_item', v, iHtml);
				container.append(finishedHtml);
				var new_slider = $(container).find('*[report_item-symptom_level]').filter(":last");
				$(new_slider).slider({
					value: v.value,
					min: v.min,
					max: v.max,
					step: v.step,
					slide: function( event, ui ) {
						//$( "[name="+k+"_symptom_level]" ).val(ui.value);
						//$(this).next(':input').val(ui.value);
						CurveStomp.reports.setItemValue(event, ui);
					},
				});
			});	
			submit_button = '<button type="button" name="report_resource" class="btn "  onclick="CurveStomp.reports.submit(\'symptom\', '+i+');">Submit Report for Household Member '+i+'</button>';
			container.append(submit_button);			
			i++;
		}
		
		
		
	},
	
	
	/**
	* submit a report that used a Report data structure
	*/
	submit : function(report_name, member_num) {
		var report_container_name = 'member_'+member_num+'_'+report_name+'_form';
		var container_select = '#'+report_container_name;
		console.log('container_select: '+container_select);
		var container = $(container_select);
		
		
		var new_data_points = {
			'member_num': member_num
		};
		var report_data = $(container).find('.row');
		$.each(report_data, function(k,v) {
			var item_name = $(v).find('*[report_item-name]').html();
			var item_value = $(v).find(':input').val();
			if(item_value != CurveStomp.reports[report_name][item_name].value){
				new_data_points[item_name] = item_value;
			}else{
				console.log('FAILED item_value:'+item_value);
				console.log('FAILED item_default:'+CurveStomp.reports[report_name][item_name].value);				
			}
		});	
		
		console.log('--------------new_data_points:::'+JSON.stringify(new_data_points, null, 2));
		
		//DO API CALL
	},
	
	/**
	* create a static form for a specific user
	*/
	renderTestingReport : function() {
		var elem_name = '#testing_form';
		console.log('elem_name'+elem_name);
		newElem = $(elem_name);
		newElem.show();
		var htmlTemplate = '';
		htmlTemplate = $('[template="testing_report"]').clone(true);
		htmlTemplate.removeAttr('template');
		outer_parent_container = newElem.closest(elem_name);
		
		i = 1;
		while(i <= number_members_in_household){
			console.log('renderTestingReport-i: '+i);
			iHtml = htmlTemplate.clone(true);
			var container_name = 'member_'+i+'_testing_form';
			outer_parent_container.append('<div id="'+container_name+'"><h2>Household Member: '+i+'</h2></div>');
			var container_select = '#'+container_name;
			var container = $(container_select);
				
			finishedHtml = CurveStomp.templater.renderHTML('report_item', {}, iHtml);
			container.append(finishedHtml);
				
			submit_button = '<button type="button" name="report_resource" class="btn "  onclick="CurveStomp.reports.submitTesting( '+i+');">Submit Report for Household Member '+i+'</button>';
			container.append(submit_button);			
			i++;
		}
		
		
	},
	/**
	* submit a static form report for a specific user
	*/
	submitTesting : function(member_num) {
		//testing_form
		console.log('submitTesting: member_num-'+member_num);
		var report_container_name = 'member_'+member_num+'_testing_form';
		var container_select = '#'+report_container_name;
		console.log('container_select: '+container_select);
		var container = $(container_select);
		
		
		var new_data_points = {
			'member_num': member_num
		};
		var report_data = $(container).find('.row');
		$.each(report_data, function(k,v) {
			var item_name = $(v).find('*[report_item-name]').html();
			var item_value = $(v).find('input:checked').val();
			
				console.log('FAILED item_value:'+item_value);
			new_data_points[item_name] = item_value;
							
			
		});	
		
		console.log('--------------new_data_points:::'+JSON.stringify(new_data_points, null, 2));
	}
}




function next(action){
	switch(action){
		case"location_profile":
			$( '#identity' ).hide();
			$( '#location' ).show();
			
			break;
		case"":
			break;
		
	}
}

