-- Add image_url column to sparks table if it doesn't exist
do $$
begin
    if not exists (
        select 1 from information_schema.columns 
        where table_name = 'sparks' 
        and column_name = 'image_url'
    ) then
        alter table sparks add column image_url text;
    end if;
end $$; 