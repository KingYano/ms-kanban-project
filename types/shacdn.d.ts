// types/shadcn.d.ts
import { NuxtConfig } from 'nuxt/schema'

declare module 'nuxt/schema' {
    interface NuxtConfig {
        shadcn?: {
            prefix?: string
            componentDir?: string
        }
    }
}
