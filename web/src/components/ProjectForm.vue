<template>
    <sui-modal v-model="isShowing" :closable="false">
        <sui-modal-header>Criar novo projeto</sui-modal-header>
        <sui-modal-content>
            <sui-form>
                <sui-form-field>
                    <label>Título/Nome</label>
                    <input v-model="form.name">
                </sui-form-field>
                <sui-form-field>
                    <label>Membros</label>
                    <sui-dropdown v-model="form.users" multiple selection :options="allUsers"/>
                </sui-form-field>
                <sui-form-field>
                    <label>Status inicial</label>
                    <sui-dropdown v-model="form.status" selection :options="statuses"/>
                </sui-form-field>
                <sui-form-field>
                    <label>Data de entrega</label>
                    <sui-input type="date" v-model="form.due_date"/>
                </sui-form-field>
            </sui-form>
        </sui-modal-content>
        <sui-modal-actions>
            <sui-button content="Descartar" icon="trash" @click="isShowing = false"/>
            <sui-button primary content="Salvar" icon="check" :disabled="!canSubmit" @click="send()"/>
        </sui-modal-actions>
    </sui-modal>
</template>
<script src="@scripts/ProjectForm.ts" lang="ts"></script>
