import { defineStore } from 'pinia'
import type { Animal } from '@/types/animal'
import type { Account } from '@/types/account'
import { adoptionService } from '@/services/adoptionService'
import { computed, ref } from 'vue'

export const useAdoptionStore = defineStore(`adoption`, () => {
  const animals = ref<Animal[]>([])
  const publicAccount = ref<Account | null>(null)
  const currentAccountId = ref<number | null>(null)

  const LOGGED_IN_ACCOUNT_ID = ref<number | null>(null)
  const privateAccount = ref<Account | null>(null)
  const myAnimals = computed(() => {
    return animals.value.filter((a) => a.accountId === privateAccount.value?.id)
  })

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadAnimals(SimulateError = false, forceReload = false) {
    if (animals.value.length > 0 && !forceReload) {
      return
    }

    loading.value = true
    error.value = null

    try {
      animals.value = await adoptionService.getAnimals(SimulateError)
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'issues in loading Animals function in stores/'
      animals.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadAccount(accountId: number, forceReload = false) {
    if (publicAccount.value && !forceReload && currentAccountId.value === accountId) {
      return
    }
    loading.value = true
    error.value = null

    try {
      loading.value = true
      publicAccount.value = await adoptionService.getAccountById(accountId)
      currentAccountId.value = accountId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'sth went wrong in loadAccount function'
    } finally {
      loading.value = false
    }
  }
  return {
    animals,
    publicAccount,
    privateAccount,
    myAnimals,
    LOGGED_IN_ACCOUNT_ID,
    loading,
    error,
    loadAnimals,
    loadAccount,
  }
})
