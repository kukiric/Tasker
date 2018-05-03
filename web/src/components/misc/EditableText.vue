<template>
    <form @click="beginEditing()" @submit="stopEditing()">
        <!-- Edição -->
        <textarea v-if="editing && textarea && !select" ref="input" v-model="content" :rows="rows" :placeholder="placeholder" @input="emitUpdate(content)" @blur="stopEditing()" :spellcheck="spellcheck"></textarea>
        <input v-if="editing && !textarea && !select" ref="input" v-model="content" :type="type" :placeholder="placeholder" :min="min" :max="max" @input="emitUpdate(content)" @blur="stopEditing()"/>
        <select v-if="editing && !textarea && select" ref="input" options="a, b, c" v-model="content" :input="emitUpdate(content)" @blur="stopEditing()">
            <option v-for="option in options">{{ option }}</option>
        </select>
        <!-- Display -->
        <div v-if="!editing && display" :is="tag" v-html="display(divContent)" :style="divStyle"></div>
        <div v-if="!editing && !display" :is="tag" :style="divStyle">{{ divContent }}</div>
    </form>
</template>
<style scoped>
    form {
        display: inline;
        margin: 0;
    }
    input, select, textarea {
        border: 0;
        box-shadow: 0 0 4px 2px skyblue;
    }
    textarea {
        width: 100%;
        resize: none;
    }
</style>
<script src="./EditableText.ts" lang="ts"></script>
