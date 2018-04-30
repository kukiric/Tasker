import { ProjectStub, TaskStub, TaskStatus, UserStub } from "api/stubs";
import EditableText from "@components/misc/EditableText.vue";
import utils from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    components: { EditableText },
    data() {
        return {
            editMode: false
        };
    },
    props: {
        task: Object,
        isFirst: Boolean
    } as {
        task: () => TaskStub,
        isFirst: () => boolean
    },
    computed: {
        progress(): number {
            return Math.floor(this.task.progress * 100);
        },
        usersNotInTask(): Partial<UserStub>[] {
            let project = this.$store.state.currentProject;
            if (project && project.users) {
                let users = project.users;
                return users.filter((u1: UserStub) => {
                    return this.task.users!.some((u2) => u1.id === u2.id) === false;
                });
            }
            return [];
        }
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
        },
        addUser(user: UserStub) {
            this.$store.dispatch("addUserToTask", { task: this.task, user: user });
        },
        removeUser(user: UserStub) {
            this.$store.dispatch("removeUserFromTask", { task: this.task, user: user });
        },
        updateTask() {
            this.$store.dispatch("updateTask", this.task);
        }
    }
});
