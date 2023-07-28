import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useShareStore = defineStore('share', () => {
  const showModal = ref(false)

  return { showModal }
})

