<template>
        <div class="ui raised login area">
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
                    <div v-if="registering" class="field">
                        <label for="fullname">Nome Completo</label>
                        <input name="fullname" v-model="fullname" autocomplete="off">
                    </div>
                    <div v-if="registering" class="field">
                        <label for="email">E-mail</label>
                        <input name="email" v-model="email" type="email" autocomplete="off">
                    </div>
                    <button :disabled="!canSubmit" class="ui fluid primary button">{{ primaryAction }}</button>
                </form>
                <hr class="ui divider">
                <a href="#" @click.prevent="registering = !registering">{{ modeText }}</a>
            </div>
            <!-- Banner de erro -->
            <div class="ui attached icon error message" v-show="error">
                <i class="exclamation triangle icon"></i>
                <div class="content">{{ error }}</div>
            </div>
            <!-- Mensagem ao usuário -->
            <div class="ui attached icon info message" v-show="user && canSubmit">
                <i class="exclamation info circle icon"></i>
                <div class="content">Ao prosseguir, você será deslogado da conta atual</div>
            </div>
        </div>
</template>
<script src="@scripts/Login.ts" lang="ts"></script>
