import { ProjectStub, UserStub, ProjectStatus } from "api/stubs";
import * as moment from "moment";
import Vue from "vue";

const defaultDate = moment().add(1, "week").format("YYYY-MM-DD");

export default Vue.extend({
    data() {
        return {
            isShowing: false,
            form: {
                name: "",
                status: "Novo",
                due_date: defaultDate
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
                let currentUser = this.$store.state.currentUser;
                if (currentUser) {
                    // Monta o objeto básico do novo projeto
                    let project: Partial<ProjectStub> = {
                        name: this.form.name,
                        status: this.form.status,
                        due_date: moment(this.form.due_date).toDate(),
                        users: [ { id: currentUser.id } ],
                        manager_id: currentUser.id
                    };
                    // Envia o novo projeto para a API
                    let req = await this.$http.post("/api/projects", project);
                    this.$store.commit("appendProject", req.data);
                    // Redireciona o usuário para o novo projeto
                    this.$router.push({ name: "ProjectView", params: { projectId: req.data.id } });
                }
            }
            catch (err) {
                alert(err.toString());
            }
        }
    },
    computed: {
        canSubmit(): boolean {
            let nameIsFilled = this.form.name.length > 0;
            let isDueDateValid = moment(this.form.due_date).isSameOrAfter(moment(), "day");
            return nameIsFilled && isDueDateValid;
        },
        statuses(): any[] {
            return Object.values(ProjectStatus).map((v) => ({
                key: v,
                text: v,
                value: v
            }));
        }
    },
    watch: {
        show: function(value) {
            this.isShowing = value;
        },
        isShowing: function(value) {
            if (!value) {
                this.$emit("close");
                this.form.name = "";
                this.form.due_date = defaultDate;
            }
        }
    }
});
