<template>
  <div class="section-header">
    <span>{{ title }}</span>
    <h2>{{ subtitle }}</h2>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>
