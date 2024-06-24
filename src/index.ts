import express from "express";
import authRoutes from "./routes/auth.route";
import sequelize from "./models/index";
import paymentRoutes from "./routes/payment.route";
import logger from "./utils/logger";
import demoRoutes from "./routes/demo.route";
import typeDefs from "./graphql/schema";
import dotenv from "dotenv";
dotenv.config();
import resolvers from "./graphql/resolve";
import { ApolloServer } from "apollo-server-express";
import errorHandlerfn from "./middleware/errorHandler";
import { getUserFromToken } from "./middleware/jwtCheck";
// import graphqlUploadExpress from 'graphql-upload/GraphQLUpload.mjs';
// import { AppoloServerPluginDrainHttpServer} from 'apollo-server-core';

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const tokenData = req.headers['authtoken'] as string | undefined;    
    const token = tokenData?.split(" ")[1] || "";
    let user = null;
    if (token) {
      try {
        user = getUserFromToken(token);
      } catch (error) {
        logger.error("error occures", { error: error });
      }
    }
    return { user };
  },
});

const app = express();
const port = 3000;
// app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

async function startServer() {
  //payment webhook
  app.use("/api", paymentRoutes);

  // GraphQL endpoint
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.json());

  //app routes
  app.get("/", (req, res) => {
    res.send("My World!");
  });

  app.use("/api", demoRoutes);
  app.use("/api", authRoutes);

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const error = new Error("API not found");
    next(error);
  });

  //error handling
  app.use(errorHandlerfn);

  sequelize
    .sync()
    .then(() => {
      app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port} `);
      });
    })
    .catch((err: unknown) => {
      logger.error("Unable to connect to the database:", err);
    });
}
startServer();
