[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [cluster/export](../modules/cluster_export.md) / [EthernetNetworkDiagnostics](../modules/cluster_export.EthernetNetworkDiagnostics.md) / Cluster

# Interface: Cluster

[cluster/export](../modules/cluster_export.md).[EthernetNetworkDiagnostics](../modules/cluster_export.EthernetNetworkDiagnostics.md).Cluster

Ethernet Network Diagnostics

The Ethernet Network Diagnostics Cluster provides a means to acquire standardized diagnostics metrics that may
be used by a Node to assist a user or Administrator in diagnosing potential problems. The Ethernet Network
Diagnostics Cluster attempts to centralize all metrics that are relevant to a potential Ethernet connection to a
Node.

EthernetNetworkDiagnosticsCluster supports optional features that you can enable with the
EthernetNetworkDiagnosticsCluster.with() factory method.

**`See`**

MatterSpecification.v11.Core § 11.15

## Hierarchy

- [`Identity`](../modules/util_export.md#identity)\<typeof [`ClusterInstance`](../modules/cluster_export.EthernetNetworkDiagnostics.md#clusterinstance)\>

  ↳ **`Cluster`**

## Table of contents

### Properties

- [attributes](cluster_export.EthernetNetworkDiagnostics.Cluster.md#attributes)
- [base](cluster_export.EthernetNetworkDiagnostics.Cluster.md#base)
- [commands](cluster_export.EthernetNetworkDiagnostics.Cluster.md#commands)
- [events](cluster_export.EthernetNetworkDiagnostics.Cluster.md#events)
- [extensions](cluster_export.EthernetNetworkDiagnostics.Cluster.md#extensions)
- [features](cluster_export.EthernetNetworkDiagnostics.Cluster.md#features)
- [id](cluster_export.EthernetNetworkDiagnostics.Cluster.md#id)
- [name](cluster_export.EthernetNetworkDiagnostics.Cluster.md#name)
- [revision](cluster_export.EthernetNetworkDiagnostics.Cluster.md#revision)
- [supportedFeatures](cluster_export.EthernetNetworkDiagnostics.Cluster.md#supportedfeatures)
- [unknown](cluster_export.EthernetNetworkDiagnostics.Cluster.md#unknown)

### Methods

- [alter](cluster_export.EthernetNetworkDiagnostics.Cluster.md#alter)
- [enable](cluster_export.EthernetNetworkDiagnostics.Cluster.md#enable)
- [set](cluster_export.EthernetNetworkDiagnostics.Cluster.md#set)
- [with](cluster_export.EthernetNetworkDiagnostics.Cluster.md#with)

## Properties

### attributes

• **attributes**: [`Merge`](../modules/util_export.md#merge)\<\{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  }, [`GlobalAttributes`](../modules/cluster_export.md#globalattributes)\<\{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  }\>\>

#### Inherited from

Identity.attributes

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:86](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L86)

___

### base

• **base**: `undefined`

#### Inherited from

Identity.base

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:92](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L92)

___

### commands

• **commands**: `Object`

#### Inherited from

Identity.commands

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:89](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L89)

___

### events

• **events**: `Object`

#### Inherited from

Identity.events

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:90](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L90)

___

### extensions

• **extensions**: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }]

#### Inherited from

Identity.extensions

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:93](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L93)

___

### features

• **features**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `errorCounts` | [`BitFlag`](../modules/schema_export.md#bitflag) | ErrorCounts Node makes available the counts for the number of errors that have occurred during the reception and transmission of packets on the ethernet interface. |
| `packetCounts` | [`BitFlag`](../modules/schema_export.md#bitflag) | PacketCounts Node makes available the counts for the number of received and transmitted packets on the ethernet interface. |

#### Inherited from

Identity.features

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:84](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L84)

___

### id

• **id**: [`Branded`](../modules/util_export.md#branded)\<``55``, ``"ClusterId"``\>

#### Inherited from

Identity.id

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:81](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L81)

___

### name

• **name**: ``"EthernetNetworkDiagnostics"``

#### Inherited from

Identity.name

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:82](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L82)

___

### revision

• **revision**: ``1``

#### Inherited from

Identity.revision

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:83](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L83)

___

### supportedFeatures

• **supportedFeatures**: `Object`

#### Inherited from

Identity.supportedFeatures

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:85](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L85)

___

### unknown

• **unknown**: ``false``

#### Inherited from

Identity.unknown

#### Defined in

[packages/matter.js/src/cluster/ClusterType.ts:91](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/ClusterType.ts#L91)

## Methods

### alter

▸ **alter**\<`AlterationsT`\>(`alterations`): [`WithAlterations`](../modules/cluster_export.ElementModifier.md#withalterations)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `AlterationsT`\>

Modify elements using [ElementModifier.alter](../classes/cluster_export.ElementModifier-1.md#alter).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `AlterationsT` | extends [`Alterations`](../modules/cluster_export.ElementModifier.md#alterations)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `alterations` | `AlterationsT` |

#### Returns

[`WithAlterations`](../modules/cluster_export.ElementModifier.md#withalterations)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `AlterationsT`\>

#### Inherited from

Identity.alter

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:74](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L74)

___

### enable

▸ **enable**\<`FlagsT`\>(`flags`): [`WithFlags`](../modules/cluster_export.ElementModifier.md#withflags)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `FlagsT`\>

Modify elements using [ElementModifier.enable](../classes/cluster_export.ElementModifier-1.md#enable).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `FlagsT` | extends [`ElementFlags`](../modules/cluster_export.ElementModifier.md#elementflags)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `flags` | `FlagsT` |

#### Returns

[`WithFlags`](../modules/cluster_export.ElementModifier.md#withflags)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `FlagsT`\>

#### Inherited from

Identity.enable

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:88](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L88)

___

### set

▸ **set**\<`ValuesT`\>(`values`): [`WithValues`](../modules/cluster_export.ElementModifier.md#withvalues)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `ValuesT`\>

Modify elements using [ElementModifier.set](../classes/cluster_export.ElementModifier-1.md#set).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ValuesT` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `ValuesT` |

#### Returns

[`WithValues`](../modules/cluster_export.ElementModifier.md#withvalues)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `ValuesT`\>

#### Inherited from

Identity.set

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:81](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L81)

___

### with

▸ **with**\<`SelectionT`\>(`...selection`): [`WithFeatures`](../modules/cluster_export.ClusterComposer.md#withfeatures)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `SelectionT`\>

Select features using [ClusterComposer.compose](../classes/cluster_export.ClusterComposer-1.md#compose).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SelectionT` | extends [`FeatureSelection`](../modules/cluster_export.ClusterComposer.md#featureselection)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...selection` | `SelectionT` |

#### Returns

[`WithFeatures`](../modules/cluster_export.ClusterComposer.md#withfeatures)\<[`Of`](cluster_export.ClusterType.Of.md)\<\{ `attributes`: \{ `carrierDetect`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `fullDuplex`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| `boolean`, `any`\> ; `phyRate`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<``null`` \| [`PHYRate`](../enums/cluster_export.EthernetNetworkDiagnostics.PHYRate.md), `any`\> ; `timeSinceReset`: [`OptionalAttribute`](cluster_export.OptionalAttribute.md)\<`number` \| `bigint`, `any`\>  } ; `extensions`: readonly [\{ `component`: \{ `attributes`: \{ `packetRxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `packetTxCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = PacketCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `attributes`: \{ `collisionCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `overrunCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\> ; `txErrCount`: [`Attribute`](cluster_export.Attribute.md)\<`number` \| `bigint`, `any`\>  }  } = ErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `packetCounts`: ``true`` = true }  }, \{ `component`: \{ `commands`: \{ `resetCounts`: [`Command`](cluster_export.Command.md)\<`void`, `void`, `any`\>  }  } = PacketCountsOrErrorCountsComponent; `flags`: \{ `errorCounts`: ``true`` = true }  }] ; `features`: \{ `errorCounts`: [`BitFlag`](../modules/schema_export.md#bitflag) ; `packetCounts`: [`BitFlag`](../modules/schema_export.md#bitflag)  } ; `id`: ``55`` = 0x37; `name`: ``"EthernetNetworkDiagnostics"`` = "EthernetNetworkDiagnostics"; `revision`: ``1`` = 1 }\>, `SelectionT`\>

#### Inherited from

Identity.with

#### Defined in

[packages/matter.js/src/cluster/mutation/MutableCluster.ts:67](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/cluster/mutation/MutableCluster.ts#L67)
