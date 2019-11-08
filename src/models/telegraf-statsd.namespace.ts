import {Common} from "./common.namespace";
import {Formatters} from "./telegraf-formatters.namespace";
import {Chanel} from "./telegraf-chanel.namespace";

export namespace Statsd {
    import TagsFormatter = Formatters.TagsFormatter;
    import KeyFormatter = Formatters.KeyFormatter;

    enum MetricType {
        Undefined,
        Counter,
        Gauge,
        Time,
        Set,
    }

    class MetricValue {
        public toString(): string {
            throw new Error("Method toString is not implemented");
        }
    }

    class NumberMetricValue extends MetricValue {
        constructor(
            public value: number,
            public explicitlySigned: boolean = false
        ) {
            super();
        }

        public toString(): string {
            return Math.abs(this.value) < 0.00000001 ? "0" : this.value.toString();
        }
    }

    class StringMetricValue extends MetricValue {
        constructor(public value: string) {
            super();
        }

        public toString() {
            return this.value;
        }
    }

    export class Metric {
        constructor(
            public name: string,
            public type: MetricType,
            public value: MetricValue,
            public sample: number,
            public tags: Common.Dictionary<string> = {},
        ) {}

        public static counter(
            name: string,
            value: number,
            sample: number = 1,
            tags: Common.Dictionary<string> = null,
        ): Metric {
            return new Metric(name, MetricType.Counter, new NumberMetricValue(value), sample, tags);
        }

        public static gauge(
            name: string,
            value: number,
            sample: number = 1,
            tags: Common.Dictionary<string> = null,
        ): Metric {
            return new Metric(name, MetricType.Gauge, new NumberMetricValue(value), sample, tags);
        }

        public static time(
            name: string,
            value: number,
            sample: number = 1,
            tags: Common.Dictionary<string> = null,
        ): Metric {
            return new Metric(name, MetricType.Time, new NumberMetricValue(value), sample, tags);
        }

        public static set(
            name: string,
            value: string,
            sample: number = 1,
            tags: Common.Dictionary<string> = null,
        ): Metric {
            return new Metric(name, MetricType.Set, new StringMetricValue(value), sample, tags);
        }
    }

    class MeasurementBuilder {
        private static readonly reservedCharactersRegex: RegExp = /[/\\?%*:|"<>@\n\r\t]/g;

        public static buildMeasurement(...names: string[]): string {
            const metricName = names
                .filter(name => name && name.trim())
                .map(name => this.sanitizeMeasurement(name.replace(/^\.*(.*)\.*$/, "$1")))
                .join(".");
            return KeyFormatter.format(metricName);
        }

        public static sanitizeMeasurement(metric: string): string {
            return metric.replace(this.reservedCharactersRegex, "_");
        }
    }

    export class MetricSerializer {
        public static serializeMetric(metric: Metric): string {
            const value = this.formattedMetricValue(metric.type, metric.value, metric.sample);
            const measurement = MeasurementBuilder.buildMeasurement(metric.name);
            const tags = metric.tags;
            const tagsValue = tags == null ? null : TagsFormatter.format(tags).join(",");
            return tagsValue && tagsValue.trim() ?
                `${measurement},${tagsValue}:${value}` :
                `${measurement}:${value}`;
        }

        private static formattedMetricValue(
            type: MetricType,
            metricValue: MetricValue,
            sample: number
        ): string {
            if (sample < 0 || sample > 1) {
                throw new Error("Argument out of range");
            }

            const metricTypeSpecifier = MetricSerializer.getMetricTypeSpecifier(type);
            const value = metricValue.toString();

            if (!metricTypeSpecifier || !metricTypeSpecifier.trim()) {
                throw new Error(`Argument "metricTypeSpecifier" is invalid`);
            }
            return sample < 1 ?
                `${value}|${metricTypeSpecifier}|@${sample}` :
                `${value}|${metricTypeSpecifier}`;
        }

        private static getMetricTypeSpecifier(metricType: MetricType) {
            switch (metricType)
            {
                case MetricType.Counter: return "c";
                case MetricType.Gauge: return "g";
                case MetricType.Time: return "ms";
                case MetricType.Set: return "s";
                default: throw new Error("Argument out of range");
            }
        }
    }

    export interface IStatsdClient {
        counter(measurement: string, value: number, sample: number, tags: Common.Dictionary<string>);
        counter(measurement: string, value: number, tags: Common.Dictionary<string>);

        gauge(measurement: string, value: number, sample: number, tags: Common.Dictionary<string>);
        gauge(measurement: string, value: number, tags: Common.Dictionary<string>);

        time(measurement: string, value: number, sample: number, tags: Common.Dictionary<string>);
        time(measurement: string, value: number, tags: Common.Dictionary<string>);

        set(measurement: string, value: number, sample: number, tags: Common.Dictionary<string>);
        set(measurement: string, value: number, tags: Common.Dictionary<string>);
    }

    export class StatsdClient implements IStatsdClient {
        constructor(
            private readonly channel: Chanel.IChannel,
            private readonly tags: Common.Dictionary<string> = {},
        ) {
            if (!channel) {
                throw new Error(`Argument "channel" is empty`);
            }
        }

        public counter(
            measurement: string,
            value: number,
            sample: number,
            tags: Common.Dictionary<string>,
        ): void;
        public counter(
            measurement: string,
            value: number,
            tags: Common.Dictionary<string>,
        ): void;
        public counter(...args): void {
            const sample = args.length === 3 && 1 || args[2] || 1;
            const tags = this.assignTags(args[args.length - 1]);
            this.publish(Metric.counter(args[0], args[1], sample, tags));
        }


        public gauge(
            measurement: string,
            value: number,
            sample: number,
            tags: Common.Dictionary<string>,
        ): void;
        public gauge(
            measurement: string,
            value: number,
            tags: Common.Dictionary<string>,
        ): void;
        public gauge(...args): void {
            const sample = args.length === 3 && 1 || args[2] || 1;
            const tags = this.assignTags(args[args.length - 1]);
            this.publish(Metric.gauge(args[0], args[1], sample, tags));
        }

        public time(
            measurement: string,
            value: number,
            sample: number,
            tags: Common.Dictionary<string>,
        ): void;
        public time(
            measurement: string,
            value: number,
            tags: Common.Dictionary<string>,
        ): void;
        public time(...args): void {
            const sample = args.length === 3 && 1 || args[2] || 1;
            const tags = this.assignTags(args[args.length - 1]);
            this.publish(Metric.time(args[0], args[1], sample, tags));
        }

        public set(
            measurement: string,
            value: number,
            sample: number,
            tags: Common.Dictionary<string>,
        ): void;
        public set(
            measurement: string,
            value: number,
            tags: Common.Dictionary<string>,
        ): void;
        public set(...args): void {
            const sample = args.length === 3 && 1 || args[2] || 1;
            const tags = this.assignTags(args[args.length - 1]);
            this.publish(Metric.set(args[0], args[1], sample, tags));
        }

        private publish(metric: Metric): void {
            if (metric.sample < 1 && metric.sample < Math.random()) {
                return;
            }

            this.channel.write(MetricSerializer.serializeMetric(metric));
        }

        private assignTags(tags: Common.Dictionary<string>): Common.Dictionary<string> {
            return Object.assign(this.tags, tags || {});
        }
    }
}