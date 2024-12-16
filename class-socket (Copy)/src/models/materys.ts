
import { Model, Table, Column } from "sequelize-typescript";

@Table({
    timestamps: false
})
export class Materys extends Model {

    @Column
    ID: number

    @Column
    classID: number

    @Column
    codeClass: string

    @Column
    className: string

    @Column
    title: string

    @Column
    content: string

    @Column
    topic: string

    @Column
    filePath: string

    @Column
    createdAt: Date

    @Column
    fileType: string

}