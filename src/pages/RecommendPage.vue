<template>
  <section id="recommend" class="section-panel">
    <SectionHeader title="Recomendar treino" subtitle="Exercícios sugeridos a partir do seu histórico" />

    <div class="form-panel recommendation-form">
      <h3>Configurar</h3>
      <div class="form-row-inline">
        <div class="form-control">
          <label for="techniquesCount">Técnicas</label>
          <input 
            id="techniquesCount"
            type="number" 
            v-model.number="techniquesCount" 
            min="1" 
            max="20"
            class="number-input"
          />
        </div>
        <div class="form-control">
          <label for="katasCount">Katis</label>
          <input 
            id="katasCount"
            type="number" 
            v-model.number="katasCount" 
            min="1" 
            max="20"
            class="number-input"
          />
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="showRecommendations = !showRecommendations">
        {{ showRecommendations ? 'Cancelar' : 'Recomendar' }}
      </button>
    </div>

    <div v-if="showRecommendations" class="recommend-grid">
      <article class="recommend-card">
        <h3>Técnicas recomendadas</h3>
        <ul>
          <li v-for="technique in filteredRecommendedTechniques" :key="technique">{{ technique.name }}</li>
          <li v-if="filteredRecommendedTechniques.length === 0">Adicione técnicas conhecidas para receber recomendações.</li>
        </ul>
      </article>

      <article class="recommend-card">
        <h3>Katis recomendados</h3>
        <ul>
          <li v-for="kati in filteredRecommendedKatis" :key="kati.id">{{ kati.name }}</li>
          <li v-if="filteredRecommendedKatis.length === 0">Adicione katis conhecidos para receber recomendações.</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import SectionHeader from '../components/SectionHeader.vue'
import { ref, computed } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const { getRecommendedTechniques, getRecommendedKatis } = useTrainingStore()

const techniquesCount = ref(2)
const katasCount = ref(5)
const showRecommendations = ref(false)

const filteredRecommendedTechniques = computed(() => {
  return getRecommendedTechniques(techniquesCount.value)
})

const filteredRecommendedKatis = computed(() => {
  return getRecommendedKatis(katasCount.value)
})
</script>
