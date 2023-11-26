import { NuxtAuthHandler } from '#auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { Theme } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import EmailProvider from 'next-auth/providers/email'
import { EmailConfig } from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'

import db from '../../db'

const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
  adapter: MongoDBAdapter(db) as Adapter,
  pages: {
    signIn: '/login',
  },
  secret: runtimeConfig.authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR.
    // May be fixed via Vite at some point
    GithubProvider.default({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
    {
      id: 'authelia',
      name: 'Authelia',
      type: 'oauth',
      clientId: runtimeConfig.josaOAuth.clientId,
      clientSecret: runtimeConfig.josaOAuth.clientSecret,
      wellKnown: runtimeConfig.josaOAuth.wellKnown,
      authorization: { params: { scope: 'openid email profile' } },
      idToken: true,
      checks: ['pkce', 'state'],
      profile(profile: any) {
        return {
          id: profile.preferred_username,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
        }
      },
    },
    // @ts-expect-error You need to use .default here for it to work during SSR.
    // May be fixed via Vite at some point
    EmailProvider.default({
      sendVerificationRequest: async (params) => {
        const { identifier, url, provider, theme } = params
        const _url = new URL(url)
        const { host } = _url

        const callbackUrl = _url.searchParams.get('callbackUrl')
        const locale =
          callbackUrl?.substring(
            _url.origin.length + 1,
            _url.origin.length + 3 // length of the locale's code
          ) === 'ar'
            ? 'ar'
            : 'en'

        await fetch(`${runtimeConfig.listMonk.apiUrl}/tx`, {
          method: 'POST',
          mode: 'cors',
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' +
              btoa(
                runtimeConfig.listMonk.user +
                  ':' +
                  runtimeConfig.listMonk.password
              ),
          }),
          body: JSON.stringify({
            subscriber_email: identifier,
            template_id:
              locale === 'en'
                ? runtimeConfig.listMonk.enTemplateId
                : runtimeConfig.listMonk.arTemplateId,
            data: {
              link: url,
            },
            content_type: 'html',
          }),
        })
          .catch((err) => {
            console.log(err)
          })
          .finally((fin) => {
            if (fin) {
              console.log(fin)
            }
          })
      },
    } as EmailConfig),
  ],
})

type Locale = 'en' | 'ar'

function subject(locale: Locale) {
  return locale === 'en' ? 'Sign in to Nuha' : 'تسجيل الدخول الى نهى'
}
