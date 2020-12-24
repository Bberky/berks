import {User} from "../entity/User";
import {Resolver, Query, Mutation, Arg, InputType, Field, Ctx} from "type-graphql";
import argon2 from 'argon2';
import { MyContext } from "src/types";
import jwt from 'jsonwebtoken';
import { response } from "express";

@InputType()
export class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

type tokenType = {
    userId: number;
    count: number;
    iat: number;
    exp: number;
}

type cookieType = {
    host: string;
    connection: string;
    'content-length': string;
    accept: string;
    'user-agent': string;
    'content-type': string;
    origin: string;
    referer: string;
    cookie: string
}
@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req, em, res }: MyContext
    ): Promise<User | undefined> {
        try {
        const myToken = req.headers as cookieType;
        if (!myToken.cookie) {
            return undefined
        }
        const response = jwt.decode(myToken.cookie.split('access-token=')[1]) as tokenType;
        const user = await em.findOne(User, {id: response.userId})
        return user;
        } catch(err) {
            console.log(err)
        }
        
        return undefined

    }

    @Query(() => String)
    hello() {
        return "world";
    }

    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<User> {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username, password: hashedPassword});
        await em.save(user);
        return user;
    }

    @Query(() => [User])
    async users(
        @Ctx() {em}: MyContext
    ): Promise<User[]> {
        const users = await em.find(User, {});
        return users;
    }

    @Mutation(() => User)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req, res}: MyContext
    ): Promise<User | null> {
        const user = await em.findOneOrFail(User, {username: options.username});
        const verified = await argon2.verify(user.password, options.password);
        console.log(verified)
        if (!verified) {
            return null
        }

        const accessToken = jwt.sign(
            {
                userId: user.id
            },
            'kwejrgbjshbvjerhb',
            {
                expiresIn: '1d'
            }
        );
        const refreshToken = jwt.sign(
            {
                userId: user.id,
                count: user.count,
            },
            'kwejrgbjshbvjerhb',
            {
                expiresIn: '1d'
            }
        );
        res.cookie('refresh-token', refreshToken);
        res.cookie("access-token", accessToken);

        return user;
    }

    @Mutation(() => Boolean)
    async deleteAllUsers(
        @Ctx() {em, req, res}: MyContext
    ): Promise<boolean> {
        const users = await em.findAndCount(User, {});
        if (!users[1]) {
            return false
        }
        console.log(req, res)
        users[0].map(({id}) => {
            em.delete(User, {id: id});
        })
        return true
    }

    // @Mutation(() => Boolean)
    // logout(
    //     @Ctx() {req, res}: MyContext
    // ): Promise<boolean> {
    //     return new Promise(resolve => req.session.destroy(err => {
    //         res.clearCookie("qid");
    //         if (err) {
    //             console.log(err);
    //             resolve(false);
    //             return;
    //         }

    //         resolve(true);
    //     }))
    // }

    @Mutation(() => Boolean)
    logout(
        @Ctx() {res}: MyContext
    ): boolean {
        try {
            res.clearCookie('access-token')
            res.clearCookie('refresh-token');
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}