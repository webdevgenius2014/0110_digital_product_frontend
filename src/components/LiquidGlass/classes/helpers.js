import { debounce } from "lodash";

export const debounceWithHooks = (fn, delay, { onStart, onComplete } = {}) => {
  let active = false;

  let debounced = debounce(() => {
    active = false;
    fn();
    if (onComplete) onComplete();
  }, delay);

  return (...args) => {
    if (!active) {
      active = true;
      if (onStart) onStart();
    }
    debounced(...args);
  };
};
