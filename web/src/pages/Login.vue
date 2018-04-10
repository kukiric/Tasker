<template>
    <div>
        <Navbar/>
        <div class="ui grid container">
            <LoginForm/>
        </div>
    </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import Navbar from "@/components/Navbar.vue";
import Vue from "vue";
export default Vue.extend({
    components: { LoginForm, Navbar }
});
</script>
