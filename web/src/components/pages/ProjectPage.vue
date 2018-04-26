<template>
    <NotFound v-if="project && project.error"/>
    <div v-else>
        <!-- Barra lateral -->
        <sui-sidebar animation="overlay" direction="right" width="very wide" :visible="showSidebar">
            <sui-button class="left attached side button" color="blue" icon="users" @click="showSidebar = !showSidebar"/>
            <div class="item">
                <!-- Lista de membros do projeto -->
                <h1 class="ui header">Membros</h1>
                <div class="ui middle aligned relaxed list" v-if="project">
                    <div class="item"  v-for="user in project.users" :key="user.id">
                        <sui-image avatar :src="gravatar(user.email)"/>
                        <div class="content">
                            <div class="header">{{ user.fullname }}</div>
                            <div class="description">{{ user.email }}</div>
                        </div>
                        <div v-if="$store.getters.userIsManager && user.id != $store.state.currentUser.id" class="right floated content">
                            <a><sui-icon color="red" name="delete" title="Remover" @click.prevent="removeUser(user)"/></a>
                        </div>
                    </div>
                </div>
                <!-- Botão de adicionar usuários no projeto -->
                <sui-dropdown v-if="$store.getters.userIsManager" fluid selection class="green button">
                    Adicionar
                    <sui-dropdown-menu>
                        <sui-dropdown-item v-for="user in $store.getters.usersNotInProject" :key="user.id" @click="addUser(user)">
                            <sui-image avatar :src="gravatar(user.email)"/>
                            {{ user.fullname }}
                        </sui-dropdown-item>
                    </sui-dropdown-menu>
                </sui-dropdown>
            </div>
        </sui-sidebar>
        <!-- Cabeçalho da página -->
        <div class="ui sticky raised attached segment">
            <h1 class="ui header">
                <i class="teal open folder icon"></i>
                <div v-if="project" class="content">
                    <div>{{ project.name }}</div>
                    <div class="sub header" :class="{ red: isLate(project) }">
                        <i v-if="isLate(project)" class="clock icon"></i>
                        <span>{{ project.status }}: {{ date(project.created_at) }} - {{ date(project.due_date) }}</span>
                    </div>
                </div>
                <div v-else class="content">Carregando...</div>
            </h1>
        </div>
        <!-- Informações do projeto -->
        <div class="project area">
            <div v-if="project">
                <ProjectOverview :project="project"/>
            </div>
        </div>
    </div>
</template>
<script src="./ProjectPage.ts" lang="ts"></script>
