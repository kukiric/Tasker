<template>
    <div class="ui segment container">
        <h1 class="ui dividing header">
            <i class="teal open folder icon"></i>
            <div v-if="project" class="content">
                <div>{{ project.name }}</div>
                <div class="sub header">{{ date(project.created_at) }}</div>
            </div>
            <div v-else class="content">Carregando...</div>
        </h1>
        <div v-if="project">
            <h2 class="ui dividing sub header">Usuários</h2>
            <ul class="ui bulleted list">
                <li v-for="user in project.users" :key="user.id" class="item">{{ user.fullname }} - {{ user.email }}</li>
            </ul>
            <h2 class="ui dividing sub header">Tarefas</h2>
            <div class="ui bulleted list">
                <div v-for="task in project.tasks" :key="task.id" class="item">
                    {{ task.description }} - <em>{{ task.status }}</em>
                    <div v-if="task.users.length > 0" class="list">
                        <div v-for="user in task.users" :key="user.id">
                            <i class="ui user icon"></i> {{ user.fullname }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else style="height: 66vh;"></div>
    </div>
</template>

<script>
import Vue from "vue";
import * as moment from "moment";
export default Vue.extend({
    data() {
        return {
           project: null
        }
    },
    props: {
        projectId: { type: String, required: true }
    },
    methods: {
        date(date) {
            return moment(date).locale("pt-br").format("LL");
        },
        async loadProject(id) {
            let req = await this.$http.get(`/api/projects/${id}?include=users,tasks[users]`);
            this.project = req.data ? req.data : { name: "Ocorreu um erro carregando o projeto" };
        }
    },
    async beforeMount() {
        await this.loadProject(this.$route.params.projectId);
    }
});
</script>
