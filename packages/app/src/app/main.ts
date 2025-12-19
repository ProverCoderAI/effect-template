import { Console, Effect, pipe } from "effect"

import { formatGreeting } from "../core/greeting.js"
import { readGreetingVariant } from "../shell/cli.js"

const program = pipe(
  readGreetingVariant,
  Effect.map((variant) => formatGreeting(variant)),
  Effect.tap(Console.log)
)

Effect.runSync(program)
