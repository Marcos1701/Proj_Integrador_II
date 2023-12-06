import { Resolver, Query, Args, InterfaceType, ObjectType, Field, Context } from "@nestjs/graphql";
import { Usuario } from "../entities/usuario.entity";
import { Injectable } from "@nestjs/common";
import { UsuariosService } from "../usuarios.service";

@ObjectType()
export class RelacaoGasto {
    @Field()
    gasto: number;

    @Field()
    gastoMesAnterior: number;
}


@Resolver(() => Usuario)
@Injectable()
export class UsuarioResolver {

    constructor(private readonly usuarioService: UsuariosService) { }

    @Query(() => RelacaoGasto)
    async gasto(@Args('access_token') access_token: string) {
        return this.usuarioService.getGasto(access_token);
    }

}