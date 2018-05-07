<template>
    <div class="lowres background">
        <div class="background"></div>
    </div>
</template>
<style scoped>
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("https://source.unsplash.com/1920x1080/daily?nature");   
        background-repeat: no-repeat;
        background-size: cover;
        z-index: -1000;
    }
    .lowres.background {
        background-image: url("https://source.unsplash.com/192x108/daily?nature");   
        position: relative;
        z-index: -1100;
    }
</style>
