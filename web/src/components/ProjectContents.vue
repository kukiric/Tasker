<template>
    <sui-card-group>
        <sui-card v-for="task in project.tasks" :key="task.id" :class="getColorForStatus(task)">
            <sui-card-content>
                <sui-card-header><sui-icon :name="getIconForStatus(task)"/>{{ task.description }}</sui-card-header>
                <sui-card-meta>Entrega: {{ date(task.due_date) }}</sui-card-meta>
                <sui-card-description>
                    <div><b>Tipo:</b> {{ task.type }}</div>
                    <div><b>Status:</b> {{ task.status }}</div>
                </sui-card-description>
            </sui-card-content>
            <sui-card-content extra v-if="task.work_items && task.work_items.length > 0">
                <sui-list>
                    <sui-list-item v-for="(work, index) in task.work_items" :key="work.id">
                        <sui-icon disabled color="blue" name="right arrow"/>Trabalho {{ index + 1 }}: {{ work.hours }} Horas
                    </sui-list-item>
                </sui-list>
            </sui-card-content>
        </sui-card>
    </sui-card-group>
</template>
<script src="@scripts/ProjectContents.ts" lang="ts"></script>
