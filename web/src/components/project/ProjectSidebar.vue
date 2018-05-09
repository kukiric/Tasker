<template>
    <sui-sidebar :visible="visible" direction="right" animation="overlay">
        <!-- Botão de abrir/fechar -->
        <sui-button class="left attached side button" :icon="pusherIcon" @click="visible = !visible"/>
        <div class="item">
            <!-- Lista de membros do projeto -->
            <h1 class="ui header">Membros</h1>
            <div class="ui middle aligned relaxed list">
                <div class="item" v-if="users == null">Carregando...</div>
                <div class="item" v-for="user in users" :key="user.id" draggable @dragstart="dragStartUser($event, user)" @dragend="dragEndUser">
                    <sui-image avatar draggable="false" :src="gravatar(user.email)"/>
                    <div class="content">
                        <div class="header">{{ user.fullname }}</div>
                        <div class="description">{{ user.email }}</div>
                    </div>
                    <div v-if="$store.getters.userIsManager && user.id != $store.state.currentUser.id" class="right floated content">
                        <a><sui-icon color="red" name="delete" title="Remover" @click.prevent="$emit('removeUser', user)"/></a>
                    </div>
                </div>
            </div>
            <!-- Botão de adicionar usuários no projeto -->
            <sui-dropdown v-if="$store.getters.userIsManager" fluid selection class="green button" :class="{ disabled: availableUsers.length === 0 }">
                Adicionar
                <sui-dropdown-menu>
                    <sui-dropdown-item v-for="user in availableUsers" :key="user.id" @click="$emit('addUser', user)">
                        <sui-image avatar :src="gravatar(user.email)"/>
                        {{ user.fullname }}
                    </sui-dropdown-item>
                </sui-dropdown-menu>
            </sui-dropdown>
        </div>
    </sui-sidebar>
</template>
<style scoped>
    .ui.sidebar {
        padding-top: 3em;
        overflow: visible !important;
        z-index: 5 !important;
        width: 25rem;
    }
    .ui.sidebar .side.button {
        position: absolute;
        visibility: visible !important;
        transform: translate(-100%, 0);
        transition: background-color 100ms ease;
        background-color: white;
        border-radius: 0;
        padding: 0.5em;
        z-index: 50;
        height: 100%;
        top: 0;
    }
    .ui.sidebar .side.button:hover {
        background-color: lightgray;
    }
</style>
<script src="./ProjectSidebar.ts" lang="ts"></script>
