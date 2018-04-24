<template>
    <sui-menu role="nav" class="attached stackable" ref="navbar">
        <!-- Link para o home -->
        <router-link class="header item" to="/">Tasker</router-link>
        <!-- Dropdown de projetos do usuário logado -->
        <sui-dropdown v-if="user" text="Meus Projetos" class="item">
            <sui-dropdown-menu>
                <router-link tag="div" class="item" :to="{ name: 'Project', params: { projectId: project.id } }" v-for="project in projects" :key="project.id">
                    {{ project.name }}
                </router-link>
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
    </sui-menu>
</template>
<script src="./Navbar.ts" lang="ts"></script>
