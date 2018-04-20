<template>
    <div>
        <sui-card-group v-for="task in g.getters.rootTasks" :key="task.id">
            <sui-card v-for="(task, index) in taskGroup(task)" :key="task.id" :class="[getColorForStatus(task), { first: index === 0 }]">
                <sui-card-content>
                    <a class="right floated"><sui-icon color="red" name="close" style="margin-right: -0.25em"/></a>
                    <sui-card-header><sui-icon :name="getIconForStatus(task)"/>{{ task.description }}</sui-card-header>
                    <sui-card-meta>Entrega: {{ date(task.due_date) }} - {{ task.estimate_work_hour }} Horas</sui-card-meta>
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
                    <sui-progress size="small" :color="getColorForStatus(task)" :percent="task.progress * 100" class="project"/>
                </sui-card-content>
            </sui-card>
            <sui-card>
                <sui-button basic primary content="Nova sub-tarefa..." style="height: 100%"/>
            </sui-card>
        </sui-card-group>
        <!-- <sui-card-group> -->
            <sui-card style="height: 12em">
                <sui-button basic primary icon="add" content="Novo grupo de tarefas..." style="height: 100%"/>
            </sui-card>
        <!-- </sui-card-group> -->
    </div>
</template>
<script src="@scripts/ProjectContents.ts" lang="ts"></script>
