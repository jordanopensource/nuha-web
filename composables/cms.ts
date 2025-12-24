import { stringify } from 'qs'
import type {
  StrapiResponseSingle,
  StrapiResponseMany,
  StrapiParams,
} from '~/types/strapi'

interface StrapiComposable {
  find: <T = unknown>(
    contentType: string,
    params?: StrapiParams
  ) => Promise<StrapiResponseMany<T>>
  findOne: <T = unknown>(
    contentType: string,
    documentId?: string | number,
    params?: StrapiParams
  ) => Promise<StrapiResponseSingle<T>>
}

export const useStrapi = (): StrapiComposable => {
  const config = useRuntimeConfig()
  const prefix = config.public.cms?.prefix || '/api'

  const buildQuery = (params?: StrapiParams): string => {
    if (!params) return ''

    const query = stringify(params, {
      encodeValuesOnly: true,
    })

    return query ? `?${query}` : ''
  }

  const find = async <T = unknown>(
    contentType: string,
    params?: StrapiParams
  ): Promise<StrapiResponseMany<T>> => {
    const query = buildQuery(params)
    const url = `${prefix}/${contentType}${query}`

    try {
      const response = await $cms<StrapiResponseMany<T>>(url)
      return response
    } catch (error) {
      console.error(`Failed to fetch ${contentType}:`, error)
      throw error
    }
  }

  const findOne = async <T = unknown>(
    contentType: string,
    documentId?: string | number,
    params?: StrapiParams
  ): Promise<StrapiResponseSingle<T>> => {
    const query = buildQuery(params)
    const url = documentId
      ? `${prefix}/${contentType}/${documentId}${query}`
      : `${prefix}/${contentType}${query}`

    try {
      const response = await $cms<StrapiResponseSingle<T>>(url)
      return response
    } catch (error) {
      console.error(`Failed to fetch ${contentType}:`, error)
      throw error
    }
  }

  return {
    find,
    findOne,
  }
}
