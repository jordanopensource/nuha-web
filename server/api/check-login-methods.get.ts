const runtimeConfig = useRuntimeConfig()

export default defineEventHandler((event) => {
  let resp: {github: boolean, josaId: boolean} = {
    github : false,
    josaId : false
  }

  if (runtimeConfig.github && (!!runtimeConfig.github.clientId &&
                               !!runtimeConfig.github.clientSecret)) {
    resp.github = true
  }
  if (runtimeConfig.josaOAuth && (!!runtimeConfig.josaOAuth.clientId &&
                                  !!runtimeConfig.josaOAuth.clientSecret &&
                                  !!runtimeConfig.josaOAuth.wellKnown)) {
    resp.josaId = true
  }

  return resp
})
