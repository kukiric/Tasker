<template>
    <div>
        <Navbar/>
        <router-view></router-view>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Vue from "vue";
export default Vue.extend({
    components: { Navbar }
});
</script>
