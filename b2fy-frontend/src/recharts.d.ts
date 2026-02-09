/**
 * Declaração para evitar conflito de tipos entre recharts e @types/react do projeto.
 * O recharts usa uma versão aninhada de @types/react que inclui bigint em ReactNode,
 * causando erro 2786. Esta declaração faz o TypeScript aceitar os componentes.
 */
declare module 'recharts' {
  import type { ComponentType } from 'react'
  export const ResponsiveContainer: ComponentType<any>
  export const BarChart: ComponentType<any>
  export const Bar: ComponentType<any>
  export const XAxis: ComponentType<any>
  export const YAxis: ComponentType<any>
  export const Tooltip: ComponentType<any>
  export const PieChart: ComponentType<any>
  export const Pie: ComponentType<any>
  export const Cell: ComponentType<any>
  export const Legend: ComponentType<any>
}
