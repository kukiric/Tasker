<template>
        <div class="ui raised login area">
            <!-- Tela principal de login -->
            <div class="ui attached segment">
                <form class="ui form" @submit.prevent="login">
                    <div class="field">
                        <label for="username">Usuário</label>
                        <input name="username" ref="usernameField" v-model="username" autocomplete="off" required>
                    </div>
                    <div class="field">
                        <label for="password">Senha</label>
                        <input name="password" v-model="password" type="password" autocomplete="off" required minlength="6">
                    </div>
                    <div v-if="registering" class="field">
                        <label for="password">Confirmar Senha</label>
                        <input name="password2" v-model="password2" type="password" autocomplete="off" required minlength="6">
                    </div>
                    <div v-if="registering" class="field">
                        <label for="fullname">Nome Completo</label>
                        <input name="fullname" v-model="fullname" autocomplete="off" required>
                    </div>
                    <div v-if="registering" class="field">
                        <label for="email">E-mail</label>
                        <input name="email" v-model="email" type="email" autocomplete="off" required>
                    </div>
                    <button class="ui fluid primary button">{{ primaryAction }}</button>
                </form>
                <hr class="ui divider">
                <a href="#" @click.prevent="registering = !registering">{{ changeModeText }}</a>
            </div>
            <!-- Banner de erro -->
            <div class="ui attached icon error message" v-show="error">
                <i class="exclamation triangle icon"></i>
                <div class="content">{{ error }}</div>
            </div>
            <!-- Banner informativo -->
            <div class="ui attached icon info message" v-show="info && !error">
                <i class="exclamation info circle icon"></i>
                <div class="content">{{ info }}</div>
            </div>
        </div>
</template>
<style scoped>
    .ui.login.area {
        width: 512px;
        margin: 64px auto;
    }
    .ui.raised.login.area {
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
    }
    @media screen and (max-width: 767px) {
        .ui.login.area {
            box-shadow: initial !important;
            margin: -2px 0;
            width: 100%;
        }
    }
</style>
<script src="./LoginPage.ts" lang="ts"></script>
