<template>
    <div class="ui attached secondary menu">
        <router-link class="header item" to="/">Tasker</router-link>
        <span class="right item" v-if="user.role">
            <router-link to="/login" style="color: black;">
                <i :class=userIconClass></i>{{ user.fullname }}
            </router-link>
        </span>
    </div>
</template>
<script src="./Navbar.ts" lang="ts"></script>
