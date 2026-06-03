<template>
  <div v-if="badge" class="badge-container">
    <div class="badge" :style="{ backgroundColor: badge.bgColor, borderColor: badge.color }">
      <span class="badge-icon">{{ badge.icon }}</span>
      <div class="badge-text">
        <span class="badge-title">{{ badge.title }}</span>
        <span class="badge-subtitle">Mestre do Kung Fu</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTrainingStore } from '../composables/useTrainingStore'

const { masterKatis, trainingHistory } = useTrainingStore()


const getMasterBadge = () => {
  if (!trainingHistory.value.length) return null

  const katiStats = {}
  let totalKatis = 0

  trainingHistory.value.forEach((entry) => {
    entry.katis.forEach((katiId) => {
      katiStats[katiId] = (katiStats[katiId] || 0) + 1
      totalKatis++
    })
  })

  if (totalKatis === 0) return null

  // Contar por categoria
  const categoryStats = {}
  Object.entries(katiStats).forEach(([katiId, count]) => {
    const kati = masterKatis.find((k) => k.id === katiId)
    if (!kati) return

    const category = kati.category || 'Outros'
    if (!categoryStats[category]) {
      categoryStats[category] = { count: 0, styles: {} }
    }
    categoryStats[category].count += count

    if (kati.style) {
      categoryStats[category].styles[kati.style] = (categoryStats[category].styles[kati.style] || 0) + count
    }
  })

  // Determinar categoria dominante
  let maxCategory = null
  let maxCount = 0
  Object.entries(categoryStats).forEach(([cat, stats]) => {
    if (stats.count > maxCount) {
      maxCount = stats.count
      maxCategory = cat
    }
  })

  if (!maxCategory) return null

  // Se Armas é dominante
  if (maxCategory === 'Armas') {
    return {
      id: 'weapon-master',
      title: 'Mestre das Armas',
      icon: '⚔️',
      color: '#D97706',
      bgColor: '#7d7863',
    }
  }

  // Se Mãos é dominante
  if (maxCategory === 'Mãos') {
    return {
      id: 'shaolin-monk',
      title: 'Monge Shaolin',
      icon: '🙏',
      color: '#DC2626',
      bgColor: '#b42626',
    }
  }

  // Se Outros é dominante, verificar substilo
  if (maxCategory === 'Outros') {
    const styles = categoryStats['Outros'].styles
    let maxStyle = null
    let maxStyleCount = 0
    Object.entries(styles).forEach(([style, count]) => {
      if (count > maxStyleCount) {
        maxStyleCount = count
        maxStyle = style
      }
    })

    if (maxStyle === 'Louva-a-Deus') {
      return {
        id: 'mantis-hands',
        title: 'Mãos de Pinça',
        icon: '🦗',
        color: '#059669',
        bgColor: '#36624c',
      }
    }

    if (maxStyle === 'Choy lay fut') {
      return {
        id: 'southern-tiger',
        title: 'Tigre do Sul',
        icon: '🐯',
        color: '#EA580C',
        bgColor: '#8b6d45',
      }
    }

    if (maxStyle === 'Garra de águia') {
      return {
        id: 'phoenix-claws',
        title: 'Garras de Fenix',
        icon: '🦅',
        color: '#7C3AED',
        bgColor: '#615a7f',
      }
    }
  }

  return null
}

const masterBadge = computed(() => getMasterBadge())

const badge = computed(() => masterBadge.value)
</script>

<style scoped>
.badge-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.badge {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.8rem;
  border-radius: 12px;
  border: 2px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.badge-icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.badge-title {
  font-weight: 700;
  font-size: 1.1rem;
  display: block;
}

.badge-subtitle {
  font-size: 0.85rem;
  opacity: 0.7;
  font-weight: 500;
  display: block;
}
</style>
