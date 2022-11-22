

SET datestyle = dmy;

CREATE TABLE reports (
  id SERIAL,
  create_date TIMESTAMP,
  name text,
  title text,
  description text,
  sql_code text,
  report_type integer, --1 primary, 2 child
  parent_report_id integer
);

CREATE TABLE report_params (
  id SERIAL,
  report_id integer,
  param_type text, --type 'range', 'combo', 'date', 'text', 'number'
  param_code text,
  param_name text,
  combo_sql text
);

CREATE TABLE users (
  id SERIAL,
  user_name text,
  user_pass text,
  category text
);

CREATE TABLE report_users (
  id SERIAL,
  record_date TIMESTAMP,
  report_id integer,
  user_name text,
  status_code text,
  update_date date
);

CREATE TABLE payments(
  id SERIAL,
  description text,
  date date,
  country text,
  create_date TIMESTAMP,
  amount integer
);