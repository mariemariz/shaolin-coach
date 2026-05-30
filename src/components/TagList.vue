<template>
  <div class="tag-list" v-if="items.length">
    <span v-for="(item, index) in items" :key="item + index" class="tag-item">
      {{ item }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>
