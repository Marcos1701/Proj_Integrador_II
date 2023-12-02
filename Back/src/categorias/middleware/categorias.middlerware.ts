import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('Request...');
        if (!req.headers.get('Authorization')) {
            throw new BadRequestException('Token não informado');
        }
        next();
    }
}
