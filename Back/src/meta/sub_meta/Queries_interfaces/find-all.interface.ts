import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export enum Metaorderby {
    titulo = 'titulo',
    valor = 'valor',
    dataCriacao = 'dataCriacao',
}

export enum Metadirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class FindAllMetaDto {
    @IsOptional()
    @IsEnum(Metaorderby)
    orderby?: keyof typeof Metaorderby;

    @IsOptional()
    @IsEnum(Metadirection)
    direction?: keyof typeof Metadirection;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsUUID('all')
    metaid: string;

}