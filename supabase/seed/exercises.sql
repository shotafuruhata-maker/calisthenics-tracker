-- ============================================================
-- Calisthenics Tracker - Seed Data
-- 10 Muscle Groups & ~130 Exercises
-- ============================================================

-- 1. Insert muscle groups
INSERT INTO public.muscle_groups (name, slug) VALUES
('Chest', 'chest'),
('Back', 'back'),
('Shoulders', 'shoulders'),
('Biceps', 'biceps'),
('Triceps', 'triceps'),
('Core', 'core'),
('Quads', 'quads'),
('Hamstrings & Glutes', 'hamstrings-glutes'),
('Calves', 'calves'),
('Full Body', 'full-body');

-- 2. Insert exercises referencing muscle group IDs by slug
DO $$
DECLARE
  chest_id uuid;
  back_id uuid;
  shoulders_id uuid;
  biceps_id uuid;
  triceps_id uuid;
  core_id uuid;
  quads_id uuid;
  hams_id uuid;
  calves_id uuid;
  fullbody_id uuid;
BEGIN
  SELECT id INTO chest_id FROM public.muscle_groups WHERE slug = 'chest';
  SELECT id INTO back_id FROM public.muscle_groups WHERE slug = 'back';
  SELECT id INTO shoulders_id FROM public.muscle_groups WHERE slug = 'shoulders';
  SELECT id INTO biceps_id FROM public.muscle_groups WHERE slug = 'biceps';
  SELECT id INTO triceps_id FROM public.muscle_groups WHERE slug = 'triceps';
  SELECT id INTO core_id FROM public.muscle_groups WHERE slug = 'core';
  SELECT id INTO quads_id FROM public.muscle_groups WHERE slug = 'quads';
  SELECT id INTO hams_id FROM public.muscle_groups WHERE slug = 'hamstrings-glutes';
  SELECT id INTO calves_id FROM public.muscle_groups WHERE slug = 'calves';
  SELECT id INTO fullbody_id FROM public.muscle_groups WHERE slug = 'full-body';

  -- ========================================================
  -- CHEST EXERCISES (20)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Standard Push-Up',
    'standard-push-up',
    'The fundamental upper-body pushing exercise performed face-down with hands shoulder-width apart. Builds a solid foundation of chest, shoulder, and tricep strength.',
    1,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Place hands shoulder-width apart on the floor, body in a straight line from head to heels. Lower your chest until it nearly touches the ground, then press back up to full arm extension. Keep your core braced and elbows at roughly 45 degrees throughout.'
  ),
  (
    'Wide Push-Up',
    'wide-push-up',
    'A push-up variation with hands placed wider than shoulder-width to emphasize the outer chest. The wider grip increases the stretch on the pectoral muscles.',
    1,
    chest_id,
    ARRAY['Shoulders', 'Triceps'],
    'Set your hands about 1.5 times shoulder-width apart with fingers pointing forward. Lower your body until your chest is just above the floor, feeling a deep stretch across the chest. Press back up while keeping your elbows tracking over your wrists.'
  ),
  (
    'Diamond Push-Up',
    'diamond-push-up',
    'A close-hand push-up where the thumbs and index fingers form a diamond shape beneath the chest. This variation heavily targets the triceps and inner chest.',
    2,
    chest_id,
    ARRAY['Triceps', 'Shoulders'],
    'Place your hands together beneath your sternum so your thumbs and index fingers form a diamond. Lower your chest to your hands while keeping elbows close to your sides. Press back up forcefully, squeezing the triceps at the top.'
  ),
  (
    'Decline Push-Up',
    'decline-push-up',
    'A push-up with feet elevated on a bench or step, shifting more load to the upper chest and shoulders. The steeper the angle, the harder the exercise becomes.',
    1,
    chest_id,
    ARRAY['Shoulders', 'Triceps', 'Core'],
    'Place your feet on an elevated surface and your hands on the floor shoulder-width apart. Lower your chest toward the ground while maintaining a rigid plank position. Push back up to full extension, focusing on the upper-chest contraction.'
  ),
  (
    'Incline Push-Up',
    'incline-push-up',
    'A beginner-friendly push-up with hands elevated on a bench, wall, or step, reducing the load on the chest. Great for building up to standard push-ups.',
    1,
    chest_id,
    ARRAY['Triceps', 'Shoulders'],
    'Place your hands on a sturdy elevated surface at shoulder width, body in a straight line. Lower your chest toward the edge of the surface under control. Press back up, fully extending your arms at the top.'
  ),
  (
    'Archer Push-Up',
    'archer-push-up',
    'A unilateral push-up variation where one arm extends to the side while the other performs the press. Builds single-arm pressing strength toward the one-arm push-up.',
    2,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Start in a wide push-up position with arms fully extended. Bend one elbow to lower your body toward that hand while the opposite arm straightens out to the side. Press back up through the working arm and alternate sides.'
  ),
  (
    'Clap Push-Up',
    'clap-push-up',
    'An explosive plyometric push-up where you push off the ground hard enough to clap your hands mid-air. Develops chest power and fast-twitch muscle fibers.',
    2,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'From a standard push-up position, lower yourself and then explode upward with enough force to lift your hands off the ground. Clap your hands together quickly before landing softly with elbows slightly bent. Immediately descend into the next rep.'
  ),
  (
    'Pseudo Planche Push-Up',
    'pseudo-planche-push-up',
    'An advanced push-up with hands placed near the hips and fingers pointing sideways or backward, mimicking planche positioning. Places extreme demand on the shoulders and chest.',
    3,
    chest_id,
    ARRAY['Shoulders', 'Triceps', 'Core'],
    'Place your hands by your waist with fingers turned outward or backward and lean your shoulders well past your wrists. Lower your chest toward the ground while maintaining the forward lean. Press back up, keeping your body rigid and core engaged throughout.'
  ),
  (
    'Hindu Push-Up',
    'hindu-push-up',
    'A flowing push-up that moves through downward dog, a scooping motion near the floor, and up into cobra pose. Works the chest, shoulders, and back through a full range of motion.',
    2,
    chest_id,
    ARRAY['Shoulders', 'Back', 'Core'],
    'Start in a downward dog position with hips high and arms straight. Swoop your chest down and forward close to the ground in an arcing motion, then press up into an upward-facing position. Reverse the movement by pushing your hips back up to the starting position.'
  ),
  (
    'Dive Bomber Push-Up',
    'dive-bomber-push-up',
    'Similar to the Hindu push-up but you reverse the swooping path on the way back, creating equal work in both directions. Challenges the chest, shoulders, and triceps through a large range of motion.',
    2,
    chest_id,
    ARRAY['Shoulders', 'Triceps', 'Core'],
    'Begin in a downward dog position with hips high. Dive forward, sweeping your chest close to the floor and pressing up into cobra. Reverse the exact same arc to return to the start, pushing hips back and up.'
  ),
  (
    'Staggered Push-Up',
    'staggered-push-up',
    'A push-up with one hand placed slightly forward and the other slightly back, creating an asymmetric load. Helps correct imbalances and progresses toward harder unilateral push-ups.',
    1,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Set up like a standard push-up but offset one hand a few inches forward and the other a few inches back. Lower and press as usual, keeping your core tight and body straight. Switch hand positions each set to train both sides evenly.'
  ),
  (
    'Spiderman Push-Up',
    'spiderman-push-up',
    'A push-up where you bring one knee toward the same-side elbow as you lower, engaging the obliques and hip flexors. Adds a core and mobility challenge to the standard push-up.',
    2,
    chest_id,
    ARRAY['Core', 'Shoulders', 'Triceps'],
    'From a standard push-up position, as you lower your chest, drive one knee out toward the elbow on the same side. Press back up while returning the leg to the start position. Alternate legs each rep.'
  ),
  (
    'Typewriter Push-Up',
    'typewriter-push-up',
    'An advanced horizontal pushing exercise where you shift your body side to side at the bottom of a wide push-up. Builds tremendous chest, shoulder, and tricep endurance.',
    3,
    chest_id,
    ARRAY['Shoulders', 'Triceps', 'Core'],
    'Start in a wide push-up position and lower yourself to one side so that arm is bent and the other is nearly straight. Slide your body horizontally to the other side while staying low to the ground. Press back up to the center and repeat to the opposite side.'
  ),
  (
    'One-Arm Push-Up',
    'one-arm-push-up',
    'The ultimate bodyweight pressing move performed on a single arm with the other hand behind the back or at the side. Demands exceptional pressing strength and core stability.',
    3,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Take a wider-than-shoulder-width stance for balance and place one hand under your chest. Lower yourself under control until your chest nearly touches the floor, keeping your hips as square as possible. Press back up to full extension without rotating your torso.'
  ),
  (
    'Ring Push-Up',
    'ring-push-up',
    'A push-up performed on gymnastic rings, which adds instability and forces greater stabilizer engagement. The free-moving rings increase chest and shoulder activation.',
    2,
    chest_id,
    ARRAY['Shoulders', 'Triceps', 'Core'],
    'Set rings to a low height and grip them in a push-up position with arms straight. Lower your chest between the rings while controlling any wobble. Press back up and turn the rings outward slightly at the top for full contraction.'
  ),
  (
    'Explosive Push-Up',
    'explosive-push-up',
    'A plyometric push-up variation where both hands leave the ground at the top of each rep. Builds upper-body power and explosive pressing strength.',
    2,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Set up in a standard push-up position and lower your chest to the ground. Drive upward as explosively as possible so your hands leave the floor. Land softly with elbows slightly bent and flow directly into the next rep.'
  ),
  (
    'Knuckle Push-Up',
    'knuckle-push-up',
    'A push-up performed on closed fists rather than open palms, increasing wrist strength and range of motion. Commonly used in martial arts training.',
    1,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Make fists and place your knuckles on the floor at shoulder width, wrists straight and neutral. Lower your chest between your fists for a slightly deeper range of motion. Press back up, keeping your wrists locked and core tight.'
  ),
  (
    'Finger Push-Up',
    'finger-push-up',
    'An advanced push-up performed on the fingertips, demanding extreme finger and grip strength. Strengthens the hands, forearms, and all the standard push-up muscles.',
    3,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Spread your fingers wide and support your upper body on your fingertips in a push-up position. Lower yourself under control, ensuring your fingers stay arched and strong. Press back up without letting your fingers collapse flat.'
  ),
  (
    'Deficit Push-Up',
    'deficit-push-up',
    'A push-up performed with hands on raised surfaces like blocks or parallettes, allowing the chest to descend below hand level. The extra range of motion increases chest stretch and activation.',
    2,
    chest_id,
    ARRAY['Triceps', 'Shoulders', 'Core'],
    'Place each hand on a raised object such as push-up handles, books, or parallettes. Lower your chest below the level of your hands for a deep stretch. Press back up to full lockout, squeezing the chest at the top.'
  ),
  (
    'Chest Dip',
    'chest-dip',
    'A dip performed on parallel bars with a forward lean to emphasize the chest over the triceps. One of the best bodyweight exercises for lower chest development.',
    2,
    chest_id,
    ARRAY['Triceps', 'Shoulders'],
    'Grip parallel bars and support yourself with arms straight, then lean your torso forward about 30 degrees. Lower until your upper arms are at least parallel to the ground, feeling a stretch in the chest. Press back up to lockout while maintaining the forward lean.'
  );

  -- ========================================================
  -- BACK EXERCISES (20)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Pull-Up',
    'pull-up',
    'The gold-standard upper-body pulling exercise performed with an overhand grip on a bar. Builds wide, strong lats and overall back thickness.',
    2,
    back_id,
    ARRAY['Biceps', 'Shoulders', 'Core'],
    'Hang from a bar with an overhand grip slightly wider than shoulder-width, arms fully extended. Pull yourself up until your chin clears the bar, driving your elbows down and back. Lower under control to a dead hang before the next rep.'
  ),
  (
    'Chin-Up',
    'chin-up',
    'A pull-up variation using an underhand (supinated) grip that emphasizes the biceps alongside the back. Typically easier than the overhand pull-up for beginners.',
    2,
    back_id,
    ARRAY['Biceps', 'Shoulders'],
    'Grip the bar with palms facing you at shoulder width and hang with arms fully extended. Pull yourself up until your chin is over the bar, squeezing your biceps and lats. Lower slowly back to a full dead hang.'
  ),
  (
    'Wide Grip Pull-Up',
    'wide-grip-pull-up',
    'A pull-up performed with hands placed well outside shoulder width to maximize lat engagement. Builds an impressive V-taper and back width.',
    2,
    back_id,
    ARRAY['Biceps', 'Shoulders'],
    'Grip the bar with an overhand grip about 1.5 times shoulder-width apart. Pull yourself up by driving your elbows toward your hips until your chin clears the bar. Lower with control, fully extending your arms at the bottom.'
  ),
  (
    'Close Grip Pull-Up',
    'close-grip-pull-up',
    'A pull-up with hands placed close together, shifting emphasis to the lower lats and biceps. The narrow grip also increases the range of motion.',
    2,
    back_id,
    ARRAY['Biceps', 'Core'],
    'Grip the bar with hands about 6 inches apart using an overhand or neutral grip. Pull yourself up until your chest nearly touches the bar. Lower under control to full extension.'
  ),
  (
    'Commando Pull-Up',
    'commando-pull-up',
    'A pull-up performed with a staggered grip on the bar so you pull up on alternating sides of the bar. Adds a rotational element and trains each side of the back differently.',
    2,
    back_id,
    ARRAY['Biceps', 'Shoulders', 'Core'],
    'Stand perpendicular to the bar and grip it with one hand in front of the other in a baseball grip. Pull up, bringing one shoulder to the bar, then lower and repeat to the other side on the next rep. Keep your core tight to minimize swinging.'
  ),
  (
    'L-Sit Pull-Up',
    'l-sit-pull-up',
    'A pull-up performed while holding the legs straight out in front at 90 degrees, demanding extreme core strength. Combines two difficult skills into one brutally effective exercise.',
    3,
    back_id,
    ARRAY['Core', 'Biceps', 'Shoulders'],
    'Hang from the bar and raise your legs to a 90-degree L-sit position, keeping them straight. Perform a full pull-up while maintaining the L-sit hold throughout. Lower back to a dead hang without dropping your legs.'
  ),
  (
    'Archer Pull-Up',
    'archer-pull-up',
    'A unilateral pull-up variation where one arm does most of the pulling while the other extends to the side along the bar. An excellent progression toward the one-arm pull-up.',
    3,
    back_id,
    ARRAY['Biceps', 'Shoulders', 'Core'],
    'Grip the bar with a very wide overhand grip. Pull yourself up toward one hand, straightening the opposite arm along the bar. Lower with control and repeat on the same side or alternate.'
  ),
  (
    'Muscle-Up',
    'muscle-up',
    'An advanced movement combining a pull-up and a dip in one fluid motion, taking you from below to above the bar. The king of bar exercises, requiring explosive pulling power and technique.',
    3,
    back_id,
    ARRAY['Chest', 'Triceps', 'Shoulders', 'Core'],
    'Hang from the bar with a false (thumbless) overhand grip and generate a slight kip or explosive pull. Pull aggressively until your chest reaches bar height, then quickly transition your wrists over the bar. Press yourself up to full lockout above the bar.'
  ),
  (
    'Typewriter Pull-Up',
    'typewriter-pull-up',
    'An advanced pull-up where you pull to one side, slide horizontally to the other side while staying at the top, then lower. Builds tremendous lat strength and endurance.',
    3,
    back_id,
    ARRAY['Biceps', 'Shoulders', 'Core'],
    'Grip the bar wide and pull yourself up to one side until your chin is over that hand. Keeping your chin above bar height, shift your body horizontally to the other hand. Lower from that side and repeat in the opposite direction.'
  ),
  (
    'One-Arm Pull-Up Assisted',
    'one-arm-pull-up-assisted',
    'A progression exercise where one arm grips the bar while the other holds a towel or band for minimal assistance. Develops the pulling strength needed for a true one-arm pull-up.',
    3,
    back_id,
    ARRAY['Biceps', 'Core', 'Shoulders'],
    'Grip the bar with one hand and hold a towel draped over the bar with the other hand lower down. Pull yourself up primarily with the bar hand, using the towel hand as little as possible. Lower under control, relying on the bar arm for most of the work.'
  ),
  (
    'Australian Row',
    'australian-row',
    'A horizontal pulling exercise performed under a low bar with feet on the ground, also known as an inverted row. Excellent for beginners building up pulling strength.',
    1,
    back_id,
    ARRAY['Biceps', 'Shoulders', 'Core'],
    'Lie under a bar set at about waist height and grip it with an overhand grip at shoulder width. Keep your body straight and heels on the ground, then pull your chest to the bar. Lower yourself back down with control until arms are fully extended.'
  ),
  (
    'Wide Australian Row',
    'wide-australian-row',
    'An inverted row with a wide overhand grip to emphasize the rear delts and upper back. Mimics a wide barbell row using only bodyweight.',
    1,
    back_id,
    ARRAY['Shoulders', 'Biceps'],
    'Set up under a low bar and grip it wider than shoulder-width with an overhand grip. Pull your chest to the bar, squeezing your shoulder blades together at the top. Lower back down slowly, keeping your body rigid throughout.'
  ),
  (
    'Close Australian Row',
    'close-australian-row',
    'An inverted row performed with a close underhand grip, emphasizing the lower lats and biceps. A great complementary movement to the wide variation.',
    1,
    back_id,
    ARRAY['Biceps', 'Core'],
    'Grip the low bar with hands about 6 inches apart, palms facing you. Pull your chest to the bar, keeping elbows tight to your sides. Lower back to full arm extension under control.'
  ),
  (
    'Inverted Row',
    'inverted-row',
    'A general term for any row performed under a bar or rings with feet on the ground. Highly scalable by adjusting body angle and foot position.',
    1,
    back_id,
    ARRAY['Biceps', 'Shoulders', 'Core'],
    'Position yourself under a bar or set of rings with your chest directly below the grip point. Pull your chest up to the bar while keeping your body in a straight line. Lower with control until your arms are completely straight.'
  ),
  (
    'Front Lever Tuck Hold',
    'front-lever-tuck-hold',
    'A static hold on the bar with the body horizontal and knees tucked to the chest, building toward the full front lever. Develops incredible lat and core strength.',
    2,
    back_id,
    ARRAY['Core', 'Shoulders'],
    'Hang from the bar and pull your body up while tucking your knees tightly to your chest. Lean back and engage your lats to bring your torso horizontal with arms straight. Hold the position, keeping your hips level with your shoulders.'
  ),
  (
    'Advanced Front Lever Hold',
    'advanced-front-lever-hold',
    'A full front lever with the body completely horizontal and legs extended, held with straight arms on the bar. One of the most impressive static strength feats in calisthenics.',
    3,
    back_id,
    ARRAY['Core', 'Shoulders'],
    'Hang from the bar and engage your lats powerfully to raise your entire body to a horizontal position with legs straight. Keep your arms locked, core braced, and body in a perfectly flat line. Hold for time, breathing steadily.'
  ),
  (
    'Front Lever Raise',
    'front-lever-raise',
    'A dynamic front lever movement where you raise from a dead hang to the full front lever position and lower back down. Builds explosive lat power beyond what static holds provide.',
    3,
    back_id,
    ARRAY['Core', 'Shoulders'],
    'Hang from the bar with straight arms and legs extended. Engage your lats and core to raise your entire body from vertical to horizontal in a controlled arc. Lower back down to a dead hang under control and repeat.'
  ),
  (
    'Back Lever Hold',
    'back-lever-hold',
    'An inverted static hold where you hang face-down from the bar with your body horizontal behind you. Demands strong shoulders, biceps tendons, and back extensors.',
    3,
    back_id,
    ARRAY['Shoulders', 'Core', 'Biceps'],
    'From an inverted hang (skin the cat position), slowly lower your body behind you until horizontal and face-down. Keep your arms straight, core tight, and body in a flat line. Hold the position, focusing on steady breathing and shoulder engagement.'
  ),
  (
    'Superman Hold',
    'superman-hold',
    'A floor-based isometric exercise where you lie face-down and lift your arms and legs off the ground simultaneously. Strengthens the entire posterior chain, especially the lower back.',
    1,
    back_id,
    ARRAY['Core', 'Shoulders'],
    'Lie face-down with arms extended overhead and legs straight. Simultaneously lift your arms, chest, and legs off the ground as high as comfortably possible. Hold the top position, squeezing your glutes and lower back.'
  ),
  (
    'Skin the Cat',
    'skin-the-cat',
    'A shoulder mobility and strength exercise where you rotate your entire body backward through your arms on a bar. Increases shoulder flexibility and builds connective tissue resilience.',
    2,
    back_id,
    ARRAY['Shoulders', 'Core', 'Biceps'],
    'Hang from a bar and tuck your knees, then rotate backward through your arms until your feet pass behind you and down. Pause in the German hang with arms behind you, then reverse the motion to return to the starting position. Move slowly and with control to protect your shoulders.'
  );

  -- ========================================================
  -- SHOULDER EXERCISES (13)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Pike Push-Up',
    'pike-push-up',
    'A push-up performed in an inverted-V position with hips high, shifting the load onto the shoulders. An essential progression toward handstand push-ups.',
    1,
    shoulders_id,
    ARRAY['Triceps', 'Chest'],
    'Start in a downward dog position with hips high and hands shoulder-width apart. Bend your elbows to lower the top of your head toward the floor between your hands. Press back up to straight arms, keeping your hips elevated throughout.'
  ),
  (
    'Elevated Pike Push-Up',
    'elevated-pike-push-up',
    'A pike push-up with feet elevated on a box or bench, increasing the vertical pressing angle and shoulder load. Bridges the gap between pike push-ups and handstand push-ups.',
    2,
    shoulders_id,
    ARRAY['Triceps', 'Chest', 'Core'],
    'Place your feet on a bench or box and walk your hands back until your torso is nearly vertical. Lower the top of your head toward the ground by bending your elbows. Press back to straight arms, maintaining the steep body angle.'
  ),
  (
    'Wall Handstand Hold',
    'wall-handstand-hold',
    'An isometric handstand held with feet resting against a wall for balance support. Builds shoulder endurance, stability, and overhead strength.',
    2,
    shoulders_id,
    ARRAY['Triceps', 'Core'],
    'Kick up into a handstand with your back or chest facing the wall, hands shoulder-width apart. Stack your hips over your shoulders and hands, using the wall only for light balance support. Hold the position while breathing steadily and keeping your core tight.'
  ),
  (
    'Freestanding Handstand Hold',
    'freestanding-handstand-hold',
    'A handstand performed without any wall support, requiring supreme balance, shoulder strength, and body control. The pinnacle of calisthenics balance skills.',
    3,
    shoulders_id,
    ARRAY['Triceps', 'Core'],
    'Kick up or press into a handstand with hands shoulder-width apart and fingers spread for balance. Stack your joints vertically: wrists, shoulders, hips, and toes in one line. Make micro-adjustments with your fingers and wrists to maintain balance.'
  ),
  (
    'Wall Handstand Push-Up',
    'wall-handstand-push-up',
    'A full handstand push-up performed against a wall, the bodyweight equivalent of an overhead press. Builds tremendous shoulder and tricep pressing strength.',
    3,
    shoulders_id,
    ARRAY['Triceps', 'Core'],
    'Get into a wall-supported handstand with hands shoulder-width apart and slightly away from the wall. Lower yourself until the top of your head lightly touches the floor. Press back up to full lockout, keeping your core engaged and body tight.'
  ),
  (
    'Ring Dip',
    'ring-dip',
    'A dip performed on gymnastic rings, which are unstable and demand far greater stabilizer muscle activation. One of the best upper-body pushing exercises in gymnastics training.',
    2,
    shoulders_id,
    ARRAY['Chest', 'Triceps', 'Core'],
    'Support yourself on rings with arms straight and rings turned outward. Lower your body by bending your elbows until your shoulders are below your elbows. Press back up to lockout, turning the rings outward again at the top.'
  ),
  (
    'Wall Walk',
    'wall-walk',
    'An exercise where you start in a push-up position and walk your feet up the wall while walking your hands closer to the wall. Builds comfort and strength in the inverted position.',
    2,
    shoulders_id,
    ARRAY['Core', 'Triceps', 'Chest'],
    'Start in a push-up position with your feet against the base of a wall. Walk your feet up the wall while simultaneously walking your hands back toward the wall. Walk back down to the starting push-up position with control.'
  ),
  (
    'Bear Crawl',
    'bear-crawl',
    'A locomotion drill performed on all fours with knees hovering just above the ground. Builds shoulder stability, core strength, and total-body coordination.',
    1,
    shoulders_id,
    ARRAY['Core', 'Quads', 'Triceps'],
    'Get on all fours with knees lifted about an inch off the ground, back flat. Move forward by simultaneously advancing your opposite hand and foot. Keep your hips low and stable as you crawl, avoiding any side-to-side rocking.'
  ),
  (
    'Crab Walk',
    'crab-walk',
    'A locomotion drill performed face-up with hips elevated, hands and feet on the ground. Strengthens the shoulders, triceps, and hip extensors while improving mobility.',
    1,
    shoulders_id,
    ARRAY['Triceps', 'Core', 'Hamstrings & Glutes'],
    'Sit on the ground, place your hands behind you with fingers pointing toward your feet, and lift your hips. Walk backward or forward by moving opposite hand and foot simultaneously. Keep your hips elevated and chest open throughout the movement.'
  ),
  (
    'Y-Raise Bodyweight',
    'y-raise-bodyweight',
    'A prone exercise where you lift your arms into a Y-shape overhead, targeting the lower traps and rear deltoids. Great for shoulder health and postural correction.',
    1,
    shoulders_id,
    ARRAY['Back', 'Core'],
    'Lie face-down on the floor with arms extended overhead in a Y-position, thumbs pointing up. Lift your arms off the floor as high as possible by squeezing your lower traps and rear delts. Hold briefly at the top, then lower with control.'
  ),
  (
    'Band Pull-Apart Bodyweight',
    'band-pull-apart-bodyweight',
    'A rear delt and upper back exercise using a resistance band held at arm''s length in front. Excellent for shoulder prehab and correcting rounded-shoulder posture.',
    1,
    shoulders_id,
    ARRAY['Back'],
    'Hold a resistance band at shoulder height with arms extended and hands shoulder-width apart. Pull the band apart by squeezing your shoulder blades together until the band touches your chest. Return slowly to the starting position, maintaining tension.'
  ),
  (
    'Prone I-Y-T Raise',
    'prone-i-y-t-raise',
    'A shoulder health exercise performed face-down, lifting the arms into I, Y, and T positions sequentially. Targets the rotator cuff, lower traps, and rear delts from multiple angles.',
    1,
    shoulders_id,
    ARRAY['Back', 'Core'],
    'Lie face-down and first lift your arms straight overhead (I), hold briefly, then lower. Next lift them at 45 degrees (Y), hold and lower, then lift them straight out to the sides (T). Perform each position with control, squeezing the upper back at the top.'
  ),
  (
    'Shoulder Tap Push-Up',
    'shoulder-tap-push-up',
    'A push-up followed by tapping each shoulder with the opposite hand at the top, adding an anti-rotation challenge. Builds shoulder stability and core strength alongside pressing power.',
    1,
    shoulders_id,
    ARRAY['Chest', 'Triceps', 'Core'],
    'Perform a standard push-up, and at the top, lift one hand to tap the opposite shoulder. Return that hand to the floor, then tap the other shoulder with the other hand. Keep your hips square to the ground throughout each tap, resisting rotation.'
  );

  -- ========================================================
  -- BICEPS EXERCISES (6)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Chin-Up Bicep Focus',
    'chin-up-bicep-focus',
    'A chin-up performed with a narrow supinated grip and emphasis on squeezing the biceps throughout the movement. The most effective bodyweight bicep builder.',
    2,
    biceps_id,
    ARRAY['Back', 'Shoulders'],
    'Grip the bar with palms facing you, hands about 6 inches apart. Pull yourself up while focusing on contracting the biceps rather than the back. Lower slowly, taking 3-4 seconds on the descent to maximize bicep time under tension.'
  ),
  (
    'Pelican Curl',
    'pelican-curl',
    'An advanced ring or TRX exercise where you lean forward from an upright position, curling your body back up using the biceps. One of the most intense bodyweight bicep isolation exercises.',
    3,
    biceps_id,
    ARRAY['Shoulders', 'Core'],
    'Hold rings or TRX handles with palms up, arms straight at your sides, body upright and leaning slightly forward. Allow your body to tilt forward by extending at the shoulder while keeping your elbows locked in place. Curl yourself back to upright by flexing your biceps hard.'
  ),
  (
    'Headbanger Pull-Up',
    'headbanger-pull-up',
    'An advanced pull-up variation where you pull yourself up and then push your body away from and back toward the bar horizontally. Creates an intense bicep pump and builds brachialis strength.',
    3,
    biceps_id,
    ARRAY['Back', 'Shoulders'],
    'Pull yourself up to the top of a chin-up and hold there. Push your body away from the bar by extending your arms, then pull yourself back in. Repeat this horizontal push-pull motion while maintaining chin-over-bar height.'
  ),
  (
    'Bodyweight Bicep Curl Ring',
    'bodyweight-bicep-curl-ring',
    'A bicep curl performed on rings or a TRX by leaning back and curling yourself up using only elbow flexion. Effectively isolates the biceps using bodyweight.',
    2,
    biceps_id,
    ARRAY['Shoulders', 'Core'],
    'Hold rings or TRX handles with a supinated grip, lean back with arms extended and body straight. Curl yourself toward the anchor point by bending only at the elbows. Extend your arms to return to the start, keeping your body rigid like a plank.'
  ),
  (
    'Isometric Chin-Up Hold',
    'isometric-chin-up-hold',
    'A static hold at the top of the chin-up position with chin over the bar. Builds bicep endurance and grip strength through sustained isometric contraction.',
    2,
    biceps_id,
    ARRAY['Back', 'Shoulders'],
    'Pull yourself to the top of a chin-up so your chin is above the bar. Hold that position with your biceps fully contracted, squeezing as hard as you can. Aim to hold for time, lowering yourself down only when you can no longer maintain the position.'
  ),
  (
    'Negative Chin-Up',
    'negative-chin-up',
    'A chin-up where you jump or step to the top position and then lower yourself as slowly as possible. Perfect for beginners building the strength for full chin-ups.',
    1,
    biceps_id,
    ARRAY['Back', 'Shoulders'],
    'Use a step or jump to get yourself to the top of the chin-up position with chin over the bar. Lower yourself as slowly as possible, aiming for 5-10 seconds on the descent. Step back up and repeat, focusing on resisting gravity with your biceps and back.'
  );

  -- ========================================================
  -- TRICEPS EXERCISES (9)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Diamond Push-Up Tricep Focus',
    'diamond-push-up-tricep-focus',
    'A diamond push-up performed with deliberate focus on tricep contraction by keeping elbows pinned to the sides. The narrow hand position maximizes tricep recruitment.',
    2,
    triceps_id,
    ARRAY['Chest', 'Shoulders'],
    'Form a diamond with your hands under your chest and keep your elbows tight against your ribs throughout. Lower slowly until your chest touches your hands, feeling the stretch in your triceps. Press up by straightening your arms forcefully, squeezing the triceps at lockout.'
  ),
  (
    'Bench Dip',
    'bench-dip',
    'A dip performed with hands on a bench behind you and feet on the ground, isolating the triceps. An accessible exercise for all levels that effectively builds tricep strength.',
    1,
    triceps_id,
    ARRAY['Shoulders', 'Chest'],
    'Place your hands on the edge of a bench behind you with fingers forward and extend your legs out front. Lower your body by bending your elbows to about 90 degrees, keeping your back close to the bench. Press back up by straightening your arms completely.'
  ),
  (
    'Korean Dip',
    'korean-dip',
    'A dip performed with the bar behind your back rather than in front, placing greater emphasis on the triceps and shoulders. Also improves shoulder extension flexibility.',
    2,
    triceps_id,
    ARRAY['Shoulders', 'Core'],
    'Grip a bar or ledge behind your back with hands about shoulder-width apart. Lower your body by bending your elbows, allowing your shoulders to extend behind you. Press back up to lockout, keeping your core tight and torso upright.'
  ),
  (
    'Sphinx Push-Up',
    'sphinx-push-up',
    'A push-up variation starting from a forearm plank position, extending the arms to a full push-up, and returning. Heavily isolates the triceps by eliminating chest contribution at the bottom.',
    2,
    triceps_id,
    ARRAY['Core', 'Shoulders'],
    'Start in a forearm plank position with elbows directly under your shoulders. Press your palms into the ground and extend your arms to lift into a push-up position. Lower back down to your forearms with control, keeping your body in a straight line.'
  ),
  (
    'Bodyweight Skull Crusher',
    'bodyweight-skull-crusher',
    'A tricep extension performed by placing hands on a bar or bench and hinging only at the elbows to lower your head toward the surface. The bodyweight equivalent of a barbell skull crusher.',
    2,
    triceps_id,
    ARRAY['Shoulders', 'Core'],
    'Place your hands on a bar or bench edge at about chest height and step your feet back into an angled plank. Lower your head toward the bar by bending only at the elbows, keeping your upper arms stationary. Extend your elbows to press back to the starting position.'
  ),
  (
    'Tricep Extension Bar',
    'tricep-extension-bar',
    'An overhead tricep extension using a low bar, lowering your body by bending at the elbows while gripping the bar. Provides a deep stretch and strong contraction for the triceps.',
    2,
    triceps_id,
    ARRAY['Shoulders', 'Core'],
    'Grip a low bar with hands shoulder-width apart and step your feet back so your body is at an angle. Lower your head under the bar by bending only at the elbows, keeping upper arms fixed. Extend your elbows to push yourself back to the start.'
  ),
  (
    'Ring Tricep Extension',
    'ring-tricep-extension',
    'A tricep isolation exercise performed on gymnastic rings, lowering your face between the rings by bending only at the elbows. The rings add instability, increasing muscle activation.',
    2,
    triceps_id,
    ARRAY['Shoulders', 'Core'],
    'Hold rings with arms straight and body in an angled plank position. Lower your face between the rings by bending only at the elbows, keeping upper arms steady. Press back to straight arms by extending at the elbows, squeezing the triceps at the top.'
  ),
  (
    'Close-Grip Push-Up',
    'close-grip-push-up',
    'A push-up with hands placed inside shoulder width to shift emphasis from the chest to the triceps. A simple yet effective tricep-dominant pushing exercise.',
    1,
    triceps_id,
    ARRAY['Chest', 'Shoulders'],
    'Place your hands about 6 inches apart directly under your chest. Lower yourself while keeping your elbows tight to your sides, touching your chest to your hands. Press up by straightening your arms and squeezing your triceps at the top.'
  ),
  (
    'Straight Bar Dip',
    'straight-bar-dip',
    'A dip performed on top of a single straight bar rather than parallel bars, requiring more tricep strength and wrist flexibility. A fundamental skill in street workout.',
    2,
    triceps_id,
    ARRAY['Chest', 'Shoulders', 'Core'],
    'Support yourself on top of a straight bar with arms locked out and the bar at your hips. Lean slightly forward and lower your body by bending your elbows until your chest nears the bar. Press back up to full lockout, keeping the bar close to your body throughout.'
  );

  -- ========================================================
  -- CORE EXERCISES (25)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Plank',
    'plank',
    'The foundational isometric core exercise, holding a push-up-like position on the forearms. Builds endurance in the abdominals, obliques, and lower back.',
    1,
    core_id,
    ARRAY['Shoulders'],
    'Rest on your forearms and toes with elbows directly under your shoulders and body in a straight line. Squeeze your abs, glutes, and quads to maintain a rigid plank from head to heels. Hold for time, breathing steadily without letting your hips sag or pike.'
  ),
  (
    'Side Plank',
    'side-plank',
    'A lateral isometric hold on one forearm targeting the obliques and lateral stabilizers. Essential for building side-body strength and spinal stability.',
    1,
    core_id,
    ARRAY['Shoulders'],
    'Lie on your side and prop yourself up on one forearm, elbow under your shoulder. Stack your feet and lift your hips so your body forms a straight line from head to heels. Hold the position, keeping your hips elevated and core braced.'
  ),
  (
    'Crunch',
    'crunch',
    'A basic abdominal exercise where you curl your upper back off the floor to contract the rectus abdominis. Effective for building the mind-muscle connection with the abs.',
    1,
    core_id,
    ARRAY[]::text[],
    'Lie on your back with knees bent and feet flat, hands behind your head or across your chest. Curl your shoulders and upper back off the floor by contracting your abs, exhaling as you rise. Lower back down with control without fully relaxing on the floor.'
  ),
  (
    'Bicycle Crunch',
    'bicycle-crunch',
    'A dynamic crunch variation alternating elbow-to-opposite-knee contact in a pedaling motion. Engages both the rectus abdominis and obliques effectively.',
    1,
    core_id,
    ARRAY[]::text[],
    'Lie on your back with hands behind your head and legs raised with knees bent at 90 degrees. Rotate your torso to bring one elbow toward the opposite knee while extending the other leg. Alternate sides in a smooth pedaling motion, keeping your shoulder blades off the ground.'
  ),
  (
    'Reverse Crunch',
    'reverse-crunch',
    'A crunch variation where you curl your hips off the floor toward your chest instead of curling your shoulders down. Targets the lower portion of the rectus abdominis.',
    1,
    core_id,
    ARRAY[]::text[],
    'Lie on your back with arms at your sides and legs raised with knees bent at 90 degrees. Curl your hips off the floor, bringing your knees toward your chest by contracting your lower abs. Lower your hips back down slowly without letting your feet touch the ground.'
  ),
  (
    'Leg Raise',
    'leg-raise',
    'A supine exercise where you raise straight legs from the floor to vertical, heavily targeting the lower abs and hip flexors. A staple in any core training routine.',
    1,
    core_id,
    ARRAY[]::text[],
    'Lie flat on your back with legs straight and hands under your hips for lower back support. Raise both legs together until they point straight up, keeping them as straight as possible. Lower them back down slowly, stopping just before they touch the floor.'
  ),
  (
    'Hanging Leg Raise',
    'hanging-leg-raise',
    'An advanced ab exercise performed hanging from a bar, raising straight legs to parallel or above. One of the most effective exercises for lower abs and hip flexor strength.',
    2,
    core_id,
    ARRAY['Shoulders', 'Back'],
    'Hang from a pull-up bar with a shoulder-width overhand grip, arms fully extended. Raise your straight legs in front of you until they are at least parallel to the ground. Lower them with control, avoiding any swinging momentum.'
  ),
  (
    'Hanging Knee Raise',
    'hanging-knee-raise',
    'A hanging core exercise where you bring your knees to your chest while suspended from a bar. A great progression toward hanging leg raises.',
    1,
    core_id,
    ARRAY['Shoulders'],
    'Hang from a bar with arms extended and core engaged. Draw your knees up toward your chest by curling your pelvis. Lower your legs back down with control, minimizing swing.'
  ),
  (
    'Toes to Bar',
    'toes-to-bar',
    'An advanced hanging core exercise where you swing your straight legs up until your toes touch the pull-up bar. Demands exceptional core strength and hamstring flexibility.',
    3,
    core_id,
    ARRAY['Shoulders', 'Back'],
    'Hang from the bar with arms extended and initiate the movement by tilting your pelvis. Raise your straight legs all the way up until your toes make contact with the bar. Lower with control back to the dead hang position.'
  ),
  (
    'Windshield Wiper',
    'windshield-wiper',
    'An advanced oblique exercise performed hanging from a bar, swinging straight legs side to side like a windshield wiper. Builds extraordinary rotational core strength.',
    3,
    core_id,
    ARRAY['Shoulders', 'Back'],
    'Hang from a bar and raise your straight legs to a toes-to-bar or L-sit position. Keeping your legs together and straight, rotate them from side to side in a controlled arc. Move through the full range of motion, engaging your obliques to decelerate at each side.'
  ),
  (
    'Dragon Flag',
    'dragon-flag',
    'An iconic core exercise popularized by Bruce Lee, where you hold your body rigid and lower it from a vertical position on a bench. Demands extreme full-core tension and control.',
    3,
    core_id,
    ARRAY['Back', 'Shoulders'],
    'Lie on a bench and grip the edge behind your head for support. Raise your entire body to vertical so only your upper back touches the bench. Lower your rigid body slowly until nearly horizontal, then raise back up without bending at the hips.'
  ),
  (
    'L-Sit Hold',
    'l-sit-hold',
    'An isometric hold where you support yourself on your hands with legs extended straight at 90 degrees in front. Builds tremendous core, hip flexor, and tricep strength.',
    2,
    core_id,
    ARRAY['Triceps', 'Shoulders'],
    'Place your hands on the floor, parallettes, or dip bars and press yourself up with arms straight. Lift your legs to a 90-degree angle in front of you, keeping them straight and together. Hold the position, pushing the floor away and keeping your abs and quads engaged.'
  ),
  (
    'V-Up',
    'v-up',
    'A dynamic core exercise where you simultaneously raise your torso and legs to form a V-shape at the top. Engages the entire rectus abdominis through a large range of motion.',
    2,
    core_id,
    ARRAY[]::text[],
    'Lie flat on your back with arms extended overhead and legs straight. Simultaneously raise your torso and legs, reaching your hands toward your toes at the top. Lower back down with control, keeping your core engaged and not fully relaxing at the bottom.'
  ),
  (
    'Mountain Climber',
    'mountain-climber',
    'A dynamic plank exercise where you rapidly alternate driving your knees toward your chest. Builds core endurance while elevating heart rate for a cardio challenge.',
    1,
    core_id,
    ARRAY['Shoulders', 'Quads'],
    'Start in a push-up position with arms straight and core tight. Drive one knee toward your chest, then quickly switch legs in a running motion. Keep your hips level and your pace steady, avoiding bouncing your hips up and down.'
  ),
  (
    'Hollow Body Hold',
    'hollow-body-hold',
    'A gymnastics staple where you lie on your back and lift your arms and legs slightly off the floor, creating a curved hollow shape. Builds the core tension fundamental to all gymnastics skills.',
    2,
    core_id,
    ARRAY[]::text[],
    'Lie on your back and press your lower back flat into the floor. Extend your arms overhead and lift them along with your shoulders and straight legs a few inches off the ground. Hold this banana-shaped position, ensuring your lower back stays glued to the floor.'
  ),
  (
    'Dead Bug',
    'dead-bug',
    'A supine core exercise where you extend opposite arm and leg while keeping your lower back pressed to the floor. Excellent for learning to brace the core and prevent spinal extension.',
    1,
    core_id,
    ARRAY[]::text[],
    'Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees above your hips. Slowly extend one arm overhead and the opposite leg out straight, hovering just above the floor. Return to the start and repeat on the other side, keeping your lower back flat throughout.'
  ),
  (
    'Bird Dog',
    'bird-dog',
    'A quadruped exercise extending opposite arm and leg to build core stability and spinal awareness. Often used in warm-ups and rehabilitation programs.',
    1,
    core_id,
    ARRAY['Back'],
    'Get on all fours with wrists under shoulders and knees under hips. Extend one arm forward and the opposite leg back until both are parallel to the floor. Hold briefly, then return to the start and switch sides, keeping your hips and shoulders level.'
  ),
  (
    'Ab Wheel Rollout',
    'ab-wheel-rollout',
    'A challenging core exercise using an ab wheel to roll forward into an extended position and back. One of the most effective anti-extension core exercises available.',
    2,
    core_id,
    ARRAY['Shoulders', 'Back'],
    'Kneel on the floor holding an ab wheel with both hands. Roll the wheel forward slowly, extending your body as far as you can without your lower back arching. Contract your abs to pull the wheel back to the starting position under your shoulders.'
  ),
  (
    'Flutter Kicks',
    'flutter-kicks',
    'A supine exercise where you rapidly alternate kicking your legs up and down in small ranges while keeping them off the ground. Targets the lower abs and hip flexors.',
    1,
    core_id,
    ARRAY[]::text[],
    'Lie on your back with hands under your hips and legs straight, lifted a few inches off the floor. Alternate kicking each leg up and down in a small, controlled range of motion. Keep your lower back pressed into the ground and maintain a steady rhythm.'
  ),
  (
    'Russian Twist',
    'russian-twist',
    'A seated rotational core exercise where you twist your torso side to side while balancing in a V-sit position. Effectively targets the obliques and transverse abdominis.',
    1,
    core_id,
    ARRAY[]::text[],
    'Sit on the floor with knees bent, lean back slightly, and lift your feet off the ground. Clasp your hands together and rotate your torso to touch the floor on each side. Move with control, keeping your core tight and feet elevated throughout.'
  ),
  (
    'Plank to Push-Up',
    'plank-to-push-up',
    'A dynamic exercise transitioning between a forearm plank and a full push-up position. Challenges the core, shoulders, and triceps while building stabilization.',
    1,
    core_id,
    ARRAY['Shoulders', 'Triceps'],
    'Start in a forearm plank, then place one hand on the floor and press up, followed by the other hand, into a push-up position. Lower back down one arm at a time to the forearm plank. Alternate the leading arm each rep to train both sides evenly.'
  ),
  (
    'Copenhagen Plank',
    'copenhagen-plank',
    'An advanced side plank variation with the top leg supported on a bench, targeting the adductors and obliques. Excellent for groin strength and injury prevention.',
    2,
    core_id,
    ARRAY['Shoulders'],
    'Lie on your side with your top leg on a bench and bottom leg hanging free, forearm on the ground. Lift your hips and bottom leg up so your body forms a straight line supported only by your forearm and top leg. Hold the position, keeping your hips elevated and core engaged.'
  ),
  (
    'Pallof Press Band',
    'pallof-press-band',
    'An anti-rotation core exercise using a resistance band, pressing your arms out in front while resisting the band''s pull. Builds the rotational stability essential for athletic performance.',
    2,
    core_id,
    ARRAY['Shoulders'],
    'Attach a band at chest height and hold it with both hands at your sternum, standing sideways to the anchor. Press your arms straight out in front of you, resisting the band''s pull trying to rotate your torso. Hold at full extension briefly, then return your hands to your chest.'
  ),
  (
    'Wood Chop Bodyweight',
    'wood-chop-bodyweight',
    'A rotational core exercise mimicking the motion of chopping wood, performed with bodyweight or a light band. Trains the obliques and transverse abdominis through a diagonal movement pattern.',
    1,
    core_id,
    ARRAY['Shoulders'],
    'Stand with feet shoulder-width apart and clasp your hands together. Rotate your torso and swing your arms diagonally from one hip up to the opposite shoulder in a chopping motion. Control the movement back down and repeat, keeping your hips relatively stable.'
  ),
  (
    'Hanging Oblique Raise',
    'hanging-oblique-raise',
    'A hanging core exercise where you raise your knees to one side, directly targeting the obliques under load. The hanging position adds shoulder and grip demands.',
    2,
    core_id,
    ARRAY['Shoulders', 'Back'],
    'Hang from a pull-up bar with arms extended. Raise your bent knees up and to one side, aiming toward the same-side elbow. Lower with control and either repeat on the same side or alternate sides each rep.'
  );

  -- ========================================================
  -- QUADS EXERCISES (15)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Bodyweight Squat',
    'bodyweight-squat',
    'The fundamental lower-body exercise performed by sitting back and down with bodyweight only. Builds quad, glute, and core strength while improving ankle and hip mobility.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core', 'Calves'],
    'Stand with feet shoulder-width apart and toes slightly turned out. Sit your hips back and down as if sitting into a chair until your thighs are at least parallel to the ground. Drive through your full foot to stand back up, squeezing your glutes at the top.'
  ),
  (
    'Jump Squat',
    'jump-squat',
    'A plyometric squat variation where you explode upward into a jump at the top of each rep. Develops lower-body power and elevates the heart rate.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Calves', 'Core'],
    'Perform a bodyweight squat, then explosively jump as high as you can from the bottom position. Land softly with bent knees, absorbing the impact through your quads and glutes. Immediately descend into the next squat and repeat.'
  ),
  (
    'Goblet Squat Hold',
    'goblet-squat-hold',
    'An isometric hold at the bottom of a squat position with hands clasped at the chest. Improves squat depth, hip mobility, and quad endurance.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core'],
    'Stand with feet shoulder-width apart and clasp your hands at chest height. Squat down to your deepest comfortable position with chest tall and knees tracking over toes. Hold the bottom position for time, keeping your torso upright and core engaged.'
  ),
  (
    'Pistol Squat',
    'pistol-squat',
    'A single-leg squat performed all the way down with the non-working leg extended in front. Demands exceptional leg strength, balance, and ankle mobility.',
    3,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core', 'Calves'],
    'Stand on one foot and extend the other leg straight out in front of you. Lower yourself on the standing leg into a deep single-leg squat, keeping the extended leg off the ground. Drive through your heel to stand back up to full extension without touching the other foot down.'
  ),
  (
    'Assisted Pistol Squat',
    'assisted-pistol-squat',
    'A pistol squat performed while holding a pole, TRX strap, or doorframe for balance and slight assistance. The best progression toward an unassisted pistol squat.',
    2,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core'],
    'Hold onto a sturdy support with one or both hands and stand on one leg. Lower into a single-leg squat as deep as possible, using the support for balance and minimal assistance. Press back up, gradually reducing how much you rely on the support.'
  ),
  (
    'Bulgarian Split Squat',
    'bulgarian-split-squat',
    'A single-leg squat with the rear foot elevated on a bench behind you. One of the best exercises for building unilateral quad and glute strength.',
    2,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core'],
    'Stand a few feet in front of a bench and place the top of your rear foot on it. Lower your back knee toward the ground by bending the front leg until your front thigh is about parallel. Drive through your front foot to stand back up, keeping your torso upright.'
  ),
  (
    'Walking Lunge',
    'walking-lunge',
    'A dynamic lunge performed by stepping forward into alternating lunges across the floor. Builds functional single-leg strength and improves balance and coordination.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core', 'Calves'],
    'Step forward with one leg and lower your back knee toward the ground until both knees are at about 90 degrees. Drive through the front heel to step forward and immediately lunge onto the other leg. Continue alternating legs as you walk forward, keeping your torso upright.'
  ),
  (
    'Reverse Lunge',
    'reverse-lunge',
    'A lunge performed by stepping backward rather than forward, which is often easier on the knees. Targets the quads and glutes while being more knee-friendly than the forward lunge.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core'],
    'Stand tall and step one foot backward, lowering your back knee toward the ground. Descend until your front thigh is parallel to the floor and your back knee nearly touches. Push through your front foot to return to standing and alternate legs.'
  ),
  (
    'Lateral Lunge',
    'lateral-lunge',
    'A lunge performed by stepping sideways, targeting the inner thighs, quads, and glutes in the frontal plane. Improves lateral mobility and adductor flexibility.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core'],
    'Stand with feet together, then take a wide step to one side, bending that knee and sitting your hips back. Keep the trailing leg straight and both feet flat on the ground as you descend. Push off the bent leg to return to standing and repeat on the other side.'
  ),
  (
    'Sissy Squat',
    'sissy-squat',
    'A quad-isolation exercise where you lean backward while bending at the knees, keeping your torso and thighs in a straight line. Places extreme tension on the quads with minimal glute involvement.',
    2,
    quads_id,
    ARRAY['Core'],
    'Stand next to a wall or post for balance support and rise onto the balls of your feet. Lean your entire body backward as a straight line from knees to shoulders while bending your knees deeply. Push through the balls of your feet to return to standing, squeezing your quads.'
  ),
  (
    'Wall Sit',
    'wall-sit',
    'An isometric lower-body exercise holding a seated position against a wall. Builds quad endurance and mental toughness through sustained contraction.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Core'],
    'Lean your back flat against a wall and slide down until your thighs are parallel to the ground with knees at 90 degrees. Keep your feet flat and shoulder-width apart, pressing your back firmly into the wall. Hold the position for time, breathing steadily throughout.'
  ),
  (
    'Step-Up',
    'step-up',
    'A single-leg exercise stepping up onto a box or bench, driving through the heel of the elevated foot. Builds functional leg strength and addresses single-leg imbalances.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Calves'],
    'Stand facing a sturdy box or bench and place one foot entirely on top. Drive through the top foot to step up, bringing the other foot to the top. Step back down with control and repeat, completing all reps on one side before switching.'
  ),
  (
    'Box Jump',
    'box-jump',
    'A plyometric exercise jumping from the ground onto an elevated box. Develops explosive lower-body power and fast-twitch muscle fibers.',
    2,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Calves', 'Core'],
    'Stand facing a box at an appropriate height with feet shoulder-width apart. Swing your arms and explode upward, jumping onto the box and landing softly with bent knees. Stand up fully on top of the box, then step back down and reset for the next rep.'
  ),
  (
    'Squat Jump',
    'squat-jump',
    'An explosive jump initiated from a deep squat hold position, emphasizing power from the bottom range. Builds starting strength and explosive quad power.',
    1,
    quads_id,
    ARRAY['Hamstrings & Glutes', 'Calves', 'Core'],
    'Lower into a deep squat and pause briefly at the bottom with your arms back. Explode upward, swinging your arms overhead and jumping as high as possible. Land softly and immediately lower back into the deep squat for the next rep.'
  ),
  (
    'Hindu Squat',
    'hindu-squat',
    'A traditional Indian squat where you rise onto your toes at the bottom and use an arm-swinging motion for rhythm. Builds quad endurance and ankle mobility through high-rep sets.',
    2,
    quads_id,
    ARRAY['Calves', 'Core'],
    'Stand with feet shoulder-width apart and swing your arms as you lower into a deep squat, coming onto your toes at the bottom. Drive up to standing while swinging your arms back for momentum. Perform in a rhythmic, continuous motion for higher repetitions.'
  );

  -- ========================================================
  -- HAMSTRINGS & GLUTES EXERCISES (12)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Glute Bridge',
    'glute-bridge',
    'A supine hip extension exercise performed by driving the hips upward while lying on your back. Activates the glutes and hamstrings and is excellent for beginners.',
    1,
    hams_id,
    ARRAY['Core'],
    'Lie on your back with knees bent and feet flat on the floor, hip-width apart. Drive through your heels to lift your hips toward the ceiling until your body forms a straight line from shoulders to knees. Squeeze your glutes at the top, then lower your hips back down with control.'
  ),
  (
    'Single-Leg Glute Bridge',
    'single-leg-glute-bridge',
    'A unilateral glute bridge performed with one foot on the ground and the other leg extended or elevated. Doubles the load on the working glute and addresses strength imbalances.',
    2,
    hams_id,
    ARRAY['Core'],
    'Lie on your back with one foot flat on the floor and the other leg extended straight or held above your hip. Drive through the grounded heel to lift your hips, keeping them level. Lower with control, completing all reps on one side before switching.'
  ),
  (
    'Hip Thrust Bodyweight',
    'hip-thrust-bodyweight',
    'A hip extension exercise with the upper back supported on a bench and feet on the floor. The bench support allows for a greater range of motion than the floor bridge.',
    1,
    hams_id,
    ARRAY['Core', 'Quads'],
    'Sit on the floor with your upper back leaning against a bench and feet flat on the ground. Drive through your heels to thrust your hips upward until your torso is parallel to the floor. Squeeze your glutes hard at the top, then lower your hips back down.'
  ),
  (
    'Nordic Curl',
    'nordic-curl',
    'An eccentric hamstring exercise where you lower your body forward from a kneeling position using only hamstring control. One of the most effective hamstring strengtheners and injury-prevention exercises.',
    3,
    hams_id,
    ARRAY['Core'],
    'Kneel on a pad with your ankles secured under a heavy object or by a partner. Keeping your body straight from knees to head, slowly lower yourself toward the ground using your hamstrings to resist gravity. Catch yourself at the bottom with your hands and push back up to reset, or use your hamstrings to pull yourself back up if strong enough.'
  ),
  (
    'Donkey Kick',
    'donkey-kick',
    'A quadruped exercise where you drive one bent leg upward toward the ceiling, squeezing the glute at the top. Simple yet effective glute isolation movement.',
    1,
    hams_id,
    ARRAY['Core'],
    'Get on all fours with wrists under shoulders and knees under hips. Keeping your knee bent at 90 degrees, drive one foot toward the ceiling by squeezing the glute. Lower back to the starting position with control and repeat on the same side.'
  ),
  (
    'Fire Hydrant',
    'fire-hydrant',
    'A quadruped exercise lifting a bent leg out to the side, targeting the gluteus medius and hip abductors. Important for hip stability and injury prevention.',
    1,
    hams_id,
    ARRAY['Core'],
    'Get on all fours with a flat back and core engaged. Lift one bent knee out to the side, raising it as high as you can without rotating your torso. Lower it back to the starting position with control and repeat.'
  ),
  (
    'Clamshell',
    'clamshell',
    'A side-lying exercise where you open your knees apart like a clamshell while keeping your feet together. Targets the gluteus medius and external hip rotators.',
    1,
    hams_id,
    ARRAY['Core'],
    'Lie on your side with knees bent at about 45 degrees and feet stacked together. Keeping your feet touching, raise the top knee as high as possible without rotating your pelvis. Lower the knee back down with control and repeat.'
  ),
  (
    'Good Morning Bodyweight',
    'good-morning-bodyweight',
    'A hip-hinge exercise performed standing with hands behind the head, bowing forward by pushing the hips back. Strengthens the hamstrings, glutes, and lower back.',
    1,
    hams_id,
    ARRAY['Back', 'Core'],
    'Stand with feet hip-width apart and place your hands behind your head. Hinge at the hips, pushing them backward and lowering your torso until it is nearly parallel to the ground. Drive your hips forward to return to standing, squeezing your glutes at the top.'
  ),
  (
    'Reverse Hyperextension',
    'reverse-hyperextension',
    'An exercise performed face-down on a bench with legs hanging off the end, raising them by contracting the glutes and hamstrings. Decompresses the spine while strengthening the posterior chain.',
    1,
    hams_id,
    ARRAY['Back', 'Core'],
    'Lie face-down on a bench or elevated surface with your hips at the edge and legs hanging down. Raise your straight legs up until they are in line with your torso by squeezing your glutes and hamstrings. Lower them back down with control without swinging.'
  ),
  (
    'Romanian Deadlift Single-Leg BW',
    'romanian-deadlift-single-leg-bw',
    'A single-leg hip hinge performed standing on one foot while the other leg extends behind you. Builds hamstring strength, balance, and hip stability simultaneously.',
    2,
    hams_id,
    ARRAY['Back', 'Core'],
    'Stand on one leg with a slight knee bend and hinge at the hips, extending the free leg behind you for counterbalance. Lower your torso until it is roughly parallel to the floor, feeling a stretch in the standing-leg hamstring. Drive your hips forward to return to upright, squeezing the glute.'
  ),
  (
    'Kickback',
    'kickback',
    'A standing or quadruped glute exercise extending one leg straight behind you against gravity. A simple, targeted glute isolation movement.',
    1,
    hams_id,
    ARRAY['Core'],
    'Stand holding a support or get on all fours. Extend one leg straight behind you, squeezing the glute at the top of the movement. Return the leg under control and repeat, keeping your hips square throughout.'
  ),
  (
    'Curtsy Lunge',
    'curtsy-lunge',
    'A lunge variation where you step one foot behind and across the other leg in a curtsy motion. Targets the gluteus medius and outer glutes alongside the quads.',
    1,
    hams_id,
    ARRAY['Quads', 'Core'],
    'Stand with feet hip-width apart and step one foot behind and to the outside of the other leg. Lower your back knee toward the ground as if performing a curtsy. Press through the front foot to return to standing and alternate sides.'
  );

  -- ========================================================
  -- CALVES EXERCISES (5)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Standing Calf Raise',
    'standing-calf-raise',
    'The classic calf exercise performed by rising onto the balls of your feet from a standing position. Targets the gastrocnemius muscle of the calf.',
    1,
    calves_id,
    ARRAY[]::text[],
    'Stand on the edge of a step with your heels hanging off for a full range of motion. Rise up onto the balls of your feet as high as possible, squeezing your calves at the top. Lower your heels below the step level for a full stretch and repeat.'
  ),
  (
    'Single-Leg Calf Raise',
    'single-leg-calf-raise',
    'A calf raise performed on one leg to double the resistance compared to the bilateral version. Excellent for addressing calf size and strength imbalances.',
    1,
    calves_id,
    ARRAY[]::text[],
    'Stand on the edge of a step on one foot with the other foot lifted behind you. Rise as high as possible onto the ball of your foot, squeezing the calf hard at the top. Lower your heel below step level for maximum stretch and repeat all reps before switching.'
  ),
  (
    'Seated Calf Raise',
    'seated-calf-raise',
    'A calf raise performed in a seated position, which shifts emphasis to the soleus muscle beneath the gastrocnemius. Important for complete calf development.',
    1,
    calves_id,
    ARRAY[]::text[],
    'Sit on a bench with the balls of your feet on a raised surface and knees bent at 90 degrees. Place weight on your knees if needed and press up through the balls of your feet. Lower your heels for a full stretch and squeeze at the top of each rep.'
  ),
  (
    'Jump Rope Calf Bounce',
    'jump-rope-calf-bounce',
    'A low-impact bouncing motion performed with a jump rope, staying on the balls of the feet throughout. Builds calf endurance and coordination while providing a cardio stimulus.',
    1,
    calves_id,
    ARRAY['Core'],
    'Hold the jump rope handles and begin skipping with a relaxed, rhythmic bounce. Stay on the balls of your feet with only a slight bend in your knees, letting your calves do the work. Keep jumps small and controlled, maintaining a consistent pace.'
  ),
  (
    'Donkey Calf Raise',
    'donkey-calf-raise',
    'A calf raise performed while hinged at the hips, typically with a partner on your back or using a machine. The hip-flexed position allows the gastrocnemius to stretch more fully.',
    2,
    calves_id,
    ARRAY[]::text[],
    'Hinge at the hips with hands on a support and your toes on the edge of a raised surface. With hips flexed at about 90 degrees, rise up onto the balls of your feet as high as possible. Lower your heels for a deep stretch and repeat with a controlled tempo.'
  );

  -- ========================================================
  -- FULL BODY EXERCISES (10)
  -- ========================================================

  INSERT INTO public.exercises (name, slug, description, difficulty, muscle_group_id, secondary_muscles, instructions) VALUES
  (
    'Burpee',
    'burpee',
    'The ultimate full-body conditioning exercise combining a squat thrust, push-up, and jump into one fluid movement. Builds total-body strength and cardiovascular endurance simultaneously.',
    2,
    fullbody_id,
    ARRAY['Chest', 'Shoulders', 'Quads', 'Core'],
    'From standing, squat down and place your hands on the floor, then jump your feet back into a push-up position. Perform a push-up, then jump your feet forward to your hands and explode upward into a jump. Land softly and immediately begin the next rep.'
  ),
  (
    'Burpee with Pull-Up',
    'burpee-with-pull-up',
    'An advanced burpee variation performed under a pull-up bar, adding a pull-up at the top of the jump. One of the most demanding bodyweight conditioning exercises.',
    3,
    fullbody_id,
    ARRAY['Back', 'Chest', 'Shoulders', 'Quads', 'Core'],
    'Perform a standard burpee beneath a pull-up bar. At the top of your jump, grab the bar and perform a full pull-up. Lower from the bar, land, and immediately go into the next burpee.'
  ),
  (
    'Bear Crawl Full Body',
    'bear-crawl-full-body',
    'An extended bear crawl performed over longer distances or durations to challenge the entire body. Builds total-body strength, endurance, and coordination.',
    1,
    fullbody_id,
    ARRAY['Shoulders', 'Core', 'Quads'],
    'Get on all fours with knees hovering an inch off the ground. Crawl forward by moving opposite hand and foot simultaneously, keeping your back flat and hips low. Continue for distance or time, maintaining a controlled, rhythmic pace.'
  ),
  (
    'Inchworm',
    'inchworm',
    'A locomotion exercise where you walk your hands out to a plank from standing, then walk your feet back to your hands. Stretches the hamstrings and strengthens the shoulders and core.',
    1,
    fullbody_id,
    ARRAY['Shoulders', 'Core', 'Hamstrings & Glutes'],
    'Stand with feet together and hinge forward to place your hands on the floor. Walk your hands out to a full plank position, keeping your legs as straight as possible. Walk your feet toward your hands in small steps, then stand up and repeat.'
  ),
  (
    'Jumping Jack',
    'jumping-jack',
    'A classic calisthenic cardio exercise jumping the feet wide while raising the arms overhead, then back together. An excellent warm-up and conditioning staple.',
    1,
    fullbody_id,
    ARRAY['Shoulders', 'Calves', 'Core'],
    'Stand with feet together and arms at your sides. Jump your feet out wide while simultaneously raising your arms overhead. Jump back to the starting position and repeat in a rhythmic, continuous motion.'
  ),
  (
    'Turkish Get-Up',
    'turkish-get-up',
    'A complex movement transitioning from lying on the ground to standing while keeping one arm extended overhead. Builds total-body strength, mobility, and stability through multiple movement patterns.',
    3,
    fullbody_id,
    ARRAY['Shoulders', 'Core', 'Quads', 'Hamstrings & Glutes'],
    'Lie on your back with one arm extended straight toward the ceiling. Roll to your elbow, then to your hand, bridge your hips, sweep your leg under you to a kneeling position, and stand up. Reverse the entire sequence to return to the lying position, keeping your arm locked overhead throughout.'
  ),
  (
    'Sprawl',
    'sprawl',
    'A burpee-like movement without the push-up or jump, focusing on quickly dropping to the ground and getting back up. Commonly used in combat sports for conditioning and agility.',
    1,
    fullbody_id,
    ARRAY['Core', 'Quads', 'Shoulders'],
    'From standing, drop your hips and place your hands on the ground, kicking your feet back to a plank. Immediately snap your feet back under you and stand up explosively. Move as quickly as possible, focusing on speed and hip drive.'
  ),
  (
    'Thruster Bodyweight',
    'thruster-bodyweight',
    'A combination of a squat and an overhead press performed fluidly as one movement using bodyweight. Builds leg and shoulder strength while challenging cardiovascular endurance.',
    2,
    fullbody_id,
    ARRAY['Quads', 'Shoulders', 'Core'],
    'Stand with feet shoulder-width apart and hands at your shoulders. Squat down to parallel, then drive up explosively, pressing your arms overhead at the top. Lower your hands back to your shoulders as you descend into the next squat.'
  ),
  (
    'Man Maker Bodyweight',
    'man-maker-bodyweight',
    'A grueling full-body complex combining a push-up, alternating rows (in plank), and a squat thrust to standing. One of the most demanding bodyweight complexes for conditioning.',
    2,
    fullbody_id,
    ARRAY['Chest', 'Back', 'Shoulders', 'Core', 'Quads'],
    'Start in a push-up position and perform a push-up. At the top, row one arm to your hip, then the other. Jump your feet to your hands, stand up, and reach overhead, then return to the push-up position.'
  ),
  (
    'Star Jump',
    'star-jump',
    'A plyometric jump where you explode off the ground and spread your arms and legs into a star shape mid-air. Builds explosive power and elevates the heart rate quickly.',
    1,
    fullbody_id,
    ARRAY['Quads', 'Shoulders', 'Calves', 'Core'],
    'Start in a quarter squat with arms by your sides. Explode upward, extending your arms and legs out wide to form an X or star shape in the air. Land softly with knees bent, absorbing the impact, and immediately load for the next jump.'
  );

END $$;
