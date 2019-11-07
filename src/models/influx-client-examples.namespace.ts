import {Chanel} from "./telegraf-chanel.namespace";
import {Influx} from "./telegraf-influx.namespace";
const os = require('os');

namespace InfluxClientExamples {
    class Program {
        constructor() {
            Program.sendMetricsWithUdpChannel("192.168.56.101");
        }

        private static sendMetricsWithUdpChannel(host: string): void {
            const channel = new Chanel.UdpChannel(host, 8094);
            const defaultTags = {
                database_tag: "influx_client_udp_channel",
                host: os.hostname(),
            };
            const client = new Influx.InfluxClient(channel, defaultTags);
            client.send(
                "weather",
                {temperature: 82},
                {location: "us-midwest"},
                new Date(),
            );
        }
    }
}