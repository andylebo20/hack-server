export const AUTH_ADMIN_ERROR_MSG = "Need to be an admin to make this request";
export const AUTH_API_CREDS_ERROR_MSG = "Your API key is invalid.";

export class ApiError {
  message: string;
  code: number;
  constructor(message: string = "", code: number = 400) {
    this.message = message;
    this.code = code;
  }
}

export class InternalError {
  message: string;
  code: number;
  constructor(message: string = "Internal error", code: number = 500) {
    this.message = message;
    this.code = code;
  }
}

export class AuthError {
  message: string;
  code: number;
  constructor(
    message: string = "Need a registered user to make this request",
    code: number = 403
  ) {
    this.message = message;
    this.code = code;
  }
}
