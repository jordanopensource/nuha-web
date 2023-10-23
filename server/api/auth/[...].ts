import { NuxtAuthHandler } from '#auth'
import GithubProvider from 'next-auth/providers/github'
import EmailProvider from 'next-auth/providers/email'
import { EmailConfig } from 'next-auth/providers/email'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import db from '../../db'
import { Theme } from 'next-auth'
import { createTransport } from 'nodemailer'
import { Adapter } from 'next-auth/adapters'

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
      server: {
        host: runtimeConfig.smtp.host,
        port: 587,
        auth: {
          user: runtimeConfig.smtp.user,
          pass: runtimeConfig.smtp.password,
        },
      },
      from: `Nuha Magic Link Login <${runtimeConfig.smtp.user}>`,
      sendVerificationRequest: async (params) => {
        const { identifier, url, provider, theme } = params
        const _url = new URL(url)
        const { host } = _url

        const callbackUrl = _url.searchParams.get('callbackUrl')
        const locale =
          callbackUrl?.substring(
            _url.origin.length + 1,
            _url.origin.length + 3, // length of the locale's code
          ) === 'ar'
            ? 'ar'
            : 'en'

        const transport = createTransport(provider.server)
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: subject(locale),
          text: text({ url, host }, locale),
          html: html({ url, host, theme }, locale),
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email (${failed.join(', ')}) could not be sent`)
        }
      },
    } as EmailConfig),
  ],
})

type Locale = 'en' | 'ar'

function subject(locale: Locale) {
  return locale === 'en' ? 'Sign in to Nuha' : 'تسجيل الدخول الى نهى'
}

function html(
  params: { url: string; host: string; theme: Theme },
  locale: Locale,
) {
  const { url, host, theme } = params

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const brandColor = '#c40f55'
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const buttonText = '#fcf0f7'

  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  }

  return `  <body style="background: ${color.background};">
  <table
    width="100%"
    border="0"
    cellspacing="20"
    cellpadding="0"
    style="max-width: 600px; margin: auto; border-radius: 10px;"
  >
    <tr>
      <td
        align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
          color.text
        };"
      >
        ${
          locale === 'en'
            ? "Dear user, please note that this is a magic link to only sign in once into your Nuha dashboard. Keep in mind that this won't create an account for you nor will we save any data. Once you click on the link the token will be used to verify. If you session ends or your log out the token will expire and you will need to re-enter you email again to receive a new link"
            : 'عزيزي المستخدم، يرجى ملاحظة أن هذا هو رابط سحري لتسجيل الدخول مرة واحدة فقط إلى لوحة القيادة الخاصة بـ Nuha الخاصة بك. تذكر أن هذا لن ينشئ حسابًا لك ولن نقوم بحفظ أي بيانات. بمجرد النقر على الرابط ، سيتم استخدام الرمز المميز للتحقق. إذا انتهت جلستك أو قمت بتسجيل الخروج ، فسينتهي صلاحية الرمز المميز وستحتاج إلى إعادة إدخال عنوان بريدك الإلكتروني مرة أخرى لتلقي رابط جديد'
        }

      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td
              align="center"
              style="border-radius: 5px"
              bgcolor="${color.buttonBackground}"
            >
              <a
                href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${
                  color.buttonText
                }; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${
                  color.buttonBorder
                }; display: inline-block; font-weight: bold;"
                >${locale === 'en' ? 'Sign in' : 'تسجيل الدخول'}</a
              >
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td
        align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
          color.text
        };"
      >
        <img
          style="display: inline; height: 80px; padding-right: 30px"
          alt="JOSA Logo" title="JOSA Logo" height="80" width="240"
          src="https://josa.ngo/_ipx/_/logos/logo-colored-en.svg"
        />
        <img
          style="display: inline; height: 80px"
          alt="Nuha Logo" title="Nuha Logo" height="80" width="80"
          src="https://nuha.josa.ngo/logo.svg"
        />
      </td>
    </tr>
  </table>
</body>`
}

function text({ url, host }: { url: string; host: string }, locale: Locale) {
  return locale === 'en'
    ? `Dear user, please note that this is a magic link to only sign in once into your Nuha dashboard. Keep in mind that this won't create an account for you nor will we save any data. Once you click on the link the token will be used to verify. If you session ends or your log out the token will expire and you will need to re-enter you email again to receive a new link\n${url}\n\n`
    : `عزيزي المستخدم، يرجى ملاحظة أن هذا هو رابط سحري لتسجيل الدخول مرة واحدة فقط إلى لوحة القيادة الخاصة بـ Nuha الخاصة بك. تذكر أن هذا لن ينشئ حسابًا لك ولن نقوم بحفظ أي بيانات. بمجرد النقر على الرابط ، سيتم استخدام الرمز المميز للتحقق. إذا انتهت جلستك أو قمت بتسجيل الخروج ، فسينتهي صلاحية الرمز المميز وستحتاج إلى إعادة إدخال عنوان بريدك الإلكتروني مرة أخرى لتلقي رابط جديد
\n${url}\n\n`
}
