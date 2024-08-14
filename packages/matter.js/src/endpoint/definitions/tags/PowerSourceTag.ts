/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

import { SemanticNamespace } from "../../type/SemanticNamespace.js";

/**
 * The tags contained in this namespace are restricted for use in the power source domain and shall NOT be used in any
 * other domain or context.
 *
 * @see {@link MatterSpecification.v13.Namespace} § 12
 */
export const PowerSourceTag = SemanticNamespace({
    id: 0xf,

    tags: {
        /**
         * The Power Source cluster is related to power provided from an unknown source
         */
        Unknown: { id: 0x0, name: "Unknown" },

        /**
         * The Power Source cluster is related to power provided from the electrical grid
         *
         * Power Source clusters with this tag shall implement the WIRED feature.
         *
         * @see {@link MatterSpecification.v13.Namespace} § 12.1
         */
        Grid: { id: 0x1, name: "Grid" },

        /**
         * The Power Source cluster is related to power provided from a solar panel array
         *
         * Power Source clusters with this tag shall implement the WIRED feature.
         *
         * @see {@link MatterSpecification.v13.Namespace} § 12.2
         */
        Solar: { id: 0x2, name: "Solar" },

        /**
         * The Power Source cluster is related to power provided from a battery
         *
         * Power Source clusters with this tag shall implement the BAT feature.
         *
         * @see {@link MatterSpecification.v13.Namespace} § 12.3
         */
        Battery: { id: 0x3, name: "Battery" },

        /**
         * The Power Source cluster is related to power provided from an electric vehicle
         *
         * Power Source clusters with this tag shall implement the BAT feature.
         *
         * @see {@link MatterSpecification.v13.Namespace} § 12.4
         */
        Ev: { id: 0x4, name: "EV" }
    }
});