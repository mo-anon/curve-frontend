import { requireLib } from '@ui-kit/features/connect-wallet'
import type { FieldsOf } from '@ui-kit/lib'
import { queryFactory, rootKeys, type ChainQuery } from '@ui-kit/lib/model'
import { curveApiValidationSuite } from '@ui-kit/lib/model/query/curve-api-validation'

type PoolsQuery = ChainQuery & { useApi: boolean }
type PoolsParams = FieldsOf<PoolsQuery>

/** Gets a list of all pool addresses as it hydrates curve-js as well. */
export const { useQuery: usePoolsList, fetchQuery: fetchPoolsList } = queryFactory({
  queryKey: ({ chainId, useApi }: PoolsParams) => [...rootKeys.chain({ chainId }), { useApi }, 'pools'] as const,
  queryFn: async ({ useApi }: PoolsQuery) => {
    // must call api in this order, must use api to get non-cached version of gaugeStatus
    const curve = requireLib('curveApi')

    await Promise.allSettled([
      curve.factory.fetchPools(useApi),
      curve.cryptoFactory.fetchPools(useApi),
      curve.twocryptoFactory.fetchPools(useApi),
      curve.crvUSDFactory.fetchPools(useApi),
      curve.tricryptoFactory.fetchPools(useApi),
      curve.stableNgFactory.fetchPools(useApi),
    ])

    await Promise.allSettled([
      curve.factory.fetchNewPools(),
      curve.cryptoFactory.fetchNewPools(),
      curve.twocryptoFactory.fetchNewPools(),
      curve.tricryptoFactory.fetchNewPools(),
      curve.stableNgFactory.fetchNewPools(),
    ])

    return curve.getPoolList()
  },
  validationSuite: curveApiValidationSuite,
})
