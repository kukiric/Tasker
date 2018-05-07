import { UserStub, AuthResponse } from "api/stubs";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            username: "",
            password: "",
            password2: "",
            fullname: "",
            email: "",
            error: "",
            info: "",
            registering: false
        };
    },
    methods: {
        refocus() {
            let ref = this.$refs.usernameField;
            if (ref instanceof HTMLInputElement) {
                ref.focus();
            }
        },
        changeMode() {
            let query = location.search;
            if (this.registering) {
                this.$router.replace("/login" + query);
            }
            else {
                this.$router.push("/register" + query);
            }
        },
        async login() {
            try {
                // Limpa as mensagens
                this.error = "";
                this.info = "";
                // Cria um novo usuário
                if (this.registering) {
                    // Verifica se a senha tem o comprimento mínimo (6)
                    if (this.password.length < 6) {
                        this.error = "A sua senha deve conter pelo menos 6 caracteres!";
                    }
                    // Verifica se as duas senhas são iguais
                    if (this.password !== this.password2) {
                        this.error = "As senhas fornecidas são diferentes!";
                        return;
                    }
                    // Envia a requisição
                    await this.$http.post("/api/users", {
                        username: this.username,
                        password: this.password,
                        fullname: this.fullname,
                        email: this.email
                    });
                }
                // Tenta logar no usuário
                this.info = "Entrando...";
                let req = await this.$http.post("/api/auth", {
                    username: this.username,
                    password: this.password
                });
                let response = req.data as AuthResponse;
                // Grava a token retornada
                if (response.token) {
                    // Limpa os dados do usuário anterior
                    this.$store.commit("reset");
                    try {
                        // Busca os dados do usuário, usando a token da resposta
                        await this.$store.dispatch("loadUser", response.token);
                        // Retorna o usuário para a página que ele tentou acessar antes de estar logado
                        let redirect = this.$route.query.redirect || "/";
                        this.$router.replace(redirect);
                    }
                    catch (err) {
                        this.error = "Não foi possível carregar os dados do usuário, tente novamente mais tarde.";
                    }
                }
                else {
                    this.error = "Erro de servidor: nenhuma token retornada!";
                }
            }
            catch (err) {
                if (this.registering) {
                    this.error = "Informações inválidas! Provavelmente já existe um "
                               + "usuário com esse nome, ou o email fornecido é invalido.";
                }
                else {
                    this.error = "Usuário ou senha incorreta!";
                }
                // Imprime a resposta do erro
                if (err.response) {
                    console.error(err.response.data);
                }
                else {
                    throw err;
                }
            }
        }
    },
    computed: {
        user(): UserStub {
            return this.$store.state.currentUser;
        },
        primaryAction(): string {
            return this.registering ?  "Criar nova conta" : "Entrar";
        },
        changeModeText(): string {
            return this.registering ? "Já tenho uma conta" : "Não tenho uma conta ainda";
        }
    },
    watch: {
        "$route.path": function(path) {
            if (path === "/register") {
                this.registering = true;
            }
            else {
                this.registering =false;
            }
        },
        "registering": function() {
            this.refocus();
        }
    },
    created() {
        if (this.$route.path === "/register") {
            this.registering = true;
        }
        this.info = this.user ? "Ao prosseguir, você será deslogado da conta atual" : "";
    },
    mounted() {
        this.refocus();
    }
});
