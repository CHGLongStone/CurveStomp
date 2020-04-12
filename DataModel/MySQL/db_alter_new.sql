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
