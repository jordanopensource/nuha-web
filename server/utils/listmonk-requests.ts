const runtimeConfig = useRuntimeConfig()

enum ListmonkRequests {
  SEND_EMAIL = 'tx',
  REGISTER_EMAIL = 'subscribers',
}

export async function sendLoginEmail(
  targetEmail: string,
  locale: string,
  loginUrl: string,
): Promise<void> {
  await makeListmonkRequest(
    ListmonkRequests.SEND_EMAIL,
    JSON.stringify({
      subscriber_email: targetEmail,
      template_id:
        locale === 'en'
          ? runtimeConfig.listMonk.enTemplateId
          : runtimeConfig.listMonk.arTemplateId,
      data: {
        link: loginUrl,
      },
      content_type: 'html',
    }),
  )
}

export async function registerEmail(email: string): Promise<void> {
  await makeListmonkRequest(
    ListmonkRequests.REGISTER_EMAIL,
    JSON.stringify({
      email,
      name: 'Nuha User',
      status: 'enabled',
      lists: [
        runtimeConfig.listMonk.enTemplateId,
        runtimeConfig.listMonk.arTemplateId,
      ].map(parseInt),
    }),
  )
}

async function makeListmonkRequest(
  path: ListmonkRequests,
  body: BodyInit,
): Promise<void | Response> {
  return await fetch(`${runtimeConfig.listMonk.apiUrl}/${path}`, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        btoa(
          runtimeConfig.listMonk.user + ':' + runtimeConfig.listMonk.password,
        ),
    }),
    body,
  })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}
