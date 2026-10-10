import type { KeyboardEvent } from "react";

/** Arrow, Home and End keys move between tabs, as screen-reader users expect of a tab list. */
export function onTabListKeyDown(e: KeyboardEvent<HTMLElement>) {
  const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
  if (current < 0) return;
  e.preventDefault();
  e.stopPropagation(); // the arrow keys must not also walk the avatar
  const next =
    e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (current + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus();
  tabs[next].click();
}
