import { ProjectStub, TaskStub, TaskStatus } from "api/stubs";
import ProjectTaskCard from "@components/project/ProjectTaskCard.vue";
import Vue from "vue";

export default Vue.extend({
    components: { ProjectTaskCard },
    props: {
        project: Object
    },
    computed: {
        rootTasks() {
            let project = this.project;
            if (project && project.tasks) {
                // Busca somente as tarefas sem pai
                let rootTasks = project.tasks.filter((task) => task.parent == null);
                // Ordena elas por ID
                return rootTasks.sort((a, b) => a.id! - b.id!);
            }
            return [];
        }
    },
    methods: {
        getTaskTree(task: Partial<TaskStub>) {
            let parent = task;
            let children = this.project.tasks.filter((other) => other.parent && other.parent.id === task.id);
            return [parent].concat(children);
        },
        createTaskGroup() {
            this.$store.dispatch("createTask");
        },
        createSubTask(parentId: number) {
            this.$store.dispatch("createTask", parentId);
        },
        deleteTask(task: TaskStub) {
            this.$store.dispatch("deleteTask", task);
        }
    }
});
