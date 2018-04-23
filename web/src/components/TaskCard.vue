<template>
    <sui-card :class="[getColorForStatus(task), { first: isFirst }]">
        <sui-card-content>
            <div class="right floated">
                <a @click="editMode = !editMode"><sui-icon color="green" name="edit" style="margin: 0" title="Editar tarefa"/></a>
            </div>
            <sui-card-header><sui-icon :name="getIconForStatus(task)"/>
                <input v-if="editMode" v-model="task.description">
                <span v-else>{{ task.description }}</span>
            </sui-card-header>
            <sui-card-meta>Entrega:
                <input v-if="editMode" type="date" v-model="task.due_date">
                <span v-else>{{ date(task.due_date) }}</span>
                - {{ task.estimate_work_hour }} Horas</sui-card-meta>
            <sui-card-description>
                <div><b>Tipo:</b> {{ task.type }}</div>
                <div><b>Status:</b> {{ task.status }}</div>
            </sui-card-description>
            <div v-if="task.users.length > 0">
                <br>
                <sui-image v-for="user in task.users" :key="user.id" avatar :src="gravatar(user.email)" :title="user.fullname"/>
            </div>
        </sui-card-content>
        <sui-card-content extra>
            <sui-list v-if="task.work_items && task.work_items.length > 0">
                <sui-list-item v-for="(work, index) in task.work_items" :key="work.id">
                    <sui-icon disabled color="blue" name="right arrow"/>Trabalho {{ index + 1 }}: {{ work.hours }} Horas
                </sui-list-item>
            </sui-list>
            <input v-if="editMode" style="width: 100%" type="range" min="0" max="1" step="any" v-model="task.progress">
            <sui-progress size="small" :color="getColorForStatus(task)" :percent="task.progress * 100" class="project"/>
        </sui-card-content>
        <sui-card-content extra v-if="editMode">
            <div style="display: flex; flex-direction: row; justify-content: space-between; with: 100%">
                <sui-button color="red" icon="trash"></sui-button>
                <sui-button color="grey" basic fluid icon="cancel" @click="editMode = false">Cancelar</sui-button>
                <sui-button color="green" icon="check"></sui-button>
            </div>
        </sui-card-content>
    </sui-card>
</template>
<script src="@scripts/TaskCard.ts" lang="ts"></script>
