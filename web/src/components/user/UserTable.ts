import { UserStub, RoleStub } from "api/stubs";
import { date, time } from "@main/utils";
import * as moment from "moment";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            users: []
        } as {
            users: UserStub[]
        };
    },
    methods: {
        date,
        time,
        userIconClass(role: RoleStub) {
            if (role) {
                if (role.name === "Admin") {
                    return "yellow key icon";
                }
                else if (role.name === "Manager") {
                    return "blue folder icon";
                }
                else {
                    return "user icon";
                }
            }
            return "red dont icon";
        },
        async getUsers() {
            let req = await this.$http.get("/api/users?include=role");
            let users: UserStub[] = req.data;
            return users || [];
        }
    },
    created() {
        this.getUsers().then((users) => this.users = users);
    }
});
