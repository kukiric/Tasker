<template>
    <!-- Bug: texto fica impossível editar se tiver tamanho nulo -->
    <form @click="beginEditing()" @submit="stopEditing()">
        <textarea v-if="editing && textarea" ref="input" v-model="content" :rows="rows" :placeholder="placeholder" @input="emitUpdate(content)" @blur="stopEditing()" :spellcheck="spellcheck"></textarea>
        <input v-if="editing && !textarea" ref="input" v-model="content" :type="type" :placeholder="placeholder" @input="emitUpdate(content)" @blur="stopEditing()"/>
        <div v-if="!editing && display" :is="tag" v-html="display(divContent)" :style="divStyle"></div>
        <div v-if="!editing && !display" :is="tag" :style="divStyle">{{ divContent }}</div>
    </form>
</template>
<style scoped>
    form {
        display: inline;
        margin: 0;
    }
    input {
        border: 0;
        box-shadow: 0 0 4px 2px skyblue;
    }
    textarea {
        width: 100%;
        resize: none;
        border: 0;
        box-shadow: 0 0 4px 2px skyblue;
    }
</style>
<script src="./EditableText.ts" lang="ts"></script>
