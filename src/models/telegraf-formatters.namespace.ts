import {Common} from "./common.namespace";

export namespace Formatters {
    export class FieldFormatter {
        public static format(fields: Common.Dictionary<any>): string[] {
            if (!fields || !Object.keys(fields).length) {
                return [""];
            }
            const formattedFields = {};
            Object.keys(fields).forEach(key => formattedFields[KeyFormatter.format(key)] = FieldValueFormatter.format(fields[key]));
            return Object.keys(formattedFields)
                .filter(key => key && key.trim() && formattedFields[key] && formattedFields[key].trim())
                .map(key => `${key}=${formattedFields[key]}`);
        }
    }

    export class FieldValueFormatter {
        private static readonly formatters: Common.Dictionary<Common.Func<any, string>> = {
            number: FieldValueFormatter.formatNumber,
            boolean: FieldValueFormatter.formatBoolean,
            Date: FieldValueFormatter.formatDate,
        };

        public static format(value: any): string {
            const formatter = this.getFormatter(value);
            if (formatter) {
                return formatter(value);
            }

            return this.formatString((value || "").toString().trim());
        }

        private static formatNumber(value: number): string {
            return value.toString();
        }

        private static formatBoolean(value: boolean): string {
            return value ? "t" : "f";
        }

        private static formatString(stringValue: string): string {
            return `\"${stringValue.replace("\"", "\\\"")}\"`;
        }

        public static formatDate(value: Date): string {
            return (+value * 100).toString();
        }

        private static getFormatter<ValueType>(value: ValueType): Common.Func<ValueType, string> {
            if (value instanceof Date) {
                return FieldValueFormatter.formatters.Date;
            }
            return FieldValueFormatter.formatters[typeof value] || FieldValueFormatter.formatters.string
        }
    }

    export class KeyFormatter {
        public static format(value: string): string {
            return value && value.trim()
                .toLowerCase()
                .replace(" ", "\\ ")
                .replace(",", "\\,")
                .replace("=", "\\=")
                .replace(/[/\\?%*:|"<>]/g, "") || null;
        }
    }

    export class TagsFormatter {
        public static format(tags: Common.Dictionary<string>): string[] {
            if (tags == null) {
                return null;
            }

            if (!Object.keys(tags).length) {
                return [""];
            }

            const formattedTags = {};
            Object.keys(tags).forEach(key => formattedTags[KeyFormatter.format(key)] = KeyFormatter.format(tags[key]));
            return Object.keys(formattedTags)
                .filter(key => key && key.trim() && formattedTags[key] && formattedTags[key].trim())
                .map(key => `${key}=${formattedTags[key]}`);
        }
    }
}