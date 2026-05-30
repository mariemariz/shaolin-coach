<template>
  <article class="card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <ul>
      <li v-for="(item, index) in bullets" :key="index">{{ item }}</li>
    </ul>
  </article>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  bullets: Array,
})
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.08);
}
.card h3 {
  margin-bottom: 0.85rem;
  font-size: 1.3rem;
}
.card p {
  margin-bottom: 1rem;
  line-height: 1.7;
}
.card ul {
  list-style: inside disc;
  padding-left: 0;
  margin: 0;
  color: #373737;
}
.card li {
  margin-bottom: 0.6rem;
}
</style>
