export interface DeviceInfo {
  os: 'ios' | 'android' | 'harmony' | 'unknown';
  container: 'wechat' | 'miniprogram' | 'app' | 'browser';
  // ...其他设备信息
}

export class Device {
  private static instance: Device;
  private deviceInfo: DeviceInfo;

  private constructor() {
    this.deviceInfo = this.detect();
  }

  public static getInstance(): Device {
    if (!Device.instance) {
      Device.instance = new Device();
    }
    return Device.instance;
  }

  private detect(): DeviceInfo {
    // 实现设备检测逻辑
    return {
      os: 'unknown',
      container: 'browser'
    };
  }

  public getInfo(): DeviceInfo {
    return this.deviceInfo;
  }
}
