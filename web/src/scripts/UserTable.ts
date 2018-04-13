import { UserStub, RoleStub } from "api/stubs";
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
        date(timestamp: string) {
            return moment(timestamp).locale("pt-br").format("LL");
        },
        time(timestamp: string) {
            return moment(timestamp).locale("pt-br").format("LLLL");
        },
        userIconClass(role: RoleStub) {
            if (role) {
                if (role.name === "Admin") {
                    return "key icon";
                }
                else if (role.name === "Manager") {
                    return "folder icon";
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
        this.getUsers().then(users => this.users = users);
    }
});
