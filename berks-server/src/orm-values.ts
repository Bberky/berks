import {createConnection} from 'typeorm';
import {User} from './entity/User';

export default {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "adamberkes",
    password: "qwertz131218",
    database: "berks",
    entities: [
        User
    ],
    synchronize: true,
    logging: false,
} as Parameters<typeof createConnection>[0]