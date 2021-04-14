library(tidyverse)
library(lubridate)

separate_visit = function(gate_types) {
  out = integer(length(gate_types))
  visit_num = 0
  seen = 0
  for (i in seq(length(gate_types))) {
    out[i] = visit_num
    if (gate_types[i] == "entrance") {
      if (seen == 0) {
        seen = 1
      } else {
        seen = 0
        visit_num = visit_num + 1
      }
    }
  }
  return(out)
}

dt = read_csv("Lekagul Sensor Data.csv")
dt = dt %>%
  mutate(
    Timestamp = lubridate::as_datetime(Timestamp),
    date = lubridate::as_date(Timestamp),
    hr = lubridate::hour(Timestamp),
    weekday = lubridate::wday(Timestamp),
    gate_type = stringr::str_remove(`gate-name`, '[0-9]$')
    )



nested_dt = dt %>%
  group_by(`car-id`) %>%
  nest()

nested_dt = nested_dt %>%
  mutate(data = map(data, function(x) {
    x$visit = separate_visit(x$gate_type)
    x$total_visit_count = max(x$visit) + 1
    return(x)
  }))

dt = unnest(nested_dt, cols = c(data)) %>%
  ungroup()

per_visit = dt %>%
  group_by(`car-type`, `car-id`, visit) %>%
  summarise(
    start_time = Timestamp[1],
    end_time = Timestamp[n()],
    stay_duration = as.numeric(as.duration(Timestamp[n()] - Timestamp[1]))/3600,
    stops = n(),
    num_generalgate = sum(gate_type == "general-gate"),
    num_rangerstop = sum(gate_type == "ranger-stop"),
    num_camping = sum(gate_type == "camping"),
    num_rangerbase = sum(gate_type == "ranger-base"),
    num_gate = sum(gate_type == "gate")
  )

per_car = per_visit %>%
  group_by(`car-type`, `car-id`) %>%
  summarise(
    total_visit = n(),
    total_stay_duration = sum(stay_duration),
    total_stops = sum(stops),
    total_num_generalgate = sum(num_generalgate),
    total_num_rangerstop = sum(num_rangerstop),
    total_num_camping = sum(num_camping),
    total_num_rangerbase = sum(num_rangerbase),
    total_num_gate = sum(num_gate)
  )

per_visit = left_join(per_visit, per_car, by = c('car-type', 'car-id'))

write_csv(per_visit, 'per_visit.csv')
write_csv(per_car, 'per_car.csv')
