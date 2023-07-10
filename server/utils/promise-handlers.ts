export function reject<T>(msg: any): Promise<T> {
  return new Promise<T>((_, reject) => {
    reject(msg)
  })
}

export function resolve<T>(msg: any): Promise<T> {
  return new Promise<T>((resolve, _) => {
    resolve(msg)
  })
}
