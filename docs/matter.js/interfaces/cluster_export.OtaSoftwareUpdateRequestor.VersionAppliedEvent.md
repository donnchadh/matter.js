[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [cluster/export](../modules/cluster_export.md) / [OtaSoftwareUpdateRequestor](../modules/cluster_export.OtaSoftwareUpdateRequestor.md) / VersionAppliedEvent

# Interface: VersionAppliedEvent

[cluster/export](../modules/cluster_export.md).[OtaSoftwareUpdateRequestor](../modules/cluster_export.OtaSoftwareUpdateRequestor.md).VersionAppliedEvent

Body of the OtaSoftwareUpdateRequestor versionApplied event

**`See`**

MatterSpecification.v11.Core § 11.19.7.7.6

## Hierarchy

- [`TypeFromSchema`](../modules/tlv_export.md#typefromschema)\<typeof [`TlvVersionAppliedEvent`](../modules/cluster_export.OtaSoftwareUpdateRequestor.md#tlvversionappliedevent)\>

  ↳ **`VersionAppliedEvent`**

## Table of contents

### Properties

- [productId](cluster_export.OtaSoftwareUpdateRequestor.VersionAppliedEvent.md#productid)
- [softwareVersion](cluster_export.OtaSoftwareUpdateRequestor.VersionAppliedEvent.md#softwareversion)

## Properties

### productId

• **productId**: `number`

#### Inherited from

TypeFromSchema.productId

#### Defined in

[packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateRequestorCluster.ts:201](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateRequestorCluster.ts#L201)

___

### softwareVersion

• **softwareVersion**: `number`

#### Inherited from

TypeFromSchema.softwareVersion

#### Defined in

[packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateRequestorCluster.ts:200](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateRequestorCluster.ts#L200)
