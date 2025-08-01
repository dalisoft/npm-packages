/**
 * Activate `dotenv` to `TypeScript` conversion
 * @param options.on On which ENV value get's activated `TypeScript` conversion
 * @param options.envs List of ENV values to be inferred
 * @returns Activation status
 * @example
 * ```ts
 * await activate({on: 'development', envs: ['development', 'test', 'production']})
 * ```
 */
export function activate<
  TEnvs extends string[] = ['development', 'test', 'production']
>(options: { on: TEnvs[number]; envs: TEnvs }): Promise<boolean>;
