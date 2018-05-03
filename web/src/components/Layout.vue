<template>
    <div>
        <Background/>        
        <Navbar/>
        <router-view></router-view>
    </div>
</template>
<style>
    .bold {
        font-weight: bold;
    }
    .transparent {
        opacity: 0.5;
    }
    @media screen and (max-width: 1199px) {
        .ui.container {
            margin: auto 2em !important;
            width: auto;
        }
    }
    @media screen and (max-width: 767px) {
        .ui.raised.attached.segment {
            margin-top: -2px;
        }
        .ui.container {
            margin: 0 !important;
        }
        .hidden.on.mobile {
            display: none !important;
        }
    }
</style>
<script src="./Layout.ts" lang="ts"></script>
