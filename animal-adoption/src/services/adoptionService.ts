import { ACCOUNTS } from '@/data/accounts'
import { ANIMALS } from '@/data/animals'
import type { Account } from '@/types/account'
import type { Animal } from '@/types/animal'

export const adoptionService = {
  async getAnimals(simulateError = false): Promise<Animal[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error(`absolutely not`))
        } else {
          resolve([...ANIMALS])
        }
      }, 500)
    })
  },

  async getAccountById(accountId: number): Promise<Account | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const account = ACCOUNTS[accountId]
        if (account) {
          resolve(account)
        } else {
          resolve(null)
        }
      }, 500)
    })
  },
}
