resource "aws_s3_bucket" "backtest_lambda_testing_bucket" {
  bucket = "backtest-lambda-testing-s3-bucket"
}

resource "aws_s3_object" "backtest_lambda_testing_object" {
  bucket = aws_s3_bucket.backtest_lambda_testing_bucket.id
  key    = "lambda_testing.zip"
  source = data.archive_file.backtest_testing_function.output_path
  etag = filemd5(data.archive_file.backtest_testing_function.output_path)
}

resource "aws_s3_bucket" "backtest_historical_data_bucket" {
  bucket = "backtest-historical-data-s3-bucket"
}

resource "aws_s3_object" "backtest_historical_data_object" {
  bucket = aws_s3_bucket.backtest_historical_data_bucket.id
  key    = "lambda_historical_data.zip"
  source = data.archive_file.backtest_historical_data_function.output_path
  etag = filemd5(data.archive_file.backtest_historical_data_function.output_path)
}