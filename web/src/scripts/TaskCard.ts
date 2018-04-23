import { ProjectStub, TaskStub, TaskStatus } from "api/stubs";
import * as moment from "moment";
import * as md5 from "md5";
import Vue from "vue";

export default Vue.extend({
    props: {
        task: Object,
        isFirst: Boolean
    },
    methods: {
        date(date: string) {
            return moment(date).format("LL");
        },
        gravatar(email: string) {
            return `https://www.gravatar.com/avatar/${md5(email)}?s=32&d=identicon`;
        },
        getColorForStatus(task: TaskStub) {
            switch (task.status) {
                case TaskStatus.NEW: return "yellow";
                case TaskStatus.ASSIGNED: return "blue";
                case TaskStatus.IN_PROGRESS: return "blue";
                case TaskStatus.TESTING: return "yellow";
                case TaskStatus.DONE: return "green";
                default: return "";
            }
        },
        getIconForStatus(task: TaskStub) {
            switch (task.status) {
                case TaskStatus.NEW: return "yellow file outline";
                case TaskStatus.ASSIGNED: return "blue user";
                case TaskStatus.IN_PROGRESS: return "blue refresh";
                case TaskStatus.TESTING: return "yellow exclamation";
                case TaskStatus.DONE: return "green check";
                default: return "";
            }
        }
    }
});
