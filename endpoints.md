# Endpoints


## /status/

Checks the status of IEX

## /test/

A route with no middleware interference

* /test/unemployment
Returns the latest unemployment statistics.

## /public/

A public route for api calls not requiring login

## /data/

A private route for raw data

## /analysis/

A private route for technical indicators

* fourQuadrant: post{
  start:

}

## /user/'username'

A route requiring token authentication for user profiles

## /login/

A public route for logins.

## /createProfile/

A public route for creating a new user

## /ticker/'stockname'
