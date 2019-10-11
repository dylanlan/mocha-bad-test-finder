import {Command, flags} from '@oclif/command'

export default class Large extends Command {
  static description = 'Find mocha tests that have too many lines of code'

  static flags = {
    help: flags.help({char: 'h'}),
    dir: flags.string({char: 'd', description: 'directory containing tests to search'}),
    lines: flags.integer({char: 'l', description: 'number of lines of test code that is too many'}),
    top: flags.integer({char: 'd', description: 'directory containing tests to search'}),
  }

  async run() {
    const {flags} = this.parse(Large)

    const lines = flags.lines || 20
    const dir = flags.dir || '.'
    const top = flags.top || 20

    this.log(`you input --dir: ${dir} --lines: ${lines} --top: ${top}`)
  }
}
