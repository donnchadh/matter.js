/**
 * @license
 * Copyright 2022-2024 Matter.js Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Channel } from "../common/Channel.js";
import { ServerAddress } from "../common/ServerAddress.js";
import { Listener } from "../common/TransportInterface.js";
import { ByteArray } from "../util/ByteArray.js";
import { NetInterface } from "./NetInterface.js";
import { Network, NetworkError } from "./Network.js";
import { UdpChannel } from "./UdpChannel.js";

export class UdpInterface implements NetInterface {
    static async create(network: Network, type: "udp4" | "udp6", port?: number, host?: string, netInterface?: string) {
        return new UdpInterface(
            await network.createUdpChannel({ listeningPort: port, type, netInterface, listeningAddress: host }),
        );
    }

    constructor(private readonly server: UdpChannel) {}

    async openChannel(address: ServerAddress) {
        if (address.type !== "udp") {
            throw new NetworkError(`Unsupported address type ${address.type}`);
        }
        const { ip, port } = address;
        return Promise.resolve(new UdpConnection(this.server, ip, port));
    }

    onData(listener: (channel: Channel<ByteArray>, messageBytes: ByteArray) => void): Listener {
        return this.server.onData((_netInterface, peerHost, peerPort, data) =>
            listener(new UdpConnection(this.server, peerHost, peerPort), data),
        );
    }

    get port() {
        return this.server.port;
    }

    async close() {
        this.server.close();
    }
}

class UdpConnection implements Channel<ByteArray> {
    readonly isReliable = false;

    constructor(
        private readonly server: UdpChannel,
        private readonly peerAddress: string,
        private readonly peerPort: number,
    ) {}

    get maxPayloadSize() {
        return this.server.maxPayloadSize;
    }

    send(data: ByteArray) {
        return this.server.send(this.peerAddress, this.peerPort, data);
    }

    get name() {
        return `udp://${this.peerAddress}:${this.peerPort}`;
    }

    async close() {
        // UDP is connectionless, so nothing to do here
    }
}
