import "./commands";
import { configure } from "@testing-library/cypress";
import { TEST_ID_ATTRIBUTE } from "../../src/constants";
configure({ testIdAttribute: TEST_ID_ATTRIBUTE });
