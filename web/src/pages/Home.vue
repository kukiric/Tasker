<template>
    <div>
        <Navbar/>
        <div class="ui segment container">
            <h1 class="ui dividing header">
                <i class="teal folder teal icon"></i>
                <div class="content">
                    Projetos
                    <div class="sub header">Visão geral</div>
                </div>
            </h1>
            <ProjectTable/>
        </div>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import ProjectTable from "@/components/ProjectTable.vue";
import Vue from "vue";
export default Vue.extend({
    components: { Navbar, ProjectTable }
});
</script>
