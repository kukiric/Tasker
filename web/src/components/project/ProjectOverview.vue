<template>
    <div>
        <sui-card-group v-for="task in $store.getters.rootTasks" :key="task.id">
            <ProjectTaskCard v-for="(subtask, index) in getTaskTree(task)" :key="subtask.id" :task="subtask" :isFirst="index === 0"/>
            <sui-card>
                <sui-button basic primary content="Nova sub-tarefa..." style="height: 100%"/>
            </sui-card>
        </sui-card-group>
        <sui-card-group>
            <sui-card style="height: 12em">
                <sui-button basic primary icon="add" content="Novo grupo de tarefas..." style="height: 100%" @click="createTaskGroup()"/>
            </sui-card>
        </sui-card-group>
    </div>
</template>
<script src="./ProjectOverview.ts" lang="ts"></script>
