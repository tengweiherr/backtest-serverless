resource "aws_api_gateway_rest_api" "stock_historic" {
  name          = "stock_historic"
  description   = "GET and POST on stock/historic"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "stock_resource" {
  parent_id   = aws_api_gateway_rest_api.stock_historic.root_resource_id
  path_part   = "stock"
  rest_api_id = aws_api_gateway_rest_api.stock_historic.id
}


resource "aws_api_gateway_resource" "stock_historic_resource" {
  parent_id   = aws_api_gateway_resource.stock_resource.id
  path_part   = "historic"
  rest_api_id = aws_api_gateway_rest_api.stock_historic.id
}

resource "aws_api_gateway_method" "get_stock_historic" {
   rest_api_id   = aws_api_gateway_rest_api.stock_historic.id
   resource_id   = aws_api_gateway_resource.stock_historic_resource.id
   http_method   = "GET"
   authorization = "NONE"
  #  authorization = "AWS_IAM"
  #  api_key_required = true
}

resource "aws_api_gateway_method" "post_stock_historic" {
   rest_api_id   = aws_api_gateway_rest_api.stock_historic.id
   resource_id   = aws_api_gateway_resource.stock_historic_resource.id
   http_method   = "POST"
   authorization = "NONE"
  #  authorization = "AWS_IAM"
  #  api_key_required = true
}

# resource "aws_api_gateway_authorizer" "get_stock_historic" {
#   name                   = "get_stock_historic"
#   rest_api_id            = aws_api_gateway_rest_api.stock_historic.id
#   authorizer_uri         = aws_lambda_function.backtest_historical_data_function.invoke_arn
#   authorizer_credentials = aws_iam_role.backtest_iam.arn
# }

resource "aws_api_gateway_usage_plan" "get_stock_historic" {
  name = "get_stock_historic"

  quota_settings {
    limit  = 20
    period = "WEEK"
  }

  throttle_settings {
    burst_limit = 3
    rate_limit  = 5
  }
}

# resource "aws_api_gateway_api_key" "get_stock_historic" {
#   name = "get_stock_historic_key"
# }

# resource "aws_api_gateway_usage_plan_key" "get_stock_historic" {
#   key_id        = aws_api_gateway_api_key.get_stock_historic.id
#   key_type      = "API_KEY"
#   usage_plan_id = aws_api_gateway_usage_plan.get_stock_historic.id
# }

resource "aws_api_gateway_integration" "get_stock_historic" {
  rest_api_id = aws_api_gateway_rest_api.stock_historic.id
  resource_id = aws_api_gateway_resource.stock_historic_resource.id
  http_method = aws_api_gateway_method.get_stock_historic.http_method
  type        = "AWS_PROXY"
  uri         = aws_lambda_function.backtest_historical_data_function.invoke_arn
  integration_http_method = "POST"
}

resource "aws_api_gateway_integration" "post_stock_historic" {
  rest_api_id = aws_api_gateway_rest_api.stock_historic.id
  resource_id = aws_api_gateway_resource.stock_historic_resource.id
  http_method = aws_api_gateway_method.post_stock_historic.http_method
  type        = "AWS_PROXY"
  uri         = aws_lambda_function.backtest_historical_data_function.invoke_arn
  integration_http_method = "POST"
}
