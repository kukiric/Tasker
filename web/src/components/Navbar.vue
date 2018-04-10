<template>
    <div class="ui attached secondary menu" style="margin-bottom: 1em; background-color: white;">
        <router-link class="header item" to="/">Tasker</router-link>
        <span class="right item" v-if="user">
            <router-link to="/login" style="color: black;">
                <i :class=userIconClass></i>{{ user.fullname }}
            </router-link>
        </span>
    </div>
</template>

<script>
import Vue from "vue"
export default Vue.extend({
    computed: {
        user() {
            return {
                username: localStorage.getItem("username"),
                fullname: localStorage.getItem("fullname"),
                role: localStorage.getItem("user-role")
            };
        },
        userIconClass() {
            let user = this.user;
            if (user) {
                if (user.role == "Admin") {
                    return "ui key icon";
                }
                else if (user.role == "Manager") {
                    return "ui folder icon";
                }
                else {
                    return "ui user icon";
                }
            }
        }
    }
});
</script>
