<template>
    <div class="root">
        <sui-card-group v-for="task in rootTasks" :key="task.id">
            <ProjectTaskCard v-for="(subtask, index) in getTaskTree(task)" :key="subtask.id" :task="subtask" :isFirst="index === 0" @delete="deleteTask(subtask)"/>
            <sui-card class="card button">
                <sui-button basic icon="add" content="Nova sub-tarefa..." @click="createSubTask(task.id)"/>
            </sui-card>
        </sui-card-group>
        <sui-card-group>
            <sui-card class="card group button">
                <sui-button basic icon="add" content="Novo grupo de tarefas..." @click="createTaskGroup()"/>
            </sui-card>
        </sui-card-group>
    </div>
</template>
<style scoped>
    .root {
        display: flex;
        flex-direction: row;
    }
    .cards {
        display: flex;
        flex-direction: column;
        margin: 1em !important;
        margin-bottom: 20em !important;
    }
    .card {
        margin: 1px !important;
        border-radius: 0 !important;
    }
    .card.first {
        border-top-left-radius: 4px !important;
        border-top-right-radius: 4px !important;
    }
    .card.button {
        min-height: 2em;
        background-color: rgba(255, 255, 255, 0.95);
        border-bottom-left-radius: 4px !important;
        border-bottom-right-radius: 4px !important;
        transition: background-color 100ms ease;
        margin-top: -1px !important;
    }
    .card.button:hover {
        background-color: white;
    }
    .card.group.button {
        min-height: 12em;
        border-radius: 4px !important;
        margin-top: 0 !important;
    }
    .ui.basic.button {
        position: absolute;
        border-radius: 0 !important;
        border-bottom-left-radius: 6px !important;
        border-bottom-right-radius: 6px !important;
        height: calc(100% + 2px);
        margin: -1px;
    }
    .card.group.button > button {
        border-radius: 6px !important;
    }
</style>
<script src="./ProjectOverview.ts" lang="ts"></script>
