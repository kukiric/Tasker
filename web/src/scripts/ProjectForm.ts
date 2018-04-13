import { ProjectStub, UserStub } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            isShowing: false,
            allUsers: [],
            form: {
                name: "",
                users: [],
                status: "Novo",
                due_date: moment().format("YYYY-MM-DD")
            }
        } as {
            isShowing: boolean,
            allUsers: any[],
            form: {
                name: string,
                users: any[],
                status: string,
                due_date: string
            }
        };
    },
    props: {
        show: Boolean
    },
    methods: {
        updateUsers() {
            let users: UserStub[] = this.$store.state.users;
            if (users && Array.isArray(users)) {
                this.allUsers = users.map(user => this.convertUser(user));
                console.log(this.allUsers);
            }
        },
        convertUser(user: UserStub) {
            return {
                key: user.id,
                value: user.id,
                text: user.fullname
            };
        },
        async send() {
            let project: ProjectStub = {
                name: this.form.name,
                status: this.form.status,
                due_date: new Date(this.form.due_date),
                manager_id: this.$store.state.user.id
            };
            try {
                let req = await this.$http.post("/api/projects", project);
                this.$store.commit("appendProject", req.data);
                this.isShowing = false;
            }
            catch (err) {
                alert(err.toString());
            }
        }
    },
    computed: {
        canSubmit(): boolean {
            return this.form && this.form.name.length > 0 && this.form.users.length > 0;
        },
        statuses(): any[] {
            return [
                "Novo",
                "Em andamento",
                "Concluído"
            ].map(v => ({
                key: v,
                text: v,
                value: v
            }));
        }
    },
    watch: {
        "show": function(val) {
            this.isShowing = val;
        },
        "isShowing": function(val) {
            if (!val) {
                this.$emit("close");
            }
        },
        "$store.state.users": function(val) {
            this.updateUsers();
        }
    },
    created() {
        this.updateUsers();
    }
});
