"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./entity/User");
exports.default = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "adamberkes",
    password: "qwertz131218",
    database: "berks",
    entities: [
        User_1.User
    ],
    synchronize: true,
    logging: false,
};
//# sourceMappingURL=orm-values.js.map