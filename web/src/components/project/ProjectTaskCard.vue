<template>
    <sui-card :class="[getColorForStatus(task), { first: isFirst }]">
        <sui-card-content>
            <!-- Botão de editar tarefa -->
            <div v-if="!editMode" class="right floated">
                <a @click="editMode = true"><sui-icon color="green" name="edit" style="margin: 0" title="Editar tarefa"/></a>
            </div>
            <!-- Título -->
            <sui-card-header><sui-icon :name="getIconForStatus(task)"/>
                <input v-if="editMode" v-model="task.title" style="width: 88%">
                <span v-else>{{ task.title }}</span>
            </sui-card-header>
            <!-- Datas -->
            <sui-card-meta>Entrega:
                <input v-if="editMode" type="date" v-model="task.due_date">
                <span v-else>{{ date(task.due_date) }}</span>
                - {{ task.estimate_work_hour }} Horas</sui-card-meta>
            <!-- Conteúdo -->
            <sui-card-description>
                <div><b>Tipo:</b> {{ task.type }}</div>
                <div><b>Status:</b> {{ task.status }}</div>
                <br>
                <textarea v-if="editMode" v-model="task.description" style="width:100%;resize:none;" rows="12"></textarea>
                <div v-else class="justified text" v-html="md(task.description)"></div>
            </sui-card-description>
        </sui-card-content>
        <sui-card-content extra>
            <!-- Usuários -->
            <div v-if="editMode">
                <a v-for="user in task.users" :key="user.id" @click="removeUser(user)">
                    <sui-image avatar :src="gravatar(user.email)" :title="'Remover ' + user.fullname"/>
                </a>
            </div>
            <div v-else-if="task.users.length > 0">
                <sui-image v-for="user in task.users" :key="user.id" avatar :src="gravatar(user.email)" :title="user.fullname"/>
            </div>
            <!-- Botão para adicionar usuários -->
            <sui-dropdown v-if="editMode" icon="plus" class="basic fluid button" :class="{ disabled: usersNotInTask.length == 0 }">
                Adicionar Usuário
                <sui-dropdown-menu>
                    <sui-dropdown-item v-for="user in usersNotInTask" :key="user.id" @click="addUser(user)">
                        <sui-image avatar :src="gravatar(user.email)"/>
                        {{ user.fullname }}
                    </sui-dropdown-item>
                </sui-dropdown-menu>
            </sui-dropdown>
            <!-- Itens de trabalho (horas) -->
            <sui-list v-if="task.work_items && task.work_items.length > 0">
                <sui-list-item v-for="(work, index) in task.work_items" :key="work.id">
                    <sui-icon disabled color="blue" name="right arrow"/>Trabalho {{ index + 1 }}: {{ work.hours }} Horas
                </sui-list-item>
            </sui-list>
            <!-- Porcentagem concluída -->
            <input v-if="editMode" style="width: 100%" type="range" min="0" max="1" step="0.05" v-model="task.progress">
            <sui-progress :color="getColorForStatus(task)" progress :percent="progress" :class="{ project: true, low: progress <= 15 }"/>
        </sui-card-content>
        <!-- Ações de edição -->
        <sui-card-content extra v-if="editMode">
            <div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%">
                <sui-button color="red" icon="trash"></sui-button>
                <sui-button color="grey" basic fluid icon="cancel" @click="editMode = false">Cancelar</sui-button>
                <sui-button color="green" icon="check"></sui-button>
            </div>
        </sui-card-content>
    </sui-card>
</template>
<script src="./ProjectTaskCard.ts" lang="ts"></script>
