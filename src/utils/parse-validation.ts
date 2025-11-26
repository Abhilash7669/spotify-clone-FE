import type { ZodError } from 'zod'

export function validateForm<T extends Record<string, string>>(
  data: T,
  errors: T,
  schema: { safeParse: (data: T) => { success: boolean; error?: ZodError<T> } },
): boolean {
  const result = schema.safeParse(data)

  if (!result.success) {
    result?.error?.errors.forEach((err) => {
      const key = err.path[0] as keyof T
      (errors[key] as string) = err.message
    })
    return false
  } else {
    return true
  }
}

export const VALIDATION_UTILS = {
  validateForm,
}
