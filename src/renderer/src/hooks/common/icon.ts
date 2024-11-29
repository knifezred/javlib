import SvgIcon from '@renderer/components/custom/svg-icon.vue'
import useSvgIconRender from '@renderer/packages/hooks/use-svg-icon-render'

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon)

  return {
    SvgIconVNode
  }
}
