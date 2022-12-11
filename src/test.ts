import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { getAvailableTimesFromRawText } from "./index.ts";

Deno.test("getAvailableTimesFromRawText should return all intervals if no break", () => {
  const input = `
    [
        {
          "scheduleId": 4711,
          "startDate": "2020-04-29",
          "startTime": "10:00:00",
          "endDate": "2020-04-29",
          "endTime": "11:00:00",
          "startBreak": "00:00:00",
          "endBreak": "00:00:00",
          "startBreak2": "00:00:00",
          "endBreak2": "00:00:00",
          "startBreak3": "00:00:00",
          "endBreak3": "00:00:00",
          "startBreak4": "00:00:00",
          "endBreak4": "00:00:00",
          "employeeId": 4712,
          "employeeName": "John Doe"
        }
    ]
    `;

  const result = getAvailableTimesFromRawText(input);

  const expected = [
    "2020-04-29 10:00 - 10:15 John Doe",
    "2020-04-29 10:15 - 10:30 John Doe",
    "2020-04-29 10:30 - 10:45 John Doe",
    "2020-04-29 10:45 - 11:00 John Doe",
  ];

  assertEquals(result, expected);
});

Deno.test("getAvailableTimesFromRawText shouldbe sorted by time", () => {
  const input = `
      [
          {
            "scheduleId": 4711,
            "startDate": "2020-04-29",
            "startTime": "10:00:00",
            "endDate": "2020-04-29",
            "endTime": "11:00:00",
            "startBreak": "00:00:00",
            "endBreak": "00:00:00",
            "startBreak2": "00:00:00",
            "endBreak2": "00:00:00",
            "startBreak3": "00:00:00",
            "endBreak3": "00:00:00",
            "startBreak4": "00:00:00",
            "endBreak4": "00:00:00",
            "employeeId": 4712,
            "employeeName": "John Doe"
          },
          {
            "scheduleId": 4713,
            "startDate": "2020-04-29",
            "startTime": "10:00:00",
            "endDate": "2020-04-29",
            "endTime": "12:35:00",
            "startBreak": "10:30:00",
            "endBreak": "12:30:00",
            "startBreak2": "00:00:00",
            "endBreak2": "00:00:00",
            "startBreak3": "00:00:00",
            "endBreak3": "00:00:00",
            "startBreak4": "00:00:00",
            "endBreak4": "00:00:00",
            "employeeId": 4714,
            "employeeName": "Jane Doe"
          }
      ]
      `;

  const result = getAvailableTimesFromRawText(input);

  const expected = [
    "2020-04-29 10:00 - 10:15 John Doe",
    "2020-04-29 10:00 - 10:15 Jane Doe",
    "2020-04-29 10:15 - 10:30 John Doe",
    "2020-04-29 10:15 - 10:30 Jane Doe",
    "2020-04-29 10:30 - 10:45 John Doe",
    "2020-04-29 10:45 - 11:00 John Doe",
  ];

  assertEquals(result, expected);
});

Deno.test("getAvailableTimesFromRawText should not return intervals in break", () => {
  const input = `
      [
          {
            "scheduleId": 4711,
            "startDate": "2020-04-29",
            "startTime": "10:00:00",
            "endDate": "2020-04-29",
            "endTime": "11:00:00",
            "startBreak": "10:30:00",
            "endBreak": "10:45:00",
            "startBreak2": "00:00:00",
            "endBreak2": "00:00:00",
            "startBreak3": "00:00:00",
            "endBreak3": "00:00:00",
            "startBreak4": "00:00:00",
            "endBreak4": "00:00:00",
            "employeeId": 4712,
            "employeeName": "John Doe"
          }
      ]
      `;

  const result = getAvailableTimesFromRawText(input);

  const expected = [
    "2020-04-29 10:00 - 10:15 John Doe",
    "2020-04-29 10:15 - 10:30 John Doe",
    "2020-04-29 10:45 - 11:00 John Doe",
  ];

  assertEquals(result, expected);
});

Deno.test("getAvailableTimesFromRawText should not return intervals ending after endDate", () => {
  const input = `
      [
          {
            "scheduleId": 4711,
            "startDate": "2020-04-29",
            "startTime": "10:00:00",
            "endDate": "2020-04-29",
            "endTime": "10:58:00",
            "startBreak": "10:30:00",
            "endBreak": "10:45:00",
            "startBreak2": "00:00:00",
            "endBreak2": "00:00:00",
            "startBreak3": "00:00:00",
            "endBreak3": "00:00:00",
            "startBreak4": "00:00:00",
            "endBreak4": "00:00:00",
            "employeeId": 4712,
            "employeeName": "John Doe"
          }
      ]
      `;

  const result = getAvailableTimesFromRawText(input);

  const expected = [
    "2020-04-29 10:00 - 10:15 John Doe",
    "2020-04-29 10:15 - 10:30 John Doe",
  ];

  assertEquals(result, expected);
});

Deno.test("getAvailableTimesFromRawText should throw if startTime is after endTime", () => {
  const input = `
        [
            {
              "scheduleId": 4711,
              "startDate": "2020-04-29",
              "startTime": "12:00:00",
              "endDate": "2020-04-29",
              "endTime": "10:00:00",
              "startBreak": "10:30:00",
              "endBreak": "10:45:00",
              "startBreak2": "00:00:00",
              "endBreak2": "00:00:00",
              "startBreak3": "00:00:00",
              "endBreak3": "00:00:00",
              "startBreak4": "00:00:00",
              "endBreak4": "00:00:00",
              "employeeId": 4712,
              "employeeName": "John Doe"
            }
        ]
        `;

  assertThrows(() => getAvailableTimesFromRawText(input));
});

Deno.test("getAvailableTimesFromRawText should return intervals if all breaks are the same", () => {
  const input = `
        [
            {
              "scheduleId": 4711,
              "startDate": "2020-04-29",
              "startTime": "10:00:00",
              "endDate": "2020-04-29",
              "endTime": "11:00:00",
              "startBreak": "10:30:00",
              "endBreak": "10:45:00",
              "startBreak2": "10:30:00",
              "endBreak2": "10:45:00",
              "startBreak3": "10:30:00",
              "endBreak3": "10:45:00",
              "startBreak4": "10:30:00",
              "endBreak4": "10:45:00",
              "employeeId": 4712,
              "employeeName": "John Doe"
            }
        ]
        `;

  const result = getAvailableTimesFromRawText(input);

  const expected = [
    "2020-04-29 10:00 - 10:15 John Doe",
    "2020-04-29 10:15 - 10:30 John Doe",
    "2020-04-29 10:45 - 11:00 John Doe",
  ];

  assertEquals(result, expected);
});
