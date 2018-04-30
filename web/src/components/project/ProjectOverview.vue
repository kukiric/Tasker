<template>
    <div>
        <sui-card-group v-for="task in $store.getters.rootTasks" :key="task.id">
            <ProjectTaskCard v-for="(subtask, index) in getTaskTree(task)" :key="subtask.id" :task="subtask" :isFirst="index === 0" @delete="deleteTask(subtask)"/>
            <sui-card>
                <sui-button basic primary content="Nova sub-tarefa..." @click="createSubTask(task.id)"/>
            </sui-card>
        </sui-card-group>
        <sui-card-group>
            <sui-card class="card button">
                <sui-button basic primary icon="add" content="Novo grupo de tarefas..." @click="createTaskGroup()"/>
            </sui-card>
        </sui-card-group>
    </div>
</template>
<style scoped>
    .card.button {
        min-height: 12em;
    }
    .ui.basic.button {
        height: calc(100% + 2px);
        margin: -1px;
    }
</style>
<script src="./ProjectOverview.ts" lang="ts"></script>
