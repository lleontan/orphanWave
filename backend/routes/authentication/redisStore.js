const redis=require("redis");
const { promisify } = require("util");
const session = require('express-session')
const RedisStore = require("connect-redis")(session);
const client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});

client.set("key", "value", redis.print);
client.get("key", redis.print);
class RedisStore {
  constructor(){}

}
  module.export = RedisStore;
