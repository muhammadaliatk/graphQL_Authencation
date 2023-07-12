"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema");
const { Query } = require("./resolver/query");
const { Mutation } = require("./resolver/mutation");
const jsonwebtoken = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { authenticate } = require('./middleware/auth');
const { ApolloServerPluginLandingPageLocalDefault, } = require('apollo-server-core');
const express_1 = __importDefault(require("express"));
const PORT = 4009;
const app = (0, express_1.default)();
app.use(bodyParser.json());
const auth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["authorization"];
    try {
        const user = yield jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = user;
    }
    catch (error) {
        console.log(error);
    }
    req.next();
});
app.use(auth);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers: {
                Query,
                Mutation,
            },
            context: ({ req, res }) => ({ user: req.user, })
        });
        yield apolloServer.start();
        apolloServer.applyMiddleware({ app: app });
        app.use((req, res) => {
            res.send("Hello from express apollo server");
        });
        app.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        });
    });
}
startServer();
