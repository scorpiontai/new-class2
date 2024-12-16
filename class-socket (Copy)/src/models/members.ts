
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    timestamps: false
})
export class members extends Model {
    @Column
    ID: number

    @Column
    name: string

    @Column
    pw: string

    @Column
    birth: string

    @Column
    viewTrack: number

    @Column
    editTrack: number

    @Column
    email: string

    @Column
    role: string

    @Column
    verifLink: string

    @Column
    profilePath: string

    @Column({type: DataType.JSON})
    classCodeLists: string[]
}