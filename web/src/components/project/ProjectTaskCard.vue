<template>
    <sui-card :class="{ first: isFirst }" @dragover.prevent @drop="dropUser">
        <sui-card-content>
            <!-- Título -->
            <sui-card-header>
                <a title="Deletar tarefa" @click="$emit('delete')"><sui-icon :name="getIconForStatus(task)"/></a>
                <EditableText tag="span" :value="task.title" @input="updateTitle"/>
            </sui-card-header>
            <!-- Datas -->
            <sui-card-meta>Entrega: <EditableText tag="span" :value="task.due_date" :display="date" type="date" @input="updateDueDate"/></sui-card-meta>
            <sui-card-meta>Estimativa: <EditableText tag="span" :value="task.estimate_work_hour" type="number" :min="1" :max="168" :display="hours" @input="updateHours"/></sui-card-meta>
            <!-- Conteúdo -->
            <sui-card-description>
                <div><b>Tipo: </b><EditableText tag="span" :value="task.type" :options="taskTypeList" select @input="updateType"/></div>
                <div><b>Status: </b><EditableText tag="span" :value="task.status" :options="taskStatusList" select @input="updateStatus" @inputImmediate="updateStatusInternal"/></div>
                <br>
                <EditableText tag="div" :value="task.description" @input="updateDescription" :display="markdown" :spellcheck="false" textarea :rows="12" placeholder="Adicionar descrição..."/>
            </sui-card-description>
        </sui-card-content>
        <!-- Usuários -->
        <sui-card-content extra>
            <div class="user list">
                <a v-for="user in task.users" :key="user.id" :title="user.fullname" @click="removeUser(user)" class="avatar">
                    <sui-icon class="hidden button" color="red" name="trash"/>
                    <sui-image avatar :src="gravatar(user.email)"/>
                </a>
                <div v-if="task.users.length == 0" class="hint text">Arraste usuários aqui para adicionar...</div>
            </div>
        </sui-card-content>
        <!-- Itens de trabalho (horas cumpridas) -->
        <sui-card-content extra v-if="task.users.length > 0">
            <sui-accordion fluid>
                <sui-accordion-title >
                    <sui-icon name="dropdown"/>
                    Itens de trabalho
                </sui-accordion-title>
                <sui-accordion-content>
                    <sui-list>
                        <sui-list-item bulleted v-for="user in task.users" :key="user.id">
                            <sui-image avatar size="mini" :src="gravatar(user.email)"/> - <span class="black bold text">{{ user.fullname }}</span>
                            <sui-list>
                                <sui-list-item v-for="work in workItems(user)" :key="work.id" class="work item">
                                    <a @click="removeHours(work)" title="Remover item"><sui-icon color="blue" name="right arrow"/></a>
                                    Dia {{ date(work.start_time) }} - {{ work.hours }}h
                                </sui-list-item>
                                <sui-list-item>
                                    <EditableText tag="span" type="number" value="0" :min="0" :max="168" autoreset :display="textAddWorkItem" @input="addHours($event, user)" :debounce="Infinity"/>
                                </sui-list-item>
                                <br>
                            </sui-list>
                        </sui-list-item>
                    </sui-list>
                </sui-accordion-content>
            </sui-accordion>
        </sui-card-content>
        <!-- Porcentagem concluída -->
        <sui-card-content extra>
            <a @click="setProgress"><sui-progress ref="progressBar" :color="getColorForStatus(task)" progress :percent="progress" :class="{ project: true, low: progress <= 15 }"/></a>
        </sui-card-content>
    </sui-card>
</template>
<style scoped>
    .ui.card {
        background-color: rgba(255, 255, 255, 0.95);
        transition: background-color 100ms ease;
        z-index: 1;
    }
    .ui.card:hover, .ui.card:focus-within {
        background-color: white;
    }
    .ui.card .text {
        max-height: 12em;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: justify;
        text-justify: inter-word;
        padding-right: 0.5em;
    }
    .ui.card.first {
        margin-bottom: 2px !important;
    }
    .ui.card.first::after {
        position: absolute;
        bottom: -2px;
        left: -1px;
        width: calc(100% + 2px);
        height: 2px;
        background-color: #1678c2;
        visibility: visible;
    }
    .styled.accordion {
        background: transparent;
    }
    .user.list > * {
        position: relative;
    }
    .user.list .avatar {
        display: inline-block;
        margin: 0.1em;
    }
    .user.list .avatar.image {
        transition: opacity 100ms ease;
        margin-bottom: 0;
    }
    .user.list .avatar.image:hover {
        opacity: 0.25;
    }
    .user.list .hidden.button {
        position: absolute;
        text-align: center;
        width: 100%;
        left: 0;
        top: 0.33em;
    }
    .work.item:hover .right.arrow.icon::before {
        content: "\F1F8" !important;
        color: #db2828 !important;
    }
    .black.text {
        color: rgba(0, 0, 0, 0.68);
    }
    .hint.text {
        font-weight: bold;
        color: #ccc;
    }
    .justified.text {
        text-justify: distribute;
    }
    div.ui.button.dropdown {
        text-align: center;
        margin: 0.5em 0;
    }
    img.avatar {
        margin-bottom: 1em;
    }
</style>
<style>
    .ui.project.progress {
        margin: 0.5em 0;
        overflow: hidden;
    }
    .ui.project.progress > .bar {
        min-width: 0;
    }
    .ui.project.progress.low > .bar > .progress {
        right: auto;
        left: 1em;
    }
    .ui.project.progress > .bar > .progress {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        pointer-events: none;
    }
    .ui.project.progress > .bar > .progress {
        text-shadow: 0 0 4px black, 0 0 2px black, 0 0 1px black;
        font-weight: bolder;
    }
</style>
<script src="./ProjectTaskCard.ts" lang="ts"></script>
