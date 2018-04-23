import { ProjectStub, TaskStub, TaskStatus } from "api/stubs";
import TaskCard from "@components/TaskCard.vue";
import * as moment from "moment";
import * as md5 from "md5";
import Vue from "vue";

export default Vue.extend({
    components: { TaskCard },
    props: {
        project: Object
    },
    methods: {
        date(date: string) {
            return moment(date).format("LL");
        },
        gravatar(email: string) {
            return `https://www.gravatar.com/avatar/${md5(email)}?s=32&d=identicon`;
        },
        getTaskTree(task: Partial<TaskStub>) {
            if (task.children) {
                return [task].concat(task.children);
            }
            return [];
        },
        createTaskGroup() {
            this.g.dispatch("createTaskGroup");
        },
        deleteTask(task: TaskStub) {
            this.g.dispatch("deleteTask", task);
        }
    }
});
