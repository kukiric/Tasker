<template>
    <div>
        <div class="spacer"></div>
        <sui-menu fixed="top" class="secondary pointing navbar" ref="navbar">
            <!-- Links -->
            <router-link class="item" to="/" exact><sui-icon name="home"/>Início</router-link>
            <router-link class="item" to="/projects"><sui-icon name="folder outline"/>Projetos</router-link>
            <router-link class="item" to="/tasks"><sui-icon name="clipboard outline"/>Tarefas</router-link>
            <router-link class="item" to="/versions"><sui-icon name="check"/>Versões</router-link>
            <!-- Menu do usuário -->
            <div v-if="user" class="right menu">
                <sui-dropdown class="avatar item">
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
    </div>
</template>
<style scoped>
    .spacer {
        height: calc(4em - 2px);
    }
    .ui.navbar {
        margin-bottom: 1em;
        background-color: white !important;
        /* box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15); */
    }
    .text {
        opacity: 1 !important;
    }
    .avatar.item {
        padding: 0.5em !important;
    }
    .avatar.image {
        margin: -0.25em 0.25em;
    }
    @media screen and (max-width: 767px) {
        .ui.attached.menu {
            margin-bottom: 0;
            box-shadow: initial;
        }
    }
</style>
<style>
    .avatar.item > .dropdown.icon {
        margin: 0.5em !important;
    }
</style>
<script src="./Navbar.ts" lang="ts"></script>
