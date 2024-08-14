/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { SemanticNamespace } from "../../type/SemanticNamespace.js";

/**
 * The tags contained in this namespace may be used in any domain or context, to indicate an association with a
 * movement in a certain direction relative to the device. Note the difference with Chapter 9, Common Position Semantic
 * Tag Namespace.
 *
 * @see {@link MatterSpecification.v13.Namespace} § 5
 */
export const CommonDirectionTag = SemanticNamespace({
    id: 0x4,

    tags: {
        Upward: { id: 0x0, name: "Upward" },
        Downward: { id: 0x1, name: "Downward" },
        Leftward: { id: 0x2, name: "Leftward" },
        Rightward: { id: 0x3, name: "Rightward" },
        Forward: { id: 0x4, name: "Forward" },
        Backward: { id: 0x5, name: "Backward" }
    }
});