/**
 * @license
 * Copyright 2022-2025 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdministratorCommissioning, BasicInformation, DescriptorCluster, OperationalCredentials } from "#clusters";
import {
    AsyncObservable,
    AtLeastOne,
    BasicSet,
    Construction,
    Crypto,
    Diagnostic,
    ImplementationError,
    InternalError,
    Logger,
    MatterError,
    Observable,
    Time,
    Timer,
} from "#general";
import {
    AttributeClientValues,
    ChannelStatusResponseError,
    ClusterClient,
    ClusterClientObj,
    DecodedAttributeReportValue,
    DecodedEventReportValue,
    InteractionClient,
    NodeDiscoveryType,
    NodeSession,
    PaseClient,
    UnknownNodeError,
    structureReadAttributeDataToClusterObject,
} from "#protocol";
import {
    AttributeId,
    Attributes,
    ClusterId,
    ClusterType,
    CommissioningFlowType,
    DiscoveryCapabilitiesSchema,
    EndpointNumber,
    EventId,
    ManualPairingCodeCodec,
    NodeId,
    QrPairingCodeCodec,
    StatusCode,
    StatusResponseError,
    getClusterById,
} from "#types";
import { AcceptedCommandList, AttributeList, ClusterRevision, FeatureMap } from "@matter/model";
import { ClusterServer } from "../cluster/server/ClusterServer.js";
import { AttributeInitialValues, ClusterServerObj, isClusterServer } from "../cluster/server/ClusterServerTypes.js";
import { CommissioningController } from "../CommissioningController.js";
import { Aggregator } from "./Aggregator.js";
import { ComposedDevice } from "./ComposedDevice.js";
import { PairedDevice, RootEndpoint } from "./Device.js";
import { DeviceInformation, DeviceInformationData } from "./DeviceInformation.js";
import {
    DeviceTypeDefinition,
    DeviceTypes,
    UnknownDeviceType,
    getDeviceTypeDefinitionFromModelByCode,
} from "./DeviceTypes.js";
import { Endpoint } from "./Endpoint.js";
import { asClusterClientInternal, isClusterClient } from "./TypeHelpers.js";

const logger = Logger.get("PairedNode");

/** Delay after receiving a changed partList  from a device to update the device structure */
const STRUCTURE_UPDATE_TIMEOUT_MS = 5_000; // 5 seconds

/** Delay after a disconnect to try to reconnect to the device */
const RECONNECT_DELAY_MS = 15_000; // 15 seconds

/** Delay after a shutdown event to try to reconnect to the device */
const RECONNECT_DELAY_AFTER_SHUTDOWN_MS = 30_000; // 30 seconds, to give device time to restart and maybe inform us about

/** Maximum delay after a disconnect to try to reconnect to the device */
const RECONNECT_MAX_DELAY_MS = 600_000; // 10 minutes

/**
 * Delay after a new session was opened by the device while in discovery state.
 * This usually happens for devices that support persisted subscriptions.
 */
const NEW_SESSION_WHILE_DISCOVERY_RECONNECT_DELAY_MS = 5_000;

export enum NodeStates {
    /**
     * Node seems active nd last communications were successful and subscription updates were received and all data is
     * up-to-date.
     */
    Connected = 0,

    /**
     * Node is disconnected. This means that the node was not connected so far or the developer disconnected it by API
     * call or the node is removed. A real disconnection can not be detected because the main Matter protocol uses UDP.
     * Data are stale and interactions will most likely return an error.
     */
    Disconnected = 1,

    /**
     * Node is reconnecting. This means that former communications failed, and we are trying to reach the device on
     * known addresses. Data are stale. It is yet unknown if the reconnection is successful. */
    Reconnecting = 2,

    /**
     * The node seems offline because communication was not possible or is just initialized. The controller is now
     * waiting for a MDNS announcement and tries every 10 minutes to reconnect.
     */
    WaitingForDeviceDiscovery = 3,
}

/** @deprecated */
export enum NodeStateInformation {
    /**
     * Node seems active nd last communications were successful and subscription updates were received and all data is
     * up-to-date.
     */
    Connected = 0,

    /**
     * Node is disconnected. This means that the node was not connected so far or the developer disconnected it by API
     * call or the node is removed. A real disconnection can not be detected because the main Matter protocol uses UDP.
     * Data are stale and interactions will most likely return an error.
     */
    Disconnected = 1,

    /**
     * Node is reconnecting. This means that former communications failed, and we are trying to reach the device on
     * known addresses. Data are stale. It is yet unknown if the reconnection is successful. */
    Reconnecting = 2,

    /**
     * The node seems offline because communication was not possible or is just initialized. The controller is now
     * waiting for a MDNS announcement and tries every 10 minutes to reconnect.
     */
    WaitingForDeviceDiscovery = 3,

    /**
     * Node structure has changed (Endpoints got added or also removed). Data are up-to-date.
     * This State information will only be fired when the subscribeAllAttributesAndEvents option is set to true.
     */
    StructureChanged = 4,

    /**
     * The node was just Decommissioned. This is a final state.
     */
    Decommissioned = 5,
}

export type CommissioningControllerNodeOptions = {
    /**
     * Unless set to false the node will be automatically connected when initialized. When set to false use
     * connect() to connect to the node at a later timepoint.
     */
    readonly autoConnect?: boolean;

    /**
     * Unless set to false all events and attributes are subscribed and value changes are reflected in the ClusterClient
     * instances. With this reading attributes values is mostly looked up in the locally cached data.
     * Additionally more features like reaction on shutdown event or endpoint structure changes (for bridges) are done
     * internally automatically.
     */
    readonly autoSubscribe?: boolean;

    /**
     * Minimum subscription interval when values are changed. Default it is set to 1s.
     * If the device is intermittently connected, the minimum interval is always set to 0s because required by Matter specs.
     */
    readonly subscribeMinIntervalFloorSeconds?: number;

    /**
     * Maximum subscription interval when values are changed. This is also used as a keepalive mechanism to validate
     * that the device is still available. matter.js tries to set meaningful values based on the device type, connection
     * type and other details. So ideally do not set this parameter unless you know it better.
     */
    readonly subscribeMaxIntervalCeilingSeconds?: number;

    /**
     * Optional additional callback method which is called for each Attribute change reported by the device. Use this
     * if subscribing to all relevant attributes is too much effort.
     * @deprecated Please use the events.attributeChanged observable instead.
     */
    readonly attributeChangedCallback?: (nodeId: NodeId, data: DecodedAttributeReportValue<any>) => void;

    /**
     * Optional additional callback method which is called for each Event reported by the device. Use this if
     * subscribing to all relevant events is too much effort.
     * @deprecated Please use the events.eventTriggered observable instead.
     */
    readonly eventTriggeredCallback?: (nodeId: NodeId, data: DecodedEventReportValue<any>) => void;

    /**
     * Optional callback method which is called when the state of the node changes. This can be used to detect when
     * the node goes offline or comes back online.
     * @deprecated Please use the events.nodeStateChanged observable and the extra events for structureCHanged and
     *  decomissioned instead.
     */
    readonly stateInformationCallback?: (nodeId: NodeId, state: NodeStateInformation) => void;
};

export class NodeNotConnectedError extends MatterError {}

interface SubscriptionHandlerCallbacks {
    attributeListener: (data: DecodedAttributeReportValue<any>, valueChanged?: boolean, oldValue?: unknown) => void;
    eventListener: (data: DecodedEventReportValue<any>) => void;
    updateTimeoutHandler: Timer.Callback;
    subscriptionAlive: () => void;
}

/**
 * Class to represents one node that is paired/commissioned with the matter.js Controller. Instances are returned by
 * the CommissioningController on commissioning or when connecting.
 */
export class PairedNode {
    readonly #endpoints = new Map<EndpointNumber, Endpoint>();
    #interactionClient: InteractionClient;
    #reconnectDelayTimer?: Timer;
    #newChannelReconnectDelayTimer = Time.getTimer(
        "New Channel Reconnect Delay",
        NEW_SESSION_WHILE_DISCOVERY_RECONNECT_DELAY_MS,
        () => {
            if (
                this.#connectionState === NodeStates.WaitingForDeviceDiscovery ||
                this.#connectionState === NodeStates.Reconnecting
            ) {
                logger.info(
                    `Node ${this.nodeId}: Still not connected after new session establishment, trying to reconnect ...`,
                );
                // Try last known address first to speed up reconnection
                this.#setConnectionState(NodeStates.Reconnecting);
                this.#scheduleReconnect(0);
            }
        },
    );
    #reconnectErrorCount = 0;
    readonly #updateEndpointStructureTimer = Time.getTimer(
        "Endpoint structure update",
        STRUCTURE_UPDATE_TIMEOUT_MS,
        () =>
            this.#updateEndpointStructure().catch(error =>
                logger.warn(`Node ${this.nodeId}: Error updating endpoint structure`, error),
            ),
    );
    #connectionState: NodeStates = NodeStates.Disconnected;
    #reconnectionInProgress = false;
    #localInitializationDone = false;
    #remoteInitializationInProgress = false;
    #remoteInitializationDone = false;
    #nodeDetails: DeviceInformation;
    #construction: Construction<PairedNode>;
    #clientReconnectInProgress = false;
    #currentSubscriptionHandler?: SubscriptionHandlerCallbacks;
    readonly #commissioningController: CommissioningController;
    #options: CommissioningControllerNodeOptions;
    readonly #reconnectFunc: (discoveryType?: NodeDiscoveryType, noForcedConnection?: boolean) => Promise<void>;
    #currentSubscriptionIntervalS?: number;
    #crypto: Crypto;

    readonly events = {
        /**
         * Emitted when the node is initialized from local data. These data usually are stale, but you can still already
         * use the node to interact with the device. If no local data are available this event will be emitted together
         * with the initializedFromRemote event.
         */
        initialized: AsyncObservable<[details: DeviceInformationData]>(),

        /**
         * Emitted when the node is fully initialized from remote and all attributes and events are subscribed.
         * This event can also be awaited if code needs to be blocked until the node is fully initialized.
         */
        initializedFromRemote: AsyncObservable<[details: DeviceInformationData]>(),

        /** Emitted when the state of the node changes. */
        stateChanged: Observable<[nodeState: NodeStates]>(),

        /**
         * Emitted when an attribute value changes. If the oldValue is undefined then no former value was known.
         */
        attributeChanged: Observable<[data: DecodedAttributeReportValue<any>, oldValue: any]>(),

        /** Emitted when an event is triggered. */
        eventTriggered: Observable<[DecodedEventReportValue<any>]>(),

        /** Emitted when the structure of the node changes (Endpoints got added or also removed). */
        structureChanged: Observable<[void]>(),

        /** Emitted when the node is decommissioned. */
        decommissioned: Observable<[void]>(),

        /** Emitted when a subscription alive trigger is received (max interval trigger or any data update) */
        connectionAlive: Observable<[void]>(),
    };

    static async create(
        nodeId: NodeId,
        commissioningController: CommissioningController,
        options: CommissioningControllerNodeOptions = {},
        knownNodeDetails: DeviceInformationData,
        interactionClient: InteractionClient,
        reconnectFunc: (discoveryType?: NodeDiscoveryType, noForcedConnection?: boolean) => Promise<void>,
        assignDisconnectedHandler: (handler: () => Promise<void>) => void,
        sessions: BasicSet<NodeSession>,
        crypto: Crypto,
        storedAttributeData?: DecodedAttributeReportValue<any>[],
    ): Promise<PairedNode> {
        const node = new PairedNode(
            nodeId,
            commissioningController,
            options,
            knownNodeDetails,
            interactionClient,
            reconnectFunc,
            assignDisconnectedHandler,
            sessions,
            crypto,
            storedAttributeData,
        );
        await node.construction;
        return node;
    }

    constructor(
        readonly nodeId: NodeId,
        commissioningController: CommissioningController,
        options: CommissioningControllerNodeOptions = {},
        knownNodeDetails: DeviceInformationData,
        interactionClient: InteractionClient,
        reconnectFunc: (discoveryType?: NodeDiscoveryType, noForcedConnection?: boolean) => Promise<void>,
        assignDisconnectedHandler: (handler: () => Promise<void>) => void,
        sessions: BasicSet<NodeSession, NodeSession>,
        crypto: Crypto,
        storedAttributeData?: DecodedAttributeReportValue<any>[],
    ) {
        assignDisconnectedHandler(async () => {
            logger.info(
                `Node ${this.nodeId}: Session disconnected${
                    this.#connectionState !== NodeStates.Disconnected ? ", trying to reconnect ..." : ""
                }`,
            );
            if (this.#connectionState === NodeStates.Connected) {
                this.#scheduleReconnect();
            }
        });

        this.#commissioningController = commissioningController;
        this.#options = options;
        this.#reconnectFunc = reconnectFunc;
        this.#crypto = crypto;

        this.#interactionClient = interactionClient;
        if (this.#interactionClient.isReconnectable) {
            this.#interactionClient.channelUpdated.on(() => {
                // When we had planned a reconnect because of a disconnect we can stop the timer now
                if (
                    this.#reconnectDelayTimer?.isRunning &&
                    !this.#clientReconnectInProgress &&
                    !this.#reconnectionInProgress &&
                    this.#connectionState === NodeStates.Reconnecting
                ) {
                    logger.info(`Node ${this.nodeId}: Got a reconnect, so reconnection not needed anymore ...`);
                    this.#reconnectDelayTimer?.stop();
                    this.#reconnectDelayTimer = undefined;
                    this.#setConnectionState(NodeStates.Connected);
                }
            });
        } else {
            logger.warn(
                `Node ${this.nodeId}: InteractionClient is not reconnectable, no automatic reconnection will happen in case of errors.`,
            );
        }
        this.#nodeDetails = new DeviceInformation(nodeId, knownNodeDetails);
        logger.info(`Node ${this.nodeId}: Created paired node with device data`, this.#nodeDetails.meta);

        sessions.added.on(session => {
            if (
                session.isInitiator || // If we initiated the session we do not need to react on it
                session.peerNodeId !== this.nodeId || // no session for this node
                this.state !== NodeStates.WaitingForDeviceDiscovery
            ) {
                return;
            }
            this.#newChannelReconnectDelayTimer.stop().start();
        });

        this.#construction = Construction(this, async () => {
            // We try to initialize from stored data already
            if (storedAttributeData !== undefined) {
                await this.#initializeFromStoredData(storedAttributeData);
            }

            if (this.#options.autoConnect !== false) {
                // This kicks of the remote initialization and automatic reconnection handling if it can not be connected
                this.#initialize().catch(error => {
                    logger.info(`Node ${nodeId}: Error during remote initialization`, error);
                    if (this.state !== NodeStates.Disconnected) {
                        this.#setConnectionState(NodeStates.WaitingForDeviceDiscovery);
                        this.#scheduleReconnect();
                    }
                });
            }
        });
    }

    get construction() {
        return this.#construction;
    }

    get isConnected() {
        return this.#connectionState === NodeStates.Connected;
    }

    /** Returns the Node connection state. */
    get state() {
        return this.#connectionState;
    }

    /** Returns the BasicInformation cluster metadata collected from the device. */
    get basicInformation() {
        return this.#nodeDetails.basicInformation;
    }

    /** Returns the general capability metadata collected from the device. */
    get deviceInformation() {
        return this.#nodeDetails.meta;
    }

    /** Is the Node fully initialized with formerly stored subscription data? False when the node was never connected so far. */
    get localInitializationDone() {
        return this.#localInitializationDone;
    }

    /** Is the Node fully initialized with remote subscription or read data? */
    get remoteInitializationDone() {
        return this.#remoteInitializationDone;
    }

    /** Is the Node initialized - locally or remotely? */
    get initialized() {
        return this.#remoteInitializationDone || this.#localInitializationDone;
    }

    /** If a subscription is established then this is the interval in seconds, otherwise undefined */
    get currentSubscriptionIntervalSeconds() {
        return this.#currentSubscriptionIntervalS;
    }

    #invalidateSubscriptionHandler() {
        if (this.#currentSubscriptionHandler !== undefined) {
            // Make sure the former handlers do not trigger anymore
            this.#currentSubscriptionHandler.attributeListener = () => {};
            this.#currentSubscriptionHandler.eventListener = () => {};
            this.#currentSubscriptionHandler.updateTimeoutHandler = () => {};
            this.#currentSubscriptionHandler.subscriptionAlive = () => {};
        }
    }

    #setConnectionState(state: NodeStates) {
        if (
            this.#connectionState === state ||
            (this.#connectionState === NodeStates.WaitingForDeviceDiscovery && state === NodeStates.Reconnecting)
        )
            return;
        this.#connectionState = state;
        if (state !== NodeStates.Connected) {
            this.#currentSubscriptionIntervalS = undefined;
        }
        this.#options.stateInformationCallback?.(this.nodeId, state as unknown as NodeStateInformation);
        this.events.stateChanged.emit(state);
        if (state === NodeStates.Disconnected) {
            this.#reconnectDelayTimer?.stop();
            this.#reconnectDelayTimer = undefined;
        }
    }

    /** Make sure to not request a new Interaction client multiple times in parallel. */
    async #handleReconnect(discoveryType?: NodeDiscoveryType): Promise<void> {
        if (this.#clientReconnectInProgress) {
            throw new NodeNotConnectedError("Reconnection already in progress. Node not reachable currently.");
        }

        this.#clientReconnectInProgress = true;
        try {
            await this.#reconnectFunc(discoveryType);
        } finally {
            this.#clientReconnectInProgress = false;
        }
    }

    /**
     * Schedule a connection to the device. This method is non-blocking and will return immediately.
     * The connection happens in the background. Please monitor the state events of the node to see if the
     * connection was successful.
     * The provided connection options will be set and used internally if the node reconnects successfully.
     */
    connect(connectOptions?: CommissioningControllerNodeOptions) {
        if (connectOptions !== undefined) {
            this.#options = connectOptions;
        }
        this.triggerReconnect();
    }

    /**
     * Trigger a reconnection to the device. This method is non-blocking and will return immediately.
     * The reconnection happens in the background. Please monitor the state events of the node to see if the
     * reconnection was successful.
     */
    triggerReconnect() {
        if (this.#reconnectionInProgress || this.#remoteInitializationInProgress) {
            logger.info(
                `Node ${this.nodeId}: Ignoring reconnect request because ${this.#remoteInitializationInProgress ? "initialization" : "reconnect"} already in progress.`,
            );
            return;
        }
        this.#scheduleReconnect(0);
    }

    /**
     * Force a reconnection to the device.
     * This method is mainly used internally to reconnect after the active session
     * was closed or the device went offline and was detected as being online again.
     * Please note that this method does not return until the device is reconnected.
     * Please use triggerReconnect method for a non-blocking reconnection triggering.
     */
    async reconnect(connectOptions?: CommissioningControllerNodeOptions) {
        if (connectOptions !== undefined) {
            this.#options = connectOptions;
        }
        if (this.#reconnectionInProgress || this.#remoteInitializationInProgress) {
            logger.debug(
                `Node ${this.nodeId}: Ignoring reconnect request because ${this.#remoteInitializationInProgress ? "initialization" : "reconnect"} already underway.`,
            );
            return;
        }
        if (this.#reconnectDelayTimer?.isRunning) {
            this.#reconnectDelayTimer.stop();
        }

        this.#reconnectionInProgress = true;
        if (this.#connectionState !== NodeStates.WaitingForDeviceDiscovery) {
            this.#setConnectionState(NodeStates.Reconnecting);

            try {
                // First try a reconnect to known addresses to see if the device is reachable
                await this.#handleReconnect(NodeDiscoveryType.None);
                this.#reconnectionInProgress = false;
                await this.#initialize();
                return;
            } catch (error) {
                if (error instanceof MatterError) {
                    logger.info(
                        `Node ${this.nodeId}: Simple re-establishing session did not worked. Reconnect ... `,
                        error,
                    );
                } else {
                    this.#reconnectionInProgress = false;
                    throw error;
                }
            }
        }

        this.#setConnectionState(NodeStates.WaitingForDeviceDiscovery);

        try {
            await this.#initialize();
        } catch (error) {
            MatterError.accept(error);

            if (error instanceof UnknownNodeError) {
                logger.info(`Node ${this.nodeId}: Node is unknown by controller, we can not connect.`);
                this.#setConnectionState(NodeStates.Disconnected);
            } else if (this.#connectionState === NodeStates.Disconnected) {
                logger.info(`Node ${this.nodeId}: No reconnection desired because requested status is Disconnected.`);
            } else {
                if (error instanceof ChannelStatusResponseError) {
                    logger.info(`Node ${this.nodeId}: Error while establishing new Channel, retrying ...`, error);
                } else if (error instanceof StatusResponseError) {
                    logger.info(`Node ${this.nodeId}: Error while communicating with the device, retrying ...`, error);
                } else {
                    logger.info(`Node ${this.nodeId}: Error waiting for device rediscovery, retrying`, error);
                }
                this.#reconnectErrorCount++;
                this.#scheduleReconnect();
            }
        } finally {
            this.#reconnectionInProgress = false;
        }
    }

    /** Ensure that the node is connected by creating a new InteractionClient if needed. */
    async #ensureConnection(forceConnect = false): Promise<InteractionClient> {
        if (this.#connectionState === NodeStates.Disconnected) {
            // Disconnected and having an InteractionClient means we initialized with an Offline one, so we do
            // connection now on usage
            this.#setConnectionState(NodeStates.Reconnecting);
            return this.#interactionClient;
        }
        if (this.#connectionState === NodeStates.Connected && !forceConnect) {
            return this.#interactionClient;
        }

        if (forceConnect) {
            this.#setConnectionState(NodeStates.WaitingForDeviceDiscovery);
        }

        await this.#handleReconnect(NodeDiscoveryType.FullDiscovery);
        if (!forceConnect) {
            this.#setConnectionState(NodeStates.Connected);
        }
        return this.#interactionClient;
    }

    async #initializeFromStoredData(storedAttributeData: DecodedAttributeReportValue<any>[]) {
        const { autoSubscribe } = this.#options;
        if (this.#remoteInitializationDone || this.#localInitializationDone || autoSubscribe === false) return;

        // Minimum sanity check that we have at least data for the Root endpoint and one other endpoint to initialize
        let rootEndpointIncluded = false;
        let otherEndpointIncluded = false;
        if (
            !storedAttributeData.some(({ path: { endpointId } }) => {
                if (endpointId === 0) {
                    rootEndpointIncluded = true;
                } else {
                    otherEndpointIncluded = true;
                }
                return rootEndpointIncluded && otherEndpointIncluded;
            })
        ) {
            return;
        }

        await this.#initializeEndpointStructure(storedAttributeData);

        // Inform interested parties that the node is initialized
        await this.events.initialized.emit(this.#nodeDetails.toStorageData());
        this.#localInitializationDone = true;
    }

    /**
     * Initialize the node after the InteractionClient was created and to subscribe attributes and events if requested.
     */
    async #initialize() {
        if (this.#remoteInitializationInProgress) {
            logger.info(`Node ${this.nodeId}: Remote initialization already in progress ...`);
            return;
        }
        this.#remoteInitializationInProgress = true;
        try {
            // Enforce a new Connection
            await this.#ensureConnection(true); // This sets state to connected when successful!
            const { autoSubscribe, attributeChangedCallback, eventTriggeredCallback } = this.#options;

            let deviceDetailsUpdated = false;
            // We need to query some Device metadata because we do not have them (or update them anyway)
            if (!this.#nodeDetails.valid || (autoSubscribe === false && !this.#remoteInitializationDone)) {
                await this.#nodeDetails.enhanceDeviceDetailsFromRemote(this.#interactionClient);
                deviceDetailsUpdated = true;
            }

            const anyInitializationDone = this.#localInitializationDone || this.#remoteInitializationDone;
            if (autoSubscribe !== false) {
                const { attributeReports, maxInterval } = await this.subscribeAllAttributesAndEvents({
                    ignoreInitialTriggers: !anyInitializationDone, // Trigger on updates only after initialization
                    attributeChangedCallback: (data, oldValue) => {
                        attributeChangedCallback?.(this.nodeId, data);
                        this.events.attributeChanged.emit(data, oldValue);
                    },
                    eventTriggeredCallback: data => {
                        eventTriggeredCallback?.(this.nodeId, data);
                        this.events.eventTriggered.emit(data);
                    },
                }); // Ignore Triggers from Subscribing during initialization

                if (attributeReports === undefined) {
                    throw new InternalError("No attribute reports received when subscribing to all values!");
                }
                await this.#initializeEndpointStructure(attributeReports, anyInitializationDone);

                this.#remoteInitializationInProgress = false; // We are done, rest is bonus and should not block reconnections

                if (!deviceDetailsUpdated) {
                    const rootEndpoint = this.getRootEndpoint();
                    if (rootEndpoint !== undefined) {
                        await this.#nodeDetails.enhanceDeviceDetailsFromCache(rootEndpoint);
                    }
                }
                this.#currentSubscriptionIntervalS = maxInterval;
            } else {
                const allClusterAttributes = await this.readAllAttributes();
                await this.#initializeEndpointStructure(allClusterAttributes, anyInitializationDone);
                this.#remoteInitializationInProgress = false; // We are done, rest is bonus and should not block reconnections
            }
            if (!this.#remoteInitializationDone) {
                try {
                    await this.#commissioningController.validateAndUpdateFabricLabel(this.nodeId);
                } catch (error) {
                    logger.info(`Node ${this.nodeId}: Error updating fabric label`, error);
                }
            }
            this.#reconnectErrorCount = 0;
            this.#setConnectionState(NodeStates.Connected);
            await this.events.initializedFromRemote.emit(this.#nodeDetails.toStorageData());
            if (!this.#localInitializationDone) {
                await this.events.initialized.emit(this.#nodeDetails.toStorageData());
                this.#localInitializationDone = true;
            }
            this.#remoteInitializationDone = true;
        } finally {
            this.#remoteInitializationInProgress = false;
        }
    }

    /**
     * Request the current InteractionClient for custom special interactions with the device. Usually the
     * ClusterClients of the Devices of the node should be used instead. An own InteractionClient is only needed
     * when you want to read or write multiple attributes or events in a single request or send batch invokes.
     */
    getInteractionClient() {
        return this.#ensureConnection();
    }

    /** Method to log the structure of this node with all endpoint and clusters. */
    logStructure() {
        const rootEndpoint = this.#endpoints.get(EndpointNumber(0));
        if (rootEndpoint === undefined) {
            logger.info(`Node ${this.nodeId} has not yet been initialized!`);
            return;
        }
        logger.info(this);
    }

    /**
     * Subscribe to all attributes and events of the device. Unless setting the Controller property autoSubscribe to
     * false this is executed automatically. Alternatively you can manually subscribe by calling this method.
     */
    async subscribeAllAttributesAndEvents(options?: {
        ignoreInitialTriggers?: boolean;
        attributeChangedCallback?: (data: DecodedAttributeReportValue<any>, oldValue: any) => void;
        eventTriggeredCallback?: (data: DecodedEventReportValue<any>) => void;
    }) {
        options = options ?? {};
        const { attributeChangedCallback, eventTriggeredCallback } = options;
        let { ignoreInitialTriggers = false } = options;

        const { minIntervalFloorSeconds, maxIntervalCeilingSeconds } =
            this.#nodeDetails.determineSubscriptionParameters(this.#options);
        const { threadConnected } = this.#nodeDetails.meta ?? {};

        this.#invalidateSubscriptionHandler();

        const subscriptionHandler: SubscriptionHandlerCallbacks = {
            attributeListener: (data, changed, oldValue) => {
                if (ignoreInitialTriggers || changed === false) {
                    return;
                }
                const {
                    path: { endpointId, clusterId, attributeId },
                    value,
                } = data;
                const device = this.#endpoints.get(endpointId);
                if (device === undefined) {
                    logger.info(
                        `Node ${this.nodeId} Ignoring received attribute update for unknown endpoint ${endpointId}!`,
                    );
                    return;
                }
                const cluster = device.getClusterClientById(clusterId);
                if (cluster === undefined) {
                    logger.info(
                        `Node ${this.nodeId} Ignoring received attribute update for unknown cluster ${Diagnostic.hex(
                            clusterId,
                        )} on endpoint ${endpointId}!`,
                    );
                    return;
                }
                logger.debug(
                    `Node ${this.nodeId} Trigger attribute update for ${endpointId}.${cluster.name}.${attributeId} to ${Diagnostic.json(
                        value,
                    )} (changed: ${changed})`,
                );

                asClusterClientInternal(cluster)._triggerAttributeUpdate(attributeId, value);
                attributeChangedCallback?.(data, oldValue);

                this.#checkAttributesForNeededStructureUpdate(endpointId, clusterId, attributeId);
            },
            eventListener: data => {
                if (ignoreInitialTriggers) return;
                const {
                    path: { endpointId, clusterId, eventId },
                    events,
                } = data;
                const device = this.#endpoints.get(endpointId);
                if (device === undefined) {
                    logger.info(`Node ${this.nodeId} Ignoring received event for unknown endpoint ${endpointId}!`);
                    return;
                }
                const cluster = device.getClusterClientById(clusterId);
                if (cluster === undefined) {
                    logger.info(
                        `Node ${this.nodeId} Ignoring received event for unknown cluster ${Diagnostic.hex(
                            clusterId,
                        )} on endpoint ${endpointId}!`,
                    );
                    return;
                }
                logger.debug(
                    `Node ${this.nodeId} Trigger event update for ${endpointId}.${cluster.name}.${eventId} for ${events.length} events`,
                );
                asClusterClientInternal(cluster)._triggerEventUpdate(eventId, events);

                eventTriggeredCallback?.(data);

                this.#checkEventsForNeededStructureUpdate(endpointId, clusterId, eventId);
            },
            updateTimeoutHandler: async () => {
                logger.info(`Node ${this.nodeId}: Subscription timed out ... trying to re-establish ...`);
                this.#setConnectionState(NodeStates.Reconnecting);
                this.#reconnectionInProgress = true;
                try {
                    const { maxInterval } = await this.subscribeAllAttributesAndEvents({
                        ...options,
                        ignoreInitialTriggers: false,
                    });
                    this.#setConnectionState(NodeStates.Connected);
                    this.#currentSubscriptionIntervalS = maxInterval;
                } catch (error) {
                    logger.info(
                        `Node ${this.nodeId}: Error resubscribing to all attributes and events. Try to reconnect ...`,
                        error,
                    );
                    this.#scheduleReconnect();
                } finally {
                    this.#reconnectionInProgress = false;
                }
            },
            subscriptionAlive: () => {
                if (this.#reconnectDelayTimer?.isRunning && this.#connectionState === NodeStates.Reconnecting) {
                    logger.info(`Node ${this.nodeId}: Got subscription update, so reconnection not needed anymore ...`);
                    this.#reconnectDelayTimer.stop();
                    this.#reconnectDelayTimer = undefined;
                    this.#setConnectionState(NodeStates.Connected);
                }
                this.events.connectionAlive.emit();
            },
        };
        this.#currentSubscriptionHandler = subscriptionHandler;

        const maxKnownEventNumber = this.#interactionClient.maxKnownEventNumber;

        // We first update all values by doing a read all on the device
        // We do not enrich existing data because we just want to store updated data
        const attributeData = await this.#interactionClient.getAllAttributes({
            dataVersionFilters: this.#interactionClient.getCachedClusterDataVersions(),
            executeQueued: !!threadConnected, // We queue subscriptions for thread devices
        });
        await this.#interactionClient.addAttributesToCache(attributeData);
        attributeData.length = 0; // Clear the array to save memory

        // If we subscribe anything we use these data to create the endpoint structure, so we do not need to fetch again
        const initialSubscriptionData = await this.#interactionClient.subscribeAllAttributesAndEvents({
            isUrgent: true,
            minIntervalFloorSeconds,
            maxIntervalCeilingSeconds,
            keepSubscriptions: false,
            dataVersionFilters: this.#interactionClient.getCachedClusterDataVersions(),
            enrichCachedAttributeData: true,
            eventFilters: maxKnownEventNumber !== undefined ? [{ eventMin: maxKnownEventNumber + 1n }] : undefined,
            executeQueued: !!threadConnected, // We queue subscriptions for thread devices
            attributeListener: (data, changed, oldValue) =>
                subscriptionHandler.attributeListener(data, changed, oldValue),
            eventListener: data => subscriptionHandler.eventListener(data),
            updateTimeoutHandler: () => subscriptionHandler.updateTimeoutHandler(),
            updateReceived: () => subscriptionHandler.subscriptionAlive(),
        });

        // After initial data are processed we want to send out callbacks, so we set ignoreInitialTriggers to false
        ignoreInitialTriggers = false;

        return initialSubscriptionData;
    }

    /** Read all attributes of the devices and return them. If a stored state exists this is used to minimize needed traffic. */
    async readAllAttributes() {
        return this.#interactionClient.getAllAttributes({
            dataVersionFilters: this.#interactionClient.getCachedClusterDataVersions(),
            enrichCachedAttributeData: true,
        });
    }

    #checkAttributesForNeededStructureUpdate(
        _endpointId: EndpointNumber,
        clusterId: ClusterId,
        attributeId: AttributeId,
    ) {
        // Any change in the Descriptor Cluster partsList attribute requires a reinitialization of the endpoint structure
        let structureUpdateNeeded = false;
        if (clusterId === DescriptorCluster.id) {
            switch (attributeId) {
                case DescriptorCluster.attributes.partsList.id:
                case DescriptorCluster.attributes.serverList.id:
                case DescriptorCluster.attributes.deviceTypeList.id:
                    structureUpdateNeeded = true;
                    break;
            }
        }
        if (!structureUpdateNeeded) {
            switch (attributeId) {
                case FeatureMap.id:
                case AttributeList.id:
                case AcceptedCommandList.id:
                case ClusterRevision.id:
                    structureUpdateNeeded = true;
                    break;
            }
        }

        if (structureUpdateNeeded) {
            logger.info(`Node ${this.nodeId}: Endpoint structure needs to be updated ...`);
            this.#updateEndpointStructureTimer.stop().start();
        }
    }

    #checkEventsForNeededStructureUpdate(_endpointId: EndpointNumber, clusterId: ClusterId, eventId: EventId) {
        // When we subscribe all data here then we can also catch this case and handle it
        if (clusterId === BasicInformation.Cluster.id && eventId === BasicInformation.Cluster.events.shutDown.id) {
            this.#handleNodeShutdown();
        }
    }

    /** Handles a node shutDown event (if supported by the node and received). */
    #handleNodeShutdown() {
        logger.info(`Node ${this.nodeId}: Node shutdown detected, trying to reconnect ...`);
        this.#scheduleReconnect(RECONNECT_DELAY_AFTER_SHUTDOWN_MS);
    }

    #scheduleReconnect(delay?: number) {
        if (this.state !== NodeStates.WaitingForDeviceDiscovery) {
            this.#setConnectionState(NodeStates.Reconnecting);
        }

        if (!this.#reconnectDelayTimer?.isRunning) {
            this.#reconnectDelayTimer?.stop();
        }
        if (delay === undefined) {
            // Calculate a delay with a backoff strategy based on errorCount and maximum 10 minutes
            delay = Math.min(RECONNECT_DELAY_MS * 2 ** this.#reconnectErrorCount, RECONNECT_MAX_DELAY_MS);
        }

        logger.info(`Node ${this.nodeId}: Reconnecting in ${Math.round(delay / 1000)}s ...`);
        this.#reconnectDelayTimer = Time.getTimer("Reconnect delay", delay, async () => await this.reconnect());
        this.#reconnectDelayTimer.start();
    }

    async #updateEndpointStructure() {
        const allClusterAttributes = await this.readAllAttributes();
        await this.#initializeEndpointStructure(allClusterAttributes, true);
        this.#options.stateInformationCallback?.(this.nodeId, NodeStateInformation.StructureChanged);
        this.events.structureChanged.emit();
    }

    /** Reads all data from the device and create a device object structure out of it. */
    async #initializeEndpointStructure(
        allClusterAttributes: DecodedAttributeReportValue<any>[],
        updateStructure = false,
    ) {
        const allData = structureReadAttributeDataToClusterObject(allClusterAttributes);

        if (updateStructure) {
            // Find out what we need to remove or retain
            const endpointsToRemove = new Set<EndpointNumber>(this.#endpoints.keys());
            for (const [endpointId] of Object.entries(allData)) {
                const endpointIdNumber = EndpointNumber(parseInt(endpointId));
                if (this.#endpoints.has(endpointIdNumber)) {
                    logger.debug(`Node ${this.nodeId}: Retaining device`, endpointId);
                    endpointsToRemove.delete(endpointIdNumber);
                }
            }
            // And remove all endpoints no longer in the structure
            for (const endpointId of endpointsToRemove.values()) {
                logger.debug(`Node ${this.nodeId}: Removing device`, endpointId);
                this.#endpoints.get(endpointId)?.removeFromStructure();
                this.#endpoints.delete(endpointId);
            }
        } else {
            this.#endpoints.clear();
        }

        const partLists = new Map<EndpointNumber, EndpointNumber[]>();
        for (const [endpointId, clusters] of Object.entries(allData)) {
            const endpointIdNumber = EndpointNumber(parseInt(endpointId));
            const descriptorData = clusters[DescriptorCluster.id] as AttributeClientValues<
                typeof DescriptorCluster.attributes
            >;

            partLists.set(endpointIdNumber, descriptorData.partsList);

            if (this.#endpoints.has(endpointIdNumber)) {
                // Endpoint exists already, so mo need to create device instance again
                continue;
            }

            logger.debug(`Node ${this.nodeId}: Creating device`, endpointId, Diagnostic.json(clusters));
            this.#endpoints.set(
                endpointIdNumber,
                this.#createDevice(endpointIdNumber, clusters, this.#interactionClient),
            );
        }

        this.#structureEndpoints(partLists);
    }

    /** Bring the endpoints in a structure based on their partsList attribute. */
    #structureEndpoints(partLists: Map<EndpointNumber, EndpointNumber[]>) {
        logger.debug(
            `Node ${this.nodeId}: Endpoints from PartsLists`,
            Diagnostic.json(Array.from(partLists.entries())),
        );

        const endpointUsages: { [key: EndpointNumber]: EndpointNumber[] } = {};
        Array.from(partLists.entries()).forEach(([parent, partsList]) =>
            partsList.forEach(endPoint => {
                if (endPoint === parent) {
                    // There could be more cases of invalid and cycling structures that never should happen ... so lets not over optimize to try to find all of them right now
                    logger.warn(`Node ${this.nodeId}: Endpoint ${endPoint} is referencing itself!`);
                    return;
                }
                endpointUsages[endPoint] = endpointUsages[endPoint] || [];
                endpointUsages[endPoint].push(parent);
            }),
        );

        logger.debug(`Node ${this.nodeId}: Endpoint usages`, Diagnostic.json(endpointUsages));

        while (true) {
            // get all endpoints with only one usage
            const singleUsageEndpoints = Object.entries(endpointUsages).filter(([_, usages]) => usages.length === 1);
            if (singleUsageEndpoints.length === 0) {
                if (Object.entries(endpointUsages).length)
                    throw new InternalError(`Endpoint structure for Node ${this.nodeId} could not be parsed!`);
                break;
            }

            logger.debug(`Node ${this.nodeId}: Processing Endpoint ${Diagnostic.json(singleUsageEndpoints)}`);

            const idsToCleanup: { [key: EndpointNumber]: boolean } = {};
            singleUsageEndpoints.forEach(([childId, usages]) => {
                const childEndpointId = EndpointNumber(parseInt(childId));
                const childEndpoint = this.#endpoints.get(childEndpointId);
                const parentEndpoint = this.#endpoints.get(usages[0]);
                if (childEndpoint === undefined || parentEndpoint === undefined) {
                    logger.warn(
                        `Node ${this.nodeId}: Endpoint ${usages[0]} not found in the data received from the device!`,
                    );
                } else if (parentEndpoint.getChildEndpoint(childEndpointId) === undefined) {
                    logger.debug(
                        `Node ${this.nodeId}: Endpoint structure: Child: ${childEndpointId} -> Parent: ${parentEndpoint.number}`,
                    );

                    parentEndpoint.addChildEndpoint(childEndpoint);
                }

                delete endpointUsages[EndpointNumber(parseInt(childId))];
                idsToCleanup[usages[0]] = true;
            });
            logger.debug(`Node ${this.nodeId}: Endpoint data Cleanup`, Diagnostic.json(idsToCleanup));
            Object.keys(idsToCleanup).forEach(idToCleanup => {
                Object.keys(endpointUsages).forEach(id => {
                    const usageId = EndpointNumber(parseInt(id));
                    endpointUsages[usageId] = endpointUsages[usageId].filter(
                        endpointId => endpointId !== parseInt(idToCleanup),
                    );
                    if (!endpointUsages[usageId].length) {
                        delete endpointUsages[usageId];
                    }
                });
            });
        }
    }

    /** Create a device object from the data read from the device. */
    #createDevice(
        endpointId: EndpointNumber,
        data: { [key: ClusterId]: { [key: string]: any } },
        interactionClient: InteractionClient,
    ) {
        const descriptorData = data[DescriptorCluster.id] as AttributeClientValues<typeof DescriptorCluster.attributes>;

        const deviceTypes = descriptorData.deviceTypeList.flatMap(({ deviceType, revision }) => {
            const deviceTypeDefinition = getDeviceTypeDefinitionFromModelByCode(deviceType);
            if (deviceTypeDefinition === undefined) {
                logger.info(
                    `NodeId ${this.nodeId}: Device type with code ${deviceType} not known, use generic replacement.`,
                );
                return UnknownDeviceType(deviceType, revision);
            }
            if (deviceTypeDefinition.revision < revision) {
                logger.debug(
                    `NodeId ${this.nodeId}: Device type with code ${deviceType} and revision ${revision} not supported, some data might be unknown.`,
                );
            }
            return deviceTypeDefinition;
        });
        if (deviceTypes.length === 0) {
            logger.info(`NodeId ${this.nodeId}: No device type found for endpoint ${endpointId}, ignore`);
            throw new MatterError(`NodeId ${this.nodeId}: No device type found for endpoint`);
        }

        const endpointClusters = Array<ClusterServerObj | ClusterClientObj>();

        // Add ClusterClients for all server clusters of the device
        for (const clusterId of descriptorData.serverList) {
            const cluster = getClusterById(clusterId);
            const clusterClient = ClusterClient(cluster, endpointId, interactionClient, data[clusterId]);
            endpointClusters.push(clusterClient);
        }

        // TODO use the attributes attributeList, acceptedCommands, generatedCommands to create the ClusterClient/Server objects
        // Add ClusterServers for all client clusters of the device
        for (const clusterId of descriptorData.clientList) {
            const cluster = getClusterById(clusterId);
            const clusterData = (data[clusterId] ?? {}) as AttributeInitialValues<Attributes>; // TODO correct typing
            // Todo add logic for Events
            endpointClusters.push(
                ClusterServer(
                    cluster,
                    /*clusterData.featureMap,*/ clusterData,
                    {},
                    undefined,
                    true,
                ) as ClusterServerObj,
            ); // TODO Add Default handler!
        }

        if (endpointId === 0) {
            // Endpoint 0 is the root endpoint, so we use a RootEndpoint object
            const rootEndpoint = new RootEndpoint();
            rootEndpoint.setDeviceTypes(deviceTypes as AtLeastOne<DeviceTypeDefinition>); // Ideally only root one as defined
            endpointClusters.forEach(cluster => {
                if (isClusterServer(cluster)) {
                    rootEndpoint.addClusterServer(cluster);
                } else if (isClusterClient(cluster)) {
                    rootEndpoint.addClusterClient(cluster);
                }
            });
            return rootEndpoint;
        } else if (deviceTypes.find(deviceType => deviceType.code === DeviceTypes.AGGREGATOR.code) !== undefined) {
            // When AGGREGATOR is in the device type list, this is an aggregator
            const aggregator = new Aggregator([], { endpointId });
            aggregator.setDeviceTypes(deviceTypes as AtLeastOne<DeviceTypeDefinition>);
            endpointClusters.forEach(cluster => {
                // TODO There should be none?
                if (isClusterServer(cluster)) {
                    aggregator.addClusterServer(cluster);
                } else if (isClusterClient(cluster)) {
                    aggregator.addClusterClient(cluster);
                }
            });
            return aggregator;
        } else {
            // It seems to be device but has a partsList, so it is a composed device
            if (descriptorData.partsList.length > 0) {
                const composedDevice = new ComposedDevice(deviceTypes[0], [], { endpointId });
                composedDevice.setDeviceTypes(deviceTypes as AtLeastOne<DeviceTypeDefinition>);
                endpointClusters.forEach(cluster => {
                    if (isClusterServer(cluster)) {
                        composedDevice.addClusterServer(cluster);
                    } else if (isClusterClient(cluster)) {
                        composedDevice.addClusterClient(cluster);
                    }
                });
                return composedDevice;
            } else {
                // else it's a normal Device
                // TODO Should we find the really correct Device derived class to instance?
                return new PairedDevice(deviceTypes as AtLeastOne<DeviceTypeDefinition>, endpointClusters, endpointId);
            }
        }
    }

    /** Returns the functional devices/endpoints (the "childs" of the Root Endpoint) known for this node. */
    getDevices(): Endpoint[] {
        return this.#endpoints.get(EndpointNumber(0))?.getChildEndpoints() ?? [];
    }

    /** Returns the device/endpoint with the given endpoint ID. */
    getDeviceById(endpointId: number) {
        return this.#endpoints.get(EndpointNumber(endpointId));
    }

    /** Returns the Root Endpoint of the device. */
    getRootEndpoint() {
        return this.getDeviceById(0);
    }

    /** De-Commission (unpair) the device from this controller by removing the fabric from the device. */
    async decommission() {
        if (!this.#commissioningController.isNodeCommissioned(this.nodeId)) {
            throw new ImplementationError(`This Node ${this.nodeId} is not commissioned.`);
        }
        if (
            this.#connectionState === NodeStates.Reconnecting ||
            this.#connectionState === NodeStates.WaitingForDeviceDiscovery
        ) {
            throw new ImplementationError(
                `This Node ${this.nodeId} is currently in a reconnect state, decommissioning is not possible.`,
            );
        }
        const operationalCredentialsCluster = this.getRootClusterClient(OperationalCredentials.Cluster);

        if (operationalCredentialsCluster === undefined) {
            throw new ImplementationError(`OperationalCredentialsCluster for node ${this.nodeId} not found.`);
        }

        const fabricIndex = await operationalCredentialsCluster.getCurrentFabricIndexAttribute(true);

        logger.debug(`Removing node ${this.nodeId} by removing fabric ${fabricIndex} on the node.`);

        const result = await operationalCredentialsCluster.commands.removeFabric({ fabricIndex });
        if (result.statusCode !== OperationalCredentials.NodeOperationalCertStatus.Ok) {
            throw new MatterError(
                `Removing node ${this.nodeId} failed with status ${result.statusCode} "${result.debugText}".`,
            );
        }
        this.#setConnectionState(NodeStates.Disconnected);
        await this.#commissioningController.removeNode(this.nodeId, false);
    }

    /**
     * Opens a Basic Commissioning Window (uses the original Passcode printed on the device) with the device.
     * This is an optional method, so it might not be supported by all devices and could be rejected with an error in
     * this case! Better use openEnhancedCommissioningWindow() instead.
     */
    async openBasicCommissioningWindow(commissioningTimeout = 900 /* 15 minutes */) {
        const adminCommissioningCluster = this.getRootClusterClient(AdministratorCommissioning.Cluster.with("Basic"));
        if (adminCommissioningCluster === undefined) {
            throw new ImplementationError(`AdministratorCommissioningCluster for node ${this.nodeId} not found.`);
        }
        if (adminCommissioningCluster.supportedFeatures.basic === false) {
            throw new ImplementationError(
                `AdministratorCommissioningCluster for node ${this.nodeId} does not support basic commissioning.`,
            );
        }

        try {
            await adminCommissioningCluster.commands.revokeCommissioning();
        } catch (error) {
            // Accept the error if no window is already open
            if (
                !StatusResponseError.is(error, StatusCode.Failure) ||
                error.clusterCode !== AdministratorCommissioning.StatusCode.WindowNotOpen
            ) {
                throw error;
            }
        }

        await adminCommissioningCluster.commands.openBasicCommissioningWindow({ commissioningTimeout });
    }

    /** Opens an Enhanced Commissioning Window (uses a generated random Passcode) with the device. */
    async openEnhancedCommissioningWindow(commissioningTimeout = 900 /* 15 minutes */) {
        const adminCommissioningCluster = this.getRootClusterClient(AdministratorCommissioning.Cluster);
        if (adminCommissioningCluster === undefined) {
            throw new ImplementationError(`AdministratorCommissioningCluster for node ${this.nodeId} not found.`);
        }

        try {
            await adminCommissioningCluster.commands.revokeCommissioning();
        } catch (error) {
            // Accept the error if no window is already open
            if (
                !StatusResponseError.is(error, StatusCode.Failure) ||
                error.clusterCode !== AdministratorCommissioning.StatusCode.WindowNotOpen
            ) {
                throw error;
            }
        }

        const basicInformationCluster = this.getRootClusterClient(BasicInformation.Cluster);
        if (basicInformationCluster == undefined) {
            throw new ImplementationError(`BasicInformationCluster for node ${this.nodeId} not found.`);
        }

        const vendorId = await basicInformationCluster.getVendorIdAttribute();
        const productId = await basicInformationCluster.getProductIdAttribute();

        const discriminator = PaseClient.generateRandomDiscriminator(this.#crypto);
        const passcode = PaseClient.generateRandomPasscode(this.#crypto);
        const salt = this.#crypto.randomBytes(32);
        const iterations = 1_000; // Minimum 1_000, Maximum 100_000
        const pakePasscodeVerifier = await PaseClient.generatePakePasscodeVerifier(this.#crypto, passcode, {
            iterations,
            salt,
        });
        await adminCommissioningCluster.commands.openCommissioningWindow({
            commissioningTimeout,
            pakePasscodeVerifier,
            salt,
            iterations,
            discriminator,
        });

        // TODO: If Timeout is shorter then 15 minutes set the timeout also in TlvData of QR-Code
        const qrPairingCode = QrPairingCodeCodec.encode([
            {
                version: 0,
                vendorId,
                productId,
                flowType: CommissioningFlowType.Standard,
                discriminator: discriminator,
                passcode: passcode,
                discoveryCapabilities: DiscoveryCapabilitiesSchema.encode({
                    onIpNetwork: true,
                }),
            },
        ]);

        return {
            manualPairingCode: ManualPairingCodeCodec.encode({
                discriminator: discriminator,
                passcode: passcode,
            }),
            qrPairingCode,
        };
    }

    /** Closes the current session, ends the subscription and disconnects the device. */
    async disconnect() {
        this.close();
        await this.#commissioningController.disconnectNode(this.nodeId);
    }

    /** Closes the current subscription and ends all timers for reconnects or such used by this PairedNode instance. */
    close(sendDecommissionedStatus = false) {
        this.#newChannelReconnectDelayTimer.stop();
        this.#reconnectDelayTimer?.stop();
        this.#reconnectDelayTimer = undefined;
        this.#updateEndpointStructureTimer.stop();
        if (sendDecommissionedStatus) {
            this.#options.stateInformationCallback?.(this.nodeId, NodeStateInformation.Decommissioned);
            this.events.decommissioned.emit();
        }
        this.#setConnectionState(NodeStates.Disconnected);
    }

    /**
     * Get a cluster server from the root endpoint. This is mainly used internally and not needed to be called by the user.
     *
     * @param cluster ClusterServer to get or undefined if not existing
     */
    getRootClusterServer<const T extends ClusterType>(cluster: T): ClusterServerObj<T> | undefined {
        return this.#endpoints.get(EndpointNumber(0))?.getClusterServer(cluster);
    }

    /**
     * Get a cluster client from the root endpoint. This is mainly used internally and not needed to be called by the user.
     *
     * @param cluster ClusterClient to get or undefined if not existing
     */
    getRootClusterClient<const T extends ClusterType>(cluster: T): ClusterClientObj<T> | undefined {
        return this.#endpoints.get(EndpointNumber(0))?.getClusterClient(cluster);
    }

    /**
     * Get a cluster server from the root endpoint. This is mainly used internally and not needed to be called by the user.
     *
     * @param endpointId EndpointNumber to get the cluster from
     * @param cluster ClusterServer to get or undefined if not existing
     */
    getClusterServerForDevice<const T extends ClusterType>(
        endpointId: EndpointNumber,
        cluster: T,
    ): ClusterServerObj<T> | undefined {
        return this.getDeviceById(endpointId)?.getClusterServer(cluster);
    }

    /**
     * Get a cluster client from the root endpoint. This is mainly used internally and not needed to be called by the user.
     *
     * @param endpointId EndpointNumber to get the cluster from
     * @param cluster ClusterClient to get or undefined if not existing
     */
    getClusterClientForDevice<const T extends ClusterType>(
        endpointId: EndpointNumber,
        cluster: T,
    ): ClusterClientObj<T> | undefined {
        return this.getDeviceById(endpointId)?.getClusterClient(cluster);
    }

    get [Diagnostic.value](): unknown {
        const root = this.getRootEndpoint();

        let statusIcon = "✗";
        switch (this.#connectionState) {
            case NodeStates.Reconnecting:
                statusIcon = "⌛";
                break;
            case NodeStates.WaitingForDeviceDiscovery:
                statusIcon = "💤";
                break;
            case NodeStates.Connected:
                statusIcon = "✓";
                break;
        }

        return Diagnostic.node(statusIcon, this.nodeId, {
            children: [
                Diagnostic.strong("Information"),
                Diagnostic.list([Diagnostic.dict(this.deviceInformation as object)]),
                Diagnostic.strong("Structure"),
                root ? Diagnostic.list([root]) : "Unknown",
            ],
        });
    }
}
