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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const orm_values_1 = __importDefault(require("./orm-values"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = 4000;
    yield typeorm_1.createConnection(orm_values_1.default);
    const schema = yield type_graphql_1.buildSchema({
        resolvers: [user_1.UserResolver],
        validate: false
    });
    const apolloServer = new apollo_server_1.ApolloServer({
        schema: schema,
        context: ({ req, res }) => {
            return { req, res, em: typeorm_1.getManager() };
        },
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        }
    });
    apolloServer.listen(PORT, () => {
        console.log(`Server started on localhost:${PORT}`);
    });
});
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map