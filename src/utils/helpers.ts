import { AxiosError } from 'axios';
import bcrypt from 'bcrypt';
import _ from 'lodash';

// IMPORTANT: Once this enters prod, DO NOT CHANGE THIS VALUE
const SALT_ROUNDS = 10;

export async function awaitTimeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHashFromPlainTextKey(
  plainTextKey: string
): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainTextKey, salt);
}

export const getErrorMessage = (e: AxiosError) =>
  _.get(e, "response.data", e.message);
