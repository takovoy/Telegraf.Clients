import {Formatters} from "./telegraf-formatters.namespace";
import {expect} from "chai";
import "mocha";

describe("Formatters test", () => {
    describe("FieldValueFormatter test", () => {
        it("Should correctly format numeric value", () => {
            expect(Formatters.FieldValueFormatter.format(12)).equal("12");
            expect(Formatters.FieldValueFormatter.format(12.12)).equal("12.12");
        });
        it("Should correctly format 'true' value", () => {
            expect(Formatters.FieldValueFormatter.format(true)).equal("t");
        });
        it("Should correctly format 'false' value", () => {
            expect(Formatters.FieldValueFormatter.format(false)).equal("f");
        });
        it("Should correctly format Date value", () => {
            const date = new Date("2019/11/08");
            const influxCorrelationTics = 1000000;
            expect(Formatters.FieldValueFormatter.format(date)).equal(`${date.getTime() * influxCorrelationTics}`);
        });
        it("Should correctly format stroke value", () => {
            expect(Formatters.FieldValueFormatter.format("too warm")).equal("\"too warm\"");
            expect(Formatters.FieldValueFormatter.format("too 'warm'")).equal("\"too 'warm'\"");
        });
    });

    describe("KeyFormatter test", () => {
        it("Should trim spaces", () => {
            expect(Formatters.KeyFormatter.format("   weather  ")).equal("weather");
        });

        it("Should screen spaces", () => {
            expect(Formatters.KeyFormatter.format("wea ther")).equal("wea\\ ther");
        });

        it("Should screen commas", () => {
            expect(Formatters.KeyFormatter.format("wea,ther")).equal("wea\\,ther");
        });

        it("Should screen =", () => {
            expect(Formatters.KeyFormatter.format("temp=rature")).equal("temp\\=rature");
        });

        it("Should screen \\n", () => {
            expect(Formatters.KeyFormatter.format("weather\n")).equal("weather");
        });

        it("Should screen \\t", () => {
            expect(Formatters.KeyFormatter.format("weather\t")).equal("weather");
        });

        it("Should screen \\v", () => {
            expect(Formatters.KeyFormatter.format("weather\v")).equal("weather");
        });

        it("Should work with '  ' string", () => {
            expect(Formatters.KeyFormatter.format("  ")).equal(null);
        });

        it("Should work with null value", () => {
            expect(Formatters.KeyFormatter.format(null)).equal(null);
        });
    });
});