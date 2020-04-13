create table if not exists report
(
	ID int auto_increment
		primary key,
	member_id int null,
	timestamp_utc timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	symptom_cough int null,
	symptom_breathing tinyint(1) null,
	symptom_walking tinyint(1) null,
	symptom_appetite tinyint(1) null,
	symptom_diarrhea tinyint(1) null,
	symptom_muscle_pain tinyint(1) null,
	symptom_fatigue tinyint(1) null,
	symptom_nose tinyint(1) null,
	symptom_throat tinyint(1) null,
	symptom_fever double null,
	symptom_headache tinyint(1) null,
	symptom_dizziness tinyint(1) null,
	symptom_nausea tinyint(1) null,
	symptom_chills tinyint(1) null,
	symptoms_general_pain tinyint(1) null,
	symptom_smell_loss tinyint(1) null,
	transmission_trans_distance int null,
	transmission_trans_surface int null,
	transmission_trans_human int null,
	results_lab_tested int null,
	results_lab_hospitalized tinyint(1) null,
	results_lab_hospital_days int null,
	results_lab_hospital_icu tinyint(1) null,
	results_lab_recovered tinyint(1) null,
	results_lab_ventilation int null,
	results_lab_oxygen int null,
	results_lab_symptoms varchar(200) default '  ' null,
	results_lab_pneumonia tinyint(1) null,
	results_lab_antibodies int null,
	constraint report___fk_member
		foreign key (member_id) references member (ID)
);

