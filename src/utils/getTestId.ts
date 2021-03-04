import { IS_CYPRESS_ENVIRONMENT, TEST_ID_ATTRIBUTE } from "../constants";

export default function getTestId(value: string) {
  return IS_CYPRESS_ENVIRONMENT && value ? { [TEST_ID_ATTRIBUTE]: value } : {};
}
