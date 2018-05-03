<template>
    <div class="ui raised error area">
        <div class="ui center aligned segment">
            <h1>404</h1>
            <h2>Ops! Essa página não existe :(<br/>Tente voltar para a <router-link to="/">Página inicial.</router-link></h2>
            <br>
        </div>
    </div>
</template>
<style scoped>
    .ui.error.area {
        width: 512px;
        margin: 64px auto;
    }
    .ui.raised.error.area {
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
    }
</style>
