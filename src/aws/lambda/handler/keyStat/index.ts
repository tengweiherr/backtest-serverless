import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { cronFetchKeyStat, fetchKeyStat } from "/opt/nodejs/util";

exports.handler = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayProxyResult
) => {
  const params = {
    symbol: event.pathParameters?.symbol,
    client: event.queryStringParameters?.client,
  };

  if (params.client) {
    return fetchKeyStat({
      symbol: params.symbol,
    });
  } else {
    return cronFetchKeyStat({
      symbols: ["1155.KL", "7100.KL"],
    });
  }
};
