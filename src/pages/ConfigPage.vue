<template>
  <section id="config" class="section-panel">
    <SectionHeader title="Configuração" subtitle="" />

    <div class="panel-grid">
      <div class="form-panel">
        <h3>Técnicas disponíveis</h3>
        <div class="helper-text">Defina a chance de repetição de cada técnica.</div>

        <div class="technique-list">
          <div v-for="technique in knownTechniques" :key="technique.name" class="technique-item">
            <span class="technique-name">{{ technique.name }}</span>
            <div class="chance-input-group">
              <input 
                type="range" 
                min="0" 
                max="100" 
                :value="technique.repetitionChance"
                @input="updateTechniqueRepetitionChance(technique.name, parseInt($event.target.value))"
                class="chance-slider"
              />
              <span class="chance-value">{{ technique.repetitionChance }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-panel">
        <h3>Katis conhecidos</h3>
        <div class="helper-text">Marque os katis que você já aprendeu e defina a chance de repetição.</div>

        <div v-for="(items, category) in groupedKatis" :key="category" class="kati-group">
          <h4>{{ category }}</h4>
          <div class="kati-list">
            <div v-for="k in items" :key="k.id" class="kati-item">
              <label class="checkbox-item">
                <input type="checkbox" :value="k.id" :checked="userKnownKatis.includes(k.id)" @change="toggleKnownKati(k.id)" />
                <span>{{ k.name }}<small v-if="k.style"> — {{ k.style }}</small></span>
              </label>
              <div class="chance-input-group">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  :value="getKatiRepetitionChance(k.id)"
                  :disabled="!userKnownKatis.includes(k.id)"
                  @input="updateKatiRepetitionChance(k.id, parseInt($event.target.value))"
                  class="chance-slider"
                />
                <span class="chance-value">{{ getKatiRepetitionChance(k.id) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="hint">
      
    </p>
  </section>
</template>

<script setup>
import SectionHeader from '../components/SectionHeader.vue'
import { computed } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const { 
  knownTechniques, 
  masterKatis, 
  userKnownKatis, 
  toggleKnownKati,
  updateTechniqueRepetitionChance,
  updateKatiRepetitionChance,
  getKatiRepetitionChance,
} = useTrainingStore()

const groupedKatis = computed(() => {
  // group by category then style/order
  const groups = {}
  masterKatis.forEach((k) => {
    const cat = k.category || 'Outros'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(k)
  })
  Object.keys(groups).forEach((cat) => {
    groups[cat].sort((a, b) => (a.category === 'Outros' && a.style && b.style ? (a.style || '').localeCompare(b.style || '') : 0) || a.order - b.order)
  })
  return groups
})
</script>

<style scoped>
.chance-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chance-slider:disabled::-webkit-slider-thumb {
  background-color: #999;
}

.chance-slider:disabled::-moz-range-thumb {
  background-color: #999;
}
</style>
