import { Context, Schema } from 'koishi'
import trustProxy from 'koa-trust-proxy'

export const name = 'xff'

export interface Config {
  header: string
  proxies: string[]
}

export const Config: Schema<Config> = Schema.object({
  header: Schema.string().default('X-Forwarded-For').description('代理头名称。'),
  proxies: Schema.array(String).default(['loopback', '172.16.0.0/12']).description('可信任的代理服务器。'),
})

export function apply(ctx: Context, config: Config) {
  ctx.router.use(trustProxy(this.trustedProxies, this.header))
  const { stack } = ctx.router
  const xffStack = stack.pop()
  stack.unshift(xffStack)
}
