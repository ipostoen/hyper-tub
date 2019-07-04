const pad4 = function (num: number) {
  let ret: string = num.toString(16);
  while (ret.length < 4) {
    ret = "0" + ret;
  }
  return ret;
}
const random4 = function() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
export const generateUUID = () => {
  if (typeof (window) !== "undefined" && typeof (window.crypto) !== "undefined" && typeof (window.crypto.getRandomValues) !== "undefined") {
    let buf: Uint16Array = new Uint16Array(8);
    window.crypto.getRandomValues(buf);
    return (pad4(buf[0]) + pad4(buf[1]) + "-" + pad4(buf[2]) + "-" + pad4(buf[3]) + "-" + pad4(buf[4]) + "-" + pad4(buf[5]) + pad4(buf[6]) + pad4(buf[7]));
  } else {
    return random4() + random4() + "-" + random4() + "-" + random4() + "-" + random4() + "-" + random4() + random4() + random4();
  }
}

export const remBaseline = 16;
export function px2rem (pxVal: number) {
  return pxVal / remBaseline + 'rem';
}

export const findByName = <T>(areaName: string, areas: T[]): T | null => {
  return areas.find(area => area['name'] === areaName);
}
export const toOption = (title: string, value: any): {title: string, value: any} => {
  return {title, value};
}

export const toPeriod = (inputs: any[]) => {
  let start = new Date(Date.now()).setHours(0, 0, 0, 1);
  let end = new Date(Date.now()).setHours(23, 59, 59, 1);
  if (inputs.length === 1) {
    start = new Date(inputs[0]).setHours(0, 0, 0, 1);
    end = new Date(inputs[0]).setHours(23, 59, 59, 1);
  } else if (inputs.length === 2) {
    start = new Date(inputs[0]).valueOf();
    end = new Date(inputs[1]).valueOf();
  }
  return [(start / 1000).toFixed(0), (end / 1000).toFixed(0)];
}
// exort
