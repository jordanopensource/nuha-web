import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import db from '../../db'
import { Theme } from 'next-auth'

const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
  adapter: MongoDBAdapter(db),
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
      server: {
        host: runtimeConfig.smtp.host,
        port: 587,
        auth: {
          user: runtimeConfig.smtp.user,
          pass: runtimeConfig.smtp.password,
        },
      },
      from: `Nuha Magic Link Login <${runtimeConfig.smtp.user}>`,
    }),
  ],
})
