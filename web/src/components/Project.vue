<template>
    <div class="ui segment container">
        <h1 class="ui header">
            <i class="teal open folder icon"></i>
            <div v-if="project" class="content">
                <div>{{ project.name }}</div>
                <div class="sub header">{{ date(project.created_at) }}</div>
            </div>
            <div v-else class="content">Carregando...</div>
        </h1>
        <div style="min-height: 66vh;">
            <div v-if="project">
                <h2 class="ui dividing sub header">Usuários</h2>
                <ul class="ui bulleted list">
                    <li v-for="user in project.users" :key="user.id" class="item">{{ user.fullname }} - {{ user.email }}</li>
                </ul>
                <h2 class="ui dividing sub header">Tarefas</h2>
                <div class="ui bulleted list">
                    <div v-for="task in project.tasks" :key="task.id" class="item" style="margin-bottom: 1.5em">
                        <div class="header">{{ task.description }}</div>
                        <div>{{ task.status }} / {{ task.type }}</div>
                        <div v-if="task.users.length > 0" class="list">
                            <div class="header" style="margin-bottom: 0.25em">Membros:</div>
                            <div v-for="user in task.users" :key="user.id">
                                <i class="ui user icon"></i> {{ user.fullname }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./Project.ts" lang="ts"></script>
