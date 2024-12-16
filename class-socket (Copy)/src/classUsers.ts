
import { Table, Column, Model, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
    timestamps: false,
})
export class classUsers extends Model {
    @Column
    ID: number;

    @Column
    userID: number;

    @Column
    className: string;

    @Column
    codeClass: string;

    @Column
    subject: string

    @Column
    description: string

    @Column
    max: number;

    @Column
    createdAt: string

    @Column
    timeAt: string

}
