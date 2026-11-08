-- This database serves Berry Fitness for Health only. An earlier migration
-- inserted two other starter apps; remove them (they have no rows of their own here).
DELETE FROM `App` WHERE `key` IN ('fitness', 'sos');
