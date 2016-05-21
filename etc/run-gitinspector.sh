#!/bin/sh -x

# --grading enables
#   --hard
#   --list-file-types
#   --metrics
#   --responsibilities
#   --timeline
#   --weeks

# To get HTML:
#   --format=html

gitinspector \
	--file-types=coffee,py,sh,js,html,conf,md \
	--grading \
	--since='02/01/2016' \
	--exclude='media/' \
	--exclude='migrations/' \
	--exclude='static/.*?less' \
	--exclude='static/bootstrap' \
	--exclude='static/datatable' \
	--exclude='static/datetimepicker' \
	--exclude='static/fonts' \
	--exclude='static/images' \
	--exclude='static/jquery' \
	--exclude='static/less' \
	--exclude='application/static/admin' \
	--exclude='application/static/angular-bootstrap' \
	--exclude='application/static/all-pages.js'
