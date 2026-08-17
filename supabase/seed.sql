-- PointBlank sample data: 5 active collections + 5 flagship products.
-- Safe to run any time after schema.sql — collections/products don't
-- depend on auth users, so this works on a totally fresh project.
--
-- Wild West, Zombie Apocalypse, Alien Invasion, Hunting Grounds, and Dino
-- Rampage are the only active collections right now; Spy Mission, Classic
-- Series, and Limited Editions are seeded inactive so they're easy to
-- bring back later.
--
-- Retailer accounts and orders are intentionally NOT created here because
-- Supabase manages auth.users specially. See "Seeding retailers & orders"
-- in the README for the 60-second way to create sample retailers
-- (sign up through /apply, then approve from /admin/retailers).

-- ─── Collections ────────────────────────────────────────────────────────
insert into collections (id, name, slug, subtitle, description, hero_image, sort_order, active) values
  (gen_random_uuid(), 'Wild West', 'wild-west', 'Turn the range into the frontier.', 'Saloon standoffs, outlaw hideouts, and frontier justice. Our best-selling theme, reimagined every season.', 'https://placehold.co/1600x900/1a1310/e4132b?text=WILD+WEST', 1, true),
  (gen_random_uuid(), 'Alien Invasion', 'alien-invasion', 'First contact. Last stand.', 'UFOs, breached outposts, and mothership assaults. Sci-fi themed targets that bring the range into another galaxy.', 'https://placehold.co/1600x900/0e1512/39e4a5?text=ALIEN+INVASION', 2, true),
  (gen_random_uuid(), 'Zombie Apocalypse', 'zombie-apocalypse', 'Survive the outbreak.', 'Quarantine zones, last stands, and outbreak protocols. Our most requested collection, refreshed quarterly.', 'https://placehold.co/1600x900/141311/c7d92c?text=ZOMBIE+APOCALYPSE', 3, true),
  (gen_random_uuid(), 'Spy Mission', 'spy-mission', 'Trust no one. Hit every mark.', 'Covert ops, double agents, and field training. Sleek design without the cliche camo.', 'https://placehold.co/1600x900/10141a/2c9ad9?text=SPY+MISSION', 4, false),
  (gen_random_uuid(), 'Classic Series', 'classic-series', 'Precision, without the noise.', 'Clean bullseyes, silhouettes, and grids for retailers who want a dependable staple alongside the fun stuff.', 'https://placehold.co/1600x900/121212/f5f4f2?text=CLASSIC+SERIES', 5, false),
  (gen_random_uuid(), 'Limited Editions', 'limited-editions', 'Here for a season. Gone for good.', 'Small-batch drops and seasonal releases. Once they sell out, they don''t come back.', 'https://placehold.co/1600x900/1a1310/e4132b?text=LIMITED+EDITIONS', 6, false),
  (gen_random_uuid(), 'Hunting Grounds', 'monster-hunt', 'The wild is watching back.', 'Apex predators lurking in the fog. A moody wilderness collection for hunters and range-goers who want their targets to feel alive.', 'https://placehold.co/1600x900/1a2414/6b8f47?text=HUNTING+GROUNDS', 7, true),
  (gen_random_uuid(), 'Dino Rampage', 'dino-rampage', 'Extinction just got interesting.', 'A prehistoric jungle overrun by apex dinosaurs and a smoking volcano. Bold, cinematic, and unlike anything else on the range.', 'https://placehold.co/1600x900/1f1408/e8930f?text=DINO+RAMPAGE', 8, true)
on conflict (slug) do nothing;

-- ─── Products ───────────────────────────────────────────────────────────
insert into products (sku, name, slug, description, collection_id, wholesale_price, msrp, moq, pack_quantity, dimensions, paper_spec, inventory, image_url, gallery, is_new, is_bestseller, is_limited, is_range_favorite) values
  ('WW-SHOWDOWN-10T', 'Wild West Showdown', 'wild-west-showdown', 'A sprawling frontier town scene with 10 numbered outlaws to hit across the saloon, sheriff''s office, and dusty main street.', (select id from collections where slug = 'wild-west'), 26.00, 44.99, 15, 15, '24 x 36 in', '28lb premium target paper, matte finish', 200, '/products/wild-west-showdown.png', '[]', true, true, false, true),
  ('ZA-OUTBREAK-10T', 'Zombie City Outbreak', 'zombie-city-outbreak', 'A ruined downtown overrun by 10 numbered undead, spread across abandoned cars, a police cruiser, and a derelict bus.', (select id from collections where slug = 'zombie-apocalypse'), 26.00, 44.99, 15, 15, '24 x 36 in', '28lb premium target paper, matte finish', 200, '/products/zombie-city-outbreak.png', '[]', true, true, false, true),
  ('AI-OUTPOST-10T', 'Alien Outpost Invasion', 'alien-outpost-invasion', 'A remote alien colony scene with 10 numbered extraterrestrials scattered across towers, a landed ship, and rocky terrain.', (select id from collections where slug = 'alien-invasion'), 26.00, 44.99, 15, 15, '24 x 36 in', '28lb premium target paper, matte finish', 200, '/products/alien-outpost-invasion.png', '[]', true, true, false, true),
  ('HG-STALK-10T', 'Backwoods Stalk', 'backwoods-stalk', 'A misty backwoods scene with 10 numbered wildlife targets stalking through the fog -- bears, elk, moose, and big cats among them. Built for hunters and range-goers who want variety beyond standard silhouettes.', (select id from collections where slug = 'monster-hunt'), 26.00, 44.99, 15, 15, '24 x 36 in', '28lb premium target paper, matte finish', 200, '/products/backwoods-stalk.png', '[]', true, false, false, false),
  ('DR-AMBUSH-10T', 'Volcanic Ambush', 'volcanic-ambush', 'A prehistoric jungle scene with 10 numbered dinosaurs -- T-Rex, triceratops, stegosaurus, pterodactyl, and more -- stalking a smoking volcano.', (select id from collections where slug = 'dino-rampage'), 26.00, 44.99, 15, 15, '24 x 36 in', '28lb premium target paper, matte finish', 200, '/products/volcanic-ambush.png', '[]', true, false, false, false)
on conflict (sku) do nothing;

-- ─── Sample orders (run after creating + approving sample retailers) ────
-- insert into orders (retailer_id, order_number, subtotal, shipping, tax, total, status, tracking_number, created_at) values
--   ((select id from profiles where email = 'orders@ironsightsrange.com'), 'PB-10021', 780.00, 0, 62.40, 842.40, 'delivered', '1Z999AA10123456784', now() - interval '70 days');
-- -- then insert matching order_items rows referencing that order's id and a product id.
