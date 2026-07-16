(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.VekpalCountdown = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MILLISECONDS_PER_DAY = 86_400_000;
  const DEFAULT_KICKOFF = "2026-06-11T00:00:00-06:00";
  const DEFAULT_FINAL = "2026-07-19T15:00:00-04:00";

  function toDate(value) {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }

  function fallbackState() {
    return {
      state: "invalid",
      label: "ワールドカップ2026 決勝",
      value: "7月19日",
      detail: "2026年"
    };
  }

  function calculateCountdownState(
    nowValue,
    kickoffValue = DEFAULT_KICKOFF,
    finalValue = DEFAULT_FINAL
  ) {
    const now = toDate(nowValue);
    const kickoff = toDate(kickoffValue);
    const final = toDate(finalValue);

    if (
      Number.isNaN(now.getTime()) ||
      Number.isNaN(kickoff.getTime()) ||
      Number.isNaN(final.getTime()) ||
      final <= kickoff
    ) {
      return fallbackState();
    }

    if (now < kickoff) {
      return {
        state: "before-kickoff",
        label: "開幕まで",
        value: String(Math.max(0, Math.ceil((kickoff - now) / MILLISECONDS_PER_DAY))),
        detail: "日"
      };
    }

    if (now < final) {
      return {
        state: "during-tournament",
        label: "決勝まで",
        value: String(Math.max(0, Math.ceil((final - now) / MILLISECONDS_PER_DAY))),
        detail: "日"
      };
    }

    return {
      state: "after-final",
      label: "ワールドカップ2026",
      value: "大会記録を見る",
      detail: "2026年大会"
    };
  }

  function renderCountdown(
    doc,
    nowValue = new Date(),
    kickoffValue = DEFAULT_KICKOFF,
    finalValue = DEFAULT_FINAL
  ) {
    if (!doc || typeof doc.querySelector !== "function") {
      return false;
    }

    const label = doc.querySelector("#countdown-label");
    const value = doc.querySelector("#countdown-days");
    const detail = doc.querySelector("#countdown-detail");

    if (!label || !value || !detail) {
      return false;
    }

    const result = calculateCountdownState(nowValue, kickoffValue, finalValue);
    if (result.state === "invalid") {
      return false;
    }

    label.textContent = result.label;
    value.textContent = result.value;
    value.dataset.state = result.state;
    detail.textContent = result.detail;
    return true;
  }

  return {
    DEFAULT_FINAL,
    DEFAULT_KICKOFF,
    calculateCountdownState,
    renderCountdown
  };
});
