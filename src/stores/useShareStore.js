import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShareStore = defineStore('share', () => {
  const showModal = ref(false)
  const copied = ref(false)

  return { showModal, copied }
})

