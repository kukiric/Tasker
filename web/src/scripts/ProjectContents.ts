import { ProjectStub, TaskStub, TaskStatus } from "api/stubs";
import TaskCard from "@components/TaskCard.vue";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    components: { TaskCard },
    props: {
        project: Object
    },
    methods: {
        ...utils,
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
