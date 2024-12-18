import { FieldsOf } from '../../lib'

export type ChainQuery = { chainId: number }
export type PoolQuery = ChainQuery & { poolId: string }
export type GaugeQuery = PoolQuery

export type ChainParams = FieldsOf<ChainQuery>
export type PoolParams = FieldsOf<PoolQuery>
export type GaugeParams = FieldsOf<GaugeQuery>

export const rootKeys = {
  chain: ({ chainId }: ChainParams) => ['chain', { chainId }] as const,
  pool: ({ chainId, poolId }: PoolParams) => [...rootKeys.chain({ chainId }), 'pool', { poolId }] as const,
  gauge: ({ chainId, poolId }: GaugeParams) => [...rootKeys.pool({ chainId, poolId }), 'gauge'] as const,
} as const
