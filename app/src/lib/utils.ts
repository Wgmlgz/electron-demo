export const MIN_SCALE = 0.8;

export const fillArr = (actions: string, n = 5, sus = '  ') => {
  const arr = actions.match(/.{1,2}/g);
  if (!arr) throw Error('failed to parse actions string');
  const t = [...arr];
  for (let i = 0; i < n - t.length; ++i) {
    t.unshift(sus);
  }
  const res = t.slice(t.length - n);
  return res;
};
