/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

/*** THIS FILE IS GENERATED, DO NOT EDIT ***/

/**
 * Priority
 *
 * This is an enumeration of priority used to tag events and possibly other data. The data type does not define any
 * particular ordering among the values. Specific uses of the data type may assign semantics to the values that imply an
 * ordering relationship.
 *
 * @see {@link MatterSpecification.v141.Core} § 7.19.2.17
 */
export enum Priority {
    /**
     * Information for engineering debugging/troubleshooting
     */
    Debug = 0,

    /**
     * Information that either drives customer facing features or provides insights into device functions that are used
     * to drive analytics use cases
     */
    Info = 1,

    /**
     * Information or notification that impacts safety, a critical function, or ongoing reliable operation of the node
     * or application supported on an endpoint.
     */
    Critical = 2
}
