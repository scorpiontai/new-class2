import { Controller } from '@nestjs/common';
import { Get, Res, Req, Query, Param, Post, Body, UseInterceptors, UploadedFile, UseGuards, Logger } from '@nestjs/common';
import { Response, Request} from 'express';
import { members } from 'src/models/members';
@Controller('profile')
export class ProfileController {

    @Get("all/image/profile/:name")
    async executeDefault(@Param("name") param: any, @Res() res: Response, @Req() req: Request, @Query("name") name: string): Promise<any> {
        try {
            const find = await members.findOne({
                where: {
                    name: param
                }, attributes: ['profilePath'], raw: true
            })
            if(find.profilePath !== null){
                res.status(200).redirect(find.profilePath)
            }
        } catch (err) {
            console.error(err.message);
        }
    }
}
