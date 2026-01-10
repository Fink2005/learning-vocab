-- Create study_sets table
create table if not exists study_sets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  target_language_id uuid references public.languages not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for study_sets
alter table study_sets enable row level security;

create policy "Users can view their own study sets"
  on study_sets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sets"
  on study_sets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study sets"
  on study_sets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own study sets"
  on study_sets for delete
  using (auth.uid() = user_id);

-- Create study_set_items table
create table if not exists study_set_items (
  id uuid default gen_random_uuid() primary key,
  study_set_id uuid references public.study_sets on delete cascade not null,
  vocabulary_id uuid references public.vocabularies on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(study_set_id, vocabulary_id)
);

-- Enable RLS for study_set_items
alter table study_set_items enable row level security;

-- Policies for items rely on the parent set permission, simplistically checking direct ownership via join might be expensive in RLS, 
-- but commonly we just check if the user owns the study_set.
-- However, standard practice often duplicates user_id or does a subquery. 
-- For simplicity/performance, often useful to rely on the cascade or direct checks.
-- Let's use a subquery for now to be safe.

create policy "Users can view items in their study sets"
  on study_set_items for select
  using (
    exists (
      select 1 from study_sets
      where study_sets.id = study_set_items.study_set_id
      and study_sets.user_id = auth.uid()
    )
  );

create policy "Users can insert items into their study sets"
  on study_set_items for insert
  with check (
    exists (
      select 1 from study_sets
      where study_sets.id = study_set_items.study_set_id
      and study_sets.user_id = auth.uid()
    )
  );

create policy "Users can delete items from their study sets"
  on study_set_items for delete
  using (
    exists (
      select 1 from study_sets
      where study_sets.id = study_set_items.study_set_id
      and study_sets.user_id = auth.uid()
    )
  );
