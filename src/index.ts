import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import ProjectResolver from "./resolvers/ProjectResolver";
import TaskResolver from "./resolvers/TaskResolver";
import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "./object-id.scalar";

mongoose.connect("mongodb://localhost:27017/taskManager", { useNewUrlParser: true });

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [ProjectResolver, TaskResolver],
    emitSchemaFile: true,
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }]
  });

  const server = new GraphQLServer({
    schema
  });

  server.start(() => console.log("Server is running on http://localhost:4000"));
}

bootstrap();
