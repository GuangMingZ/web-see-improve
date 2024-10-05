import { getWebVitals, getResource } from './core/performance';
import { SdkBase, BasePlugin, PerformanceOption } from '@websee/types';
import { EVENTTYPES, STATUS_CODE } from '@websee/common';
import { getTimestamp, _global, on } from '@websee/utils';

export default class WebPerformance extends BasePlugin {
  type: string;
  options: PerformanceOption = {};
  constructor(options: PerformanceOption) {
    super(EVENTTYPES.PERFORMANCE);
    this.type = EVENTTYPES.PERFORMANCE;
    this.bindOptions(options);
  }
  bindOptions(options: PerformanceOption) {
    this.options = { ...options };
  }
  core({ transportData }: SdkBase) {
    // 获取FCP、LCP、TTFB、FID等指标
    getWebVitals((res: any) => {
      // name指标名称、rating 评级、value数值
      const { name, rating, value } = res;
      transportData.send({
        type: EVENTTYPES.PERFORMANCE,
        status: STATUS_CODE.OK,
        time: getTimestamp(),
        name,
        rating,
        value,
      });
    }, this.options);

    const observer = new PerformanceObserver(list => {
      if (this.options.silentLongTask !== true) {
        for (const long of list.getEntries()) {
          // 上报长任务详情
          transportData.send({
            type: EVENTTYPES.PERFORMANCE,
            name: 'longTask',
            longTask: long,
            time: getTimestamp(),
            status: STATUS_CODE.OK,
          });
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });

    on(_global, 'load', () => {
      if (this.options.silentResourceList !== true) {
        // 上报资源列表
        transportData.send({
          type: EVENTTYPES.PERFORMANCE,
          name: 'resourceList',
          time: getTimestamp(),
          status: STATUS_CODE.OK,
          resourceList: getResource(),
        });
      }

      if (this.options.silentMemory !== true) {
        // 上报内存情况, safari、firefox不支持该属性
        if (performance.memory) {
          transportData.send({
            type: EVENTTYPES.PERFORMANCE,
            name: 'memory',
            time: getTimestamp(),
            status: STATUS_CODE.OK,
            memory: {
              jsHeapSizeLimit: performance.memory && performance.memory.jsHeapSizeLimit,
              totalJSHeapSize: performance.memory && performance.memory.totalJSHeapSize,
              usedJSHeapSize: performance.memory && performance.memory.usedJSHeapSize,
            },
          });
        }
      }
    });
  }
  transform() {}
}
