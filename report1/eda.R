library(tidyverse)

dt = read_csv('Lekagul Sensor Data.csv')

dt = dt %>%
  separate(Timestamp, c("date", "time"), remove = F, sep = " ")

dt = dt %>%
  group_by(`car-id`) %>%
  mutate(duration = Timestamp - lag(Timestamp))

dt = dt %>%
  group_by(`car-id`) %>%
  mutate(path = paste(`gate-name`, lag(`gate-name`), sep='-'))

dt %>%
  filter(!is.na(duration)) %>%
  ggplot(aes(x = duration)) +
  geom_histogram() +
  facet_wrap(~`car-type`, scales = 'free_x')

dt %>%
  filter(duration > 1E5) %>%
  mutate(duration_days = duration / 86400) %>%
  select(duration_days, `car-id`, `path`) %>%
  View()

dt %>%
  filter(`car-id` == '20154519024544-322') %>%
  View()

dt %>%
  separate(time, c("h", "m", "s")) %>%
  mutate(h = as.numeric(h), m = as.numeric(h), s = as.numeric(s)) %>%
  ggplot(aes(x = h)) +
  geom_histogram()


ggsave('duration-path.png', width = 20, height = 20)
