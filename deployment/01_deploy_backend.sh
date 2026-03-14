#!/bin/bash
set -e

echo "Deploying BabyCareAssistant API to AWS Lambda..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$SCRIPT_DIR/../.env.local"

if [ -f "$ENV_FILE" ]; then
  # Load env variables safely
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Error: .env.local file not found at $ENV_FILE"
  echo "Please copy .env.example to .env.local and fill in your details."
  exit 1
fi

export AWS_PROFILE=${AWS_PROFILE:-default}
export AWS_REGION=${AWS_REGION:-ap-northeast-1}

cd "$SCRIPT_DIR/../backend/BabyCareAssistant.API"

echo "Building Native AOT deployment package via Docker..."
DOCKER_BUILDKIT=1 docker build --platform linux/arm64 -f ../Dockerfile.aot --output type=local,dest=./out ..

echo "Zipping the Native AOT bootstrap..."
cd out
rm -f deploy.zip
# Zip the bootstrap executable
zip deploy.zip bootstrap

echo "Deploying to AWS Lambda using AWS CLI..."
aws lambda update-function-code \
  --function-name ${LAMBDA_FUNCTION_NAME} \
  --zip-file fileb://deploy.zip \
  --region ${AWS_REGION} > /dev/null

echo "Waiting for function code update to complete..."
aws lambda wait function-updated \
  --function-name ${LAMBDA_FUNCTION_NAME} \
  --region ${AWS_REGION}

echo "Updating function configuration for provided.al2023..."
aws lambda update-function-configuration \
  --function-name ${LAMBDA_FUNCTION_NAME} \
  --handler bootstrap \
  --runtime provided.al2023 \
  --region ${AWS_REGION} > /dev/null

rm deploy.zip
cd ../../../../../


echo "Deployment finished."
