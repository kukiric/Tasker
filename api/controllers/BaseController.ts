import { Lifecycle, Request, ResponseToolkit, RouteOptionsAccess } from "hapi";
import { Model, RelationMappings, transaction } from "objection";
import { RoleType } from "api/models/Role";
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
    roles: RoleType[];
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
        return this.createRelationThrough(id, other, otherId, this.modelClass, h);
    }

    /**
     * Cria um relacionamento entre esse objeto (id) e outro (otherId), através de um modelo específico
     */
    // tslint:disable-next-line:max-line-length
    protected async createRelationThrough(id: any, other: string, otherId: any, model: typeof Model, h: ResponseToolkit) {
        let self = await model.query().findById(id);
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
        return this.deleteRelationThrough(id, entity, relation, otherId, this.modelClass, h);
    }

    /**
     * Remove o relacionamento entre esse objeto (id) e outro (otherId), através de um modelo específico
     */
    // tslint:disable-next-line:max-line-length
    protected async deleteRelationThrough(id: any, entity: string, relation: string, otherId: any, model: typeof Model, h: ResponseToolkit) {
        let self = await model.query().findById(id);
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
     * BUG: A validação não é recursiva, permitindo qualquer valor entre colchetes
     */
    protected includeValidator(relations: RelationMappings) {
        // Monta a expressão regular
        // Exemplo: para uma entidade com as relações a, b e c:
        // /^((a|b|c)(\[[\[\]\w,]+\])?(,|$))+(?!.)/
        let relationNameList = Object.keys(relations).join("|");
        let relationExamples = Object.keys(relations).join(", ");
        let regex = new RegExp(`^((${relationNameList})(\\[[\\[\\]\\w,]+\\])?(,|$))+(?!.)`);
        return {
            include: Joi.string().regex(regex).optional().example("a[b],c[d[e,f,g]]")
                .description("Comma separated list of relations to eager-load, "
                           + "with children relations in brackets.\n\n"
                           + "Allowed relations for this model: " + relationExamples)
        };
    }

    /**
     * Cria uma expressão eager para o objection a partir do parâmetro "include" da rota
     * Exemplo: "a[b],c" => [a.[b],c]
     * @see https://vincit.github.io/objection.js/#eager-loading
     */
    protected makeEagerString(include?: string) {
        if (include) {
            // Troca as vírgulas do parâmetro por espaços
            include = include.replace(/,/g, " ");
            // Insere pontos se necessário
            include = include.replace(/\[/g, ".[");
            // Envolve toda a expressão em colchetes
            include = `[${include}]`;
            // Remove as vírgulas no final para evitar erros
            include = include.replace(/,+$/, "");
            // Retorna a string transformada
            return include;
        }
        return "";
    }

    /**
     * Gera uma eager query a partir de um modelo com includes automáticos
     */
    protected eagerQuery(include?: string, modelClass = this.modelClass, maxDepth = 3) {
        // Verifica a profundidade da pilha de operação de inclusão
        if (include && maxDepth > 0) {
            // Monta uma pseudo-pilha para contar os colchetes
            let stackSize = 0;
            // Monta um array de colchetes para contagem dos mesmos
            let brackets = include.split("").filter(ch => ch === "[" || ch === "]");
            // Verifica se a pilha foi estourada por muitas aberturas sucessivas
            let overflow = brackets.some(b => {
                if (b === "[") {
                    ++stackSize;
                }
                else {
                    --stackSize;
                }
                return stackSize >= maxDepth;
            });
            // Joga o erro para fora se a profundidade máxima for excedida
            // TODO: tratar em um lugar mais prático (eg. dentro do ciclo de validação do Hapi)
            if (overflow) {
                let err = new Error(`Max eager query include depth of ${maxDepth} exceeded!`);
                Object.assign(err, { code: 400 });
                throw err;
            }
        }
        // Retorna a expressão transformada para o formado do Objection.js
        return modelClass.query().eager(this.makeEagerString(include));
    }

    /**
     * Executa um trecho de código dentro de uma transação com o banco de dados
     */
    protected async inTransaction<T>(callback: (trx: any) => Promise<T>) {
        return await transaction(this.modelClass.knex(), callback);
    }
}
