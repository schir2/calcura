import type {ChartHue, ChartNeutral} from '~/theme/palette'
import {chartNeutralDark, chartNeutralLight, chartSeriesDark, chartSeriesLight} from '~/theme/palette'

// Chart.js canvases can't read CSS vars reactively, so colors are literal rgb triples selected by
// color mode at draw time. `colorMode.value` is read inside each getter so chart option computeds
// recompute when the theme flips (race-free, unlike getComputedStyle on the skin CSS vars).
export function useChartColors() {
  const {colorMode} = useNaiveColorMode()

  function hue(name: ChartHue, alpha = 1): string {
    const map = colorMode.value === 'dark' ? chartSeriesDark : chartSeriesLight
    const rgb = map[name] ?? map.slate
    return alpha >= 1 ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`
  }

  function ink(role: ChartNeutral, alpha = 1): string {
    const map = colorMode.value === 'dark' ? chartNeutralDark : chartNeutralLight
    const rgb = map[role] ?? map.muted
    return alpha >= 1 ? `rgb(${rgb})` : `rgba(${rgb}, ${alpha})`
  }

  return {hue, ink}
}