<template>
    <table class="ui selectable single line celled table">
        <thead class="computer only">
            <tr>
                <th>Nome</th>
                <th>Data de criação</th>
                <th>Gerente</th>
            </tr>
        </thead>
        <tbody>
            <router-link :to="{ name: 'ProjectDetails', params: { projectId: project.id }}" tag="tr" v-for="project in projects" :key="project.id">
                <td>{{ project.name }}</td>
                <td>{{ date(project.created_at) }}</td>
                <td v-if="project.manager">
                    <i class="user icon"></i>{{ project.manager.fullname }}
                </td>
                <td v-else class="disabled">
                    <span><i class="user icon"></i>Sem gerente</span>
                </td>
            </router-link>
        </tbody>
    </table>
</template>

<script>
import * as moment from "moment";
import Vue from 'vue'
export default Vue.extend({
    data: () => {
        return {
            projects: []
        }
    },
    methods: {
        date(date) {
            return moment(date).locale("pt-br").format("LL");
        },
        async fetchProjects() {
            let userId = localStorage.getItem("user-id");
            let req = await this.$http.get(`/api/users/${userId}/projects`);
            let projects = Array.isArray(req.data) && req.data.sort((a, b) => {
                return a.created_at > b.created_at;
            });
            this.projects = projects || [];
        }
    },
    created() {
        this.fetchProjects();
    }
})
</script>
