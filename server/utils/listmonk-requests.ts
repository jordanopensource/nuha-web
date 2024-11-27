const runtimeConfig = useRuntimeConfig()

enum ListmonkEndpoint {
  // reference https://listmonk.app/docs/apis/transactional/
  SEND_TRANSACTIONAL_EMAIL = 'tx',
  // reference https://listmonk.app/docs/apis/subscribers/#post-apisubscribers
  SUBSCRIBE_EMAIL = 'subscribers',
}

export async function sendLoginEmail(
  targetEmail: string,
  locale: string,
  loginUrl: string
): Promise<void> {
  await makeListmonkRequest(
    ListmonkEndpoint.SEND_TRANSACTIONAL_EMAIL,
    JSON.stringify({
      subscriber_email: targetEmail,
      template_id: parseInt(
        locale === 'en'
          ? runtimeConfig.listMonk.enTemplateId
          : runtimeConfig.listMonk.arTemplateId
      ),
      data: {
        link: loginUrl,
      },
      content_type: 'html',
    })
  )
}

export async function subscribeEmail(email: string): Promise<void> {
  await makeListmonkRequest(
    ListmonkEndpoint.SUBSCRIBE_EMAIL,
    JSON.stringify({
      email,
      name: email.substring(0, email.indexOf('@')),
      status: 'enabled',
      lists: [runtimeConfig.listMonk.listId].map(parseInt),
    })
  )
}

async function makeListmonkRequest(
  path: ListmonkEndpoint,
  body: BodyInit
): Promise<void | Response> {
  return await fetch(`${runtimeConfig.listMonk.apiUrl}/${path}`, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization:
        'token ' +
        runtimeConfig.listMonk.user +
        ':' +
        runtimeConfig.listMonk.token,
    }),
    body,
  })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {})
}
