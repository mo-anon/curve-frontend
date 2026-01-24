import { useCallback } from 'react'
import { useStore } from '@/dex/store/useStore'
import { type CurveApi, useCurve } from '@ui-kit/features/connect-wallet'
import { usePageVisibleInterval } from '@ui-kit/hooks/usePageVisibleInterval'
import { REFRESH_INTERVAL } from '@ui-kit/lib/model'
import { useGasInfoAndUpdateLib } from '@ui-kit/lib/model/entities/gas-info'
import { useNetworks } from '../entities/networks'
import { usePoolsList } from '../queries/pools-list.query'

export const useAutoRefresh = (chainId: number | undefined) => {
  const { curveApi } = useCurve()
  const { data: networks } = useNetworks()
  const fetchPools = useStore((state) => state.pools.fetchPools)
  const poolDataMapper = useStore((state) => chainId && state.pools.poolsMapper[chainId])
  const fetchPoolsVolume = useStore((state) => state.pools.fetchPoolsVolume)
  const fetchPoolsTvl = useStore((state) => state.pools.fetchPoolsTvl)
  const setTokensMapper = useStore((state) => state.tokens.setTokensMapper)
  const { data: poolsList } = usePoolsList({ chainId, useApi: chainId ? (networks[chainId]?.useApi ?? false) : false })

  useGasInfoAndUpdateLib({ chainId, networks })

  const fetchPoolsVolumeTvl = useCallback(
    async (curve: CurveApi) => {
      if (!chainId || !poolDataMapper) return
      const poolsData = Object.values(poolDataMapper)
      await Promise.all([fetchPoolsVolume(chainId, poolsData), fetchPoolsTvl(curve, poolsData)])
      void setTokensMapper(curve, poolsData)
    },
    [chainId, fetchPoolsTvl, fetchPoolsVolume, poolDataMapper, setTokensMapper],
  )

  usePageVisibleInterval(() => {
    if (curveApi) {
      void fetchPoolsVolumeTvl(curveApi)

      if (poolsList?.length) {
        void fetchPools(curveApi, poolsList, null)
      }
    }
  }, REFRESH_INTERVAL['5m'])
}
