<template>
  <div class="history-panel">
    <div class="section-header small-header">
      <span>Histórico</span>
      <h3>Últimos registros</h3>
    </div>

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
          <button
            type="button"
            class="icon-button edit-icon"
            @click="emit('edit', entry.id)"
            title="Editar treino"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
        </div>
        <div class="entry-tags">
          <span v-for="technique in entry.techniques" :key="technique.name" class="pill">{{ technique.name }}</span>
          <span v-for="kati in entry.katis" :key="kati" class="pill pill-secondary">{{ katiName(kati) }}</span>
        </div>
        <p v-if="entry.observations" class="entry-observations">{{ entry.observations }}</p>
      </article>
    </div>

    <p v-else class="helper-text">Nenhum treino registrado ainda. Use o formulário para começar.</p>
  </div>
</template>

<script setup>
import { useTrainingStore } from '../composables/useTrainingStore'

const emit = defineEmits(['edit'])

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

<style scoped>
.icon-button {
  background: none;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #666);
  transition: color 0.2s ease;
}

.icon-button:hover {
  color: var(--color-primary, #42b983);
}

.edit-icon {
  opacity: 0.7;
}

.edit-icon:hover {
  opacity: 1;
}

.entry-observations {
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 0.95em;
  color: var(--color-text-secondary, #AAA);
  line-height: 1.5;
}
</style>
