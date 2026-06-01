import { computed, ref, watch } from 'vue'

const STORAGE_KEYS = {
  history: 'shaolin-kungfu-history',
  techniques: 'shaolin-kungfu-techniques',
  userKnownKatis: 'shaolin-kungfu-user-katis',
  katiRepetitionChances: 'shaolin-kungfu-kati-chances',
}

const DEFAULT_REPETITION_CHANCE = 100
const MAX_RECOMMENDATION_DAYS = 30
const MS_PER_DAY = 1000 * 60 * 60 * 24

const defaultTechniques = [
  { name: 'Socos caminhando', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Socos na base', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Socos combinados', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Chutes', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Chutes parado', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Chutes combinados', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Chin Na', repetitionChance: DEFAULT_REPETITION_CHANCE },
  { name: 'Calejamento, Reflexo e Combate', repetitionChance: DEFAULT_REPETITION_CHANCE },
]

// Master list of katis grouped by category/style. IDs are stable keys saved in user selections and history.
const masterKatis = [
  // Mãos Shaolin do Norte
  { id: 'hands-1', category: 'Mãos', order: 1, name: '1º kati - Lianbu Quan' },
  { id: 'hands-2', category: 'Mãos', order: 2, name: '2º kati - Duanda' },
  { id: 'hands-3', category: 'Mãos', order: 3, name: '3º kati - Meihua' },
  { id: 'hands-4', category: 'Mãos', order: 4, name: '4º kati - Chuanxin' },
  { id: 'hands-5', category: 'Mãos', order: 5, name: '5º kati - Wuyi' },
  { id: 'hands-6', category: 'Mãos', order: 6, name: '6º kati - Babu' },
  { id: 'hands-7', category: 'Mãos', order: 7, name: '7º kati - Zuoma' },
  { id: 'hands-8', category: 'Mãos', order: 8, name: '8º kati - Linglu' },
  { id: 'hands-9', category: 'Mãos', order: 9, name: '9º kati - Kaimen' },
  { id: 'hands-10', category: 'Mãos', order: 10, name: '10º kati - Lianhuan' },
  { id: 'hands-11', category: 'Mãos', order: 11, name: '11º kati - Fashi' },
  { id: 'hands-12', category: 'Mãos', order: 12, name: '18 Movimentos' },
  { id: 'hands-13', category: 'Mãos', order: 13, name: 'Serpente' },
  { id: 'hands-14', category: 'Mãos', order: 14, name: 'Palma de Buda' },
  { id: 'hands-15', category: 'Mãos', order: 15, name: 'Macaco' },
  { id: 'hands-16', category: 'Mãos', order: 16, name: 'Bêbado' },

  // Armas
  { id: 'weap-1', category: 'Armas', order: 1, name: 'Bastão' },
  { id: 'weap-2', category: 'Armas', order: 2, name: 'Facão' },
  { id: 'weap-3', category: 'Armas', order: 3, name: 'Punhal' },
  { id: 'weap-4', category: 'Armas', order: 4, name: 'Punhal duplo' },
  { id: 'weap-5', category: 'Armas', order: 5, name: 'Espada dragão' },
  { id: 'weap-6', category: 'Armas', order: 6, name: 'Facão duplo' },
  { id: 'weap-7', category: 'Armas', order: 7, name: 'Lança' },
  { id: 'weap-8', category: 'Armas', order: 8, name: 'Bengala' },
  { id: 'weap-9', category: 'Armas', order: 9, name: 'Bastão sobrancelha' },
  { id: 'weap-10', category: 'Armas', order: 10, name: 'San tien Quan' },
  { id: 'weap-11', category: 'Armas', order: 11, name: 'Facão Lohap' },
  { id: 'weap-12', category: 'Armas', order: 12, name: 'Combinado bastão' },
  { id: 'weap-13', category: 'Armas', order: 13, name: 'Argola' },
  { id: 'weap-14', category: 'Armas', order: 14, name: 'Bastão Vassoura' },
  { id: 'weap-15', category: 'Armas', order: 15, name: 'Flauta' },
  { id: 'weap-16', category: 'Armas', order: 16, name: 'Guan Dao' },
  { id: 'weap-17', category: 'Armas', order: 17, name: 'Combinado bastão 2' },
  { id: 'weap-18', category: 'Armas', order: 18, name: 'Homeici' },


  // Outros estilos - Tantui
  { id: 'tantui-1', category: 'Outros', style: 'Tantui', order: 1, name: 'Tantui de 12' },
  { id: 'tantui-2', category: 'Outros', style: 'Tantui', order: 2, name: 'Tantui de 10' },

  // Outros estilos - Louva-a-Deus
  { id: 'louva-1', category: 'Outros', style: 'Louva-a-Deus', order: 1, name: '1º Louva-a-Deus' },
  { id: 'louva-2', category: 'Outros', style: 'Louva-a-Deus', order: 2, name: '2º Louva-a-Deus' },
  { id: 'louva-3', category: 'Outros', style: 'Louva-a-Deus', order: 3, name: '3º Louva-a-Deus' },
  { id: 'louva-4', category: 'Outros', style: 'Louva-a-Deus', order: 4, name: '4º Louva-a-Deus' },

  // Garra de águia
  { id: 'eagle-1', category: 'Outros', style: 'Garra de águia', order: 1, name: '1º Garra de águia' },
  { id: 'eagle-2', category: 'Outros', style: 'Garra de águia', order: 2, name: '2º Garra de águia' },
  { id: 'eagle-3', category: 'Outros', style: 'Garra de águia', order: 3, name: '3º Garra de águia' },
  { id: 'eagle-4', category: 'Outros', style: 'Garra de águia', order: 4, name: '4º Garra de águia' },

  // Cha chuan
  { id: 'chachuan-1', category: 'Outros', style: 'Cha chuan', order: 1, name: 'Cha chuan' },

  // Choy lay fut
  { id: 'choy-1', category: 'Outros', style: 'Choy lay fut', order: 1, name: '1º Choy lay fut' },
  { id: 'choy-2', category: 'Outros', style: 'Choy lay fut', order: 2, name: '2º Choy lay fut' },
  { id: 'choy-3', category: 'Outros', style: 'Choy lay fut', order: 3, name: '3º Choy lay fut' },

  // Lohap / Lohan
  { id: 'lohap-1', category: 'Outros', style: 'Lohap', order: 1, name: 'Lohap' },
  { id: 'lohan-1', category: 'Outros', style: 'Lohan', order: 1, name: 'Lohan' },
]

const loadStoredArray = (key, fallback) => {
  if (globalThis.window === undefined) {
    return fallback
  }

  try {
    const raw = globalThis.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.warn('Falha ao ler localStorage para', key, error)
    return fallback
  }
}

const normalizeStoredTechniques = (stored) => {
  // Convert old format (strings) to new format (objects with repetitionChance)
  return stored.map(tech => 
    typeof tech === 'string' 
      ? { name: tech, repetitionChance: DEFAULT_REPETITION_CHANCE }
      : tech
  )
}

const knownTechniques = ref(normalizeStoredTechniques(loadStoredArray(STORAGE_KEYS.techniques, defaultTechniques)))
// userKnownKatis stores an array of masterKatis ids that the user marked as learned
const userKnownKatis = ref(loadStoredArray(STORAGE_KEYS.userKnownKatis, []))
const trainingHistory = ref(loadStoredArray(STORAGE_KEYS.history, []))
const katiRepetitionChances = ref(loadStoredArray(STORAGE_KEYS.katiRepetitionChances, {}))

const formDatetime = ref(new Date().toISOString().slice(0, 16))
const selectedTechniques = ref([])
const selectedKatis = ref([]) // will store kati ids

const saveArray = (key, value) => {
  if (globalThis.window === undefined) return
  globalThis.localStorage.setItem(key, JSON.stringify(value))
}

watch(knownTechniques, (value) => saveArray(STORAGE_KEYS.techniques, value), { deep: true })
watch(userKnownKatis, (value) => saveArray(STORAGE_KEYS.userKnownKatis, value), { deep: true })
watch(trainingHistory, (value) => saveArray(STORAGE_KEYS.history, value), { deep: true })
watch(katiRepetitionChances, (value) => saveArray(STORAGE_KEYS.katiRepetitionChances, value), { deep: true })

const registerTraining = () => {
  if (!formDatetime.value || (!selectedTechniques.value.length && !selectedKatis.value.length)) {
    return
  }

  trainingHistory.value.unshift({
    id: Date.now(),
    datetime: formDatetime.value,
    techniques: [...selectedTechniques.value],
    katis: [...selectedKatis.value], // store ids
  })

  selectedTechniques.value = []
  selectedKatis.value = []
  formDatetime.value = new Date().toISOString().slice(0, 16)
}



const toggleKnownKati = (id) => {
  const idx = userKnownKatis.value.indexOf(id)
  if (idx === -1) {
    userKnownKatis.value.push(id)
    // Initialize with default chance if not set
    if (!katiRepetitionChances.value[id]) {
      katiRepetitionChances.value[id] = DEFAULT_REPETITION_CHANCE
    }
  } else {
    userKnownKatis.value.splice(idx, 1)
  }
}

const updateTechniqueRepetitionChance = (techniqueName, chance) => {
  const technique = knownTechniques.value.find(t => t.name === techniqueName)
  if (technique) {
    technique.repetitionChance = Math.max(0, Math.min(100, chance))
  }
}

const updateKatiRepetitionChance = (katiId, chance) => {
  katiRepetitionChances.value[katiId] = Math.max(0, Math.min(100, chance))
}

const getKatiRepetitionChance = (katiId) => {
  return katiRepetitionChances.value[katiId] ?? DEFAULT_REPETITION_CHANCE
}

const recentHistory = computed(() => {
  return [...trainingHistory.value]
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    .slice(0, 5)
})

const lastTrainingDate = computed(() => {
  if (!trainingHistory.value.length) return ''
  return new Date(
    [...trainingHistory.value].sort((a, b) => new Date(b.datetime) - new Date(a.datetime))[0].datetime,
  ).toLocaleString()
})

const historyMap = (type) => {
  const seen = new Map()

  trainingHistory.value.forEach((entry) => {
    (entry[type] || []).forEach((item) => {
      const current = seen.get(item)
      const entryDate = new Date(entry.datetime)
      if (!current || entryDate > current) {
        seen.set(item, entryDate)
      }
    })
  })

  return seen
}

const maxOrderByCategory = masterKatis.reduce((acc, kati) => {
  const category = kati.category || 'Outros'
  acc[category] = Math.max(acc[category] || 0, kati.order || 0)
  return acc
}, {})

const normalizeRecencyScore = (date) => {
  if (!date) return 1
  const days = Math.floor((Date.now() - date.getTime()) / MS_PER_DAY)
  return Math.min(days, MAX_RECOMMENDATION_DAYS) / MAX_RECOMMENDATION_DAYS
}

const getLastTrainedDate = (item, type, history) => {
  const seen = history.get(type)
  return seen ? seen.get(item) : undefined
}

const scoreTechnique = (technique, history) => {
  const lastDate = getLastTrainedDate(technique.name, 'techniques', history)
  const recencyScore = normalizeRecencyScore(lastDate)
  const chanceScore = technique.repetitionChance / 100
  const orderScore = 0.5

  return calculateScore(orderScore, chanceScore, recencyScore)
}

const scoreKati = (katiId, history) => {
  const kati = masterKatis.find((m) => m.id === katiId)
  const lastDate = getLastTrainedDate(katiId, 'katis', history)
  const recencyScore = normalizeRecencyScore(lastDate)
  const chanceScore = getKatiRepetitionChance(katiId) / 100
  const categoryMaxOrder = kati ? maxOrderByCategory[kati.category || 'Outros'] : 0
  const orderScore = kati && categoryMaxOrder > 1 ? (kati.order - 1) / (categoryMaxOrder - 1) : 0.5

  return calculateScore(orderScore, chanceScore, recencyScore)
}

const calculateScore = (orderScore, chanceScore, recencyScore) => {
  // Fórmula de recomendação:
  return 0.3 * orderScore + 0.3 * chanceScore + 0.4 * recencyScore;
};

const sortedRecommendations = (items, type, limit = 6) => {
  const history = new Map([
    ['techniques', historyMap('techniques')],
    ['katis', historyMap('katis')],
  ])

  return items
    .slice()
    .sort((a, b) => {
      const scoreA = type === 'techniques' ? scoreTechnique(a, history) : scoreKati(a, history)
      const scoreB = type === 'techniques' ? scoreTechnique(b, history) : scoreKati(b, history)
      return scoreB - scoreA
    })
    .slice(0, limit)
}

const getRecommendedTechniques = (count = 6) => {
  return sortedRecommendations(knownTechniques.value, 'techniques', count)
}

const getRecommendedKatis = (count = 6) => {
  const ids = sortedRecommendations(userKnownKatis.value.slice(), 'katis', count)
  return ids.map((id) => masterKatis.find((m) => m.id === id)).filter(Boolean)
}

const recommendedTechniques = computed(() => getRecommendedTechniques())
const recommendedKatis = computed(() => getRecommendedKatis())

const toLocale = (value) => new Date(value).toLocaleString()

export function useTrainingStore() {
  return {
    knownTechniques,
    masterKatis,
    userKnownKatis,
    trainingHistory,
    formDatetime,
    selectedTechniques,
    selectedKatis,
    katiRepetitionChances,
    registerTraining,
    toggleKnownKati,
    updateTechniqueRepetitionChance,
    updateKatiRepetitionChance,
    getKatiRepetitionChance,
    recommendedTechniques,
    recommendedKatis,
    getRecommendedTechniques,
    getRecommendedKatis,
    recentHistory,
    lastTrainingDate,
    toLocale,
  }
}
