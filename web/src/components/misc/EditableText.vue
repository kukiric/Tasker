<template>
    <!-- Bug: texto fica impossível editar se tiver tamanho nulo -->
    <form @click="beginEditing()" @submit="stopEditing()">
        <textarea v-if="editing && textarea" ref="input" v-model="content" :rows="rows" @input="emitUpdate(content)" @blur="stopEditing()" :spellcheck="spellcheck"></textarea>
        <input v-if="editing && !textarea" ref="input" v-model="content" @input="emitUpdate(content)" @blur="stopEditing()"/>
        <div v-if="!editing && display" :is="tag" v-html="display(content)"></div>
        <div v-if="!editing && !display" :is="tag">{{ content }}</div>
    </form>
</template>
<style scoped>
    form {
        display: inline;
        width: 100%;
        margin: 0;
    }
    textarea {
        width: 100%;
        resize: none;
    }
</style>
<script src="./EditableText.ts" lang="ts"></script>
