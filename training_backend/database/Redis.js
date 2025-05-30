const redis = require("redis");

let client;

async function redisClient() {
    if (client) return client;
    client = redis.createClient({ url: `redis://${process.env.DB_REDIS_HOST}:${process.env.DB_REDIS_PORT}` });
    await client.connect();
    return client;
}

module.exports = redisClient;