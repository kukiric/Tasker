import { ProjectStub } from "api/stubs";
import * as marked from "marked";
import * as moment from "moment";
import * as md5 from "md5";

/**
 * Métodos utilitários usados em todo o projeto
 */
export default {
    isLate(project: ProjectStub) {
        return project.status !== "Concluído" && moment("now").isAfter(project.due_date, "day");
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
    picsum(hash: string) {
        
    },
    md(source: string) {
        return marked(source, { gfm: true, sanitize: true });
    }
};
