<template>
    <sui-menu role="nav" class="attached stackable" ref="navbar">
        <!-- Link para o home -->
        <router-link class="header item" to="/">Tasker</router-link>
        <!-- Dropdown de projetos do usuário logado -->
        <sui-dropdown v-if="user" text="Meus Projetos" class="item">
            <sui-dropdown-menu>
                <router-link tag="div" class="item"
                    :to="{ name: 'Project', params: { projectId: project.id } }"
                    v-for="project in userProjects" :key="project.id">
                    {{ project.name }}
                </router-link>
                <div v-if="userProjects.length == 0" class="disabled item">Não há nada aqui...</div>
            </sui-dropdown-menu>
        </sui-dropdown>
        <!-- Menu do usuário -->
        <div v-if="user" class="right menu">
            <sui-dropdown class="avatar item" icon="bars">
                <sui-image avatar :src="gravatar(user.email)"/>
                <sui-dropdown-menu>
                    <sui-dropdown-item :text="user.fullname" icon="address card" class="text" disabled/>
                    <sui-dropdown-item :text="user.email" icon="envelope" class="text" disabled/>
                    <sui-dropdown-divider/>
                    <router-link is="sui-dropdown-item" to="/admin" text="Painel de Controle" icon="wrench"/>
                    <sui-dropdown-item text="Sair" icon="sign out" @click="logout()"/>
                </sui-dropdown-menu>
            </sui-dropdown>
            <!-- Botão de logoff -->
        </div>
    </sui-menu>
</template>
<style scoped>
    .ui.attached.menu {
        margin-bottom: 1em;
        background-color: white;
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
    }
    .text {
        opacity: 1 !important;
    }
    .avatar.item {
        padding: 0.5em;
    }
    .avatar.image {
        margin: -0.25em 0.25em;
    }
    .dropdown.icon {
        display: inherit !important;
    }
    @media screen and (max-width: 767px) {
        .ui.attached.menu {
            margin-bottom: 0;
            box-shadow: initial;
        }
    }
</style>
<script src="./Navbar.ts" lang="ts"></script>
