import { Model } from "objection";
import * as Joi from "joi".

export default class Tag extends Model {
    public static tableName = "tag";
    public id!: number;
    public name!: string;

    public static validator = {
        id: Joi.forbidden(),
        name: Joi.string().required().example("Android")
    };
}
