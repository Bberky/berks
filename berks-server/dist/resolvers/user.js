"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = exports.UsernamePasswordInput = void 0;
const User_1 = require("../entity/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
exports.UsernamePasswordInput = UsernamePasswordInput;
let UserResolver = class UserResolver {
    me({ req, em, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myToken = req.headers;
                if (!myToken.cookie) {
                    return undefined;
                }
                const response = jsonwebtoken_1.default.decode(myToken.cookie.split('access-token=')[1]);
                const user = yield em.findOne(User_1.User, { id: response.userId });
                return user;
            }
            catch (err) {
                console.log(err);
            }
            return undefined;
        });
    }
    hello() {
        return "world";
    }
    register(options, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield argon2_1.default.hash(options.password);
            const user = em.create(User_1.User, { username: options.username, password: hashedPassword });
            yield em.save(user);
            return user;
        });
    }
    users({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield em.find(User_1.User, {});
            return users;
        });
    }
    login(options, { em, req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOneOrFail(User_1.User, { username: options.username });
            const verified = yield argon2_1.default.verify(user.password, options.password);
            console.log(verified);
            if (!verified) {
                return null;
            }
            const accessToken = jsonwebtoken_1.default.sign({
                userId: user.id
            }, 'kwejrgbjshbvjerhb', {
                expiresIn: '1d'
            });
            const refreshToken = jsonwebtoken_1.default.sign({
                userId: user.id,
                count: user.count,
            }, 'kwejrgbjshbvjerhb', {
                expiresIn: '1d'
            });
            res.cookie('refresh-token', refreshToken);
            res.cookie("access-token", accessToken);
            return user;
        });
    }
    deleteAllUsers({ em, req, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield em.findAndCount(User_1.User, {});
            if (!users[1]) {
                return false;
            }
            console.log(req, res);
            users[0].map(({ id }) => {
                em.delete(User_1.User, { id: id });
            });
            return true;
        });
    }
    logout({ res }) {
        try {
            res.clearCookie('access-token');
            res.clearCookie('refresh-token');
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
};
__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Query(() => [User_1.User]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteAllUsers", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Boolean)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map