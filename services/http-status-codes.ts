export const HTTP_STATUS_CODES: Record<number, string> = {
  200: "OK - The request was successful.",
  201: "Created - The resource was successfully created.",
  202: "Accepted - The request has been accepted for processing.",
  204: "No Content - The request was successful, but there is no content to send.",
  400: "Bad Request - The server could not understand the request due to invalid syntax.",
  401: "Unauthorized - The client must authenticate itself to get the requested response.",
  403: "Forbidden - The client does not have access rights to the content.",
  404: "Not Found - The server can not find the requested resource.",
  405: "Method Not Allowed - The request method is not supported for the resource.",
  409: "Conflict - The request conflicts with the current state of the server.",
  422: "Unprocessable Entity - The server understands the content type but cannot process the request.",
  500: "Internal Server Error - The server encountered a situation it doesn't know how to handle.",
  502: "Bad Gateway - The server received an invalid response from the upstream server.",
  503: "Service Unavailable - The server is not ready to handle the request.",
  504: "Gateway Timeout - The server did not receive a timely response from the upstream server.",
};

export function getHttpStatusMessage(statusCode: number): string {
  return HTTP_STATUS_CODES[statusCode] || "Unknown Status Code - No description available.";
}