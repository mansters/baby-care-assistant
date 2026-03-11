#!/bin/bash
set -e

echo "Configuring Lambda environment variables and Function URL..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$SCRIPT_DIR/../.env.local"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Error: .env.local file not found at $ENV_FILE"
  echo "Please copy .env.example to .env.local and fill in your details."
  exit 1
fi

export AWS_PROFILE=${AWS_PROFILE:-default}
export AWS_REGION=${AWS_REGION:-ap-northeast-1}

# Update environment variables
aws lambda update-function-configuration \
  --function-name ${LAMBDA_FUNCTION_NAME} \
  --environment "Variables={ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT},Authentication__Cognito__UserPoolId=${COGNITO_USER_POOL_ID},Authentication__Cognito__ClientId=${COGNITO_CLIENT_ID},Authentication__Cognito__Region=${COGNITO_REGION},DynamoDB__TableName=${DYNAMODB_TABLE_NAME},DynamoDB__Region=${DYNAMODB_REGION},DynamoDB__GSI1Name=${DYNAMODB_GSI1_NAME}}" \
  --region ${AWS_REGION}

echo "Waiting for function update to complete..."
aws lambda wait function-updated --function-name ${LAMBDA_FUNCTION_NAME} --region ${AWS_REGION}

# Create Function URL with AWS_IAM auth type
# Ignore if already exists
aws lambda create-function-url-config \
  --function-name ${LAMBDA_FUNCTION_NAME} \
  --auth-type AWS_IAM \
  --cors '{"AllowHeaders":["*"],"AllowMethods":["*"],"AllowOrigins":["*"]}' \
  --region ${AWS_REGION} || true

# Add resource-based policy to allow SSR compute role to invoke via Function URL
aws lambda add-permission \
  --function-name ${LAMBDA_FUNCTION_NAME} \
  --statement-id AllowAmplifySSRInvoke \
  --action lambda:InvokeFunctionUrl \
  --principal "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${LAMBDA_SSR_ROLE_NAME}" \
  --function-url-auth-type AWS_IAM \
  --region ${AWS_REGION} || true

echo ""
echo "Configuration finished. Here is the Function URL:"
aws lambda get-function-url-config --function-name ${LAMBDA_FUNCTION_NAME} --region ${AWS_REGION} --query FunctionUrl --output text
