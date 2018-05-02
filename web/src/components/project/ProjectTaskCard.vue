<template>
    <sui-card :class="[getColorForStatus(task), { first: isFirst }]">
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
            <div v-if="task.users.length > 0">
                <sui-image avatar v-for="user in task.users" :key="user.id" :src="gravatar(user.email)" :title="user.fullname"/>
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
        background-color: rgba(255, 255, 255, 0.90) !important;
        transition: background-color 100ms ease;
    }
    .ui.card:hover {
        background-color: white !important;
    }
    .ui.first.card {
        margin-right: 3em;
    }
    .ui.first.card::after {
        font-family: "Icons";
        position: absolute;
        right: -2em;
        height: initial;
        visibility: visible;
        top: calc(50% - 0.5em);
        transform: scale(4.0);
        content: "\F105"; /* Caractere '>' (angle-right) */
        color: lightgray;
    }
    .ui.card .text {
        max-height: 12em;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: justify;
        text-justify: inter-word;
        padding-right: 0.5em;
    }
    div.ui.button.dropdown {
        text-align: center;
        margin: 0.5em 0;
    }
    img.avatar {
        margin-bottom: 1em;
    }
</style>
<script src="./ProjectTaskCard.ts" lang="ts"></script>
