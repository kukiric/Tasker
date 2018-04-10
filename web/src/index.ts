import Vue from "vue";
import App from "@/components/App.vue";

let app = new Vue({
    el: "#app",
    data: {
        title: "Index",
        data: "My data"
    },
    components: {
        App
    },
    template: `
    <div>
        <App :title=title :data=data />
        Título: <input v-model='title'>
        Dados: <input v-model='data'>
    </div>`
});
