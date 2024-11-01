import { AppBar, Toolbar } from '@mui/material'
import Box from '@mui/material/Box'
import { ConnectWalletIndicator } from '../../features/connect-wallet'
import { LanguageSwitcher } from '../../features/switch-language'
import { ChainSwitcher } from '../../features/switch-chain'
import { AppButtonLinks } from './AppButtonLinks'
import { HeaderLogo } from './HeaderLogo'
import { HeaderStats } from './HeaderStats'
import { PageTabs } from './PageTabs'
import { Theme } from '@mui/system'
import { ThemeSwitcherIconButton } from '../../features/switch-theme'
import { AdvancedModeSwitcher } from '../../features/switch-advanced-mode'
import { BaseHeaderProps, toolbarColors } from './types'

export const DesktopHeader = <TChainId extends number>({
  currentApp,
  chains,
  languages,
  wallet,
  pages,
  appStats,
  themes: [theme, setTheme],
  advancedMode: [isAdvancedMode, setAdvancedMode],
  translations: t
}: BaseHeaderProps<TChainId>) => (
  <AppBar color="transparent" position="relative">
    <Toolbar sx={{ backgroundColor: (t: Theme) => toolbarColors[t.palette.mode][0] }}>
      <HeaderLogo appName={currentApp} />
      <AppButtonLinks currentApp="lend" />

      <Box sx={{ flexGrow: 1 }} />

      <Box display="flex" marginLeft={2} justifyContent="flex-end" gap={3}>
        <AdvancedModeSwitcher advancedMode={isAdvancedMode} onChange={setAdvancedMode} label={t.advancedMode} />
        <LanguageSwitcher {...languages} />
        <ThemeSwitcherIconButton theme={theme} onChange={setTheme} label={t.themeSwitcher} />
        <ChainSwitcher {...chains} />
        <ConnectWalletIndicator {...wallet} />
      </Box>
    </Toolbar>
    <Toolbar sx={{ backgroundColor: (t: Theme) => toolbarColors[t.palette.mode][1] }}>
      <PageTabs pages={pages} />
      <Box flexGrow={1} />
      <HeaderStats appStats={appStats} />
    </Toolbar>
  </AppBar>
)
