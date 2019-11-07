import {Chanel} from "./telegraf-chanel.namespace";
import {Statsd} from "./telegraf-statsd.namespace";
const os = require('os');

namespace StatsdExamples {
    class Program {
        constructor() {
            Program.sendMetricsWithUdpChannel("192.168.56.101");
        }

        private static sendMetricsWithUdpChannel(host: string): void {
            const channel = new Chanel.UdpChannel(host, 8125);
            const defaultTags = {
                database_tag: "statsd_client_udp_channel",
                host: os.hostname(),
            };
            const client = new Statsd.StatsdClient(channel, defaultTags);
            client.time("deploys", 200, {stage: "test", application: "my-app"});
        }
    }
}
