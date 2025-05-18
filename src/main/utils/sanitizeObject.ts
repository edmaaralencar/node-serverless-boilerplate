// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeObject(object: Record<string, any> = {}) {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (!value) {
      return acc
    }

    return {
      ...acc,
      [key]: value,
    }
  }, {})
}
