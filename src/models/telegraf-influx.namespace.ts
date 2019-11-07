import {Formatters} from "./telegraf-formatters.namespace";
import {Common} from "./common.namespace";
import {Chanel} from "./telegraf-chanel.namespace";

export namespace Influx {
    class InfluxPoint
    {
        constructor(
            public measurement: string,
            public fields: Common.Dictionary<any>,
            public tags: Common.Dictionary<string> = null,
            public utcTimestamp: Date = null
        ) {
            if (!measurement) {
                throw new Error(`Invalid argument "measurement"`);
            }
            if (!fields) {
                throw new Error(`Invalid argument "fields"`);
            }
            if (!tags) {
                throw new Error(`Invalid argument "tags"`);
            }
        }

        public format(): string {
            return this.toString();
        }

        public toString(): string {
            return InfluxPointSerializer.serialize(this);
        }
    }

    class InfluxPointSerializer {
        public static serialize(point: InfluxPoint): string {
            const tags = point.tags;
            const fields = point.fields;
            const allTags = Formatters.TagsFormatter.format(tags).join(",");
            const allFields = Formatters.FieldFormatter.format(fields).join(",");
            const tagsPart = allTags.length > 0 ? `,${allTags}` : allTags;
            const measurement = Formatters.KeyFormatter.format(point.measurement);
            return `${measurement}${tagsPart} ${allFields} ${Formatters.FieldValueFormatter.formatDate(point.utcTimestamp)}`.trim();
        }
    }

    interface IInfluxClient {
        send(
            measurement: string,
            fields: Common.Dictionary<any>,
            tags: Common.Dictionary<string>,
            timestamp: Date
        );
    }

    export class InfluxClient implements IInfluxClient {
        constructor(
            private readonly channel: Chanel.IChannel,
            private readonly tags: Common.Dictionary<string> = {},
        ) {
            if (!channel) {
                throw new Error(`Argument "channel" is empty`);
            }
        }

        public send(
            measurement: string,
            fields: Common.Dictionary<any>,
            tags: Common.Dictionary<string>,
            timestamp: Date = null
        ): Promise<number> {
            return this.publish(new InfluxPoint(measurement, fields, this.assignTags(tags), timestamp));
        }

        private publish(point: InfluxPoint): Promise<number> {
            return this.channel.write(point.format());
        }

        private assignTags(tags: Common.Dictionary<string>): Common.Dictionary<string> {
            return Object.assign(this.tags, tags || {});
        }
    }
}