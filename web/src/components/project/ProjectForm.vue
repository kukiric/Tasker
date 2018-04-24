<template>
    <sui-modal v-model="isShowing" animation="fade down">
        <sui-modal-header>Criar novo projeto</sui-modal-header>
        <sui-modal-content>
            <sui-form id="modal-form" @submit.prevent="send">
                <sui-form-field>
                    <label>Título/Nome</label>
                    <input v-model="form.name">
                </sui-form-field>
                <sui-form-field>
                    <label>Data de entrega</label>
                    <sui-input type="date" v-model="form.due_date"/>
                </sui-form-field>
            </sui-form>
        </sui-modal-content>
        <sui-modal-actions>
            <sui-button content="Descartar" icon="trash" @click="isShowing = false" type="button"/>
            <sui-button primary content="Salvar" icon="check" :disabled="!canSubmit" type="submit" form="modal-form"/>
        </sui-modal-actions>
    </sui-modal>
</template>
<script src="./ProjectForm.ts" lang="ts"></script>
