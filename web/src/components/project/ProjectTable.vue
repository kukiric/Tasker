<template>
    <div v-if="projects.error">
        <h3 class="ui red header">Ocorreu um erro tentando acessar o servidor</h3>
    </div>
    <!-- Tabela de projetos -->
    <table v-else class="ui single line selectable celled table">
        <thead class="hidden on mobile">
            <tr>
                <th>Nome</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Data de criação</th>
                <th>Data de entrega</th>
                <th>Gerente</th>
            </tr>
        </thead>
        <tbody>
            <router-link :to="{ name: 'Project', params: { projectId: project.id } }"
                    v-for="project in projects" :key="project.id"
                    tag="tr" :class="{ negative: isLate(project), positive: isDone(project) }">
                <td>{{ project.name }}</td>
                <td><sui-label v-for="tag in project.tags" :color="tag.color" :key="tag.id">{{ tag.name }}</sui-label></td>
                <td>{{ project.status }}</td>
                <td :title="time(project.created_at)">{{ date(project.created_at) }}</td>
                <td :title="time(project.due_date)">{{ date(project.due_date) }}</td>
                <td v-if="project.manager">{{ project.manager.fullname }}</td>
                <td v-else title="Sem gerente"><hr class="ui divider" style="margin: 0"></td>
            </router-link>
        </tbody>
    </table>
</template>
<script src="./ProjectTable.ts" lang="ts"></script>
