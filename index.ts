const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema");
const { Query } = require("./resolver/query");
const { Mutation } = require("./resolver/mutation");
const jsonwebtoken = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const {authenticate} = require('./middleware/auth')
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');
import express, { Express, Request, Response } from "express";
const PORT = 4009;
const app = express();
app.use(bodyParser.json());

const auth = async (req:any) => {
  const token = req.headers["authorization"];
  try {
    const user = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } catch (error) {
    console.log(error);
  }
  req.next();
};
app.use(auth);
async function startServer() {
 
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: {
      Query,
      Mutation,
    },
    context:({req,res}:any)=>({user: req.user,})

 });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app:app });
  app.use((req, res) => {
    res.send("Hello from express apollo server");
  });
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });
}
startServer();
