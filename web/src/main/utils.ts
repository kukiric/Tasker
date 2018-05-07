import { ProjectStub } from "api/stubs";
import * as marked from "marked";
import * as moment from "moment";
import * as md5 from "md5";

interface ObjectWithId {
    id: number;
}

export function dropdownItem(object: ObjectWithId, textKey: string) {
    return {
        key: object.id,
        value: object.id,
        text: object[textKey]
    };
}

export function dropdownItems(objects: ObjectWithId[], textKey: string) {
    return objects.map((value) => dropdownItem(value, textKey));
}

export function isLate(project: ProjectStub) {
    return project.status !== "Concluído" && moment().isAfter(project.due_date, "day");
}

export function isDone(project: ProjectStub) {
    return project.status === "Concluído";
}

export function date(value: string) {
    return moment(value).format("L");
}

export function time(timestamp: string) {
    return moment(timestamp).format("LLLL");
}

export function gravatar(email: string) {
    return `https://www.gravatar.com/avatar/${md5(email)}?s=32&d=identicon`;
}

export function markdown(source: string) {
    return marked(source, { gfm: false, sanitize: true });
}
