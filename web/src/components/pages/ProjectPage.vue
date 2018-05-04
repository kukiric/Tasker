<template>
    <ErrorPage v-if="project && project.error"/>
    <div class="root" v-else>
        <!-- Barra lateral -->
        <sui-sidebar animation="overlay" direction="right" width="very wide" :visible="showSidebar">
            <sui-button class="left attached side button" color="blue" icon="users" @click="showSidebar = !showSidebar"/>
            <div class="item">
                <!-- Lista de membros do projeto -->
                <h1 class="ui header">Membros</h1>
                <div class="ui middle aligned relaxed list" v-if="project">
                    <div class="item" v-for="user in project.users" :key="user.id" draggable @dragstart="dragStartUser($event, user)" @dragend="dragEndUser">
                        <sui-image avatar draggable="false" :src="gravatar(user.email)"/>
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
                <sui-dropdown v-if="$store.getters.userIsManager" fluid selection class="green button" :class="{ disabled: usersNotInProject.length === 0 }">
                    Adicionar
                    <sui-dropdown-menu>
                        <sui-dropdown-item v-for="user in usersNotInProject" :key="user.id" @click="addUser(user)">
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
                    <!-- Título -->
                    <EditableText tag="span" :value="project.name" @input="updateName"/>
                    <div class="spacer"></div>
                    <!-- Tags -->
                    <sui-label v-for="tag in project.tags" :key="tag.id" :color="tag.color" image>
                        {{ tag.name }}
                        <sui-icon name="delete" @click="removeTag(tag.id)"/>
                    </sui-label>
                    <sui-dropdown search selection placeholder="Adicionar tags" :options="tags" class="tags" :class="{ disabled: tags.length == 0 }" @input="addTag"/>
                    <!-- Informações extras -->
                    <div class="sub header" :class="{ red: isLate(project) }">
                        <i v-if="isLate(project)" class="clock icon"></i>
                        <EditableText tag="span" :value="project.status" select :options="projectStatusList" @input="updateStatus" class="bold"/>
                        <div class="double spacer"></div>
                        Criado em <EditableText tag="span" :value="project.created_at" :display="date" type="date" @input="updateCreatedAt" class="bold"/>
                        <div class="spacer"></div>
                        Entregar até <EditableText tag="span" :value="project.due_date" :display="date" type="date" @input="updateDueDate" class="bold"/>
                    </div>
                </div>
                <div v-else class="content">Carregando...</div>
            </h1>
            <SyncIndicator class="sync indicator" size="large"/>
        </div>
        <!-- Informações do projeto -->
        <div class="project area">
            <div v-if="project">
                <ProjectOverview :project="project"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .root {
        width: 100%;
        height: 100%;
    }
    .spacer {
        display: inline-block;
        width: 10px;
    }
    .spacer.double {
        width: 20px;
    }
    .dropdown {
        font-size: 1rem;
    }
    .ui.sidebar {
        overflow: visible !important;
    }
    .ui.sidebar.inverted div, .ui.sidebar.inverted .header {
        color: white !important;
    }
    .ui.sidebar .side.button {
        position: absolute;
        visibility: visible !important;
        transform: translate(-100%, -50%);
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
        z-index: 50;
        top: 10em;
    }
    .red.sub.header {
        color: #db2828 !important;
    }
    .ui.raised.attached.segment {
        margin-top: calc(-1em - 1px);
    }
    .ui.raised.attached.segment::after {
        margin-left: -1em;
        position: absolute;
        content: "";
        width: 100%;
        height: 2px;
        bottom: 0;
        z-index: -1;
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
    }
    .ui.sticky.raised.segment {
        position: sticky;
        z-index: 10;
    }
    .sync.indicator {
        position: absolute;
        right: 0.25em;
        top: 0.5em;
    }
    .ui.header {
        margin-bottom: 0;
    }
    .project.area {
        width: 100%;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .tags {
        font-size: 0.75rem !important;
        position: absolute;
        top: 0.5em;
        right: 4em;
    }
    @media screen and (max-width: 767px) {
        .ui.raised.attached.segment {
            margin-top: -2px;
        }
        .ui.sidebar .side.button {
            font-size: 125%;
        }
    }
</style>
<script src="./ProjectPage.ts" lang="ts"></script>
