<template>
    <div>
        <h1>{{ title }}</h1>
        <p>Dados: {{ data }}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        data: String
    }
}
</script>
