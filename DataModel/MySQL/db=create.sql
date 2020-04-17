create schema if not exists curvestompdev;
use curvestompdev;

################################################################################################

# DESTROY DATABASE
drop table if exists curvestompdev.report;
drop table if exists curvestompdev.member;
drop table if exists curvestompdev.household_location;
drop table if exists curvestompdev.household;
drop table if exists curvestompdev.location;
drop table if exists curvestompdev.locale;

# CREATE DATABASE
create table if not exists curvestompdev.location
(
    id          bigint auto_increment primary key,
    country     varchar(60)  not null,
    region      varchar(60),
    city        varchar(60)  not null,
    street_name varchar(100) not null,
    postal_code varchar(25)
);
create unique index location_street_name_postal_code_city_region_country_uindex
    on curvestompdev.location (street_name, postal_code, city, region, country);

create table if not exists curvestompdev.locale
(
    id           int auto_increment primary key,
    code         varchar(10) unique not null,
    is_supported bool default FALSE
);
insert into curvestompdev.locale (code, is_supported)
values ('en-ca', TRUE),
       ('en-us', TRUE),
       ('en', TRUE);

create table household
(
    id            bigint auto_increment,
    uid           bigint       null,
    sha2_256_pass varchar(128) not null comment 'sha2-256(concat(uid, passcode))',
    locale_id     int          null,
    constraint household_pk
        primary key (id),
    constraint household_locale_id_fk
        foreign key (locale_id) references locale (id)
);
create unique index household_uid_uindex
    on household (uid);

create table household_location
(
    id           bigint auto_increment,
    household_id bigint                  null,
    location_id  bigint                  null,
    effective_ts timestamp default now() null,
    constraint household_location_pk
        primary key (id),
    constraint household_location_household_id_fk
        foreign key (household_id) references household (id),
    constraint household_location_location_id_fk
        foreign key (location_id) references location (id)
);
create index household_location_household_id_index
    on household_location (household_id);

create table member
(
    id           bigint auto_increment,
    household_id bigint                not null,
    age          int                   not null,
    sex          varchar(1)            not null,
    alias        varchar(2) default '' null,
    constraint member_pk
        primary key (id),
    constraint member_household_id_fk
        foreign key (household_id) references household (id)
);
create unique index member_household_id_age_alias_sex_uindex
    on member (household_id, age, alias, sex);

create table if not exists report
(
    id                   bigint auto_increment,
    member_id            bigint                  not null,
    ts                   timestamp default now() not null,
    #SYMPTOM INFORMATION
    symp_cough           int       default 0,
    symp_breathing       bool      default FALSE,
    symp_walking         bool      default FALSE,
    symp_appetite_loss   bool      default FALSE,
    symp_diarrhea        bool      default FALSE,
    symp_muscle_pain     bool      default FALSE,
    symp_fatigue         bool      default FALSE,
    symp_runny_nose      bool      default FALSE,
    symp_sore_throat     bool      default FALSE,
    symp_fever           numeric   default 36.7,
    symp_headache        bool      default FALSE,
    symp_dizzy           bool      default FALSE,
    symp_nausea          bool      default FALSE,
    symp_shivers         bool      default FALSE,
    symp_general_pain    bool      default FALSE,
    symp_smell_loss      bool      default FALSE,
    # TRANSMISSION INFORMATION
    tran_distance        int       default 0,
    tran_surface         int       default 0,
    tran_human           int       default 0,
    # CLINICAL FINDINGS
    lab_tested           int       default -1,
    lab_hospitalized     bool      default FALSE,
    lab_days_in_hospital int       default 0,
    lab_icu              bool      default FALSE,
    lab_recovered        bool      default FALSE,
    lab_ventilated       bool      default FALSE,
    lab_oxygen           bool      default FALSE,
    lab_pneumonia        bool      default FALSE,
    lab_antibodies       int       default -1,
    lab_other_symps      varchar(200),
    constraint report_pk
        primary key (id),
    constraint report_member_id_fk
        foreign key (member_id) references member (id)
);
create index report_member_id_ts_index
    on report (member_id, ts);

##################################################################################################