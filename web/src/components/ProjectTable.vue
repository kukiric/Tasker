<template>
    <!-- Tabela de projetos -->
    <table class="ui striped single line selectable celled table">
        <thead class="hidden on mobile">
            <tr>
                <th>Nome</th>
                <th>Data de criação</th>
                <th>Gerente</th>
            </tr>
        </thead>
        <tbody>
            <router-link :to="{ name: 'Project', params: { projectId: project.id } }" v-for="project in projects" :key="project.id" tag="tr">
                <td v-if="currentUserIsInProject(project)" title="Você faz parte desse projeto">
                    <i class="yellow star icon"></i>{{ project.name }}
                </td>
                <td v-else>
                    <i class="disabled star outline icon"></i>{{ project.name }}
                </td>
                <td :title="time(project.created_at)">{{ date(project.created_at) }}</td>
                <td v-if="project.manager" :title="project.manager.email">
                    <i class="user icon"></i>{{ project.manager.fullname }}
                </td>
                <td v-else class="disabled">
                    <span><i class="user icon"></i>Sem gerente</span>
                </td>
            </router-link>
        </tbody>
    </table>
</template>
<script src="@scripts/ProjectTable.ts" lang="ts"></script>
