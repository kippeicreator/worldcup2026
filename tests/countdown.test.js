"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  calculateCountdownState,
  renderCountdown
} = require("../countdown.js");

const KICKOFF = "2026-06-11T00:00:00Z";
const FINAL = "2026-07-19T12:00:00Z";

test("開幕前は開幕までの日数を返す", () => {
  const result = calculateCountdownState("2026-06-10T00:00:00Z", KICKOFF, FINAL);
  assert.equal(result.state, "before-kickoff");
  assert.equal(result.value, "1");
  assert.equal(result.detail, "日");
});

test("開幕日時から大会期間中になる", () => {
  const result = calculateCountdownState(KICKOFF, KICKOFF, FINAL);
  assert.equal(result.state, "during-tournament");
  assert.equal(result.label, "決勝まで");
});

test("大会期間中は決勝までの日数を返す", () => {
  const result = calculateCountdownState("2026-07-01T12:00:00Z", KICKOFF, FINAL);
  assert.equal(result.state, "during-tournament");
  assert.equal(result.detail, "日");
});

test("決勝前日は残り1日になる", () => {
  const result = calculateCountdownState("2026-07-18T12:00:00Z", KICKOFF, FINAL);
  assert.equal(result.value, "1");
});

test("決勝日時以降は大会記録への案内を返す", () => {
  const result = calculateCountdownState(FINAL, KICKOFF, FINAL);
  assert.equal(result.state, "after-final");
  assert.equal(result.value, "大会記録を見る");
});

test("無効な日付では安全なフォールバック状態を返す", () => {
  const result = calculateCountdownState("not-a-date", KICKOFF, FINAL);
  assert.equal(result.state, "invalid");
  assert.equal(result.value, "7月19日");
});

test("対象DOMがないページでは何も変更せずfalseを返す", () => {
  assert.equal(renderCountdown(null, KICKOFF, KICKOFF, FINAL), false);
  assert.equal(renderCountdown({ querySelector: () => null }, KICKOFF, KICKOFF, FINAL), false);
});
