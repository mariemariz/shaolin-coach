<template>
  <section ref="registerSection" id="register" class="section-panel">
    <SectionHeader title="Registrar treino" subtitle="Registre data, hora e atividades praticadas" />

    <div class="panel-grid">
      <div class="form-panel">
        <form @submit.prevent="registerTraining">
          <div class="form-row">
            <label for="datetime">Data e hora</label>
            <input id="datetime" type="datetime-local" v-model="formDatetime" required />
          </div>

          <div class="form-row">
            <div class="field-label">Técnicas</div>
            <div class="checkbox-grid">
              <label v-for="technique in knownTechniques" :key="technique.name" class="checkbox-item">
                <input type="checkbox" :value="technique" v-model="selectedTechniques" />
                <span>{{ technique.name }}</span>
              </label>
              <p v-if="knownTechniques.length === 0" class="helper-text">Adicione técnicas na seção de configuração.</p>
            </div>
          </div>

          <div class="form-row">
            <div class="field-label">Katis</div>
            <div v-if="learnedKatis.length === 0" class="helper-text">Adicione katis na seção de configuração.</div>
            <template v-else>
              <div v-for="[category, katis] in learnedKatisByCategory" :key="category" class="category-section">
                <h4 class="category-title">{{ category }}</h4>
                <div class="checkbox-grid">
                  <label v-for="k in katis" :key="k.id" class="checkbox-item">
                    <input type="checkbox" :value="k.id" v-model="selectedKatis" />
                    <span>{{ k.name }}</span>
                  </label>
                </div>
              </div>
            </template>
          </div>

          <div class="form-row">
            <label for="observations">Observações</label>
            <textarea
              id="observations"
              v-model="selectedObservations"
              placeholder="Notas sobre o treino, dificuldades encontradas, melhorias..."
              rows="4"
            />
          </div>

          <div class="actions-row">
            <button type="submit" class="btn btn-primary">
              {{ editingEntryId ? 'Salvar alterações' : 'Salvar treino' }}
            </button>
            <button
              v-if="editingEntryId"
              type="button"
              class="btn btn-secondary"
              @click="cancelTrainingEdit"
            >
              Cancelar edição
            </button>
          </div>
        </form>
      </div>

      <HistoryPanel
        :history="trainingHistory"
        :recent-history="recentHistory"
        :last-training-date="lastTrainingDate"
        @edit="handleEditTraining"
      />
    </div>
  </section>
</template>

<script setup>
import SectionHeader from '../components/SectionHeader.vue'
import HistoryPanel from '../components/HistoryPanel.vue'
import MasterBadge from '../components/MasterBadge.vue'
import { computed, ref } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const registerSection = ref(null)

const {
  formDatetime,
  selectedTechniques,
  selectedKatis,
  selectedObservations,
  knownTechniques,
  masterKatis,
  userKnownKatis,
  registerTraining,
  cancelTrainingEdit,
  editingEntryId,
  startEditingTraining,
  trainingHistory,
  recentHistory,
  lastTrainingDate,
} = useTrainingStore()

const handleEditTraining = (entryId) => {
  startEditingTraining(entryId)
  setTimeout(() => {
    registerSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 0)
}

const learnedKatis = computed(() => masterKatis.filter((m) => userKnownKatis.value.includes(m.id)))

const learnedKatisByCategory = computed(() => {
  const grouped = {}
  learnedKatis.value.forEach((kati) => {
    if (!grouped[kati.category]) {
      grouped[kati.category] = []
    }
    grouped[kati.category].push(kati)
  })

  const order = ['Mãos', 'Armas', 'Outros']
  return Object.entries(grouped)
    .sort((a, b) => {
      const indexA = order.indexOf(a[0])
      const indexB = order.indexOf(b[0])
      if (indexA !== indexB) return indexA - indexB
      return a[0].localeCompare(b[0])
    })
    .map(([category, katis]) => [category, katis.sort((a, b) => (a.order || 0) - (b.order || 0))])
})
</script>

<style scoped>
.optional {
  font-size: 0.85em;
  color: var(--color-text-secondary, #666);
  font-weight: normal;
}
</style>
