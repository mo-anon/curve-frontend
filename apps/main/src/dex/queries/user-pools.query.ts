import { requireLib, useCurve } from '@ui-kit/features/connect-wallet'
import { createValidationSuite, type FieldsOf } from '@ui-kit/lib'
import { queryFactory, rootKeys, type ChainQuery, type UserQuery } from '@ui-kit/lib/model'
import { chainValidationGroup } from '@ui-kit/lib/model/query/chain-validation'
import { curveApiValidationGroup } from '@ui-kit/lib/model/query/curve-api-validation'
import { userAddressValidationGroup } from '@ui-kit/lib/model/query/user-address-validation'

type UserPoolsQuery = ChainQuery & UserQuery
type UserPoolsParams = FieldsOf<UserPoolsQuery>

const { useQuery: useUserPoolsQuery, fetchQuery: fetchUserPools } = queryFactory({
  queryKey: ({ chainId, userAddress }: UserPoolsParams) =>
    [...rootKeys.chain({ chainId }), ...rootKeys.user({ userAddress }), 'pools'] as const,
  queryFn: async ({ userAddress }: UserPoolsQuery) => await requireLib('curveApi').getUserPoolList(userAddress),
  staleTime: '1m',
  validationSuite: createValidationSuite(({ chainId, userAddress }: UserPoolsParams) => {
    chainValidationGroup({ chainId })
    curveApiValidationGroup({ chainId })
    userAddressValidationGroup({ userAddress })
  }),
})

export { fetchUserPools }

export const useUserPools = (params: UserPoolsParams) => {
  const { provider, isHydrated } = useCurve()

  return useUserPoolsQuery(params, provider && isHydrated)
}
