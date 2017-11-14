#!/bin/bash

if [ "$CI_BRANCH" = "develop" ] 
then
    npm run stage
elif [ "$CI_BRANCH" = "master" ]
then
    npm run prod
else
    npm run local
fi