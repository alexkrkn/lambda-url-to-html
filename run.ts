import { handler } from './index';

const main = async () => {
  const res = await handler({} as any);
  console.log(res);
};

main();