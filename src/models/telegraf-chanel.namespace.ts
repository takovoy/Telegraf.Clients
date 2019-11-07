import {Socket} from "dgram";
const dgram = require("dgram");

export namespace Chanel {
    export interface IChannel {
        write(metric: string): Promise<number>;
    }

    enum ProtocolsEnum {
        udp4 = "udp4"
    }

    class Channel implements IChannel {
        private readonly _socket: Socket;

        constructor(
            private connectionHost: string = "127.0.0.1",
            private connectionPort: number = 8125,
            private protocol: ProtocolsEnum,
        ) {
            this._socket = dgram.createSocket(protocol);
        }

        public write(metric: string): Promise<number> {
            if (!metric || !metric.trim()) {
                return;
            }
            const encodedCommand = Buffer.from(metric, "utf8");
            return new Promise<number>((resolve, reject) => this._socket.send(
                encodedCommand,
                0,
                encodedCommand.length,
                this.connectionPort,
                this.connectionHost,
                (error, bytes) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(bytes);
                }
            ))
        }
    }

    export class UdpChannel extends Channel implements IChannel {
        constructor(connectionHost?: string, connectionPort?: number) {
            super(connectionHost, connectionPort, ProtocolsEnum.udp4);
        }
    }
}
