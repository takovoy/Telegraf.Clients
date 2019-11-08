import {expect} from "chai";
import "mocha";
import {Statsd} from "./telegraf-statsd.namespace";

describe("Statsd test", () => {
    describe("MetricSerializer test", () => {
        it("should correctly format 'Counter' value", () => {
            let metric: Statsd.Metric = Statsd.Metric.counter("deploys.test.myservice", 1, 0.1);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("deploys.test.myservice:1|c|@0.1");
            metric = Statsd.Metric.counter("deploys.test.myservice", 1);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("deploys.test.myservice:1|c");
            metric = Statsd.Metric.counter("deploys.test.myservice", 101);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("deploys.test.myservice:101|c");
            metric = Statsd.Metric.counter("deploys.test.myservice", -1);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("deploys.test.myservice:-1|c");
            metric = Statsd.Metric.counter("deploys.test.myservice", 0.1);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("deploys.test.myservice:0.1|c");
        });

        it("should correctly format 'Gauge' value", () => {
            let metric: Statsd.Metric = Statsd.Metric.gauge("users.current.den001.myapp", 32);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("users.current.den001.myapp:32|g");
            metric = Statsd.Metric.gauge("users.current.den001.myapp", -10);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("users.current.den001.myapp:-10|g");
            metric = Statsd.Metric.gauge("users.current.den001.myapp", 1,0.1);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("users.current.den001.myapp:1|g|@0.1");
        });

        it("should correctly format 'Set' value", () => {
            let metric: Statsd.Metric = Statsd.Metric.set("users.unique", "101");
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("users.unique:101|s");
            metric = Statsd.Metric.set("users.unique", "test");
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("users.unique:test|s");
        });

        it("should correctly format 'Time' value", () => {
            let metric: Statsd.Metric = Statsd.Metric.time("load.time", 320);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("load.time:320|ms");
            metric = Statsd.Metric.time("load.time", 200,0.1);
            expect(Statsd.MetricSerializer.serializeMetric(metric))
                .equal("load.time:200|ms|@0.1");
        });
    });
});