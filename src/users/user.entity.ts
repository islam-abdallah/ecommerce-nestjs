import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { CURRENT_TIMESTAMP } from "src/utils/constants";
import { UserType } from "src/utils/enums";

import { Product } from "src/products/product.entity";
import { Review } from "src/reviews/review.entity";
@Entity({'name':'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({type:'varchar', length:150,})
    username: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.Normal_USER })
    userType: string;

    @Column({ type: 'varchar', length: 150 })
    password: string;

    @Column({ type: 'boolean', default: false })
    accountVerified: boolean;

    @Column({ type: 'boolean', default: true })
    accountActive: boolean;

    @Column({ type:'varchar', length:150, unique: true })
    email: string;

    @CreateDateColumn({ type: 'timestamp', default:() => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default:() => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;


    @OneToMany(() => Product, (product) => product.user)
    products: Product[];    

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];
}


