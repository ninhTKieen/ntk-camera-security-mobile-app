import { parseSOAPString } from '@src/utils/onvif.util';
import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';

import { TOnvifDiscoveryDevice } from './onvif.model';

const dataToSend =
  '<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope"' +
  ' xmlns:dn="http://www.onvif.org/ver10/network/wsdl">' +
  '<Header>' +
  '<wsa:MessageID xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">' +
  'urn:uuid:92709f08-4888-c08f-f14a-fdb94c578c6e' +
  '</wsa:MessageID>' +
  '<wsa:To xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">' +
  'urn:schemas-xmlsoap-org:ws:2005:04:discovery' +
  '</wsa:To>' +
  '<wsa:Action xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">' +
  'http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe' +
  '</wsa:Action>' +
  '</Header>' +
  '<Body>' +
  '<Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery"' +
  ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
  ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<Types>dn:NetworkVideoTransmitter</Types>' +
  '<Scopes />' +
  '</Probe>' +
  '</Body>' +
  '</Envelope>';

class DiscoveryService {
  private port: number;
  private socket: UdpSocket | null;

  constructor(port = 54321) {
    this.port = port;
    this.socket = null;
  }

  init() {
    this.socket = dgram.createSocket({
      type: 'udp4',
    });
    this.socket?.bind(this.port);
  }

  discover() {
    if (!this.socket) {
      this.init();
      setTimeout(() => {
        this.socket?.send(
          dataToSend,
          undefined,
          undefined,
          3702,
          '239.255.255.250',
          function (err) {
            if (err) {
              console.log(err);
              throw err;
            }
          },
        );
      }, 2000);
    } else {
      this.socket.send(
        dataToSend,
        undefined,
        undefined,
        3702,
        '239.255.255.250',
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        },
      );
    }
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }

  getDevices(
    callback: (devices: TOnvifDiscoveryDevice[]) => object,
    timeout?: number,
  ) {
    timeout = timeout || 10000;
    if (!this.socket) {
      return;
    }
    const devices: TOnvifDiscoveryDevice[] = [];

    this.socket?.on('message', (buff) => {
      const msg = buff.toString();
      parseSOAPString(msg).then((data) => {
        const manufacturer = data?.probeMatches?.probeMatch?.scopes
          ?.split(' ')
          ?.find((scope: any) => scope.includes('onvif://www.onvif.org/name/'))
          ?.split('onvif://www.onvif.org/name/')[1];
        const model = data?.probeMatches?.probeMatch?.scopes
          ?.split(' ')
          ?.find((scope: any) =>
            scope.includes('onvif://www.onvif.org/hardware/'),
          )
          ?.split('onvif://www.onvif.org/hardware/')[1];
        const name = manufacturer + ' ' + model;

        const xAddrs = data?.probeMatches?.probeMatch?.XAddrs;
        if (!xAddrs) {
          return;
        }
        const match = xAddrs.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        const ip = match?.length > 0 ? match[0] : null;
        if (ip) {
          if (!devices.map((device) => device.ip).includes(ip)) {
            devices.push({ name, ip });
          }
        }
      });
    });

    setTimeout(() => {
      callback(devices);
      if (this.socket) {
        this.close();
      }
    }, timeout);
  }
}

const discoveryService = new DiscoveryService();

export default discoveryService;
