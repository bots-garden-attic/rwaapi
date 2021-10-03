#!/bin/bash

url_api=$(gp url 8080)
function_name="hey"
function_version="0.0.0"
data='{"name":"Bob"}'
header="DEMO_TOKEN:hello"

hey -n 600 -c 300 -m POST -T "Content-Type: application/json" -H "DEMO_TOKEN:hello" -d ${data} "${url_api}/functions/fork/${function_name}/${function_version}" 

# This opens 300 connections, and sends 600 requests. 
