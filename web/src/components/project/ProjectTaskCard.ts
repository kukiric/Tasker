import { ProjectStub, TaskStub, TaskStatus, UserStub, TaskType } from "api/stubs";
import EditableText from "@components/misc/EditableText.vue";
import * as moment from "moment";
import utils from "@main/utils";
import { clamp } from "lodash";
import Vue from "vue";

export default Vue.extend({
    components: { EditableText },
    data() {
        return {
            taskStatus: "", // Para mudar a cor das cartas sem ter que re-construir todo o estado
            taskProgress: 0 // Idem, mas para a barra de progresso
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
            return Math.floor(this.taskProgress * 100);
        },
        taskStatusList() {
            return Object.values(TaskStatus);
        },
        taskTypeList() {
            return Object.values(TaskType);
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
            switch (this.taskStatus) {
                case TaskStatus.NEW: return "yellow";
                case TaskStatus.ASSIGNED: return "teal";
                case TaskStatus.IN_PROGRESS: return "blue";
                case TaskStatus.TESTING: return "olive";
                case TaskStatus.DONE: return "green";
                default: return "";
            }
        },
        getIconForStatus(task: TaskStub) {
            switch (this.taskStatus) {
                case TaskStatus.NEW: return "yellow asterisk";
                case TaskStatus.ASSIGNED: return "teal user";
                case TaskStatus.IN_PROGRESS: return "blue refresh";
                case TaskStatus.TESTING: return "olive file";
                case TaskStatus.DONE: return "green check";
                default: return "";
            }
        },
        hours(h: number) {
            return `${h} Horas`;
        },
        addUser(user: UserStub) {
            this.$store.dispatch("addUserToTask", { task: this.task, user: user });
        },
        dropUser(event: DragEvent) {
            let payload = event.dataTransfer.getData("addUserRequest");
            if (payload) {
                let user = JSON.parse(payload) as UserStub;
                let userInTask = this.task.users!.some((other) => other.id === user.id);
                if (!userInTask) {
                    this.addUser(user);
                }
            }
        },
        removeUser(user: UserStub) {
            this.$store.dispatch("removeUserFromTask", { task: this.task, user: user });
        },
        async sendUpdate(newValues: TaskStub) {
            await this.$store.dispatch("updateTask", newValues);
        },
        updateTitle(title: string) {
            this.sendUpdate({ ...this.task, title });
        },
        updateDescription(description: string) {
            this.sendUpdate({ ...this.task, description });
        },
        updateDueDate(date: Date) {
            if (date) {
               this.sendUpdate({ ...this.task, due_date: moment(date).toDate() });
            }
        },
        updateHours(estimate_work_hour: number) {
            this.sendUpdate({ ...this.task, estimate_work_hour });
        },
        updateType(type: string) {
            this.sendUpdate({ ...this.task, type: type as TaskType });
        },
        updateStatus(status: string) {
            this.sendUpdate({ ...this.task, status: status as TaskStatus });
        },
        updateStatusInternal(status: string) {
            this.taskStatus = status;
        },
        setProgress(event: MouseEvent) {
            // Busca o elemento dentro da instância do componente
            let progressBar = (this.$refs.progressBar as any).$el;
            if (progressBar instanceof HTMLElement) {
                // Calcula a porcentagem do clique na barra
                let rect = progressBar.getBoundingClientRect();
                let width = rect.width;
                let start = rect.left;
                let click = event.clientX;
                let progress = clamp((click - start) / width, 0, 1);
                this.sendUpdate({ ...this.task, progress });
                this.taskProgress = progress;
            }
        }
    },
    created() {
        this.taskStatus = this.task.status;
        this.taskProgress = this.task.progress;
    }
});
