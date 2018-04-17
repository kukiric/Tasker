<template>
    <div>
        <!-- Barra lateral -->
        <sui-sidebar animation="overlay" direction="right" width="very wide" :visible="showSidebar">
            <sui-button class="left attached side button" icon="bars" @click="showSidebar = !showSidebar"/>
            <div class="item">
                <h1 class="ui header">Membros</h1>
                <div class="ui middle aligned relaxed list" v-if="project">
                    <div class="item"  v-for="user in project.users" :key="user.id">
                        <sui-image avatar :src="gravatar(user.email)"/>
                        <div class="content">
                            <div class="header">{{ user.fullname }}</div>
                            <div class="description">{{ user.email }}</div>
                        </div>
                        <div v-if="user.id != g.state.currentUser.id" class="right floated content">
                            <a><sui-icon color="red" name="delete" title="Remover" @click.prevent="removeUser(user)"/></a>
                        </div>
                    </div>
                </div>
                <sui-dropdown v-if="g.getters.userIsManager" fluid selection class="green button">
                    Adicionar
                    <sui-dropdown-menu>
                        <sui-dropdown-item v-for="user in g.getters.usersNotInProject" :key="user.id" @click="addUser(user)">
                            <sui-image avatar :src="gravatar(user.email)"/>
                            {{ user.fullname }}
                        </sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </div>
        </sui-sidebar>
        <div class="ui raised segment container">
            <!-- Cabeçalho da página -->
            <h1 class="ui header">
                <i class="teal open folder icon"></i>
                <div v-if="project" class="content">
                    <div>{{ project.name }}</div>
                    <div class="sub header" :class="{ red: isLate }">
                        <i v-if="isLate" class="clock icon"></i>
                        <span>{{ date(project.created_at) }} - {{ date(project.due_date) }}</span>
                    </div>
                </div>
                <div v-else class="content">Carregando...</div>
            </h1>
            <!-- Informações do projeto -->
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
    </div>
</template>
<script src="@scripts/ProjectView.ts" lang="ts"></script>
