[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [cluster/export](../modules/cluster_export.md) / [ApplicationBasic](../modules/cluster_export.ApplicationBasic.md) / ApplicationStruct

# Interface: ApplicationStruct

[cluster/export](../modules/cluster_export.md).[ApplicationBasic](../modules/cluster_export.ApplicationBasic.md).ApplicationStruct

This indicates a global identifier for an Application given a catalog.

**`See`**

MatterSpecification.v11.Cluster § 6.3.4.1

## Hierarchy

- [`TypeFromSchema`](../modules/tlv_export.md#typefromschema)\<typeof [`TlvApplicationStruct`](../modules/cluster_export.ApplicationBasic.md#tlvapplicationstruct)\>

  ↳ **`ApplicationStruct`**

## Table of contents

### Properties

- [applicationId](cluster_export.ApplicationBasic.ApplicationStruct.md#applicationid)
- [catalogVendorId](cluster_export.ApplicationBasic.ApplicationStruct.md#catalogvendorid)

## Properties

### applicationId

• **applicationId**: `string`

This shall indicate the application identifier, expressed as a string, such as "123456-5433", "PruneVideo"
or "Company X". This field shall be unique within a catalog.

For the DIAL registry catalog, this value shall be the DIAL prefix.

**`See`**

MatterSpecification.v11.Cluster § 6.3.4.1.2

#### Inherited from

TypeFromSchema.applicationId

#### Defined in

[packages/matter.js/src/cluster/definitions/ApplicationBasicCluster.ts:47](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/ApplicationBasicCluster.ts#L47)

___

### catalogVendorId

• **catalogVendorId**: `number`

This shall indicate the Connectivity Standards Alliance issued vendor ID for the catalog. The DIAL registry
shall use value 0x0000.

It is assumed that Content App Platform providers (see Video Player Architecture section in [MatterDevLib] )
will have their own catalog vendor ID (set to their own Vendor ID) and will assign an ApplicationID to each
Content App.

**`See`**

MatterSpecification.v11.Cluster § 6.3.4.1.1

#### Inherited from

TypeFromSchema.catalogVendorId

#### Defined in

[packages/matter.js/src/cluster/definitions/ApplicationBasicCluster.ts:37](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/definitions/ApplicationBasicCluster.ts#L37)
