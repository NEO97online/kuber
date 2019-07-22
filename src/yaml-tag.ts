import YAML from 'yaml'

export default function yaml() {
  const args = new Array(arguments.length)
  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i]
  }

  const string = args.shift()
  const raw = string.raw
  var result = ''

  args.forEach(applySubstitutions)
  result += raw[raw.length - 1]
  return YAML.parse(result)

  function applySubstitutions(arg: string, i: number) {
    var lit = raw[i]
    if (Array.isArray(arg)) {
      arg = arg.join('')
    }
    result += lit + arg
  }
}
