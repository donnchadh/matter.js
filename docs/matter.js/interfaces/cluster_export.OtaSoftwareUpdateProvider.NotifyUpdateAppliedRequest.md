[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [cluster/export](../modules/cluster_export.md) / [OtaSoftwareUpdateProvider](../modules/cluster_export.OtaSoftwareUpdateProvider.md) / NotifyUpdateAppliedRequest

# Interface: NotifyUpdateAppliedRequest

[cluster/export](../modules/cluster_export.md).[OtaSoftwareUpdateProvider](../modules/cluster_export.OtaSoftwareUpdateProvider.md).NotifyUpdateAppliedRequest

Input to the OtaSoftwareUpdateProvider notifyUpdateApplied command

**`See`**

MatterSpecification.v11.Core § 11.19.6.5.25

## Hierarchy

- [`TypeFromSchema`](../modules/tlv_export.md#typefromschema)\<typeof [`TlvNotifyUpdateAppliedRequest`](../modules/cluster_export.OtaSoftwareUpdateProvider.md#tlvnotifyupdateappliedrequest)\>

  ↳ **`NotifyUpdateAppliedRequest`**

## Table of contents

### Properties

- [softwareVersion](cluster_export.OtaSoftwareUpdateProvider.NotifyUpdateAppliedRequest.md#softwareversion)
- [updateToken](cluster_export.OtaSoftwareUpdateProvider.NotifyUpdateAppliedRequest.md#updatetoken)

## Properties

### softwareVersion

• **softwareVersion**: `number`

#### Inherited from

TypeFromSchema.softwareVersion

#### Defined in

[packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateProviderCluster.ts:180](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateProviderCluster.ts#L180)

___

### updateToken

• **updateToken**: `Uint8Array`

#### Inherited from

TypeFromSchema.updateToken

#### Defined in

[packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateProviderCluster.ts:179](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/OtaSoftwareUpdateProviderCluster.ts#L179)
