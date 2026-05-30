<template>
  <section id="register" class="section-panel">
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
              <label v-for="technique in knownTechniques" :key="technique" class="checkbox-item">
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

          <button type="submit" class="btn btn-primary">Salvar treino</button>
        </form>
      </div>

      <HistoryPanel
        :history="trainingHistory"
        :recent-history="recentHistory"
        :last-training-date="lastTrainingDate"
      />
    </div>
  </section>
</template>

<script setup>
import SectionHeader from '../components/SectionHeader.vue'
import HistoryPanel from '../components/HistoryPanel.vue'
import { computed } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const {
  formDatetime,
  selectedTechniques,
  selectedKatis,
  knownTechniques,
  masterKatis,
  userKnownKatis,
  registerTraining,
  trainingHistory,
  recentHistory,
  lastTrainingDate,
} = useTrainingStore()

const learnedKatis = computed(() => masterKatis.filter((m) => userKnownKatis.value.includes(m.id)))

const learnedKatisByCategory = computed(() => {
  const grouped = {}
  learnedKatis.value.forEach((kati) => {
    if (!grouped[kati.category]) {
      grouped[kati.category] = []
    }
    grouped[kati.category].push(kati)
  })
  return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0]))
})
</script>
