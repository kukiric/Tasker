<template>
    <div>
        <Navbar/>
        <Project projectId="projectId"/>
    </div>
</template>

<script>
import Vue from "vue";
import Navbar from "@/components/Navbar.vue";
import Project from "@/components/Project.vue";
export default Vue.extend({
    components: { Navbar, Project },
    props: {
        projectId: { type: String, required: true }
    }
});
</script>
