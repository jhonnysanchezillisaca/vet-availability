import { dateFns } from "./deps.ts";

interface RawSchedule {
  scheduleId: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  startBreak: string;
  endBreak: string;
  startBreak2: string;
  endBreak2: string;
  startBreak3: string;
  endBreak3: string;
  startBreak4: string;
  endBreak4: string;
  employeeId: number;
  employeeName: string;
}

interface Break {
  startTime: Date;
  endTime: Date;
}

interface Employee {
  id: number;
  name: string;
}

interface Schedule {
  id: number;
  startDateTime: Date;
  endDateTime: Date;
  breaks: Break[];
  employee: Employee;
}

interface Interval {
  start: Date;
  end: Date;
  employeeName?: string;
}

const fileName = Deno.args[0] ?? "src/input.json";
console.info(`using file ${fileName}`);
const input = await Deno.readTextFile(fileName);
const result = getAvailableTimesFromRawText(input);

// print lines to console
result.forEach((line) => console.log(line));

export function getAvailableTimesFromRawText(input: string): string[] {
  const rawSchedules = JSON.parse(input) as RawSchedule[];

  const sortedAvailability = rawSchedules.flatMap((rawSchedule) =>
    getAvailablility(toSchedule(rawSchedule))
  ).sort((a, b) => a.start.getTime() - b.start.getTime());

  return formatIntervals(sortedAvailability);
}

function formatIntervals(intervals: Interval[]): string[] {
  const resultLines = [];
  for (const interval of intervals) {
    resultLines.push(
      `${dateFns.format(interval.start, "yyyy-MM-dd HH:mm")} - ${
        dateFns.format(interval.end, "HH:mm")
      } ${interval.employeeName}`,
    );
  }

  return resultLines;
}

function getAvailablility(schedule: Schedule): Interval[] {
  const intervalDurationInMinutes = 15;
  const workingTimeStart15MinutesIntervals = dateFns.eachMinuteOfInterval({
    start: schedule.startDateTime,
    end: schedule.endDateTime,
  }, { step: intervalDurationInMinutes });

  // last array element removed as it is the same as endDateTime
  workingTimeStart15MinutesIntervals.splice(-1);

  const workingTimeIntervals = workingTimeStart15MinutesIntervals.map(
    (startDate) => ({
      start: startDate,
      end: dateFns.addMinutes(startDate, intervalDurationInMinutes),
      employeeName: schedule.employee.name,
    }),
  );

  const availableIntervals = workingTimeIntervals.filter((
    interval,
  ) =>
    !isIntervalInBreaks(
      interval,
      schedule.breaks,
    )
  );

  return availableIntervals;
}

function isIntervalInBreaks(interval: Interval, breaks: Break[]) {
  for (const scheduledBreak of breaks) {
    const isInBreak = dateFns.areIntervalsOverlapping(interval, {
      start: scheduledBreak.startTime,
      end: scheduledBreak.endTime,
    });
    if (isInBreak) {
      return true;
    }
  }
  return false;
}

function toSchedule(raw: RawSchedule): Schedule {
  return {
    id: raw.scheduleId,
    // I assume that datetime is in UTC
    startDateTime: new Date(`${raw.startDate}T${raw.startTime}`),
    endDateTime: new Date(`${raw.endDate}T${raw.endTime}`),
    employee: { id: raw.employeeId, name: raw.employeeName },
    breaks: getBreaks(
      raw.startDate,
      raw.startBreak,
      raw.endBreak,
      raw.startBreak2,
      raw.endBreak2,
      raw.startBreak3,
      raw.endBreak3,
      raw.startBreak4,
      raw.endBreak4,
    ),
  };
}

/**
 * @param startBreak
 * @param endBreak
 * @param startBreak2
 * @param endBreak2
 * @param startBreak3
 * @param endBreak3
 * @param startBreak4
 * @param endBreak4
 * @returns List of breaks. Ignores empty breaks
 *
 * We assume that the breaks date is the same as the start date
 */
function getBreaks(
  startDate: string,
  startBreak: string,
  endBreak: string,
  startBreak2: string,
  endBreak2: string,
  startBreak3: string,
  endBreak3: string,
  startBreak4: string,
  endBreak4: string,
): Break[] {
  const breaks: { startTime: string; endTime: string }[] = [
    { startTime: startBreak, endTime: endBreak },
    { startTime: startBreak2, endTime: endBreak2 },
    { startTime: startBreak3, endTime: endBreak3 },
    { startTime: startBreak4, endTime: endBreak4 },
  ];

  const notNullBreaks = breaks.filter((b) => isBreak(b.startTime, b.endTime));

  return notNullBreaks.map((b) => ({
    startTime: new Date(`${startDate}T${b.startTime}`),
    endTime: new Date(`${startDate}T${b.endTime}`),
  }));
}

function isBreak(startTimeRaw: string, endTimeRaw: string): boolean {
  return startTimeRaw !== "00:00:00" && endTimeRaw !== "00:00:00";
}
