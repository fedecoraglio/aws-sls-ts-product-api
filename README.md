# aws-sls-ts-product-api
Local environemnt
- Run the following command to create the database

aws dynamodb create-table --cli-input-json file://db_products_skeleton.json --endpoint-url http://localhost:8000


aws dynamodb create-table \
--table-name products \
--attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=sk,AttributeType=S \
    AttributeName=gsi1pk,AttributeType=S \
    AttributeName=gsi1sk,AttributeType=S \
--key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=sk,KeyType=RANGE \
--provisioned-throughput \
    ReadCapacityUnits=1,WriteCapacityUnits=1 \
--global-secondary-indexes \
    "IndexName=gsi1,KeySchema=[{AttributeName=gsi1pk,KeyType=HASH},{AttributeName=gsi1sk,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=1,WriteCapacityUnits=1}" \
--stream-specification StreamEnabled=true,StreamViewType=NEW_IMAGE \
--sse-specification Enabled=true,SSEType=AES256,KMSMasterKeyId= \
--billing-mode PROVISIONED \
--endpoint-url http://localhost:8000
