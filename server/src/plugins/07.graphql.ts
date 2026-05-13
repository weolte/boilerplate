import { buildSchema } from "drizzle-graphql";
import fastifyPlugin from "fastify-plugin";
import mercurius from "mercurius";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { join } from "path";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { mergeSchemas } from "@graphql-tools/schema";

export default fastifyPlugin(async (fastify) => {
  const { entities } = buildSchema(fastify.db);

  const schemaFromLoader = await loadSchema(
    join(process.cwd(), "graphql/schema.graphql"),
    {
      loaders: [new GraphQLFileLoader()],
    },
  );

  const schemaFromScript = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: {
        health: {
          type: GraphQLString,

          resolve: async (parent, args, context, info) => {
            return "ok";
          },
        },
        users: {
          type: entities.queries.users.type,
          args: entities.queries.users.args,
          resolve: async (parent, args, context, info) => {
            const users = await entities.queries.users.resolve(
              parent,
              args,
              context,
              info,
            );

            return users;
          },
        },
        todos: entities.queries.todos,
        profiles: entities.queries.profiles,
        profile: entities.queries.profilesSingle,
      },
    }),
    mutation: new GraphQLObjectType({
      name: "Mutation",
      fields: {
        insertTodo: {
          ...entities.mutations.insertIntoTodosSingle,
          resolve: async (parent, args, context, info) => {
            const todo = await entities.mutations.insertIntoTodosSingle.resolve(
              parent,
              args,
              context,
              info,
            );

            await context.pubsub.publish({
              topic: "TODO_ADDED",
              payload: {
                todoAdded: todo,
              },
            });

            return todo;
          },
        },
      },
    }),
    subscription: new GraphQLObjectType({
      name: "Subscription",
      fields: {
        todoAdded: {
          type: entities.types.TodosItem,
          subscribe: (_, __, { pubsub }) => pubsub.subscribe("TODO_ADDED"),
        },
      },
    }),
  });

  const schema = mergeSchemas({
    schemas: [schemaFromScript, schemaFromLoader],
  });

  fastify.register(mercurius, {
    schema,
    graphiql: true,
    subscription: true,
    context: async (request, reply) => {
      await request.accessVerify();
      const user = request.user as any;
      return {
        user,
      };
    },
  });
});
