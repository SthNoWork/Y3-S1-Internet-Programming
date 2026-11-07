import { defineStore } from 'pinia'
import type { Animal } from '@/types/animal'
import type { Account } from '@/types/account'
import { adoptionService } from '@/services/adoptionService'
import { ref } from 'vue'

export const useAdoptionStore = defineStore(`adoption`, () => {
  const animals = ref<Animal[]>([])
  const account = ref<Account | null>(null)
  const currentAccountId = ref<number | null>(null)

  const LOGGED_IN_ACCOUNT_ID = ref<number | null>(null)
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
    if (account.value && !forceReload && currentAccountId.value === accountId) {
      return
    }
    loading.value = true
    error.value = null

    try {
      loading.value = true
      account.value = await adoptionService.getAccountById(accountId)
      currentAccountId.value = accountId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'sth went wrong in loadAccount function'
    } finally {
      loading.value = false
    }
  }
  return { animals, account, LOGGED_IN_ACCOUNT_ID, loading, error, loadAnimals, loadAccount }
})
