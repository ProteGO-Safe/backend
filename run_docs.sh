
docker run -p 80:8080 -e SWAGGER_JSON=/docs/swagger.yaml -v "$(pwd)/docs":/docs swaggerapi/swagger-ui
