<template>
    <div class="ui container">
        <ProjectForm :show="showProjectModal" @close="showProjectModal = false" v-if="admin"/>
        <!-- Visualização de projetos -->
        <div class="ui raised segment">
            <div style="display: flex; align-items: center; justify-content: space-between">
                <h1 class="ui header">
                    <sui-icon color="teal" name="folder"/>
                    <div class="content">
                        Projetos
                        <div class="sub header">Visão geral</div>
                    </div>
                </h1>
                <button @click="showProjectModal = true" class="ui basic green action button" type="button" v-if="admin">
                    <sui-icon name="plus"/>Novo
                </button>
            </div>
            <hr class="ui fitted divider">
            <ProjectTable/>
        </div>
        <!-- Visualização de usuários -->
        <div class="ui raised segment">
            <div style="display: flex; align-items: center; justify-content: space-between">
                <h1 class="ui header">
                    <sui-icon color="blue" name="users"/>
                    <div class="content">
                        Usuários
                        <div class="sub header">Visão geral</div>
                    </div>
                </h1>
                <button class="ui basic green disabled action button" type="button" v-if="admin">
                    <sui-icon name="plus"/>Novo
                </button>
            </div>
            <hr class="ui fitted divider">
            <UserTable/>
        </div>
        <br><br>
    </div>
</template>
<script src="./AdminPage.ts" lang="ts"></script>
