<template>
    <div v-if="isAdminOrManager" class="ui container">
        <ProjectForm :show="showProjectModal" @close="showProjectModal = false"/>
        <!-- Visualização de projetos -->
        <div class="ui raised segment">
            <div style="display: flex; align-items: center; justify-content: space-between">
                <h1 class="ui header">
                    <i class="teal folder icon"></i>
                    <div class="content">
                        Projetos
                        <div class="sub header">Visão geral</div>
                    </div>
                </h1>
                <button @click="showProjectModal = true" class="ui basic green action button" type="button"><i class="plus icon"></i>Novo</button>
            </div>
            <hr class="ui fitted divider">
            <ProjectTable/>
        </div>
        <!-- Visualização de usuários -->
        <div class="ui raised segment">
            <div style="display: flex; align-items: center; justify-content: space-between">
                <h1 class="ui header">
                    <i class="blue users icon"></i>
                    <div class="content">
                        Usuários
                        <div class="sub header">Visão geral</div>
                    </div>
                </h1>
                <button class="ui basic green disabled action button" type="button"><i class="plus icon"></i>Novo</button>
            </div>
            <hr class="ui fitted divider">
            <UserTable/>
        </div>
    </div>
</template>
<script src="./HomePage.ts" lang="ts"></script>
