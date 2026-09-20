import { fireEvent, screen } from '@testing-library/react';

/** Opens a shadcn/Radix select from its trigger and picks the option with this
 * visible label — the keyboard path, since jsdom has no layout for pointer events.
 * (The pointer-capture/scrollIntoView stubs Radix needs live in src/test/setup.ts.) */
export async function chooseOption(trigger: HTMLElement, optionName: string | RegExp): Promise<void> {
  fireEvent.keyDown(trigger, { key: 'Enter' });
  fireEvent.click(await screen.findByRole('option', { name: optionName }));
}
