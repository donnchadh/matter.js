[@project-chip/matter.js](../README.md) / [Modules](../modules.md) / [node/export](../modules/node_export.md) / [\<internal\>](../modules/node_export._internal_.md) / TransactionalInteractionServer

# Class: TransactionalInteractionServer

[node/export](../modules/node_export.md).[\<internal\>](../modules/node_export._internal_.md).TransactionalInteractionServer

Wire up an InteractionServer that initializes an InvocationContext earlier than the cluster API supports.

This is necessary for attributes because the ClusterServer attribute APIs are synchronous while transaction
management is asynchronous.

It's not necessary for command handling because that API is entirely async.  We do it here, however, just for the
sake of consistency.

This could be integrated directly into InteractionServer but this further refactoring is probably warranted there
regardless.  This keeps the touch light for now.

## Hierarchy

- [`InteractionServer`](protocol_interaction_export.InteractionServer-1.md)

  ↳ **`TransactionalInteractionServer`**

## Table of contents

### Constructors

- [constructor](node_export._internal_.TransactionalInteractionServer.md#constructor)

### Properties

- [#aclServer](node_export._internal_.TransactionalInteractionServer.md##aclserver)
- [#activity](node_export._internal_.TransactionalInteractionServer.md##activity)
- [#changeListener](node_export._internal_.TransactionalInteractionServer.md##changelistener)
- [#endpoint](node_export._internal_.TransactionalInteractionServer.md##endpoint)
- [#endpointStructure](node_export._internal_.TransactionalInteractionServer.md##endpointstructure)
- [#endpointStructure](node_export._internal_.TransactionalInteractionServer.md##endpointstructure-1)
- [#eventHandler](node_export._internal_.TransactionalInteractionServer.md##eventhandler)
- [#isClosing](node_export._internal_.TransactionalInteractionServer.md##isclosing)
- [#newActivityBlocked](node_export._internal_.TransactionalInteractionServer.md##newactivityblocked)
- [#nextSubscriptionId](node_export._internal_.TransactionalInteractionServer.md##nextsubscriptionid)
- [#subscriptionConfig](node_export._internal_.TransactionalInteractionServer.md##subscriptionconfig)
- [#subscriptionMap](node_export._internal_.TransactionalInteractionServer.md##subscriptionmap)

### Accessors

- [#tracer](node_export._internal_.TransactionalInteractionServer.md##tracer)
- [aclServer](node_export._internal_.TransactionalInteractionServer.md#aclserver)
- [isClosing](node_export._internal_.TransactionalInteractionServer.md#isclosing)

### Methods

- [#updateStructure](node_export._internal_.TransactionalInteractionServer.md##updatestructure)
- [[asyncDispose]](node_export._internal_.TransactionalInteractionServer.md#[asyncdispose])
- [blockNewActivity](node_export._internal_.TransactionalInteractionServer.md#blocknewactivity)
- [close](node_export._internal_.TransactionalInteractionServer.md#close)
- [getId](node_export._internal_.TransactionalInteractionServer.md#getid)
- [handleInvokeRequest](node_export._internal_.TransactionalInteractionServer.md#handleinvokerequest)
- [handleReadRequest](node_export._internal_.TransactionalInteractionServer.md#handlereadrequest)
- [handleSubscribeRequest](node_export._internal_.TransactionalInteractionServer.md#handlesubscriberequest)
- [handleTimedRequest](node_export._internal_.TransactionalInteractionServer.md#handletimedrequest)
- [handleWriteRequest](node_export._internal_.TransactionalInteractionServer.md#handlewriterequest)
- [invokeCommand](node_export._internal_.TransactionalInteractionServer.md#invokecommand)
- [onNewExchange](node_export._internal_.TransactionalInteractionServer.md#onnewexchange)
- [readAttribute](node_export._internal_.TransactionalInteractionServer.md#readattribute)
- [readEvent](node_export._internal_.TransactionalInteractionServer.md#readevent)
- [writeAttribute](node_export._internal_.TransactionalInteractionServer.md#writeattribute)

## Constructors

### constructor

• **new TransactionalInteractionServer**(`endpoint`): [`TransactionalInteractionServer`](node_export._internal_.TransactionalInteractionServer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `endpoint` | [`Endpoint`](endpoint_export.Endpoint-1.md)\<[`RootEndpoint`](../interfaces/node_export.ServerNode.RootEndpoint.md)\> |

#### Returns

[`TransactionalInteractionServer`](node_export._internal_.TransactionalInteractionServer.md)

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[constructor](protocol_interaction_export.InteractionServer-1.md#constructor)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:71](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L71)

## Properties

### #aclServer

• `Private` `Optional` **#aclServer**: [`AccessControlServer`](behavior_definitions_access_control_export.AccessControlServer-1.md)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:69](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L69)

___

### #activity

• `Private` **#activity**: [`NodeActivity`](behavior_cluster_export._internal_.NodeActivity-1.md)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:67](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L67)

___

### #changeListener

• `Private` **#changeListener**: (`type`: [`Change`](../enums/node_export._internal_.Change.md)) => `void`

#### Type declaration

▸ (`type`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`Change`](../enums/node_export._internal_.Change.md) |

##### Returns

`void`

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:65](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L65)

___

### #endpoint

• `Private` **#endpoint**: [`Endpoint`](endpoint_export.Endpoint-1.md)\<[`RootEndpoint`](../interfaces/node_export.ServerNode.RootEndpoint.md)\>

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:66](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L66)

___

### #endpointStructure

• `Private` **#endpointStructure**: [`InteractionEndpointStructure`](protocol_interaction_export.InteractionEndpointStructure.md)

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[#endpointStructure](protocol_interaction_export.InteractionServer-1.md##endpointstructure)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:64](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L64)

___

### #endpointStructure

• `Private` **#endpointStructure**: [`InteractionEndpointStructure`](protocol_interaction_export.InteractionEndpointStructure.md)

#### Inherited from

InteractionServer.#endpointStructure

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:165](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L165)

___

### #eventHandler

• `Private` **#eventHandler**: [`EventHandler`](protocol_interaction_export.EventHandler.md)\<`any`\>

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[#eventHandler](protocol_interaction_export.InteractionServer-1.md##eventhandler)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:170](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L170)

___

### #isClosing

• `Private` **#isClosing**: `boolean` = `false`

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[#isClosing](protocol_interaction_export.InteractionServer-1.md##isclosing)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:168](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L168)

___

### #newActivityBlocked

• `Private` **#newActivityBlocked**: `boolean` = `false`

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:68](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L68)

___

### #nextSubscriptionId

• `Private` **#nextSubscriptionId**: `number`

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[#nextSubscriptionId](protocol_interaction_export.InteractionServer-1.md##nextsubscriptionid)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:166](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L166)

___

### #subscriptionConfig

• `Private` **#subscriptionConfig**: [`Configuration`](../interfaces/node_export._internal_.SubscriptionOptions.Configuration.md)

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[#subscriptionConfig](protocol_interaction_export.InteractionServer-1.md##subscriptionconfig)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:169](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L169)

___

### #subscriptionMap

• `Private` `Readonly` **#subscriptionMap**: `Map`\<`number`, [`SubscriptionHandler`](protocol_interaction_export.SubscriptionHandler.md)\>

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[#subscriptionMap](protocol_interaction_export.InteractionServer-1.md##subscriptionmap)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:167](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L167)

## Accessors

### #tracer

• `get` **#tracer**(): `undefined` \| [`ActionTracer`](node_export._internal_.ActionTracer-1.md)

#### Returns

`undefined` \| [`ActionTracer`](node_export._internal_.ActionTracer-1.md)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:264](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L264)

___

### aclServer

• `get` **aclServer**(): [`AccessControlServer`](behavior_definitions_access_control_export.AccessControlServer-1.md)

#### Returns

[`AccessControlServer`](behavior_definitions_access_control_export.AccessControlServer-1.md)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:128](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L128)

___

### isClosing

• `get` **isClosing**(): `boolean`

#### Returns

`boolean`

#### Inherited from

InteractionServer.isClosing

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:188](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L188)

## Methods

### #updateStructure

▸ **#updateStructure**(): `void`

#### Returns

`void`

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:270](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L270)

___

### [asyncDispose]

▸ **[asyncDispose]**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:101](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L101)

___

### blockNewActivity

▸ **blockNewActivity**(): `void`

#### Returns

`void`

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:107](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L107)

___

### close

▸ **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[close](protocol_interaction_export.InteractionServer-1.md#close)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:1236](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L1236)

___

### getId

▸ **getId**(): `number`

#### Returns

`number`

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[getId](protocol_interaction_export.InteractionServer-1.md#getid)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:184](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L184)

___

### handleInvokeRequest

▸ **handleInvokeRequest**(`exchange`, `«destructured»`, `message`): `Promise`\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `invokeResponses`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `command`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `commandFields`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `commandPath`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<...\>  }\>\> ; `status`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `commandPath`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<...\> ; `status`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<...\>  }\>\>  }\>[]\> ; `suppressResponse`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\>  }\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `«destructured»` | [`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `invokeRequests`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `commandFields`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TlvStream`](../modules/tlv_export.md#tlvstream)\> ; `commandPath`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterId`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `commandId`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`CommandId`](../modules/datatype_export.md#commandid)\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\>  }\>\>  }\>[]\> ; `suppressResponse`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\> ; `timedRequest`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\>  }\> |
| `message` | [`Message`](../interfaces/codec_export.Message.md) |

#### Returns

`Promise`\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `invokeResponses`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `command`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `commandFields`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `commandPath`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<...\>  }\>\> ; `status`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `commandPath`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<...\> ; `status`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<...\>  }\>\>  }\>[]\> ; `suppressResponse`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\>  }\>\>

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[handleInvokeRequest](protocol_interaction_export.InteractionServer-1.md#handleinvokerequest)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:1023](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L1023)

___

### handleReadRequest

▸ **handleReadRequest**(`exchange`, `«destructured»`, `message`): `Promise`\<[`DataReportPayload`](../modules/protocol_interaction_export.md#datareportpayload)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `«destructured»` | [`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeRequests`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`AttributeId`](../modules/datatype_export.md#attributeid)\> ; `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `enableTagCompression`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `listIndex`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<``null`` \| `number`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[]\> ; `dataVersionFilters`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `dataVersion`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `path`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterId`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `endpointId`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>\>  }\>[]\> ; `eventFilters`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `eventMin`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number` \| `bigint`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[]\> ; `eventRequests`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `eventId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EventId`](../modules/datatype_export.md#eventid)\> ; `isUrgent`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[]\> ; `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `isFabricFiltered`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\>  }\> |
| `message` | [`Message`](../interfaces/codec_export.Message.md) |

#### Returns

`Promise`\<[`DataReportPayload`](../modules/protocol_interaction_export.md#datareportpayload)\>

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[handleReadRequest](protocol_interaction_export.InteractionServer-1.md#handlereadrequest)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:199](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L199)

___

### handleSubscribeRequest

▸ **handleSubscribeRequest**(`exchange`, `«destructured»`, `messenger`, `message`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `«destructured»` | [`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeRequests`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`AttributeId`](../modules/datatype_export.md#attributeid)\> ; `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `enableTagCompression`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `listIndex`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<``null`` \| `number`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[]\> ; `dataVersionFilters`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `dataVersion`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `path`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterId`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `endpointId`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>\>  }\>[]\> ; `eventFilters`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `eventMin`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number` \| `bigint`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[]\> ; `eventRequests`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `eventId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EventId`](../modules/datatype_export.md#eventid)\> ; `isUrgent`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[]\> ; `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `isFabricFiltered`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\> ; `keepSubscriptions`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\> ; `maxIntervalCeilingSeconds`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `minIntervalFloorSeconds`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\>  }\> |
| `messenger` | [`InteractionServerMessenger`](protocol_interaction_export.InteractionServerMessenger.md) |
| `message` | [`Message`](../interfaces/codec_export.Message.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[handleSubscribeRequest](protocol_interaction_export.InteractionServer-1.md#handlesubscriberequest)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:854](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L854)

___

### handleTimedRequest

▸ **handleTimedRequest**(`exchange`, `«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `«destructured»` | [`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `timeout`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\>  }\> |

#### Returns

`void`

#### Inherited from

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[handleTimedRequest](protocol_interaction_export.InteractionServer-1.md#handletimedrequest)

#### Defined in

[packages/matter.js/src/protocol/interaction/InteractionServer.ts:1224](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/protocol/interaction/InteractionServer.ts#L1224)

___

### handleWriteRequest

▸ **handleWriteRequest**(`exchange`, `writeRequest`, `message`): `Promise`\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `writeResponses`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `path`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `enableTagCompression`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `listIndex`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\>  }\>\> ; `status`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterStatus`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `status`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\>  }\>\>  }\>[]\>  }\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `writeRequest` | [`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `moreChunkedMessages`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `suppressResponse`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `timedRequest`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`boolean`\> ; `writeRequests`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `data`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TlvStream`](../modules/tlv_export.md#tlvstream)\> ; `dataVersion`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`number`\> ; `path`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`AttributeId`](../modules/datatype_export.md#attributeid)\> ; `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`ClusterId`](../modules/datatype_export.md#clusterid)\> ; `enableTagCompression`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<`boolean`\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`EndpointNumber`](../modules/datatype_export.md#endpointnumber)\> ; `listIndex`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<... \| ...\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>\>  }\>[]\>  }\> |
| `message` | [`Message`](../interfaces/codec_export.Message.md) |

#### Returns

`Promise`\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `interactionModelRevision`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number`\> ; `writeResponses`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `path`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `attributeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `clusterId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `enableTagCompression`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `endpointId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `listIndex`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\>  }\>\> ; `status`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<[`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `clusterStatus`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\> ; `status`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<...\>  }\>\>  }\>[]\>  }\>\>

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[handleWriteRequest](protocol_interaction_export.InteractionServer-1.md#handlewriterequest)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:191](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L191)

___

### invokeCommand

▸ **invokeCommand**(`path`, `command`, `exchange`, `commandFields`, `message`, `endpoint`, `timed?`): `Promise`\<\{ `clusterCode?`: `number` ; `code`: [`StatusCode`](../enums/protocol_interaction_export.StatusCode.md) ; `response`: [`TlvStream`](../modules/tlv_export.md#tlvstream) ; `responseId`: [`CommandId`](../modules/datatype_export.md#commandid)  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | [`CommandPath`](../interfaces/protocol_interaction_export.CommandPath.md) | `undefined` |
| `command` | [`CommandServer`](cluster_export.CommandServer.md)\<`any`, `any`\> | `undefined` |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> | `undefined` |
| `commandFields` | `any` | `undefined` |
| `message` | [`Message`](../interfaces/codec_export.Message.md) | `undefined` |
| `endpoint` | [`EndpointInterface`](../interfaces/endpoint_export.EndpointInterface.md) | `undefined` |
| `timed` | `boolean` | `false` |

#### Returns

`Promise`\<\{ `clusterCode?`: `number` ; `code`: [`StatusCode`](../enums/protocol_interaction_export.StatusCode.md) ; `response`: [`TlvStream`](../modules/tlv_export.md#tlvstream) ; `responseId`: [`CommandId`](../modules/datatype_export.md#commandid)  }\>

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[invokeCommand](protocol_interaction_export.InteractionServer-1.md#invokecommand)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:233](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L233)

___

### onNewExchange

▸ **onNewExchange**(`exchange`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |

#### Returns

`Promise`\<`void`\>

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[onNewExchange](protocol_interaction_export.InteractionServer-1.md#onnewexchange)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:111](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L111)

___

### readAttribute

▸ **readAttribute**(`path`, `attribute`, `exchange`, `fabricFiltered`, `message`, `endpoint`): `Promise`\<\{ `value`: `any` ; `version`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`AttributePath`](../interfaces/protocol_interaction_export.AttributePath.md) |
| `attribute` | [`AnyAttributeServer`](../modules/cluster_export.md#anyattributeserver)\<`any`\> |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `fabricFiltered` | `boolean` |
| `message` | [`Message`](../interfaces/codec_export.Message.md) |
| `endpoint` | [`EndpointInterface`](../interfaces/endpoint_export.EndpointInterface.md) |

#### Returns

`Promise`\<\{ `value`: `any` ; `version`: `number`  }\>

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[readAttribute](protocol_interaction_export.InteractionServer-1.md#readattribute)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:139](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L139)

___

### readEvent

▸ **readEvent**(`path`, `eventFilters`, `event`, `exchange`, `fabricFiltered`, `message`, `endpoint`): `Promise`\<[`EventStorageData`](../interfaces/protocol_interaction_export.EventStorageData.md)\<`any`\>[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`EventPath`](../interfaces/protocol_interaction_export.EventPath.md) |
| `eventFilters` | `undefined` \| [`TypeFromFields`](../modules/tlv_export.md#typefromfields)\<\{ `eventMin`: [`FieldType`](../interfaces/tlv_export.FieldType.md)\<`number` \| `bigint`\> ; `nodeId`: [`OptionalFieldType`](../interfaces/tlv_export.OptionalFieldType.md)\<[`NodeId`](../modules/datatype_export.md#nodeid)\>  }\>[] |
| `event` | [`EventServer`](cluster_export.EventServer.md)\<`any`, `any`\> |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> |
| `fabricFiltered` | `boolean` |
| `message` | [`Message`](../interfaces/codec_export.Message.md) |
| `endpoint` | [`EndpointInterface`](../interfaces/endpoint_export.EndpointInterface.md) |

#### Returns

`Promise`\<[`EventStorageData`](../interfaces/protocol_interaction_export.EventStorageData.md)\<`any`\>[]\>

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[readEvent](protocol_interaction_export.InteractionServer-1.md#readevent)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:161](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L161)

___

### writeAttribute

▸ **writeAttribute**(`path`, `attribute`, `value`, `exchange`, `message`, `endpoint`, `timed?`, `isListWrite?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | [`AttributePath`](../interfaces/protocol_interaction_export.AttributePath.md) | `undefined` |
| `attribute` | [`AttributeServer`](cluster_export.AttributeServer.md)\<`any`\> | `undefined` |
| `value` | `any` | `undefined` |
| `exchange` | [`MessageExchange`](protocol_export.MessageExchange.md)\<[`MatterDevice`](behavior_cluster_export._internal_.MatterDevice.md)\> | `undefined` |
| `message` | [`Message`](../interfaces/codec_export.Message.md) | `undefined` |
| `endpoint` | [`EndpointInterface`](../interfaces/endpoint_export.EndpointInterface.md) | `undefined` |
| `timed` | `boolean` | `false` |
| `isListWrite?` | `boolean` | `undefined` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[InteractionServer](protocol_interaction_export.InteractionServer-1.md).[writeAttribute](protocol_interaction_export.InteractionServer-1.md#writeattribute)

#### Defined in

[packages/matter.js/src/node/server/TransactionalInteractionServer.ts:206](https://github.com/project-chip/matter.js/blob/5f71eedebdb9fa54338bde320c311bb359b7455d/packages/matter.js/src/node/server/TransactionalInteractionServer.ts#L206)
