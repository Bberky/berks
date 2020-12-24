import { Field, ID, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



@Entity()
@ObjectType()
export class User {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Int)
    @Column({default: 0})
    count: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt!: string;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt!: string;

    @Field(() => String)
    @Column({unique: true})
    username!: string;

    @Field(() => String)
    @Column()
    password!: string;
} 