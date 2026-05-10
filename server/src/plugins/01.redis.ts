// import fastifyPlugin from "fastify-plugin";
// import fastifyRedis from "@fastify/redis";
// import { deleteSession } from "@services/sessions/delete.js";

// export default fastifyPlugin(async (fastify) => {
//   await fastify.register(fastifyRedis, {
//     host: "localhost",
//   });

//   const DB = 0;
//   const CHANNEL = `__keyevent@${DB}__:expired`;
//   await fastify.redis.config("SET", "notify-keyspace-events", "Ex");

//   // Subscriber for expired keys
//   const subscriber = fastify.redis.duplicate();
//   await subscriber.subscribe(CHANNEL, (err, count) => {
//     if (err) {
//       fastify.log.error(`Failed to subscribe: ${err.message}`);
//     } else {
//       fastify.log.info(
//         `Subscribed to ${count} channel(s). Waiting for expired keys...`,
//       );
//     }
//   });

//   // Listen for expired keys
//   subscriber.on("message", async (channel, key) => {
//     const [keyType, keyValue] = key.split(":");

//     // Delete record from sql database if session expires
//     if (keyType === "session") {
//       await deleteSession({ fastify, sessionUuid: keyValue! });
//     }
//   });
// });
