<template>
    <nav class="ui attached menu">
        <!-- Link para o home -->
        <router-link class="header item" to="/">Tasker</router-link>
        <!-- Dropdown de projetos do usuário logado -->
        <div v-if="user" class="ui simple dropdown item">
            Meus Projetos <i class="dropdown icon"></i>
            <div class="ui menu">
                <router-link tag="div" :to="{ name: 'ProjectView', params: { projectId: project.id } }" v-for="project in projects" :key="project.id" replace class="item">
                {{ project.name }}
                </router-link>
                <div v-if="projects.length == 0" class="disabled item">Não há nada aqui...</div>
            </div>
        </div>
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
