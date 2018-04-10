<template>
    <div>
        <Navbar/>
        <div class="ui container center aligned">
            <h1>Essa página só deve ser exibida se o usuário estiver autenticado.</h1>
            <span>{{ token }}</span>
        </div>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Vue from "vue";
export default Vue.extend({
    components: { Navbar },
    computed: {
        token() {
            return localStorage.getItem("api-token");
        }
    }
});
</script>
