import { createClient } from "redis";

const initRedisClient = async () => {
  const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_ENDPOINT,
      port: Number(process.env.REDIS_PORT),
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
};

export { initRedisClient };
