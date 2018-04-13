<template>
    <nav class="ui attached menu">
        <!-- Link para o home -->
        <router-link class="header item" to="/">Tasker</router-link>
        <!-- Dropdown de projetos do usuário logado -->
        <sui-dropdown v-if="user" text="Meus Projetos" class="item">
            <sui-dropdown-menu>
                <sui-dropdown-item v-for="project in projects" :key="project.id">
                    <router-link tag="div" :to="{ name: 'ProjectView', params: { projectId: project.id } }">
                    {{ project.name }}
                    </router-link>
                </sui-dropdown-item>
                <div v-if="projects.length == 0" class="disabled item">Não há nada aqui...</div>
            </sui-dropdown-menu>
        </sui-dropdown>
        <div v-if="user" class="right menu">
            <!-- Botão de logoff -->
            <a @click="logout()" class="item"><i class="sign out icon"></i>Sair</a>
            <!-- Nome de usuário e botão para a tela de login -->
            <router-link to="/login" style="color: black" class="item">
                <i :class=userIconClass></i>{{ user.fullname }}
            </router-link>
        </div>
    </nav>
</template>
<script src="@scripts/Navbar.ts" lang="ts"></script>
