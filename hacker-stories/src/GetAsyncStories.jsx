import {initialStories} from './InitialStories';

export const getAsyncStories = () =>
new Promise(resolve =>
  setTimeout(
    () => resolve({ data: { stories: initialStories } }),
    2000
  )
);

export default getAsyncStories;