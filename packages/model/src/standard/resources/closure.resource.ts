/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { Resource } from "#models/Resource.js";

Resource.add({
    tag: "semanticNamespace", name: "Closure", xref: "namespace§2",
    details: "The tags contained in this namespace may be used in any domain or context, to indicate an " +
        "association with a feature of a Closure, e.g. the button to activate opening a garage door.",
    children: [
        { tag: "semanticTag", name: "Opening", description: "Move toward open position" },
        { tag: "semanticTag", name: "Closing", description: "Move toward closed position" },
        { tag: "semanticTag", name: "Stop", description: "Stop any movement" }
    ]
});
