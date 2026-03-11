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

dotnet lambda deploy-function ${LAMBDA_FUNCTION_NAME} \
  --function-role ${LAMBDA_EXECUTION_ROLE_NAME} \
  --function-handler BabyCareAssistant.API \
  --function-runtime dotnet8 \
  --function-memory-size ${LAMBDA_MEMORY_SIZE:-512} \
  --function-timeout ${LAMBDA_TIMEOUT:-30} \
  --region ${AWS_REGION}

echo "Deployment finished."
