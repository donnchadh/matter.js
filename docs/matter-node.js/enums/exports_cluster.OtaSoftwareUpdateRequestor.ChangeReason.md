[@project-chip/matter-node.js](../README.md) / [Modules](../modules.md) / [exports/cluster](../modules/exports_cluster.md) / [OtaSoftwareUpdateRequestor](../modules/exports_cluster.OtaSoftwareUpdateRequestor.md) / ChangeReason

# Enumeration: ChangeReason

[exports/cluster](../modules/exports_cluster.md).[OtaSoftwareUpdateRequestor](../modules/exports_cluster.OtaSoftwareUpdateRequestor.md).ChangeReason

**`See`**

MatterSpecification.v11.Core § 11.19.7.4.15

## Table of contents

### Enumeration Members

- [DelayByProvider](exports_cluster.OtaSoftwareUpdateRequestor.ChangeReason.md#delaybyprovider)
- [Failure](exports_cluster.OtaSoftwareUpdateRequestor.ChangeReason.md#failure)
- [Success](exports_cluster.OtaSoftwareUpdateRequestor.ChangeReason.md#success)
- [TimeOut](exports_cluster.OtaSoftwareUpdateRequestor.ChangeReason.md#timeout)
- [Unknown](exports_cluster.OtaSoftwareUpdateRequestor.ChangeReason.md#unknown)

## Enumeration Members

### DelayByProvider

• **DelayByProvider** = ``4``

The reason for a state change is a request by the OTA Provider to wait.

#### Defined in

packages/matter.js/dist/esm/cluster/definitions/OtaSoftwareUpdateRequestorCluster.d.ts:132

___

### Failure

• **Failure** = ``2``

The reason for a state change is the failure of a prior operation.

#### Defined in

packages/matter.js/dist/esm/cluster/definitions/OtaSoftwareUpdateRequestorCluster.d.ts:124

___

### Success

• **Success** = ``1``

The reason for a state change is the success of a prior operation.

#### Defined in

packages/matter.js/dist/esm/cluster/definitions/OtaSoftwareUpdateRequestorCluster.d.ts:120

___

### TimeOut

• **TimeOut** = ``3``

The reason for a state change is a time-out.

#### Defined in

packages/matter.js/dist/esm/cluster/definitions/OtaSoftwareUpdateRequestorCluster.d.ts:128

___

### Unknown

• **Unknown** = ``0``

The reason for a state change is unknown.

#### Defined in

packages/matter.js/dist/esm/cluster/definitions/OtaSoftwareUpdateRequestorCluster.d.ts:116
