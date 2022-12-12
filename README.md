# vet-availability

Calculates the available 15 minutes time slots from a schedule taking into account breaks.

Output example:

```
2020-04-29 10:00 - 10:15 John Doe
2020-04-29 10:00 - 10:15 Jane Doe
2020-04-29 10:15 - 10:30 John Doe
2020-04-29 10:15 - 10:30 Jane Doe
2020-04-29 10:30 - 10:45 John Doe
2020-04-29 10:45 - 11:00 John Doe
```

This project uses Deno and is set to run on Github Codespaces
https://deno.land/manual@v1.28.3/getting_started/setup_your_environment#github-codespaces


## Run program

To run the program you have to have [installed Deno](https://deno.land/manual@v1.28.3/getting_started/installation). Then execute

```bash
deno run --allow-read src/index.ts
```

## Execute tests

```bash
deno test --allow-read
```

## Assumptions

- We don't support schedules that span more than one day
- All dates are in UTC
