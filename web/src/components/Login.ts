import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            username: "",
            password: "",
            error: ""
        };
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
                    localStorage.setItem("user-id", req.data.id);
                    let redirect = this.$route.query.redirect || "/";
                    this.$router.push(redirect);
                    this.initUserData(this);
                }
            }
            catch (err) {
                this.error = "Usuário ou senha incorreta!";
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
        canSubmit(): boolean {
            return this.username.length > 0 && this.password.length >= 6;
        }
    },
    mounted() {
        let ref = this.$refs.autofocus;
        if (ref instanceof HTMLInputElement) {
            ref.focus();
        }
    }
});
