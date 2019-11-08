'use strict';Object.defineProperty(exports,'__esModule',{value:true});const dgram=require('dgram');var Chanel;(function(Chanel){let ProtocolsEnum;(function(ProtocolsEnum){ProtocolsEnum['udp4']='udp4';}(ProtocolsEnum||(ProtocolsEnum={})));class Channel{constructor(connectionHost='127.0.0.1',connectionPort=8125,protocol){this.connectionHost=connectionHost;this.connectionPort=connectionPort;this.protocol=protocol;this._socket=dgram.createSocket(protocol);}write(metric){if(!metric||!metric.trim()){return Promise.reject('Invalid metric data');}const encodedCommand=Buffer.from(metric,'utf8');return new Promise((resolve,reject)=>this._socket.send(encodedCommand,0,encodedCommand.length,this.connectionPort,this.connectionHost,(error,bytes)=>{if(error){reject(error);return;}resolve(bytes);}));}}class UdpChannel extends Channel{constructor(connectionHost,connectionPort){super(connectionHost,connectionPort,ProtocolsEnum.udp4);}}Chanel.UdpChannel=UdpChannel;}(Chanel=exports.Chanel||(exports.Chanel={})));