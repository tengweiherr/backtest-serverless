import { fetchHello } from "/opt/nodejs/util";

exports.handler = async () => {
  return fetchHello();
};
