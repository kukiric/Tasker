import { UserStub } from "api/stubs";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            username: "",
            password: "",
            fullname: "",
            email: "",
            error: "",
            registering: false
        };
    },
    methods: {
        refocus() {
            let ref = this.$refs.autofocus;
            if (ref instanceof HTMLInputElement) {
                ref.focus();
            }
        },
        async login() {
            try {
                this.error = "";
                if (this.registering) {
                    await this.$http.post("/api/users", {
                        username: this.username,
                        password: this.password,
                        fullname: this.fullname,
                        email: this.email
                    });
                }
                let req = await this.$http.post("/api/auth", {
                    username: this.username,
                    password: this.password
                });
                let token = req.data.token;
                if (!token) {
                    this.error = "Erro de servidor: nenhuma token retornada";
                }
                else {
                    this.$store.commit("reset");
                    localStorage.setItem("api-token", token);
                    localStorage.setItem("username", req.data.username);
                    localStorage.setItem("fullname", req.data.fullname);
                    localStorage.setItem("user-role", req.data.role);
                    localStorage.setItem("user-id", req.data.id);
                    let redirect = this.$route.query.redirect || "/";
                    this.$router.push(redirect);
                    this.initUserData(this);
                }
            }
            catch (err) {
                if (this.registering) {
                    this.error = "Informações inválidas! Provavelmente já existe um "
                               + "usuário com esse nome, ou o email fornecido não existe.";
                }
                else {
                    this.error = "Usuário ou senha incorreta!";
                }
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
        primaryAction(): string {
            if (this.registering) {
                return "Criar nova conta";
            }
            else {
                return "Entrar";
            }
        },
        modeText(): string {
            if (this.registering) {
                return "Já tenho uma conta";
            }
            else {
                return "Não tenho uma conta ainda";
            }
        },
        canSubmit(): boolean {
            return this.username.length > 0 && this.password.length >= 6;
        },
        user(): UserStub {
            return this.$store.state.user;
        }
    },
    watch: {
        registering: function(val) {
            this.refocus();
        }
    },
    mounted() {
        this.refocus();
    }
});
