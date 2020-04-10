create schema if not exists curvestompdev collate utf8mb4_0900_ai_ci;

create table if not exists city
(
	ID int auto_increment
		primary key,
	name varchar(100) null,
	iso_code varchar(6) null
);

create table if not exists country
(
	ID int auto_increment
		primary key,
	name varchar(100) null,
	iso_code varchar(6) null
);

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
	locale_id int null,
	constraint household___fk_locale
		foreign key (locale_id) references locale (ID)
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

create table if not exists region
(
	ID int auto_increment
		primary key,
	name varchar(100) null,
	iso_code varchar(6) null
);

create table if not exists location
(
	ID int auto_increment
		primary key,
	country int null,
	region int null,
	city int null,
	constraint location___fk_city
		foreign key (city) references city (ID),
	constraint location___fk_country
		foreign key (country) references country (ID),
	constraint location___fk_region
		foreign key (region) references region (ID)
);

create table if not exists household_location
(
	household_id int not null,
	location_id int not null
		primary key,
	effective_ts timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint household_location___fk_household
		foreign key (household_id) references household (ID),
	constraint household_location___fk_location
		foreign key (location_id) references location (ID)
);

create table if not exists report
(
	ID int auto_increment
		primary key,
	member_id int null,
	timestamp_utc timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
	constraint report___fk_member
		foreign key (member_id) references member (ID)
);

