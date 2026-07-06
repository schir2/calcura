export function useNavDrawer() {
  const isOpen = useState<boolean>('nav-drawer-open', () => false)
  return {
    isOpen,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
  }
}
