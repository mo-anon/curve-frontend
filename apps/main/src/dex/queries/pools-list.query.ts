import { requireLib } from '@ui-kit/features/connect-wallet'
import type { FieldsOf } from '@ui-kit/lib'
import { queryFactory, rootKeys, type ChainQuery } from '@ui-kit/lib/model'
import { curveApiValidationSuite } from '@ui-kit/lib/model/query/curve-api-validation'
import { Chain } from '@ui-kit/utils'

/**
 * A hardcoded blacklist of pools we don't want to show in the front-end for whatever reason.
 * In the future this will be moved to a separate TanStack query, as there's there's now a
 * Prices API endpoint with additional pools that we need to filter out.
 */
const blacklist: Partial<Record<Chain, string[]>> = {
  [Chain.Ethereum]: [
    'weth-llamma',
    'sfrxeth-llamma',
    'pax',
    'busd',
    'y',
    'factory-v2-267',
    'factory-v2-332', // CRVUSD/STUSDT
    'factory-v2-348', // PYUSD/crvUSD
    'factory-v2-349', // crvUSD/PYUSD
    'factory-v2-350', // crvUSD/PYUSD
    'factory-v2-233', // Adamant Dollar
    'factory-stable-ng-13', // USDV-3crv
    'factory-stable-ng-21', // weETH/WETH
    'factory-v2-370', // PRISMA/yPRISMA
  ],
  [Chain.Fantom]: [
    'factory-v2-137', // old eywa pool
    'factory-v2-140', // old eywa pool
    'factory-stable-ng-12', // CrossCurve crvUSDT
    'factory-stable-ng-13', // CrossCurve
    'factory-stable-ng-14', // CrossCurve
    'factory-stable-ng-15', // CrossCurve
  ],
  [Chain.Base]: ['factory-v2-4', 'factory-v2-5'],
} as const

type PoolsListQuery = ChainQuery & { useApi: boolean }
type PoolsListParams = FieldsOf<PoolsListQuery>

/** Gets a list of all pool addresses as it hydrates curve-js as well. */
export const { useQuery: usePoolsList, fetchQuery: fetchPoolsList } = queryFactory({
  queryKey: ({ chainId, useApi }: PoolsListParams) => [...rootKeys.chain({ chainId }), { useApi }, 'pools'] as const,
  queryFn: async ({ chainId, useApi }: PoolsListQuery) => {
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

    return curve.getPoolList().filter((poolId) => !blacklist[chainId as Chain]?.includes(poolId))
  },
  validationSuite: curveApiValidationSuite,
})
