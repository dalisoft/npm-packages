interface ITestBase<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
> {
  name: TName;
  input: TInput;
  test_input: TValidate;
  excepted: TExcepted;
  input_args?: TInputArgs;
}
interface ITestVariants<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
> extends ITestBase<TName, TInput, TInputArgs, TValidate, TExcepted> {
  variants: string[][];
}
interface ITestChild<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
> extends ITestBase<TName, TInput, TInputArgs, TValidate, TExcepted> {
  children: Array<
    | ITestBase<TName, TInput, TInputArgs, TValidate, TExcepted>
    | ITestVariants<TName, TInput, TInputArgs, TValidate, TExcepted>
    | ITestChild<TName, TInput, TInputArgs, TValidate, TExcepted>
  >;
}
interface ITestReturn<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
> {
  name: TName;
  args: [TInput, TValidate];
  excepted: TExcepted;
  input_args: TInputArgs;
}
interface ITestSuite<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
> {
  suite: string;
  tests: ITestReturn<TName, TInput, TInputArgs, TValidate, TExcepted>[];
}
type TestKind<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
> =
  | ITestBase<TName, TInput, TInputArgs, TValidate, TExcepted>
  | ITestVariants<TName, TInput, TInputArgs, TValidate, TExcepted>
  | ITestChild<TName, TInput, TInputArgs, TValidate, TExcepted>;

function generateTest<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
>(
  test: TestKind<TName, TInput, TInputArgs, TValidate, TExcepted>,
  is_parent: false
): ITestReturn<TName, TInput, TValidate, TExcepted>;
export function generateTest<
  TName = string,
  TInput = string,
  TInputArgs = string[],
  TValidate = string,
  TExcepted = string
>(
  test: TestKind<TName, TInput, TInputArgs, TValidate, TExcepted>,
  is_parent = true
): ITestSuite<TName, TInput, TInputArgs, TValidate, TExcepted> {
  const {
    name,
    input,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    test_input,
    excepted,
    variants,
    children,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    input_args = []
  } = test;

  if (variants) {
    return {
      suite: name,
      tests: (variants as string[][]).map(
        ([inputTemplate, testInputTemplate]) => {
          const inputIt =
            typeof inputTemplate === 'string'
              ? inputTemplate.replace(/%s/g, input)
              : input;
          const testInputIt =
            typeof testInputTemplate === 'string'
              ? testInputTemplate.replace(/%s/g, test_input)
              : test_input;

          return {
            name: inputIt,
            args: [inputIt, testInputIt],
            input_args,
            excepted
          };
        }
      )
    };
  }
  if (children) {
    return {
      suite: name,
      tests: (
        children as ITestChild<
          TName,
          TInput,
          TInputArgs,
          TValidate,
          TExcepted
        >[]
      ).map((child) => generateTest(child, false))
    };
  }
  if (!is_parent) {
    return { name, args: [input, test_input], input_args, excepted };
  }

  return {
    suite: name,
    tests: [
      { name: test_input, args: [input, test_input], input_args, excepted }
    ]
  };
}
