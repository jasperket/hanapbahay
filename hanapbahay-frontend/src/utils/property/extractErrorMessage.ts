import { isAxiosError } from "axios";

export const extractErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    if (data) {
      const errors = data.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        return errors.join(" ");
      }
      if (errors && typeof errors === "object") {
        const collected = Object.values(errors)
          .flat()
          .filter((value): value is string => typeof value === "string");
        if (collected.length > 0) {
          return collected.join(" ");
        }
      }
      if (typeof data.message === "string") {
        return data.message;
      }
      if (typeof data.title === "string") {
        return data.title;
      }
    }
    return error.response?.statusText ?? "Request failed.";
  }

  return "Unexpected error occurred.";
};
