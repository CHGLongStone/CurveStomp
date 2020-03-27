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




















register.user
register.location
report.symptom
report.testing
report.transmission

