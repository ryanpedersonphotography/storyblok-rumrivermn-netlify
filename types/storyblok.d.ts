declare module '@storyblok/react' {
  export type SbBlokData = Record<string, unknown>;
  export type ISbStoryData = Record<string, unknown>;
  export function storyblokEditable(input: unknown): Record<string, unknown>;
  export function storyblokInit(config: unknown): void;
  export function apiPlugin(): unknown;
  export function StoryblokComponent(props: { blok: unknown }): JSX.Element | null;
}

declare module '@storyblok/react/rsc' {
  export type SbBlokData = Record<string, unknown>;
  export type ISbStoryData = Record<string, unknown>;
  export function storyblokEditable(input: unknown): Record<string, unknown>;
  export function storyblokInit(config: unknown): void;
  export function apiPlugin(): unknown;
  export function StoryblokComponent(props: { blok: unknown }): JSX.Element | null;
}
