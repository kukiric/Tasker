import { ProjectStub, UserStub } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            isShowing: false,
            form: {
                name: "",
                status: "Novo",
                due_date: moment().add(1, "week").format("YYYY-MM-DD")
            }
        } as {
            isShowing: boolean,
            form: {
                name: string,
                status: string,
                due_date: string
            }
        };
    },
    props: {
        show: Boolean
    },
    methods: {
        convertUser(user: UserStub) {
            return {
                key: user.id,
                value: user.id,
                text: user.fullname
            };
        },
        async send() {
            if (!this.canSubmit) {
                return;
            }
            try {
                let currentUser: UserStub = this.$store.state.user;
                let project: ProjectStub = {
                    name: this.form.name,
                    status: this.form.status,
                    due_date: moment(this.form.due_date).toDate(),
                    users: [{ id: currentUser.id }],
                    manager_id: currentUser.id
                };
                let req = await this.$http.post("/api/projects", project);
                this.$store.commit("appendProject", req.data);
                this.$router.push({ name: "ProjectView", params: { projectId: req.data.id } });
            }
            catch (err) {
                alert(err.toString());
            }
        }
    },
    computed: {
        canSubmit(): boolean {
            let nameIsFilled = this.form.name.length > 0
            let isDueDateValid = moment(this.form.due_date).isSameOrAfter(moment(), "day");
            return nameIsFilled && isDueDateValid;
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
        show: function(val) {
            this.isShowing = val;
        },
        isShowing: function(val) {
            if (!val) {
                this.$emit("close");
            }
        }
    }
});
