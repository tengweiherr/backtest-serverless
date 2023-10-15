resource "aws_cloudwatch_log_group" "lambda_testing" {
  name = "/aws/lambda/${aws_lambda_function.backtest_testing_function.function_name}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "lambda_historical_data" {
  name = "/aws/lambda/${aws_lambda_function.backtest_historical_data_function.function_name}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "fetch_historical_data_api" {
  name = "/aws/apigateway/${aws_api_gateway_rest_api.stock_historic.name}"
  retention_in_days = 30
}