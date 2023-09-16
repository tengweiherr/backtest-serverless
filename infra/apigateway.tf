resource "aws_api_gateway_rest_api" "fetch_historical_data_api" {
  name          = "fetch_historical_data_api"
  description   = "API Gateway for triggering BacktestHistoricalDataFunction"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "fetch_historical_data_api" {
  parent_id   = aws_api_gateway_rest_api.fetch_historical_data_api.root_resource_id
  path_part   = "fetch_historical_data_api"
  rest_api_id = aws_api_gateway_rest_api.fetch_historical_data_api.id
}

resource "aws_api_gateway_method" "fetch_historical_data_api" {
   rest_api_id   = aws_api_gateway_rest_api.fetch_historical_data_api.id
   resource_id   = aws_api_gateway_resource.fetch_historical_data_api.id
   http_method   = "POST"
   authorization = "AWS_IAM"
   api_key_required = true
}

resource "aws_api_gateway_authorizer" "fetch_historical_data_api" {
  name                   = "fetch_historical_data_api"
  rest_api_id            = aws_api_gateway_rest_api.fetch_historical_data_api.id
  authorizer_uri         = aws_lambda_function.backtest_historical_data_function.invoke_arn
  authorizer_credentials = aws_iam_role.backtest_iam.arn
}

resource "aws_api_gateway_usage_plan" "fetch_historical_data_api" {
  name = "fetch_historical_data_api"

  quota_settings {
    limit  = 20
    period = "WEEK"
  }

  throttle_settings {
    burst_limit = 3
    rate_limit  = 5
  }
}

resource "aws_api_gateway_api_key" "fetch_historical_data_api" {
  name = "fetch_historical_data_api_key"
}

resource "aws_api_gateway_usage_plan_key" "fetch_historical_data_api" {
  key_id        = aws_api_gateway_api_key.fetch_historical_data_api.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.fetch_historical_data_api.id
}

resource "aws_api_gateway_integration" "fetch_historical_data_api" {
  rest_api_id = aws_api_gateway_rest_api.fetch_historical_data_api.id
  resource_id = aws_api_gateway_resource.fetch_historical_data_api.id
  http_method = aws_api_gateway_method.fetch_historical_data_api.http_method
  integration_http_method = aws_api_gateway_method.fetch_historical_data_api.http_method
  type        = "AWS_PROXY"
  uri         = aws_lambda_function.backtest_historical_data_function.invoke_arn
}
