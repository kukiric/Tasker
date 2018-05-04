import { ProjectStub } from "api/stubs";
import * as marked from "marked";
import * as moment from "moment";
import * as md5 from "md5";

interface ObjectWithId {
    id: number;
};

/**
 * Métodos utilitários usados em todo o projeto
 */
const utils = {
    dropdownItem(object: ObjectWithId, textKey: string) {
        return {
            key: object.id,
            value: object.id,
            text: object[textKey]
        };
    },
    dropdownItems(objects: ObjectWithId[], textKey: string) {
        return objects.map((value) => utils.dropdownItem(value, textKey));
    },
    isLate(project: ProjectStub) {
        return project.status !== "Concluído" && moment().isAfter(project.due_date, "day");
    },
    date(date: string) {
        return moment(date).format("L");
    },
    time(timestamp: string) {
        return moment(timestamp).format("LLLL");
    },
    gravatar(email: string) {
        return `https://www.gravatar.com/avatar/${md5(email)}?s=32&d=identicon`;
    },
    md(source: string) {
        return marked(source, { gfm: false, sanitize: true });
    }
};

export default utils;
