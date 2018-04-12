import { Lifecycle, Request, ResponseToolkit, RouteOptionsAccess } from "hapi";
import { AllowedRole } from "api/models/Role";
import { Model, RelationMappings } from "objection";
import * as Boom from "boom";
import * as Joi from "joi";

/**
 * Tipo de função que trata rotas em um controller
 */
export type PathHandler = (
    params: { [key: string]: any },
    h: ResponseToolkit,
    request: Request
) => Lifecycle.ReturnValue;

interface BaseRoute {
    /**
     * Validação para os parâmetros no caminho do recurso
     */
    paramsValidator?: {
        [name: string]: Joi.AnySchema
    };
    /**
     * Validação para os parâmetros no final da URL
     */
    queryValidator?: {
        [name: string]: Joi.AnySchema
    };
    /**
     * Validação para as informações no corpo da requisição
     */
    payloadValidator?: {
        [name: string]: Joi.AnySchema
    };
    /**
     * Validação para o a resposta da requisição
     */
    responseValidator?: {
        [name: string]: Joi.AnySchema
    } | Joi.AnySchema;
    /**
     * Função que responde à requisição
     */
    handler: PathHandler;
}

interface RouteWithAuth extends BaseRoute {
    /**
     * Obriga os usuários a estarem autenticados para acessar essa rota
     * @default true
     */
    authRequired?: true;
    /**
     * Roles permitidos a acessar essa rota
     */
    roles: AllowedRole[];
}

interface RouteWithoutAuth extends BaseRoute {
    authRequired: false;
    roles?: undefined;
}

/**
 * União dos tipos de rota com e sem o parâmetro authRequired
 */
export type Route = RouteWithAuth | RouteWithoutAuth;

export interface RouteMapping {
    [uri: string]: Route;
}

export interface RouteDefinitions {
    GET?: RouteMapping;
    POST?: RouteMapping;
    PUT?: RouteMapping;
    DELETE?: RouteMapping;
}

export default abstract class BaseController {
    /**
     * Classe de modelo usada em buscas
     */
    protected abstract modelClass: typeof Model;

    /**
     * Rotas desse controlador
     */
    public abstract routes: RouteDefinitions;

    /**
     * Retorna um erro de não encontrado para essa entidade
     */
    protected notFound(id: any) {
        return Boom.notFound(`${this.modelClass.name} with id ${id} not found`);
    }

    /**
     * Retorna um erro de não encontrado para outra entidade dentro dessa
     */
    protected childNotFound(childName: string, id: any, otherId: any) {
        return Boom.notFound(`${childName} with id ${otherId} not found in ` +
                             `${this.modelClass.name.toLowerCase()} with id ${id}`);
    }

    /**
     * Checa se o objeto do tipo modelClass existe no banco
     * @default modelClass this.modelClass
     */
    protected async exists(id: number, modelClass?: typeof Model) {
        let model = modelClass || this.modelClass;
        return await model.query().findById(id) !== undefined;
    }

    /**
     * Cria um relacionamento entre esse objeto (id) e outro (otherId)
     */
    protected async createRelation(id: any, other: string, otherId: any, h: ResponseToolkit) {
        let self = await this.modelClass.query().findById(id);
        if (self) {
            let relation = await self.$relatedQuery(other).relate(otherId);
            return h.response(relation).code(201);
        }
        return this.notFound(id);
    }

    /**
     * Remove o relacionamento entre esse objeto (id) e outro (otherId)
     */
    protected async deleteRelation(id: any, entity: string, relation: string, otherId: any, h: ResponseToolkit) {
        let self = await this.modelClass.query().findById(id);
        if (self) {
            let deleted = await self.$relatedQuery(relation).unrelate().where({ id: otherId });
            if (deleted) {
                return h.response().code(204);
            }
            return this.childNotFound(entity, id, otherId);
        }
        return this.notFound(id);
    }

    /**
     * Cria um validador que envolve o objeto em um array
     */
    protected arrayValidator(obj: { [key: string]: Joi.AnySchema }) {
        return Joi.array().items(Joi.object(obj));
    }

    /**
     * Cria um validador simples com propriedades obrigatórias do tipo number
     */
    protected multiIdValidator(...args: string[]) {
        let validator: { [key: string]: Joi.NumberSchema } = {};
        for (let arg of args) {
            validator[arg] = Joi.number().required();
        }
        return validator;
    }

    /**
     * Especialização de multiIdValidator para ID simples
     */
    protected idValidator(name: string) {
        return this.multiIdValidator(name);
    }

    /**
     * Cria um validador que permite somente buscar as relações que existem no modelo-alvo
     */
    protected includeValidator(relations: RelationMappings) {
        // Monta a expressão regular
        // Exemplo: para uma entidade com as relações a, b e c:
        // /^((a|b|c)(\[\w+\])?(,|$))+(?!.)/
        // Nota: as relações recursivas (filhos, filhos de filhos, etc) não são validadas
        let relationNameList = Object.keys(relations).join("|");
        let relationExamples = Object.keys(relations).join(",");
        let regex = new RegExp(`((${relationNameList})(\[\w+\])?(,|$))+(?!.)/`);
        return {
            include: Joi.string().regex(regex.compile()).optional().example(relationExamples)
                .description("Comma separated list of relations to eager-load, "
                           + "with children relations in brackets")
        };
    }

    /**
     * Cria uma expressão eager para o objection a partir do parâmetro "include" da rota
     * Exemplo: "a[b],c" => [a.[b],c]
     * @see https://vincit.github.io/objection.js/#eager-loading
     */
    protected makeEager(include: string) {
        if (include) {
            let withSpaces = include.replace(",", " ");
            let andDots = withSpaces.replace("[", ".[");
            let inBrackets = `[${andDots}]`;
            return inBrackets;
        }
        return "";
    }
}
