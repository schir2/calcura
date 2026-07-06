import {useBreakpoints, breakpointsTailwind} from '@vueuse/core'

export function useNavMode() {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = breakpoints.smaller('md')
  const isTablet = breakpoints.between('md', 'lg')
  const isDesktop = breakpoints.greaterOrEqual('lg')
  return {isMobile, isTablet, isDesktop}
}
