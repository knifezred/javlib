import { SetupStoreId } from '@renderer/enums'
import { cloneDeep } from 'lodash-es'
import type { PiniaPluginContext } from 'pinia'

/**
 * The plugin reset the state of the store which is written by setup syntax
 *
 * @param context
 */
export function resetSetupStore(context: PiniaPluginContext) {
  const setupSyntaxIds = Object.values(SetupStoreId) as string[]

  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store

    const defaultStore = cloneDeep($state)

    context.store.$reset = () => {
      context.store.$patch(defaultStore)
    }
  }
}
