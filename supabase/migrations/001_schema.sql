-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Muscle groups
create table public.muscle_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null
);

alter table public.muscle_groups enable row level security;
create policy "Muscle groups are viewable by everyone" on public.muscle_groups for select using (true);

-- Exercises
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text not null default '',
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  muscle_group_id uuid references public.muscle_groups on delete cascade not null,
  secondary_muscles text[] default '{}',
  instructions text not null default ''
);

alter table public.exercises enable row level security;
create policy "Exercises are viewable by everyone" on public.exercises for select using (true);

-- Weekly goals
create table public.weekly_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  exercise_id uuid references public.exercises on delete cascade not null,
  week_start date not null,
  target_reps integer not null check (target_reps > 0),
  unique(user_id, exercise_id, week_start)
);

alter table public.weekly_goals enable row level security;
create policy "Users can view own goals" on public.weekly_goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.weekly_goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.weekly_goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.weekly_goals for delete using (auth.uid() = user_id);
create policy "Friends can view goals" on public.weekly_goals for select using (
  exists (
    select 1 from public.friendships
    where status = 'accepted'
    and ((requester_id = auth.uid() and addressee_id = user_id)
      or (addressee_id = auth.uid() and requester_id = user_id))
  )
);

-- Daily logs
create table public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  exercise_id uuid references public.exercises on delete cascade not null,
  log_date date not null default current_date,
  reps integer not null check (reps > 0),
  sets integer not null default 1 check (sets > 0),
  notes text,
  created_at timestamptz default now() not null
);

alter table public.daily_logs enable row level security;
create policy "Users can view own logs" on public.daily_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.daily_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own logs" on public.daily_logs for update using (auth.uid() = user_id);
create policy "Users can delete own logs" on public.daily_logs for delete using (auth.uid() = user_id);
create policy "Friends can view logs" on public.daily_logs for select using (
  exists (
    select 1 from public.friendships
    where status = 'accepted'
    and ((requester_id = auth.uid() and addressee_id = user_id)
      or (addressee_id = auth.uid() and requester_id = user_id))
  )
);

-- Friendships
create table public.friendships (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.profiles on delete cascade not null,
  addressee_id uuid references public.profiles on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'blocked')),
  created_at timestamptz default now() not null,
  unique(requester_id, addressee_id)
);

alter table public.friendships enable row level security;
create policy "Users can view own friendships" on public.friendships for select using (auth.uid() = requester_id or auth.uid() = addressee_id);
create policy "Users can send friend requests" on public.friendships for insert with check (auth.uid() = requester_id);
create policy "Users can update received requests" on public.friendships for update using (auth.uid() = addressee_id or auth.uid() = requester_id);
create policy "Users can delete own friendships" on public.friendships for delete using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Activity feed
create table public.activity_feed (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  activity_type text not null,
  payload jsonb default '{}' not null,
  created_at timestamptz default now() not null
);

alter table public.activity_feed enable row level security;
create policy "Users can view own feed" on public.activity_feed for select using (auth.uid() = user_id);
create policy "Friends can view feed" on public.activity_feed for select using (
  exists (
    select 1 from public.friendships
    where status = 'accepted'
    and ((requester_id = auth.uid() and addressee_id = user_id)
      or (addressee_id = auth.uid() and requester_id = user_id))
  )
);
create policy "System can insert feed items" on public.activity_feed for insert with check (auth.uid() = user_id);

-- Cardio runs
create table public.cardio_runs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  started_at timestamptz default now() not null,
  finished_at timestamptz,
  total_distance_m double precision default 0 not null,
  total_duration_s integer default 0 not null,
  avg_pace double precision,
  route_geojson jsonb
);

alter table public.cardio_runs enable row level security;
create policy "Users can view own runs" on public.cardio_runs for select using (auth.uid() = user_id);
create policy "Users can insert own runs" on public.cardio_runs for insert with check (auth.uid() = user_id);
create policy "Users can update own runs" on public.cardio_runs for update using (auth.uid() = user_id);
create policy "Friends can view runs" on public.cardio_runs for select using (
  exists (
    select 1 from public.friendships
    where status = 'accepted'
    and ((requester_id = auth.uid() and addressee_id = user_id)
      or (addressee_id = auth.uid() and requester_id = user_id))
  )
);

-- Run waypoints
create table public.run_waypoints (
  id uuid default uuid_generate_v4() primary key,
  run_id uuid references public.cardio_runs on delete cascade not null,
  lat double precision not null,
  lng double precision not null,
  altitude double precision,
  accuracy double precision,
  timestamp timestamptz default now() not null,
  elapsed_s integer not null default 0,
  segment_distance_m double precision not null default 0
);

alter table public.run_waypoints enable row level security;
create policy "Users can view own waypoints" on public.run_waypoints for select using (
  exists (select 1 from public.cardio_runs where id = run_id and user_id = auth.uid())
);
create policy "Users can insert own waypoints" on public.run_waypoints for insert with check (
  exists (select 1 from public.cardio_runs where id = run_id and user_id = auth.uid())
);

-- Weekly leaderboard view
create or replace view public.weekly_leaderboard as
select
  dl.user_id,
  p.username,
  p.display_name,
  p.avatar_url,
  dl.exercise_id,
  e.name as exercise_name,
  date_trunc('week', dl.log_date::timestamp)::date as week_start,
  sum(dl.reps * dl.sets) as total_reps
from public.daily_logs dl
join public.profiles p on p.id = dl.user_id
join public.exercises e on e.id = dl.exercise_id
group by dl.user_id, p.username, p.display_name, p.avatar_url, dl.exercise_id, e.name, date_trunc('week', dl.log_date::timestamp)::date;

-- Triggers for activity feed
create or replace function public.log_workout_activity()
returns trigger as $$
begin
  insert into public.activity_feed (user_id, activity_type, payload)
  values (
    new.user_id,
    'workout_log',
    jsonb_build_object(
      'exercise_id', new.exercise_id,
      'reps', new.reps,
      'sets', new.sets,
      'log_date', new.log_date
    )
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_workout_logged
  after insert on public.daily_logs
  for each row execute function public.log_workout_activity();

create or replace function public.log_goal_activity()
returns trigger as $$
begin
  insert into public.activity_feed (user_id, activity_type, payload)
  values (
    new.user_id,
    'goal_set',
    jsonb_build_object(
      'exercise_id', new.exercise_id,
      'target_reps', new.target_reps,
      'week_start', new.week_start
    )
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_goal_set
  after insert on public.weekly_goals
  for each row execute function public.log_goal_activity();

create or replace function public.log_run_complete_activity()
returns trigger as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    insert into public.activity_feed (user_id, activity_type, payload)
    values (
      new.user_id,
      'run_complete',
      jsonb_build_object(
        'run_id', new.id,
        'distance_m', new.total_distance_m,
        'duration_s', new.total_duration_s
      )
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_run_completed
  after update on public.cardio_runs
  for each row execute function public.log_run_complete_activity();

create or replace function public.log_friendship_activity()
returns trigger as $$
begin
  if new.status = 'accepted' and (old is null or old.status != 'accepted') then
    insert into public.activity_feed (user_id, activity_type, payload)
    values (
      new.requester_id,
      'friend_added',
      jsonb_build_object('friend_id', new.addressee_id)
    );
    insert into public.activity_feed (user_id, activity_type, payload)
    values (
      new.addressee_id,
      'friend_added',
      jsonb_build_object('friend_id', new.requester_id)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_friendship_accepted
  after update on public.friendships
  for each row execute function public.log_friendship_activity();

-- Indexes
create index idx_daily_logs_user_date on public.daily_logs (user_id, log_date);
create index idx_daily_logs_exercise on public.daily_logs (exercise_id);
create index idx_weekly_goals_user_week on public.weekly_goals (user_id, week_start);
create index idx_activity_feed_user on public.activity_feed (user_id, created_at desc);
create index idx_run_waypoints_run on public.run_waypoints (run_id, timestamp);
create index idx_friendships_users on public.friendships (requester_id, addressee_id);

-- Enable realtime on activity_feed
alter publication supabase_realtime add table public.activity_feed;
