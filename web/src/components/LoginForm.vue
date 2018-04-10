<template>
    <div class="ui center aligned centered six wide column">
        <div class="ui segment">
            <form class="ui form" @submit.prevent="login">
                <div class="field">
                    <label for="username">Usuário</label>
                    <input name="username" autofocus v-model="username" autocomplete="off">
                </div>
                <div class="field">
                    <label for="password">Senha</label>
                    <input name="password" v-model="password" type="password" autocomplete="off">
                </div>
                <button :disabled="!canSubmit" class="ui primary button">Entrar</button>
            </form>
        </div>
        <div class="ui error message" v-show="error">{{ error }}</div>
    </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
    data: () => {
        return {
            username: "",
            password: "",
            error: ""
        }
    },
    methods: {
        async login() {
            try {
                this.error = "";
                let req = await this.$http.post("/api/auth", {
                    username: this.username,
                    password: this.password
                });
                let token = req.data.token;
                if (!token) {
                    this.error = "Erro de servidor: nenhuma token retornada";
                }
                else {
                    localStorage.setItem("api-token", token);
                    localStorage.setItem("username", req.data.username);
                    localStorage.setItem("fullname", req.data.fullname);
                    localStorage.setItem("user-role", req.data.role);
                    let redirect = this.$route.query.redirect || "/";
                    this.$router.push(redirect);
                }
            }
            catch (err) {
                this.error = "Usuário ou senha incorreta!";
                if (err.response) {
                    console.error(err.response || err.response.data || err.response.details);
                }
                else {
                    throw err;
                }
            }
        }
    },
    computed: {
        canSubmit() {
            return this.username.length > 0 && this.password.length >= 6;
        }
    }
});
</script>
