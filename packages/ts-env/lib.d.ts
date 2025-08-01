/**
 * Activate `dotenv` to `TypeScript` conversion
 * @param options.on On which ENV value get's activated `TypeScript` conversion
 * @param options.envs List of ENV values to be inferred
 * @returns Activation status
 * @example
 * ```ts
 * await activate({on: 'DEVELOPMENT', envs: ['DEVELOPMENT', 'PRODUCTION']})
 * ```
 */
export function activate<
  TEnvs extends string[] = ['DEVELOPMENT', 'TESTING', 'PRODUCTION']
>(options: { on: TEnvs[number]; envs: TEnvs }): Promise<boolean>;
