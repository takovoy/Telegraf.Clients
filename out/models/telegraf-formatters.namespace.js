'use strict';Object.defineProperty(exports,'__esModule',{value:true});var Formatters;(function(Formatters){class FieldFormatter{static format(fields){if(!fields||!Object.keys(fields).length){return[''];}const formattedFields={};Object.keys(fields).forEach(key=>formattedFields[KeyFormatter.format(key)]=FieldValueFormatter.format(fields[key]));return Object.keys(formattedFields).filter(key=>key&&key.trim()&&formattedFields[key]&&formattedFields[key].trim()).map(key=>`${key}=${formattedFields[key]}`);}}Formatters.FieldFormatter=FieldFormatter;class FieldValueFormatter{static format(value){const formatter=this.getFormatter(value);if(formatter){return formatter(value);}return this.formatString((value||'').toString().trim());}static formatNumber(value){return value.toString();}static formatBoolean(value){return value?'t':'f';}static formatString(stringValue){return`\"${stringValue.replace('"','\\"')}\"`;}static formatDate(value){return(+value*100).toString();}static getFormatter(value){if(value instanceof Date){return FieldValueFormatter.formatters.Date;}return FieldValueFormatter.formatters[typeof value]||FieldValueFormatter.formatters.string;}}FieldValueFormatter.formatters={number:FieldValueFormatter.formatNumber,boolean:FieldValueFormatter.formatBoolean,Date:FieldValueFormatter.formatDate};Formatters.FieldValueFormatter=FieldValueFormatter;class KeyFormatter{static format(value){return value&&value.trim().toLowerCase().replace(' ','\\ ').replace(',','\\,').replace('=','\\=').replace(/[/\\?%*:|"<>]/g,'')||null;}}Formatters.KeyFormatter=KeyFormatter;class TagsFormatter{static format(tags){if(tags==null){return null;}if(!Object.keys(tags).length){return[''];}const formattedTags={};Object.keys(tags).forEach(key=>formattedTags[KeyFormatter.format(key)]=KeyFormatter.format(tags[key]));return Object.keys(formattedTags).filter(key=>key&&key.trim()&&formattedTags[key]&&formattedTags[key].trim()).map(key=>`${key}=${formattedTags[key]}`);}}Formatters.TagsFormatter=TagsFormatter;}(Formatters=exports.Formatters||(exports.Formatters={})));