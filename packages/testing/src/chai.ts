/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import Chai from "chai";
import "./global-definitions.js";

export interface DiffMarker {}

Chai.config.truncateThreshold = 200;

function createDiffMarker(title: string) {
    return {
        toString() {
            return `<<${title}>>`;
        },
    } as DiffMarker;
}

expect.IGNORE = createDiffMarker("ignore");
expect.BIGINT = createDiffMarker("bigint");
expect.BYTES = createDiffMarker("bytes");
expect.NUMBER = createDiffMarker("number");
expect.STRING = createDiffMarker("string");

(Chai.config as any).deepEqual = (expected: unknown, actual: unknown) => {
    return (Chai.util as any).eql(expected, actual, {
        comparator(expected: unknown, actual: unknown) {
            switch (expected) {
                case expect.IGNORE:
                    return true;

                case expect.BIGINT:
                    return typeof actual === "bigint";

                case expect.NUMBER:
                    return typeof actual === "number";

                case expect.STRING:
                    return typeof actual === "string";

                case expect.BYTES:
                    return actual instanceof Uint8Array;
            }
            return null;
        },
    });
};
