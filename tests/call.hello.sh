#!/bin/bash

url_api=$(gp url 8080)
function_name="hello"
function_version="0.0.0"
http POST "${url_api}/functions/${function_name}/${function_version}" \
    name="Bob Morane"

http POST "${url_api}/functions/${function_name}/${function_version}" \
    name="Bill Ballantine"\
    rwaapi_data:"hello world" \
    rwaapi_token:"tada"
