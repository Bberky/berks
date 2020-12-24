import "reflect-metadata";
import {createConnection, getManager} from "typeorm";
import {ApolloServer} from "apollo-server";
import {buildSchema} from "type-graphql";
import { UserResolver } from "./resolvers/user";
import ormconfig from "./orm-values";
import { __prod__ } from "./constants";
import express from 'express';
import cors from "cors";

const main = async () => {
    const PORT = 4000;
    await createConnection(ormconfig);
    const schema = await buildSchema({
        resolvers: [UserResolver],
        validate: false
    });
    // const app = express();

    // app.use(
    //     cors({
    //         origin: 'http://localhost:3000',
    //         credentials: true
    //     }),
    //     // session({
    //     //     name: "hehe",
    //     //     store: new RedisStore({
    //     //         client: redisClient,
    //     //         disableTouch: true,
    //     //     }),
    //     //     cookie: {
    //     //         maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    //     //         httpOnly: true,
    //     //         secure: __prod__,
    //     //         sameSite: 'lax'
    //     //     },
    //     //     saveUninitialized: false,
    //     //     secret: "askdjfhkerjgvkfdjv",
    //     //     resave: false
    //     // })
    // )

    const apolloServer = new ApolloServer({
        schema: schema,
        context: ({req, res}) => {
            return {req, res, em: getManager()}
        },
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        }
    })

    apolloServer.listen(PORT, () => {
        console.log(`Server started on localhost:${PORT}`)
    })
}

main().catch((err) => {
    console.log(err);
})

