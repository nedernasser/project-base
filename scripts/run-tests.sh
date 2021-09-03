#!/bin/bash

docker-compose -f ./docker-compose-test.yml down
docker-compose -f ./docker-compose-test.yml up --build &

docker exec -t project_base_test_app_db sh -c 'mysqladmin ping -h localhost'

while true; do
  if grep -q 'No such' <<<"$(docker exec -t project_base_test_app_db sh -c 'mysqladmin -u root -ppassword ping -h localhost')"; then
    continue
  fi

  if grep -q 'mysqld is alive' <<<"$(docker exec -t project_base_test_app_db sh -c 'mysqladmin -u root -ppassword ping -h localhost')"; then
    break
  fi

  sleep 2;
done

docker exec -t project_base_test_app_db sh -c 'mysqladmin -u root -p$MYSQL_PASSWORD --force drop project_base'
docker exec -t project_base_test_app_db sh -c 'mysqladmin -u root -p$MYSQL_PASSWORD --force create project_base'

while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:3006/health-check --header 'x-api-key: 5c7a38ee-985b-4d84-b3a4-025dddafa071')" != "200" ]]; do sleep 2; done

docker exec -t project_base_test_app sh -c 'npm run migration'
sleep 1;
docker exec -it project_base_test_app sh -c 'npm run mocha; echo $?'

if [ $? -eq 0 ]
then
  echo 'Success :)'
  exit 0
else
  echo 'Failure :(' >&2
  exit 1
fi
