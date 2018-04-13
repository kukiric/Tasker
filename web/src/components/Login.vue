<template>
    <div class="ui container">
        <div style="max-width: 512px; margin: -1px auto">
            <!-- Tela principal de login -->
            <div class="ui attached segment">
                <form class="ui form" @submit.prevent="login">
                    <div class="field">
                        <label for="username">Usuário</label>
                        <input name="username" ref="autofocus" v-model="username" autocomplete="off">
                    </div>
                    <div class="field">
                        <label for="password">Senha</label>
                        <input name="password" v-model="password" type="password" autocomplete="off">
                    </div>
                    <button :disabled="!canSubmit" class="ui fluid primary button">Entrar</button>
                </form>
            </div>
            <div class="ui attached icon error message" v-show="error">
                <i class="exclamation circle icon"></i>
                <div class="content">{{ error }}</div>
            </div>
        </div>
    </div>
</template>
<script src="./Login.ts" lang="ts"></script>
