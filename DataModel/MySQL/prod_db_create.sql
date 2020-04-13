create schema if not exists curvestomp;

create table if not exists locale
(
	ID int auto_increment
		primary key,
	code varchar(10) null,
	supported_bool tinyint(1) null
);

create table if not exists household
(
	ID int auto_increment
		primary key,
	identifier bigint null,
	passcode varchar(20) null,
	locale_id int default 1 null,
	constraint household___fk_locale
		foreign key (locale_id) references locale (ID)
);

create index household_identifier_index
	on household (identifier);

create table if not exists location
(
	ID int auto_increment
		primary key,
	country varchar(60) null,
	city varchar(60) null,
	region varchar(60) null,
	street_name varchar(60) null,
	postal_code varchar(60) null
);

create table if not exists household_location
(
	ID int auto_increment
		primary key,
	household_id int null,
	location_id int null,
	effective_ts timestamp default CURRENT_TIMESTAMP null,
	constraint household_location___fk_household
		foreign key (household_id) references household (ID),
	constraint `household_location___fk|_location`
		foreign key (location_id) references location (ID)
);

create table if not exists member
(
	ID int auto_increment
		primary key,
	household_id int null,
	age int null,
	sex varchar(1) null,
	alias varchar(2) null,
	designator varchar(10) null,
	constraint member___fk_household
		foreign key (household_id) references household (ID)
);

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

