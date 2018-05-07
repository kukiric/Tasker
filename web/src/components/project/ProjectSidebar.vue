<template>
    <sui-menu vertical fixed="right">
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
    </sui-menu>
</template>
<style scoped>
    .ui.menu {
        overflow: visible !important;
        background-color: rgba(255, 255, 255, 0.5);
        width: 25rem;
    }
</style>
<script src="./ProjectSidebar.ts" lang="ts"></script>
