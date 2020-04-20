create schema if not exists curvestompdev collate utf8mb4_unicode_ci;
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
create table locale
(
    id           int auto_increment
        primary key,
    code         varchar(10)          not null,
    is_supported tinyint(1) default 0 null,
    constraint code
        unique (code)
);

create table household
(
    id            bigint auto_increment
        primary key,
    uid           bigint       null,
    sha2_256_pass varchar(128) not null comment 'sha2-256(concat(uid, passcode))',
    locale_id     int          null,
    constraint household_uid_uindex
        unique (uid),
    constraint household_locale_id_fk
        foreign key (locale_id) references locale (id)
);

create table location
(
    id          bigint auto_increment
        primary key,
    country     varchar(60)  not null,
    region      varchar(60)  null,
    city        varchar(60)  not null,
    street_name varchar(100) not null,
    postal_code varchar(25)  null,
    constraint location_street_name_postal_code_city_region_country_uindex
        unique (street_name, postal_code, city, region, country)
);

create table household_location
(
    id           bigint auto_increment
        primary key,
    household_id bigint                              null,
    location_id  bigint                              null,
    effective_ts timestamp default CURRENT_TIMESTAMP null,
    constraint household_location_household_id_fk
        foreign key (household_id) references household (id),
    constraint household_location_location_id_fk
        foreign key (location_id) references location (id)
);

create index household_location_household_id_index
    on household_location (household_id);

create table member
(
    id           bigint auto_increment
        primary key,
    household_id bigint                not null,
    age          int                   not null,
    sex          varchar(1)            not null,
    alias        varchar(2) default '' null,
    constraint member_household_id_age_alias_sex_uindex
        unique (household_id, age, alias, sex),
    constraint member_household_id_fk
        foreign key (household_id) references household (id)
);

create table report
(
    id                   bigint auto_increment
        primary key,
    member_id            bigint                                  not null,
    ts                   timestamp     default CURRENT_TIMESTAMP not null,
    symp_cough           int           default 0                 null,
    symp_breathing       tinyint(1)    default 0                 null,
    symp_walking         tinyint(1)    default 0                 null,
    symp_appetite_loss   tinyint(1)    default 0                 null,
    symp_diarrhea        tinyint(1)    default 0                 null,
    symp_muscle_pain     tinyint(1)    default 0                 null,
    symp_fatigue         tinyint(1)    default 0                 null,
    symp_runny_nose      tinyint(1)    default 0                 null,
    symp_sore_throat     tinyint(1)    default 0                 null,
    symp_fever           decimal(4, 2) default 36.70             null,
    symp_headache        tinyint(1)    default 0                 null,
    symp_dizzy           tinyint(1)    default 0                 null,
    symp_nausea          tinyint(1)    default 0                 null,
    symp_shivers         tinyint(1)    default 0                 null,
    symp_general_pain    tinyint(1)    default 0                 null,
    symp_smell_loss      tinyint(1)    default 0                 null,
    tran_distance        int           default 0                 null,
    tran_surface         int           default 0                 null,
    tran_human           int           default 0                 null,
    lab_tested           int           default -1                null,
    lab_hospitalized     tinyint(1)    default 0                 null,
    lab_days_in_hospital int           default 0                 null,
    lab_icu              tinyint(1)    default 0                 null,
    lab_recovered        tinyint(1)    default 0                 null,
    lab_ventilated       tinyint(1)    default 0                 null,
    lab_oxygen           tinyint(1)    default 0                 null,
    lab_pneumonia        tinyint(1)    default 0                 null,
    lab_antibodies       int           default -1                null,
    lab_other_symps      varchar(200)                            null,
    constraint report_member_id_fk
        foreign key (member_id) references member (id)
);

create index report_member_id_ts_index
    on report (member_id, ts);
