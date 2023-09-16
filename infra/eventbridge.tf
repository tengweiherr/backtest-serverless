# Create our schedule
resource "aws_cloudwatch_event_rule" "every_day" {
  name        = "every_day_rule"
  description = "trigger lambda every day"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.every_day.name
  target_id = "SendToLambda"
  arn       = aws_lambda_function.backtest_historical_data_function.arn
}