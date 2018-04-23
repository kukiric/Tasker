import * as moment from "moment";
import * as md5 from "md5";
import { ProjectStub } from "api/stubs";

/**
 * Métodos utilitários usados em todo o projeto
 */
export default {
    isLate(project: ProjectStub) {
        return project.status !== "Concluído" && moment().isAfter(project.due_date, "day");
    },
    date(date: string) {
        return moment(date).format("LL");
    },
    time(timestamp: string) {
        return moment(timestamp).format("LLLL");
    },
    gravatar(email: string) {
        return `https://www.gravatar.com/avatar/${md5(email)}?s=32&d=identicon`;
    }
};
