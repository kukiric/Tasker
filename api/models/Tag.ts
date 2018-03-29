import { Model } from "objection";
import { TagStub } from "api/stubs";
import * as Joi from "joi";

export default class Tag extends Model implements TagStub {
    public id!: number;
    public name!: string;

    public static validator = {
        id: Joi.forbidden(),
        name: Joi.string().required().example("Android")
    };
}
