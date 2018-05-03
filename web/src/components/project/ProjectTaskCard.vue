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
                <EditableText tag="div" :value="task.description" @input="updateDescription" :display="md" :spellcheck="false" textarea :rows="12" placeholder="Adicionar descrição..."/>
            </sui-card-description>
        </sui-card-content>
        <sui-card-content extra>
            <!-- Usuários -->
            <div class="user list">
                <a v-for="user in task.users" :key="user.id" :title="user.fullname" @click="removeUser(user)">
                    <sui-icon class="hidden button" color="red" name="trash"/>
                    <sui-image avatar :src="gravatar(user.email)"/>
                </a>
                <div v-if="task.users.length == 0" class="hint text">Adicione usuários arrastando-os para a tarefa desejada.</div>
            </div>
            <!-- Itens de trabalho (horas) -->
            <sui-list v-if="task.work_items && task.work_items.length > 0">
                <sui-list-item v-for="(work, index) in task.work_items" :key="work.id">
                    <sui-icon disabled color="blue" name="right arrow"/>Trabalho {{ index + 1 }}: {{ work.hours }} Horas
                </sui-list-item>
            </sui-list>
            <!-- Porcentagem concluída -->
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
    .user.list > * {
        position: relative;
    }
    .avatar {
        transition: opacity 100ms ease;
    }
    .avatar:hover {
        opacity: 0.25;
    }
    .hidden.button {
        position: absolute;
        text-align: center;
        width: 100%;
        top: -0.5em;
    }
    .hint.text {
        text-align: center !important;
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
