import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { cronFetchHistoricData, fetchHistoricData } from "/opt/nodejs/util";

exports.handler = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayProxyResult
) => {
  if (event.httpMethod === "POST") {
    if (
      event.body === null ||
      !event.body ||
      !JSON.parse(event.body).symbol ||
      !JSON.parse(event.body).interval ||
      !JSON.parse(event.body).range
    ) {
      return {
        statusCode: 400,
        body: "Bad request",
      };
    }

    const body = JSON.parse(event.body);

    return fetchHistoricData({
      symbol: body?.symbol,
      interval: body?.interval,
      range: body?.range,
    });
  }

  return cronFetchHistoricData({
    symbols: ["1155.KL", "7100.KL"],
    interval: "1d",
    range: "1mo",
  });
};
