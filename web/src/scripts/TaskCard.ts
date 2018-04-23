import { ProjectStub, TaskStub, TaskStatus } from "api/stubs";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    props: {
        task: Object,
        isFirst: Boolean
    },
    methods: {
        ...utils,
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
