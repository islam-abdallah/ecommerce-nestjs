import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
const CURRENT_TIMESTAMP = 'CURRENT_TIMESTAMP(6)'
@Entity({'name':'reviews'})
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    comment: string;

    @Column({ type:'int' })
    rate: number;

    @CreateDateColumn({ type: 'timestamp', default:() => CURRENT_TIMESTAMP })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default:() => CURRENT_TIMESTAMP, onUpdate: CURRENT_TIMESTAMP })
    updatedAt: Date;
}


