import { NuxtAuthHandler } from '#auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { Adapter } from 'next-auth/adapters'
import EmailProvider from 'next-auth/providers/email'
import { EmailConfig } from 'next-auth/providers/email'
import GithubProvider from 'next-auth/providers/github'

import db from '../../db'
import { sendLoginEmail, subscribeEmail } from '../../utils/listmonk-requests'

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
      allowDangerousEmailAccountLinking: true,
    }),
    {
      id: 'authelia',
      name: 'Authelia',
      type: 'oauth',
      clientId: runtimeConfig.josaOAuth.clientId,
      clientSecret: runtimeConfig.josaOAuth.clientSecret,
      allowDangerousEmailAccountLinking: true,
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

        await subscribeEmail(identifier)
        await sendLoginEmail(identifier, locale, url)
      },
    } as EmailConfig),
  ],
})
