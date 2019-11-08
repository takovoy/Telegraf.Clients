import {Chanel} from "./models/telegraf-chanel.namespace";
import {Statsd} from "./models/telegraf-statsd.namespace";
import {Influx} from "./models/telegraf-influx.namespace";

export const Telegraf = {
    UdpChannel: Chanel.UdpChannel,
    StatsdClient: Statsd.StatsdClient,
    InfluxClient: Influx.InfluxClient,
};