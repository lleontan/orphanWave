--This database is for non-time series data.
create database if not EXISTS user_db;
use user_db;
create table if not exists users (
    id SERIAL primary key,
    email varchar(320) not null UNIQUE,
    passhash varchar(255) not null,
    user_name varchar(255) not null UNIQUE
);
create table if not exists sessions (
    id SERIAL primary key,
    sign_in_time timestamp not null,
    ip varchar(15) not null
);
