## how to run

```
bun install
# run web storybook
bun storybook
# run rn storybook
bun start
```

## what is it

in `.storybook/preview.tsx` we have a decorator that can add any ui we want to the Story

in `.storybook/main.ts` we have a react-native-web-vite storybook setup with a modified version of the code from `@storybook/addon-react-native-server`

We can add node stuff in `.storybook/main.ts` and any stuff we want to override in the canvas to the decorator `.storybook/preview.tsx`
