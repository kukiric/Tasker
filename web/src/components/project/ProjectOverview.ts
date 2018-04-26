import { ProjectStub, TaskStub, TaskStatus } from "api/stubs";
import ProjectTaskCard from "@components/project/ProjectTaskCard.vue";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectTaskCard },
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
            this.$store.dispatch("createTaskGroup");
        },
        deleteTask(task: TaskStub) {
            this.$store.dispatch("deleteTask", task);
        }
    }
});
