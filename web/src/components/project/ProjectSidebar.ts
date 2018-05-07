import { UserStub } from "api/stubs";
import { differenceWith } from "lodash";
import { gravatar } from "@main/utils";
import Vue from "vue";

export default Vue.extend({
    props: {
        users: { type: Array }
    },
    computed: {
        availableUsers() {
            let users = this.users;
            if (users) {
                let allUsers = this.$store.state.allUsers;
                return differenceWith<any>(allUsers, users, (a, b) => a.id === b.id);
            }
            return [];
        }
    },
    methods: {
        gravatar,
        dragStartUser(event: DragEvent, user: UserStub) {
            let target = event.target as HTMLElement;
            target.classList.add("transparent");
            event.dataTransfer.setData("addUserRequest", JSON.stringify(user));
        },
        dragEndUser(event: DragEvent) {
            let target = event.target as HTMLElement;
            target.classList.remove("transparent");
        }
    }
});
