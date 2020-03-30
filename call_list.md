# API Calls



## register.user
### call
```
{
	'method': 'register.user',
	'params': {
		'user_guid' : 'user_guid_value',
		'passcode' : 'passcode_value',
	}
	id: ''
}
```



### response
```
{
	"result": {
		"status": "OK",
		"data": {
			'register_user' : true,
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
}
```
## authenticate.user
### call
```
{
	'method': 'register.location',
	'params': {
		'user_guid' : 'user_guid_value',
		'passcode' : 'passcode_value',
	}
	id: ''
}
```



### response
```
{
	"result": {
		"status": "OK",
		"data": {
			'registered_location' : true,
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
}
```
## authenticate.user
### call
```
{
	'method': 'authenticate.user',
	'params': {
		'user_guid' : 'user_guid_value',
		'passcode' : 'passcode_value',
	}
	id: ''
}
```



### response
```
{
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
}
```

## register.user
### call
```
{
	'method': 'register.user',
	'params': {
		'user_guid' : 'user_guid_value',
		'passcode' : 'passcode_value',
	}
	id: ''
}
```


### response
```
{
	"result": {
		"status": "OK",
		"data": {
			'registered' : true,
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
}
```




## report.symptom
### call
```
{
	'method': 'report.symptom',
	'params': {
		'user_guid' : 'user_guid_value',
		'member_id' : 'member_id',
		'dry_cough' : 0,
		'pneumonia' : 0,
		'difficulty_breathing' : 0,
		'difficulty_walking' : 0,
		'appetite' : 0,
		'diarrhea' : 0,
		'muscle_ache' : 0,
		'fatigue' : 0,
		'runny_nose' : 0,
		'congestion' : 0,
		'sore_throat' : 0,
		'fever_c' : 0,
		'headache' : 0,
		'confusion__dizzyness' : 0,
		'nausea' : 0,
		'chills' : 0,
		'other_pain' : 0
	}
	id: ''
}
```


### response
```
{
	"result": {
		"status": "OK",
		"data": {
			'result_saved' : true,
			'member_id' : 'member_id'
		}
	},
	"error": null,
	"id": null,
}
```


## report.testing
### call
```
{
	'method': 'report.testing',
	'params': {
		'user_guid' : 'user_guid_value',
		'member_id' : 'member_id',
		'tested' : 0,
		'recovered' : 0,
		'hospitalized' : 0,
		'ventilation' : 0,
		'oxygen' : 0,
		'other_symptoms' : "other_symptoms"
	}
	id: ''
}
```


### response
```
{
	"result": {
		"status": "OK",
		"data": {
			'result_saved' : true
		}
	},
	"error": null,
	"id": null,
}
```


## report.transmission

### call
```
{
	'method': 'report.transmission',
	'params': {
		'user_guid' : 'user_guid_value',
		'member_id' : 'member_id',
		'travel_amount' : 0,
		'travel_distance' : 0,
		'hospitalized' : 0,
		'surface_touch' : 0,
		'number_of_regular_contacts' : 0

	}
	id: ''
}
```


### response
```
{
	"result": {
		"status": "OK",
		"data": {
			'result_saved' : true
		}
	},
	"error": null,
	"id": null,
}
```

















