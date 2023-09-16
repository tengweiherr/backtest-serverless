data "archive_file" "backtest_testing_function" {
  type = "zip"
  source_dir  = "${path.module}/../dist/aws/lambda/handler/testing/"
  output_path = "${path.module}/../dist/aws/lambda/lambda_testing.zip"
}

data "archive_file" "backtest_historical_data_function" {
  type = "zip"
  source_dir  = "${path.module}/../dist/aws/lambda/handler/historicalData/"
  output_path = "${path.module}/../dist/aws/lambda/lambda_historical_data.zip"
}

data "archive_file" "backtest_deps_layer_code_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../dist/aws/lambda/layer"
  output_path = "${path.module}/../dist/aws/lambda/layer.zip"
}

resource "aws_lambda_function" "backtest_testing_function" {
  function_name = "BacktestTestingFunction"
  description = "testing purpose"
  s3_bucket = aws_s3_bucket.backtest_lambda_testing_bucket.id
  s3_key    = aws_s3_object.backtest_lambda_testing_object.key
  runtime = "nodejs16.x"
  handler = "index.handler"
  source_code_hash = data.archive_file.backtest_testing_function.output_base64sha256
  role = aws_iam_role.backtest_iam.arn
  layers = [
    aws_lambda_layer_version.backtest_lambda_deps_layer.arn
  ]
}

resource "aws_lambda_function" "backtest_historical_data_function" {
  function_name = "BacktestHistoricalDataFunction"
  description = "fetching historical"
  s3_bucket = aws_s3_bucket.backtest_historical_data_bucket.id
  s3_key    = aws_s3_object.backtest_historical_data_object.key
  runtime = "nodejs16.x"
  handler = "index.handler"
  source_code_hash = data.archive_file.backtest_historical_data_function.output_base64sha256
  role = aws_iam_role.backtest_iam.arn
  layers = [
    aws_lambda_layer_version.backtest_lambda_deps_layer.arn
  ]
  environment {
    variables = {
      AZURE_SUBSCRIPTION_KEY = var.AZURE_SUBSCRIPTION_KEY
      OPENAI_API_KEY = var.OPENAI_API_KEY
      RAPID_API_KEY = var.RAPID_API_KEY
      RAPID_API_HOST = var.RAPID_API_HOST
      REDIS_ENDPOINT = var.REDIS_ENDPOINT
      REDIS_PASSWORD = var.REDIS_PASSWORD
      REDIS_PORT = var.REDIS_PORT
    }
  }
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backtest_historical_data_function.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.every_day.arn
}

resource "aws_lambda_permission" "allow_apigateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backtest_historical_data_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.fetch_historical_data_api.execution_arn}/*/*/*"
}

resource "aws_lambda_layer_version" "backtest_lambda_deps_layer" {
  layer_name          = "shared_deps"
  filename            = data.archive_file.backtest_deps_layer_code_zip.output_path
  source_code_hash    = data.archive_file.backtest_deps_layer_code_zip.output_base64sha256
  compatible_runtimes = ["nodejs16.x"]
}