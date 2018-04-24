<template>
    <!-- Tabela de projetos -->
    <table class="ui single line celled table">
        <thead class="hidden on mobile">
            <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Email</th>
                <th>Data de criação</th>
                <th>Nível</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user.id">
                <td>{{ user.fullname }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td :title="time(user.created_at)">{{ date(user.created_at) }}</td>
                <td>
                    <i :class="userIconClass(user.role)"></i>
                    {{ user.role ? user.role.name : "Usuário bloqueado" }}
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script src="./UserTable.ts" lang="ts"></script>
