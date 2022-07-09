import { format } from 'date-fns'
import tko from '@tko/build.reference/dist/build.reference.es6';
import { computed } from '@/utils/decorators'
import ViewComponent from './ViewComponent';
import { addLoggerHook, logger } from '@/kotg/logger'

export class MainApp extends ViewComponent<typeof MainApp> {
  logs = ko.observableArray<string>([])

  constructor() {
    super()
    addLoggerHook(msg => this.logs.push(msg))
    logger.log(`[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] Started`)
  }

  @computed()
  get allLogs () {
    return this.logs().map(log => (
      <div class={this.jss.logLine}>{log}</div>
    ))
  }

  get template() {
    const { jss } = this
    return (
      <div class={jss.layout}>
        {this.allLogs}
      </div>
    );
  }

  static get css () {
    return {
      layout: {
      },
      logLine: {
      },
    }
  }
}

MainApp.register();
