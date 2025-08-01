export function activate<
  TEnvs extends string[] = ['DEVELOPMENT', 'TESTING', 'PRODUCTION']
>(options: { on: TEnvs[number]; envs: TEnvs }): Promise<boolean>;
