<template>
  <div class="dashboard-panel">
    <div class="dashboard-header">
      <div>
        <span class="tag">Dashboard</span>
        <h2>Visão geral dos katis e técnicas</h2>
        <p>Use o filtro de período para analisar treinos recentes e acompanhar ciclos.</p>
      </div>
      <div class="dashboard-filter">
        <span>Período</span>
        <div class="filter-buttons">
          <button
            v-for="option in rangeOptions"
            :key="option.value"
            :class="['btn', selectedRangeMonths === option.value ? 'btn-primary' : 'btn-secondary']"
            type="button"
            @click="selectedRangeMonths = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="dashboard-summary-grid">
      <div class="stat-card">
        <span>Katis conhecidos</span>
        <strong>{{ knownKatis.length }}</strong>
      </div>
      <div class="stat-card">
        <span>Ciclos completos</span>
        <strong>{{ cycleCompleteDates.length }}</strong>
      </div>
      <div class="stat-card">
        <span>Último ciclo completo</span>
        <strong>{{ lastCycleCompleteDateLabel }}</strong>
      </div>
      <div class="stat-card">
        <span>Katis faltando no ciclo</span>
        <strong>{{ cycleMissingKatis.length }}</strong>
      </div>
    </div>

    <div class="dashboard-grid">
      <article class="dashboard-card full-card">
        <div class="section-header small-header dashboard-card-header">
          <span>Top katis</span>
          <div class="dashboard-card-title-group">
            <h3>Ordenados por quantidade de treinos</h3>
            <button type="button" class="btn btn-secondary btn-sm" @click="showAllKatis = !showAllKatis">
              {{ showAllKatis ? 'Recolher' : 'Mostrar todos' }}
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Kati</th>
                <th>Treinos</th>
                <th>Último treino</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="kati in visibleKatis" :key="kati.id">
                <td>{{ kati.name }}</td>
                <td>{{ kati.count }}</td>
                <td>{{ formatDaysSince(kati.id) }}</td>
              </tr>
              <tr v-if="knownKatis.length === 0">
                <td colspan="3" class="empty-state">Marque katis conhecidos na configuração para começar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="dashboard-card">
        <div class="section-header small-header">
          <span>Ciclo atual</span>
          <h3>Progresso do ciclo de katis</h3>
        </div>

        <p class="helper-text">Registre todos os katis que você conhece para completar um ciclo.</p>
        <div class="cycle-status">
          <div><strong>{{ knownKatis.length - cycleMissingKatis.length }}</strong> de <strong>{{ knownKatis.length }}</strong> katis treinados no ciclo atual</div>
          <div class="missing-list">
            <strong>Katis faltando</strong>
            <ul>
              <li v-for="kati in cycleMissingKatis" :key="kati.id">{{ kati.name }}</li>
              <li v-if="cycleMissingKatis.length === 0">Nenhum. Você já completou o ciclo atual.</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="dashboard-card full-card">
        <div class="section-header small-header">
          <span>Técnicas</span>
          <h3>Ordenadas por quantidade de treinos</h3>
        </div>

        <div class="table-wrapper">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Técnica</th>
                <th>Treinos</th>
                <th>Último treino</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tech in techniquesSorted" :key="tech.name">
                <td>{{ tech.name }}</td>
                <td>{{ tech.count }}</td>
                <td>{{ formatTechniqueDaysSince(tech.name) }}</td>
              </tr>
              <tr v-if="techniquesSorted.length === 0">
                <td colspan="3" class="empty-state">Nenhuma técnica registrada no período.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const { knownTechniques, masterKatis, userKnownKatis, trainingHistory } = useTrainingStore()

const selectedRangeMonths = ref(3)
const rangeOptions = [
  { value: 1, label: '1 mês' },
  { value: 3, label: '3 meses' },
  { value: 6, label: '6 meses' },
  { value: 12, label: '12 meses' },
]

const now = () => new Date()

const rangeStartDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() - selectedRangeMonths.value)
  return date
})

const filteredHistory = computed(() => {
  return trainingHistory.value.filter((entry) => new Date(entry.datetime) >= rangeStartDate.value)
})

const techniqueCounts = computed(() => {
  const counts = {}
  knownTechniques.value.forEach((tech) => {
    counts[tech.name] = 0
  })
  filteredHistory.value.forEach((entry) => {
    (entry.techniques || []).forEach((tech) => {
      const name = typeof tech === 'string' ? tech : tech.name
      counts[name] = (counts[name] || 0) + 1
    })
  })
  return counts
})

const katiCounts = computed(() => {
  const counts = {}
  userKnownKatis.value.forEach((id) => { counts[id] = 0 })
  filteredHistory.value.forEach((entry) => {
    (entry.katis || []).forEach((id) => {
      if (counts[id] !== undefined) {
        counts[id] += 1
      }
    })
  })
  return counts
})

const knownKatis = computed(() => {
  return masterKatis.filter((kati) => userKnownKatis.value.includes(kati.id))
})

const knownKatisSorted = computed(() => {
  return [...knownKatis.value]
    .map((kati) => ({
      ...kati,
      count: katiCounts.value[kati.id] ?? 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const showAllKatis = ref(false)
const visibleKatis = computed(() => showAllKatis.value ? knownKatisSorted.value : knownKatisSorted.value.slice(0, 5))

const techniqueList = computed(() => {
  return knownTechniques.value
    .map((tech) => ({
      name: tech.name,
      count: techniqueCounts.value[tech.name] ?? 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const allKatiLastTraining = computed(() => {
  const map = new Map()
  trainingHistory.value.forEach((entry) => {
    const date = new Date(entry.datetime)
    ;(entry.katis || []).forEach((id) => {
      const existing = map.get(id)
      if (!existing || date > existing) {
        map.set(id, date)
      }
    })
  })
  return map
})

const allTechniqueLastTraining = computed(() => {
  const map = new Map()
  trainingHistory.value.forEach((entry) => {
    const date = new Date(entry.datetime)
    ;(entry.techniques || []).forEach((tech) => {
      const name = typeof tech === 'string' ? tech : tech.name
      const existing = map.get(name)
      if (!existing || date > existing) {
        map.set(name, date)
      }
    })
  })
  return map
})

const formatDaysSince = (katiId) => {
  const last = allKatiLastTraining.value.get(katiId)
  if (!last) return 'Ainda não treinado'
  const diffDays = Math.floor((now() - last) / (1000 * 60 * 60 * 24))
  return `${diffDays} dia${diffDays === 1 ? '' : 's'}`
}

const formatTechniqueDaysSince = (techName) => {
  const last = allTechniqueLastTraining.value.get(techName)
  if (!last) return 'Ainda não treinado'
  const diffDays = Math.floor((now() - last) / (1000 * 60 * 60 * 24))
  return `${diffDays} dia${diffDays === 1 ? '' : 's'}`
}

const daysSinceLastTraining = computed(() => {
  const result = {}
  knownKatis.value.forEach((kati) => {
    const last = allKatiLastTraining.value.get(kati.id)
    if (!last) {
      result[kati.id] = '—'
      return
    }
    const diffDays = Math.floor((now() - last) / (1000 * 60 * 60 * 24))
    result[kati.id] = `${diffDays} dia${diffDays === 1 ? '' : 's'}`
  })
  return result
})

const cycleData = computed(() => {
  const knownIds = new Set(userKnownKatis.value)
  const historySorted = [...trainingHistory.value].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
  const trainedInCycle = new Set()
  const cycleDates = []

  historySorted.forEach((entry) => {
    (entry.katis || []).forEach((id) => {
      if (knownIds.has(id)) {
        trainedInCycle.add(id)
      }
    })

    if (knownIds.size > 0 && trainedInCycle.size === knownIds.size) {
      cycleDates.push(new Date(entry.datetime))
      trainedInCycle.clear()
    }
  })

  return {
    cycleDates,
    currentCycleTrained: trainedInCycle,
  }
})

const cycleCompleteDates = computed(() => cycleData.value.cycleDates)
const lastCycleCompleteDateLabel = computed(() => {
  if (!cycleCompleteDates.value.length) {
    return 'Ainda não completo'
  }
  return cycleCompleteDates.value[cycleCompleteDates.value.length - 1].toLocaleDateString()
})

const cycleMissingKatis = computed(() => {
  if (!userKnownKatis.value.length) return []
  const trained = cycleData.value.currentCycleTrained
  return knownKatis.value.filter((kati) => !trained.has(kati.id))
})

const techniquesSorted = computed(() => techniqueList.value)

const lastCycleCompleteDate = computed(() => {
  const dates = cycleCompleteDates.value
  return dates.length ? dates[dates.length - 1] : null
})
</script>

<style scoped>
.dashboard-panel {
  display: grid;
  gap: 1.8rem;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}
.dashboard-filter {
  min-width: 240px;
}
.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}
.dashboard-summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.dashboard-grid {
  display: grid;
  gap: 1.8rem;
  grid-template-columns: 1fr 1fr;
}
.dashboard-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 1.8rem;
}
.full-card {
  grid-column: 1 / -1;
}
.dashboard-list {
  display: grid;
  gap: 0.9rem;
  padding-left: 0;
  margin: 1rem 0 0;
  list-style: none;
}
.dashboard-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
}
.dashboard-card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}
.dashboard-card-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  align-items: flex-end;
}
.btn-sm {
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
}
.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.dashboard-table th,
.dashboard-table td {
  text-align: left;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.dashboard-table th {
  font-size: 0.95rem;
  color: #f8d2a8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.table-wrapper {
  overflow-x: auto;
}
.tag-small {
  color: #ffd8a8;
  font-size: 0.95rem;
}
.cycle-status {
  display: grid;
  gap: 1rem;
}
.missing-list ul {
  margin: 0.75rem 0 0;
  padding-left: 1.15rem;
}
.empty-state {
  color: #d0cbc2;
}
@media (max-width: 960px) {
  .dashboard-summary-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
