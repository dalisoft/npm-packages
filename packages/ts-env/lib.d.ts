export function activate<
  TEnvs extends string[] = ['DEVELOPMENT', 'TESTING', 'PRODUCTION']
>(options: { on: TEnvs[number]; evns: TEnvs }): Promise<boolean>;
