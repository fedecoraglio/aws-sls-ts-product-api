# Products and Categories Management

This is a project that allows managing products and categories. This project uses Serverless Framework with NodeJS and is deployed on AWS Lambda.

## Required tools

- AWS CLI
- NodeJS
- NoSQL Workbench
- Docker
- Visual Studio Code

## Local installation of Dynamodb

To do this, we need to install the Docker application and AWS CLI on our computer. Then, following this link, we will find a dynamodb image to use locally: https://hub.docker.com/r/amazon/dynamodb-local/

Then we can run the following commands:

```bash
docker pull amazon/dynamodb-local
docker run -p 8000:8000 -d amazon/dynamodb-local
```
Then we must create our database, which will have a single table called products
This is the command to create it from a terminal from the root of the project:

```bash
aws dynamodb create-table --cli-input-json file://db_products_skeleton.json --endpoint-url http://localhost:8000
```

You should update the dbconnect/index.ts file like this:

```JSON
{
    "accessKeyId": "access_key_id", // you can get this using NoSQL Workbench on the connection description
    "secretAccessKey": "secret_access_key", // you can get this using NoSQL Workbench on the connection description
    "region": "localhost",
    "endpoint": "http://localhost:8000",
}
```

## Project installation

To install, it is necessary to have a connection to the DynamoDB database, which can be local or remote.

On the project, run the following command:
```bash
npm install
```
In case it needs to be run locally, use:
```bash
npm run offline
```
To deploy the project, use the command:
```bash
npm run deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
