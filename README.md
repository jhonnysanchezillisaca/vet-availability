# vet-availability

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
