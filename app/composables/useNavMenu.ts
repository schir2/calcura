import type {MenuOption} from 'naive-ui'
import {Icon, NuxtLink} from '#components'
import {tools, isAvailable} from '~/constants/tools'

function renderIcon(name: string) {
  return () => h(Icon, {name})
}

function renderLink(label: string, to: string) {
  return () => h(NuxtLink, {to, class: 'n-menu-link'}, () => label)
}

function renderComingSoon(label: string) {
  return () => h('span', {class: 'flex items-center gap-2'}, [
    h('span', label),
    h('span', {class: 'text-xs text-skin-muted'}, 'soon'),
  ])
}

export function useNavMenu(): {menuOptions: MenuOption[]; routeByKey: Record<string, string>} {
  const menuOptions: MenuOption[] = [
    {
      key: 'dashboard',
      icon: renderIcon('uil:create-dashboard'),
      label: renderLink('Dashboard', '/dashboard'),
    },
    ...tools.map((tool): MenuOption => ({
      key: tool.id,
      icon: renderIcon(tool.icon),
      disabled: !isAvailable(tool),
      label: isAvailable(tool)
          ? renderLink(tool.label, tool.route!)
          : renderComingSoon(tool.label),
    })),
  ]

  const routeByKey: Record<string, string> = {
    dashboard: '/dashboard',
    ...Object.fromEntries(tools.filter(isAvailable).map(tool => [tool.id, tool.route!])),
  }

  return {menuOptions, routeByKey}
}
