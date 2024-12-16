import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AesService } from 'src/aes/aes.service';
import { IdService } from 'src/id/id.service';
import { Materys } from 'src/models/materys';
import axios from 'axios'
@Injectable()
export class ShowfileGuard implements CanActivate {
  constructor(private readonly aes: AesService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    try {
      const ctx = context.switchToHttp()
      const res = ctx.getResponse()
      const req = ctx.getRequest()

      let classCode = req.params.classCode

      const get = await axios.get(`http://localhost:4000/api/classroom/are/inMyClass/${req.params.classCode}?token=${req.query.token}`)
      return get.data.message

    } catch (error) {
      console.error(error.message)
    }
  }
}
