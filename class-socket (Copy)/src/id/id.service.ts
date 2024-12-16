import { Injectable } from '@nestjs/common';
import { classUsers } from 'src/classUsers';
import { members } from 'src/models/members';

@Injectable()
export class IdService {

    async findAttributeWithCodeClass(codeClass: string): Promise<any> {
        try {
            console.debug("classCode is", codeClass)
            const find = await classUsers.findOne({
                where: {
                    codeClass: codeClass
                }, raw: true
            })


            return { className: find.className, classID: find.ID }
        } catch (err) {
            console.error(err.message);
        }
    }

    async findTheNameWithId(userID: number): Promise<any> {
        try {
            const find = await members.findOne({
                where: {
                    ID: userID
                }, raw: true, attributes: ['ID']
            })


            return find.ID
        } catch (err) {
            console.error(err.message);
        }
    }
}

