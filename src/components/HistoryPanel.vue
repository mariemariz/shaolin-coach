<template>
  <div class="history-panel">
    <div class="section-header small-header">
      <span>Histórico</span>
      <h3>Últimos registros</h3>
    </div>

    <!-- <p class="helper-text">

    </p> -->

    <div class="summary-cards">
      <div class="stat-small">
        <span>Total de treinos</span>
        <strong>{{ history.length }}</strong>
      </div>
      <div class="stat-small">
        <span>Último treino</span>
        <strong>{{ lastTrainingDate || 'Ainda não' }}</strong>
      </div>
    </div>

    <div v-if="history.length" class="history-list">
      <article v-for="entry in recentHistory" :key="entry.id" class="history-card">
        <div class="entry-row">
          <div>
            <strong>{{ toLocale(entry.datetime) }}</strong>
          </div>
        </div>
            <div class="entry-tags">
              <span v-for="technique in entry.techniques" :key="technique" class="pill">{{ technique.name }}</span>
              <span v-for="kati in entry.katis" :key="kati" class="pill pill-secondary">{{ katiName(kati) }}</span>
            </div>
      </article>
    </div>

    <p v-else class="helper-text">Nenhum treino registrado ainda. Use o formulário para começar.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const props = defineProps({
  history: {
    type: Array,
    required: true,
  },
  recentHistory: {
    type: Array,
    required: true,
  },
  lastTrainingDate: {
    type: String,
    required: false,
    default: '',
  },
})

const { masterKatis } = useTrainingStore()

const katiName = (id) => {
  const found = masterKatis.find((m) => m.id === id)
  return found ? found.name : id
}

const toLocale = (value) => new Date(value).toLocaleString()
</script>
