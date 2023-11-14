import { HttpStatusCode } from "axios";

/**
 * @param error - the error caught from axios
 * @param prompt - the vue-i18n message format string of prompt
 * @param t - the translator of vue-i18n (destructed from ```useI18n()```)
 */
export function throwError(error: any, prompt: string, t: any): void {
  const response = error.response;

  if (response) {
    console.error(response.data);
    console.error(response.status);
    console.error(response.headers);

    switch (response.status) {
      case HttpStatusCode.BadRequest:
        ElMessage.error(t(prompt, { err: t("badRequest") }));
        break;
      case HttpStatusCode.Unauthorized:
        ElMessage.error(t(prompt, { err: t("unauthorized") }));
        break;
      case HttpStatusCode.Forbidden:
        ElMessage.error(t(prompt, { err: t("forbidden") }));
        break;
      case HttpStatusCode.NotFound:
        ElMessage.error(t(prompt, { err: t("notFound") }));
        break;
      case HttpStatusCode.InternalServerError:
        ElMessage.error(t(prompt, { err: t("internalErr") }));
        break;
      default:
        ElMessage.error(t(prompt, { err: t("unknownErr") }));
        break;
    }
  } else {
    error.request ? console.error(error.request) : console.error(error.message);
    ElMessage.error(t(prompt, { err: t("chkNet") }));
  }

  console.error(error.config);
}
