import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { buildSchema, MiddlewareFn } from "type-graphql";
import ProjectResolver from "./resolvers/ProjectResolver";
import TaskResolver from "./resolvers/TaskResolver";
import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "./object-id.scalar";
import { prometheus, serverPrometheus } from "./graphql-middleware-prometheus";

mongoose.connect("mongodb://localhost:27017/taskManager", {
  useNewUrlParser: true
});

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [ProjectResolver, TaskResolver],
    emitSchemaFile: true,
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
  });
  const prometheusMiddleware = prometheus({});
  const server = new GraphQLServer({
    schema,
    middlewares: [prometheusMiddleware]
  });
  serverPrometheus(server);
  server.start(() => console.log("Server is running on http://localhost:4000"));
}

bootstrap();
